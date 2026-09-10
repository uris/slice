import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '../../components/Button';
import { FlexDiv } from '../../components/FlexDiv';
import { Label } from '../../components/Label';
import { ProgressIndicator } from '../../components/Progress';
import { useMicrophone } from '../useMicrophone/useMicrophone';
import { useAudioRecorder } from './useAudioRecorder';

type UseAudioRecorderDemoProps = {
	microphoneDeviceId: string;
	startMuted: boolean;
};

function UseAudioRecorderDemo(props: Readonly<UseAudioRecorderDemoProps>) {
	const { microphoneDeviceId, startMuted } = props;
	const [selectedDeviceId, setSelectedDeviceId] = useState(microphoneDeviceId);
	const [audioUrl, setAudioUrl] = useState<string | null>(null);
	const audioUrlRef = useRef<string | null>(null);
	const {
		micStream,
		muted,
		isSupported,
		isRequesting,
		error: microphoneError,
		microphones,
		toggleMute,
		refreshMicrophones,
		setMicrophone,
	} = useMicrophone(startMuted, selectedDeviceId);
	const {
		audioBlob,
		error: recorderError,
		isRecording,
		recordingSizeMb,
		mimeType,
		resetRecording,
		startRecording,
		stopRecording,
	} = useAudioRecorder(micStream);

	useEffect(() => {
		setSelectedDeviceId(microphoneDeviceId);
	}, [microphoneDeviceId]);

	useEffect(() => {
		void refreshMicrophones();
	}, [refreshMicrophones]);

	useEffect(() => {
		return () => {
			if (audioUrlRef.current) {
				URL.revokeObjectURL(audioUrlRef.current);
				audioUrlRef.current = null;
			}
		};
	}, []);

	const selectedMicLabel = useMemo(() => {
		const selected = microphones.find((microphone) => microphone.deviceId === selectedDeviceId);
		return selected?.label || 'Default microphone';
	}, [microphones, selectedDeviceId]);

	return (
		<FlexDiv width={'fill'} height={'fill'} padding={32} gap={24}>
			<FlexDiv direction={'row'} width={'fill'} gap={24} align={'start'}>
				<FlexDiv width={420} padding={16} gap={12}>
					<div>Select the default microphone or switch to another input.</div>
					<label htmlFor={'audio-recorder-microphone-select'}>Microphone device</label>
					<select
						id={'audio-recorder-microphone-select'}
						value={selectedDeviceId}
						onChange={async (event) => {
							const nextDeviceId = event.target.value;
							setSelectedDeviceId(nextDeviceId);
							await setMicrophone(nextDeviceId);
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
					<div>
						Selected mic: <Label>{selectedMicLabel}</Label>
					</div>
					<div>
						Requesting mic: <ProgressIndicator show={isRequesting} inline />
						{!isRequesting && <Label>false</Label>}
					</div>
					<div>
						Muted: <Label>{String(muted)}</Label>
					</div>
					<div>
						Recording: <Label>{String(isRecording)}</Label>
					</div>
					<div>
						Recording size: <Label>{recordingSizeMb.toFixed(2)} MB</Label>
					</div>
					<div>
						Mic supported: <Label>{String(isSupported)}</Label>
					</div>
					<div>
						Recorder MIME type: <Label>{mimeType ?? 'none'}</Label>
					</div>
					<div>
						Mic error: <Label>{microphoneError?.message ?? 'none'}</Label>
					</div>
					<div>
						Recorder error: <Label>{recorderError?.message ?? 'none'}</Label>
					</div>
				</FlexDiv>
				<FlexDiv width={420} padding={16} gap={12}>
					<div>Recording playback</div>
					{audioUrl ? (
						<audio controls autoPlay src={audioUrl} style={{ width: '100%' }}>
							<track kind="captions" />
						</audio>
					) : (
						<Label>No recording yet</Label>
					)}
				</FlexDiv>
			</FlexDiv>
			<FlexDiv direction={'row'} wrap gap={8}>
				<Button
					label={muted ? 'Unmute Mic' : 'Mute Mic'}
					onClick={() => {
						toggleMute();
					}}
				/>
				<Button
					label={'Start Recording'}
					onClick={() => {
						startRecording();
					}}
					state={isRecording ? 'disabled' : 'normal'}
				/>
				<Button
					label={'Stop Recording'}
					onClick={async () => {
						const blob = await stopRecording();
						if (!blob) return;
						if (audioUrlRef.current) {
							URL.revokeObjectURL(audioUrlRef.current);
						}
						const nextAudioUrl = URL.createObjectURL(blob);
						audioUrlRef.current = nextAudioUrl;
						setAudioUrl(nextAudioUrl);
					}}
					state={isRecording ? 'normal' : 'disabled'}
				/>
				<Button
					label={'Reset Recording'}
					onClick={() => {
						resetRecording();
						if (audioUrlRef.current) {
							URL.revokeObjectURL(audioUrlRef.current);
							audioUrlRef.current = null;
						}
						setAudioUrl(null);
					}}
					state={audioUrl ? 'normal' : 'disabled'}
				/>
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof UseAudioRecorderDemo> = {
	title: 'Hooks/useAudioRecorder',
	component: UseAudioRecorderDemo,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		microphoneDeviceId: '',
		startMuted: false,
	},
};

export default meta;

export const Demo: StoryObj<typeof UseAudioRecorderDemo> = {};
