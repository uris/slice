import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../Button';
import { FlexDiv } from '../FlexDiv';
import { Label } from '../Label';
import { Camera } from './Camera';
import type { CameraElement } from './_types';

const meta: Meta<typeof Camera> = {
	title: 'Components/Camera',
	component: Camera,
	args: {
		userProfile: {
			name: 'John Does',
			email: 'john.doe@example.com',
		},
	},
};

export default meta;

type StreamInfo = {
	streamId?: string;
	videoDeviceId?: string;
	videoEnabled?: boolean;
	videoReadyState?: MediaStreamTrackState;
	audioDeviceId?: string;
	audioEnabled?: boolean;
	audioReadyState?: MediaStreamTrackState;
};

function CameraDemo(args: any) {
	const cameraRef = useRef<CameraElement | null>(null);
	const [streamInfo, setStreamInfo] = useState<StreamInfo>({});

	const refreshStreamInfo = useCallback(() => {
		const stream = cameraRef.current?.stream;
		const videoTrack = cameraRef.current?.videoTrack;
		const audioTrack = cameraRef.current?.audioTrack;
		setStreamInfo({
			streamId: stream?.id,
			videoDeviceId: videoTrack?.getSettings().deviceId,
			videoEnabled: videoTrack?.enabled,
			videoReadyState: videoTrack?.readyState,
			audioDeviceId: audioTrack?.getSettings().deviceId,
			audioEnabled: audioTrack?.enabled,
			audioReadyState: audioTrack?.readyState,
		});
	}, []);

	useEffect(() => {
		refreshStreamInfo();
	}, [refreshStreamInfo]);

	return (
		<FlexDiv width={'fill'} height={'fill'} padding={32} gap={24}>
			<FlexDiv direction={'row'} width={'fill'} gap={24} align={'start'}>
				<FlexDiv width={460} height={460}>
					<Camera {...args} ref={cameraRef} onVideoStream={refreshStreamInfo} />
				</FlexDiv>
				<FlexDiv width={360} padding={16} gap={12}>
					<div>NOTE: This demo uses the forwarded ref instead of component state events.</div>
					Stream ID: <Label>{streamInfo.streamId ?? 'none'}</Label>
					Video Device ID: <Label>{streamInfo.videoDeviceId ?? 'none'}</Label>
					Video Enabled:{' '}
					<span>
						<Label>{String(streamInfo.videoEnabled ?? false)}</Label> /{' '}
						<Label>{streamInfo.videoReadyState ?? 'none'}</Label>
					</span>
					Audio Device ID: <Label>{streamInfo.audioDeviceId ?? 'none'}</Label>
					Audio Enabled:{' '}
					<span>
						<Label>{String(streamInfo.audioEnabled ?? false)}</Label> /
						<Label>{streamInfo.audioReadyState ?? 'none'}</Label>
					</span>
				</FlexDiv>
			</FlexDiv>
			<FlexDiv direction={'row'} wrap gap={8}>
				<Button label={'Refresh Ref Info'} onClick={() => refreshStreamInfo()} />
				<Button
					label={'Start Stream'}
					onClick={async () => {
						await cameraRef.current?.startCamera?.();
						refreshStreamInfo();
					}}
				/>
				<Button
					label={'Stop Stream'}
					onClick={async () => {
						await cameraRef.current?.stopCamera?.();
						refreshStreamInfo();
					}}
				/>
				<Button
					label={'Toggle Video'}
					onClick={async () => {
						await cameraRef.current?.toggleVideo?.();
						refreshStreamInfo();
					}}
				/>
				<Button
					label={'Toggle Mic'}
					onClick={() => {
						cameraRef.current?.toggleMic?.();
						refreshStreamInfo();
					}}
				/>
				<Button
					label={'Take Snapshot'}
					onClick={() => {
						cameraRef.current?.snapshot?.();
						refreshStreamInfo();
					}}
				/>
			</FlexDiv>
		</FlexDiv>
	);
}

export const Demo: StoryObj<typeof Camera> = {
	render: (args) => <CameraDemo {...args} />,
};
