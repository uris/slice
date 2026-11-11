import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '../../components/Button';
import { Chip } from '../../components/Chip';
import { FlexBox } from '../../components/FlexBox';
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
		<FlexBox width={'fill'} height={'fill'} padding={32} gap={24}>
			<FlexBox direction={'row'} width={'fill'} gap={24} align={'start'}>
				<FlexBox width={460} padding={16} gap={12}>
					<div>NOTE: This demo uses the hook refs to inspect the live microphone stream and track.</div>
					<div>
						Mic Device Supported: <Chip>{String(isSupported)}</Chip>
					</div>
					<div>
						Requesting mic access: <ProgressIndicator show={isRequesting} inline />
						{!isRequesting && <Chip>false</Chip>}
					</div>
					<div>
						Auto Request: <Chip>{String(autoRequest)}</Chip>
					</div>
					<div>
						Muted: <Chip>{String(muted)}</Chip>
					</div>
					<div>
						Input Volume: <Chip>{inputVolume.toFixed(2)}</Chip>
					</div>
					<div>
						Mic Stream ID: <Chip>{micInfo.streamId ?? 'none'}</Chip>
					</div>
					<div>
						Processed Stream ID: <Chip>{micInfo.processedStreamId ?? 'none'}</Chip>
					</div>
					<div>
						Mic Track ID: <Chip>{micInfo.trackId ?? 'none'}</Chip>
					</div>
					<div>
						Mic Device ID: <Chip>{micInfo.deviceId ?? 'none'}</Chip>
					</div>
					<div>
						Mic Device Label: <Chip>{micDeviceLabel ?? 'none'}</Chip>
					</div>
					<div>
						Track Enabled: <Chip>{String(micInfo.enabled ?? false)}</Chip>
					</div>
					<div>
						Track State: <Chip>{micInfo.readyState ?? 'none'}</Chip>
					</div>
					<div>
						Error: <Chip>{error?.message ?? 'none'}</Chip>
					</div>
				</FlexBox>
				<FlexBox width={360} padding={16} gap={12}>
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
							aria-label="Microphone volume"
							id={'microphone-input-volume'}
							value={inputVolume}
							min={0}
							max={1}
							step={0.05}
							width={'100%'}
							onChange={(value) => setInputVolume(value)}
						/>
					</div>
				</FlexBox>
			</FlexBox>
			<FlexBox direction={'row'} wrap gap={8}>
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
			</FlexBox>
		</FlexBox>
	);
}

const meta: Meta<typeof UseMicrophoneDemo> = {
	title: 'Hooks/useMicrophone',
	component: UseMicrophoneDemo,
	parameters: {
		a11y: { test: 'todo' },
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
