import type { Meta, StoryObj } from '@storybook/react-vite';
import { createRef, useCallback, useEffect, useRef, useState } from 'react';
import { expect, fireEvent, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { Chip } from '../Chip';
import { FlexBox } from '../FlexBox';
import {
	createFakeCameraStream,
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
		showProfileButton: true,
		showSettingsButton: true,
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
		<FlexBox width={'fill'} height={'fill'} padding={32} gap={24}>
			<FlexBox direction={'row'} width={'fill'} gap={24} align={'start'}>
				<FlexBox width={460} height={460}>
					<Camera {...args} ref={cameraRef} onVideoStream={refreshStreamInfo} />
				</FlexBox>
				<FlexBox width={360} padding={16} gap={12}>
					<div>NOTE: This demo uses the forwarded ref instead of component state events.</div>
					Stream ID: <Chip>{streamInfo.streamId ?? 'none'}</Chip>
					Video Device ID: <Chip>{streamInfo.videoDeviceId ?? 'none'}</Chip>
					Video Enabled:{' '}
					<span>
						<Chip>{String(streamInfo.videoEnabled ?? false)}</Chip> /{' '}
						<Chip>{streamInfo.videoReadyState ?? 'none'}</Chip>
					</span>
					Audio Device ID: <Chip>{streamInfo.audioDeviceId ?? 'none'}</Chip>
					Audio Enabled:{' '}
					<span>
						<Chip>{String(streamInfo.audioEnabled ?? false)}</Chip> /<Chip>{streamInfo.audioReadyState ?? 'none'}</Chip>
					</span>
				</FlexBox>
			</FlexBox>
			<FlexBox direction={'row'} wrap gap={8}>
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
			</FlexBox>
		</FlexBox>
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
		<FlexBox width={'fill'} height={'fill'} padding={32} gap={24}>
			<FlexBox width={460} height={460}>
				<Camera {...args} ref={cameraRef} />
			</FlexBox>
			<FlexBox direction={'row'} wrap gap={8}>
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
			</FlexBox>
			<div data-testid={'ref-controls-log'}>{log.join(' | ')}</div>
		</FlexBox>
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
		await expect(within(canvasElement).getByRole('button', { name: 'Off' })).toHaveAttribute('aria-pressed', 'true');
		await expect(within(canvasElement).getByRole('button', { name: 'User Info' })).toHaveAttribute(
			'aria-pressed',
			'false',
		);
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
			await expect(args.onNoVideo).toHaveBeenCalledWith(new Error('No video track available'));
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
			.mockRejectedValue('permission denied')
			.mockRejectedValueOnce(new DOMException('Device missing', 'NotFoundError'));
		try {
			const result = await rejectedRef.current?.startCamera?.();
			await expect(result).toEqual(new Error('Could not access the camera. Ensure permissions are correct'));
			await expect(request).toHaveBeenNthCalledWith(1, {
				video: { deviceId: { exact: 'missing-camera' } },
				audio: { deviceId: { exact: 'missing-mic' } },
			});
			await expect(request).toHaveBeenNthCalledWith(2, { video: true, audio: true });
			await expect(request).toHaveBeenNthCalledWith(3, {
				video: { deviceId: { exact: 'missing-camera' } },
				audio: false,
			});
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

export const HiddenControls: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true, showControlBar: false, autoHideControlBar: false },
	render: (args) => <Camera {...args} />,
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).queryAllByRole('button')).toHaveLength(0);
	},
};
export const FrameAndNativeAttributes: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: {
		startCameraOff: true,
		showControlBar: false,
		width: 320,
		height: 180,
		className: 'camera-custom',
		style: { borderRadius: 12 },
		onClick: fn(),
	},
	render: (args) => <Camera {...args} id="camera-frame" data-testid="camera-frame" />,
	play: async ({ canvasElement, args }) => {
		const frame = within(canvasElement).getByTestId('camera-frame');
		expect(frame).toHaveClass('camera-custom');
		expect(frame.id).toBe('camera-frame');
		expect(getComputedStyle(frame).width).toBe('320px');
		expect(getComputedStyle(frame).height).toBe('180px');
		expect(getComputedStyle(frame).borderRadius).toBe('12px');
		await userEvent.click(frame);
		expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};
