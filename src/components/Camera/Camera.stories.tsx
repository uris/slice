import type { Meta, StoryObj } from '@storybook/react-vite';
import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { expect, fn, spyOn, within } from 'storybook/test';
import { Button } from '../Button';
import { FlexDiv } from '../FlexDiv';
import { Label } from '../Label';
import {
	runCameraDemoPlay,
	runCameraImperativeRefControlsPlay,
	runCameraKeyboardAndHoverPlay,
	runCameraNoAudioTrackPlay,
	runCameraStreamLifecycleEdgeCasesPlay,
} from '../playHelpers';
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
		sessionSettings: {},
		onChangeProfile: fn(),
		onChangeSettings: fn(),
		onNoVideo: fn(),
		onNoAudio: fn(),
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
	// Start manually after play installs its media mock; an in-flight native
	// request from mount could otherwise overwrite the successful test stream.
	args: { startCameraOff: true },
	render: (args) => <CameraDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		await runCameraDemoPlay({ canvasElement, args });
	},
};

export const KeyboardAndHoverInteractions: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true },
	render: (args) => <CameraDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		await runCameraKeyboardAndHoverPlay({ canvasElement, args });
	},
};

export const StreamLifecycleEdgeCases: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true },
	render: (args) => <CameraDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		await runCameraStreamLifecycleEdgeCasesPlay({ canvasElement, args });
	},
};

export const NoAudioTrack: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true },
	render: (args) => <CameraDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		await runCameraNoAudioTrackPlay({ canvasElement, args });
	},
};

function CameraImperativeRefDemo(args: any) {
	const cameraRef = useRef<CameraElement | null>(null);
	const [log, setLog] = useState<string[]>([]);

	const append = useCallback((message: string) => {
		setLog((previous) => [...previous, message]);
	}, []);

	return (
		<FlexDiv width={'fill'} height={'fill'} padding={32} gap={24}>
			<FlexDiv width={460} height={460}>
				<Camera {...args} ref={cameraRef} />
			</FlexDiv>
			<FlexDiv direction={'row'} wrap gap={8}>
				<Button label={'Disable Video (ref)'} onClick={() => append(String(cameraRef.current?.disableVideo?.()))} />
				<Button label={'Enable Video (ref)'} onClick={() => append(String(cameraRef.current?.enableVideo?.()))} />
				<Button label={'Start Stream'} onClick={async () => append(String(await cameraRef.current?.startCamera?.()))} />
				<Button
					label={'Stop Track Directly'}
					onClick={() => {
						cameraRef.current?.videoTrack?.stop();
						append('track stopped');
					}}
				/>
				<Button label={'Mute Mic (ref)'} onClick={() => append(String(cameraRef.current?.muteMic?.()))} />
				<Button label={'Unmute Mic (ref)'} onClick={() => append(String(cameraRef.current?.unmuteMic?.()))} />
				<Button
					label={'List Devices (ref)'}
					onClick={async () => append(String(await cameraRef.current?.devices?.()))}
				/>
				<Button
					label={'Log Ref Getters'}
					onClick={() =>
						append(
							`video:${cameraRef.current?.video ? 'yes' : 'no'} container:${cameraRef.current?.container ? 'yes' : 'no'}`,
						)
					}
				/>
			</FlexDiv>
			<div data-testid={'ref-controls-log'}>{log.join(' | ')}</div>
		</FlexDiv>
	);
}

export const ImperativeRefControls: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true },
	render: (args) => <CameraImperativeRefDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		await runCameraImperativeRefControlsPlay({ canvasElement, args });
	},
};

const guardRef = createRef<CameraElement>();
export const ControlsWithoutStream: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true, autoHideControlBar: false },
	render: (args) => <Camera {...args} ref={guardRef} />,
	play: async ({ canvasElement }) => {
		await expect(guardRef.current).not.toBeNull();
		const camera = guardRef.current;
		if (!camera) throw new Error('Camera ref was not attached');
		await expect(camera.muteMic?.()).toEqual(new Error('No audio track found'));
		await expect(camera.unmuteMic?.()).toEqual(new Error('No audio track found'));
		await expect(camera.snapshot?.()).toBeUndefined();
		await expect(await camera.stopCamera?.()).toEqual(new Error('No media stream to stop'));
		await expect(within(canvasElement).getByRole('button', { name: 'Photo' })).toHaveAttribute('aria-disabled', 'true');
		await expect(camera.container?.style.getPropertyValue('--camera-controls-transform')).toBe('translateY(0%)');
	},
};

const missingVideoRef = createRef<CameraElement>();
export const MissingVideoTrack: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true, showControlBar: false },
	render: (args) => <Camera {...args} ref={missingVideoRef} />,
	play: async ({ args }) => {
		const stream = new MediaStream();
		const request = spyOn(navigator.mediaDevices, 'getUserMedia').mockResolvedValue(stream);
		try {
			await expect(await missingVideoRef.current?.startCamera?.()).toEqual(new Error('No video track available'));
			await expect(args.onNoVideo).toHaveBeenCalledWith('No video track available');
			await expect(missingVideoRef.current?.stream).toBeUndefined();
			await expect(missingVideoRef.current?.container?.style.getPropertyValue('--camera-controls-transform')).toBe(
				'translateY(100%)',
			);
		} finally {
			request.mockRestore();
		}
	},
};

const rejectedRef = createRef<CameraElement>();
export const DeviceConstraintFallback: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true, sessionSettings: { videoDeviceId: 'missing-camera', micDeviceId: 'missing-mic' } },
	render: (args) => <Camera {...args} ref={rejectedRef} />,
	play: async ({ canvasElement, args }) => {
		const request = spyOn(navigator.mediaDevices, 'getUserMedia')
			.mockRejectedValueOnce(new DOMException('Device missing', 'NotFoundError'))
			.mockRejectedValueOnce('permission denied');
		try {
			const result = await rejectedRef.current?.startCamera?.();
			await expect(result).toEqual(new Error('Could not access the camera. Ensure permissions are correct'));
			await expect(request).toHaveBeenNthCalledWith(1, {
				video: { deviceId: { exact: 'missing-camera' } },
				audio: { deviceId: { exact: 'missing-mic' } },
			});
			await expect(request).toHaveBeenNthCalledWith(2, { video: true, audio: true });
			await expect(args.onNoVideo).toHaveBeenCalledWith(result);
			await expect(args.onNoAudio).toHaveBeenCalledWith(result);
			await expect(
				await within(canvasElement).findByText('Could not access the camera. Ensure permissions are correct'),
			).toBeVisible();
		} finally {
			request.mockRestore();
		}
	},
};

export const AutoStartPermissionDenied: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: false },
	beforeEach: () => {
		const request = spyOn(navigator.mediaDevices, 'getUserMedia').mockRejectedValue(
			new DOMException('Camera permission denied', 'NotAllowedError'),
		);
		return () => request.mockRestore();
	},
	render: (args) => <Camera {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await expect(await canvas.findByText('Camera permission denied')).toBeVisible();
		await expect(args.onNoVideo).toHaveBeenCalledWith(expect.objectContaining({ name: 'NotAllowedError' }));
		await expect(args.onNoAudio).toHaveBeenCalledWith(expect.objectContaining({ name: 'NotAllowedError' }));
		await expect(canvas.getByRole('button', { name: 'Photo' })).toHaveAttribute('aria-disabled', 'true');
	},
};
