import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { FlexDiv } from '../../components/FlexDiv';
import { Label } from '../../components/Label';
import { ProgressIndicator } from '../../components/Progress';
import { Slider } from '../../components/Slider';
import { useMicrophone } from './useMicrophone';

type UseMicrophoneDemoProps = {
	microphoneDeviceId: string;
	startMuted: boolean;
	autoRequest: boolean;
};

type MicInfo = {
	streamId?: string;
	processedStreamId?: string;
	trackId?: string;
	deviceId?: string;
	enabled?: boolean;
	readyState?: MediaStreamTrackState;
};

function UseMicrophoneDemo(props: Readonly<UseMicrophoneDemoProps>) {
	const { microphoneDeviceId, startMuted, autoRequest } = props;
	const [selectedDeviceId, setSelectedDeviceId] = useState(microphoneDeviceId);
	const [micInfo, setMicInfo] = useState<MicInfo>({});
	const {
		micStream,
		processedMicStream,
		micTrack,
		currentDeviceId,
		inputVolume,
		muted,
		isSupported,
		isRequesting,
		error,
		microphones,
		requestMicrophone,
		stopMicrophone,
		muteMic,
		unmuteMic,
		toggleMute,
		setInputVolume,
		refreshMicrophones,
		setMicrophone,
	} = useMicrophone(startMuted, selectedDeviceId, autoRequest);

	const refreshMicInfo = useCallback(() => {
		const stream = micStream.current;
		const track = micTrack.current;
		setMicInfo({
			streamId: stream?.id,
			processedStreamId: processedMicStream.current?.id,
			trackId: track?.id,
			deviceId: currentDeviceId ?? undefined,
			enabled: track?.enabled,
			readyState: track?.readyState,
		});
	}, [currentDeviceId, micStream, micTrack, processedMicStream]);

	const refreshDevices = useCallback(async () => {
		await refreshMicrophones();
	}, [refreshMicrophones]);

	useEffect(() => {
		setSelectedDeviceId(microphoneDeviceId);
	}, [microphoneDeviceId]);

	useEffect(() => {
		void refreshDevices();
	}, [refreshDevices]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: update always
	useEffect(() => {
		refreshMicInfo();
	}, [muted, isRequesting, error, refreshMicInfo]);

	// set the microphone device name
	const micDeviceLabel = useMemo(() => {
		const selected = microphones.find((mic) => mic.deviceId === selectedDeviceId);
		const label = selected?.label;
		if (selected) return label === '' ? 'Default Microphone' : label;
		return undefined;
	}, [microphones, selectedDeviceId]);

	return (
		<FlexDiv width={'fill'} height={'fill'} padding={32} gap={24}>
			<FlexDiv direction={'row'} width={'fill'} gap={24} align={'start'}>
				<FlexDiv width={460} padding={16} gap={12}>
					<div>NOTE: This demo uses the hook refs to inspect the live microphone stream and track.</div>
					<div>
						Mic Device Supported: <Label>{String(isSupported)}</Label>
					</div>
					<div>
						Requesting mic access: <ProgressIndicator show={isRequesting} inline />
						{!isRequesting && <Label>false</Label>}
					</div>
					<div>
						Auto Request: <Label>{String(autoRequest)}</Label>
					</div>
					<div>
						Muted: <Label>{String(muted)}</Label>
					</div>
					<div>
						Input Volume: <Label>{inputVolume.toFixed(2)}</Label>
					</div>
					<div>
						Mic Stream ID: <Label>{micInfo.streamId ?? 'none'}</Label>
					</div>
					<div>
						Processed Stream ID: <Label>{micInfo.processedStreamId ?? 'none'}</Label>
					</div>
					<div>
						Mic Track ID: <Label>{micInfo.trackId ?? 'none'}</Label>
					</div>
					<div>
						Mic Device ID: <Label>{micInfo.deviceId ?? 'none'}</Label>
					</div>
					<div>
						Mic Device Label: <Label>{micDeviceLabel ?? 'none'}</Label>
					</div>
					<div>
						Track Enabled: <Label>{String(micInfo.enabled ?? false)}</Label>
					</div>
					<div>
						Track State: <Label>{micInfo.readyState ?? 'none'}</Label>
					</div>
					<div>
						Error: <Label>{error?.message ?? 'none'}</Label>
					</div>
				</FlexDiv>
				<FlexDiv width={360} padding={16} gap={12}>
					<label htmlFor={'microphone-device-select'}>Microphone device</label>
					<select
						id={'microphone-device-select'}
						value={selectedDeviceId}
						onChange={async (event) => {
							const nextDeviceId = event.target.value;
							setSelectedDeviceId(nextDeviceId);
							await setMicrophone(nextDeviceId);
							refreshMicInfo();
						}}
						style={{
							width: '100%',
							padding: '8px 12px',
							borderRadius: 8,
							background: 'var(--core-surface-primary)',
							color: 'var(--core-text-primary)',
							border: '1px solid var(--core-outline-primary)',
						}}
					>
						<option value={''}>Default microphone</option>
						{microphones.map((device, index) => (
							<option key={`${device.deviceId}_${index}`} value={device.deviceId}>
								{device.label || `Microphone ${device.deviceId.slice(0, 8)}`}
							</option>
						))}
					</select>
					<Button
						label={'Refresh Devices'}
						onClick={async () => {
							await refreshDevices();
							refreshMicInfo();
						}}
					/>
					<div>
						<label htmlFor={'microphone-input-volume'}>Input volume</label>
						<Slider
							id={'microphone-input-volume'}
							value={inputVolume}
							scaleMin={0}
							scaleMax={1}
							step={0.05}
							width={'100%'}
							onChange={(value) => setInputVolume(value)}
						/>
					</div>
				</FlexDiv>
			</FlexDiv>
			<FlexDiv direction={'row'} wrap gap={8}>
				<Button label={'Refresh Ref Info'} onClick={() => refreshMicInfo()} />
				<Button
					label={'Request Mic'}
					onClick={async () => {
						await requestMicrophone();
						refreshMicInfo();
					}}
				/>
				<Button
					label={'Stop Mic'}
					onClick={() => {
						stopMicrophone();
						refreshMicInfo();
					}}
				/>
				<Button
					label={'Mute'}
					onClick={() => {
						muteMic();
						refreshMicInfo();
					}}
				/>
				<Button
					label={'Unmute'}
					onClick={() => {
						unmuteMic();
						refreshMicInfo();
					}}
				/>
				<Button
					label={'Toggle Mic'}
					onClick={() => {
						toggleMute();
						refreshMicInfo();
					}}
				/>
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof UseMicrophoneDemo> = {
	title: 'Hooks/useMicrophone',
	component: UseMicrophoneDemo,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		microphoneDeviceId: '',
		startMuted: true,
		autoRequest: true,
	},
};

export default meta;

export const Demo: StoryObj<typeof UseMicrophoneDemo> = {};