export const KeyboardRevealsControls: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true, autoHideControlBar: true, onChangeProfile: fn() },
	render: (args) => <Camera {...args} data-testid="camera" />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const user = canvas.getByRole('button', { name: 'User Info' });
		expect(user.tagName).toBe('BUTTON');
		user.focus();
		await waitFor(() =>
			expect(canvas.getByTestId('camera').style.getPropertyValue('--camera-controls-transform')).toBe('translateY(0%)'),
		);
		await userEvent.keyboard(' ');
		expect(args.onChangeProfile).toHaveBeenCalledTimes(1);
		expect(canvas.getByRole('button', { name: 'Photo' })).toBeDisabled();
	},
};
export const VideoOnly: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { audio: false, startCameraOff: true, autoHideControlBar: false },
	render: (args) => <Camera {...args} />,
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).queryByRole('button', { name: /^(mic|muted)$/i })).toBeNull();
	},
};
function ParentRerenderDemo() {
	const ref = useRef<CameraElement>(null);
	const [count, setCount] = useState(0);
	const [device, setDevice] = useState<string>();
	return (
		<>
			<Camera
				ref={ref}
				sessionSettings={{ videoDeviceId: device }}
				startCameraOff
				autoHideControlBar={false}
				onVideoStream={() => {}}
				data-testid="parent-camera"
			/>
			<Button
				onClick={() => {
					void ref.current?.startCamera();
				}}
			>
				Acquire
			</Button>
			<Button onClick={() => ref.current?.disableVideo()}>Disable capture</Button>
			<Button onClick={() => setCount(count + 1)}>Rerender {count}</Button>
			<Button onClick={() => setDevice('next-device')}>Switch device</Button>
		</>
	);
}
export const ParentRerenderPreservesVideoOff: StoryObj<typeof Camera> = {
	tags: ['tests'],
	render: () => <ParentRerenderDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const request = spyOn(navigator.mediaDevices, 'getUserMedia').mockImplementation(async () =>
			createFakeCameraStream(),
		);
		try {
			await userEvent.click(canvas.getByRole('button', { name: 'Acquire' }));
			await waitFor(() => expect(canvas.getByRole('button', { name: 'Photo' })).not.toBeDisabled());
			await userEvent.click(canvas.getByRole('button', { name: 'Disable capture' }));
			await userEvent.click(canvas.getByRole('button', { name: 'Rerender 0' }));
			expect(canvas.getByRole('button', { name: 'Photo' })).toBeDisabled();
			expect(request).toHaveBeenCalledTimes(1);
			const video = canvas.getByTestId('parent-camera').querySelector('video') as HTMLVideoElement;
			const stream = video.srcObject as MediaStream;
			expect(stream.getVideoTracks()[0].readyState).toBe('live');
			expect(stream.getVideoTracks()[0].enabled).toBe(false);
			await userEvent.click(canvas.getByRole('button', { name: 'Switch device' }));
			await waitFor(() => expect(video.srcObject).not.toBe(stream));
			await waitFor(() => expect(canvas.getByRole('button', { name: 'Photo' })).toBeDisabled());
			expect(stream.getVideoTracks()[0].readyState).toBe('ended');
			expect(request).toHaveBeenLastCalledWith({ video: { deviceId: { exact: 'next-device' } }, audio: true });
		} finally {
			request.mockRestore();
		}
	},
};

export const FocusAndActivityKeepControlsVisible: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true, autoHideControlBar: true },
	render: (args) => <Camera {...args} data-testid="camera-activity" />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const frame = canvas.getByTestId('camera-activity');
		const user = canvas.getByRole('button', { name: 'User Info' });
		user.focus();
		await new Promise((resolve) => setTimeout(resolve, 3100));
		expect(frame.style.getPropertyValue('--camera-controls-transform')).toBe('translateY(0%)');
		user.blur();
		await userEvent.hover(frame);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		fireEvent.mouseMove(frame);
		await new Promise((resolve) => setTimeout(resolve, 1200));
		expect(frame.style.getPropertyValue('--camera-controls-transform')).toBe('translateY(0%)');
		await userEvent.unhover(frame);
	},
};

const snapshotRef = createRef<CameraElement>();
export const SnapshotRemainsSynchronous: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true, autoHideControlBar: false },
	render: (args) => <Camera {...args} ref={snapshotRef} />,
	play: async ({ canvasElement }) => {
		const request = spyOn(navigator.mediaDevices, 'getUserMedia').mockImplementation(async () =>
			createFakeCameraStream(),
		);
		const create = spyOn(URL, 'createObjectURL');
		const revoke = spyOn(URL, 'revokeObjectURL');
		try {
			await snapshotRef.current?.startCamera();
			await waitFor(() => expect(within(canvasElement).getByRole('button', { name: 'Photo' })).not.toBeDisabled());
			const first = snapshotRef.current?.snapshot();
			const second = snapshotRef.current?.snapshot();
			expect(first instanceof Blob).toBe(true);
			expect(second instanceof Blob).toBe(true);
			expect(revoke).toHaveBeenCalledWith(create.mock.results[0].value);
			expect(snapshotRef.current?.snapshot({ toggle: true })).toBeUndefined();
			expect(revoke).toHaveBeenCalledWith(create.mock.results[1].value);
		} finally {
			request.mockRestore();
			create.mockRestore();
			revoke.mockRestore();
		}
	},
};

export const NoAutoHideWorkWhenUnused: StoryObj<typeof Camera> = {
	tags: ['tests'],
	args: { startCameraOff: true, onMouseMove: fn() },
	render: (args) => (
		<>
			<Camera {...args} autoHideControlBar={false} data-testid="fixed-controls" />
			<Camera {...args} showControlBar={false} data-testid="no-controls" />
		</>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const timers = spyOn(window, 'setTimeout');
		try {
			const fixed = canvas.getByTestId('fixed-controls');
			const hidden = canvas.getByTestId('no-controls');
			await userEvent.hover(fixed);
			fireEvent.mouseMove(fixed);
			canvas.getByRole('button', { name: 'User Info' }).focus();
			await userEvent.unhover(fixed);
			await userEvent.hover(hidden);
			fireEvent.mouseMove(hidden);
			await userEvent.unhover(hidden);
			expect(timers.mock.calls.filter((call) => call[1] === 3000)).toHaveLength(0);
			expect(args.onMouseMove).toHaveBeenCalled();
		} finally {
			timers.mockRestore();
		}
	},
};

export const OptionalToolbarActions: StoryObj<typeof Camera> = {
	tags: ['tests'],
	render: () => <Camera startCameraOff autoHideControlBar={false} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.queryByRole('button', { name: 'User Info' })).not.toBeInTheDocument();
		expect(canvas.queryByRole('button', { name: 'Settings' })).not.toBeInTheDocument();
		expect(canvas.getByRole('button', { name: 'Off' })).toBeInTheDocument();
	},
};

export const OffBackgroundRemainsConsistent: StoryObj<typeof Camera> = {
	tags: ['tests'],
	render: () => (
		<Camera
			startCameraOff
			audio={false}
			autoHideControlBar={false}
			backgroundColor="rgb(40, 60, 80)"
			borderWidth={2}
			borderColor="core-outline-special"
			borderRadius={16}
			data-testid="background-camera"
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const frame = canvas.getByTestId('background-camera');
		const video = frame.querySelector('video');
		if (!video) throw new Error('Expected video element');
		const request = spyOn(navigator.mediaDevices, 'getUserMedia').mockImplementation(async () =>
			createFakeCameraStream(),
		);
		try {
			expect(getComputedStyle(video).visibility).toBe('hidden');
			const background = getComputedStyle(frame).backgroundColor;
			await userEvent.click(canvas.getByRole('button', { name: 'Off' }));
			await waitFor(() => expect(getComputedStyle(video).visibility).toBe('visible'));
			await userEvent.click(canvas.getByRole('button', { name: 'Video' }));
			await waitFor(() => expect(getComputedStyle(video).visibility).toBe('hidden'));
			expect(getComputedStyle(frame).backgroundColor).toBe(background);
			expect(background).toBe('rgb(40, 60, 80)');
			expect(getComputedStyle(frame).borderTopWidth).toBe('2px');
			expect(getComputedStyle(frame).borderRadius).toBe('16px');
			expect(getComputedStyle(frame).borderTopStyle).toBe('solid');
			await userEvent.click(canvas.getByRole('button', { name: 'Off' }));
			await waitFor(() => expect(getComputedStyle(video).visibility).toBe('visible'));
			expect(request).toHaveBeenCalledTimes(1);
		} finally {
			request.mockRestore();
		}
	},
};
