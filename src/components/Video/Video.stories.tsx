import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import {
	runVideoCustomClassNamePlay,
	runVideoCustomControlsChildrenPlay,
	runVideoHoverControlsPlay,
	runVideoImperativeRefPlay,
	runVideoLoadProgressPlay,
	runVideoLoadProgressZeroDurationPlay,
	runVideoNullableObjectFitPlay,
	runVideoPlay,
	runVideoPlaybackLifecyclePlay,
	runVideoUndefinedControlledPropsPlay,
} from 'src/components/playHelpers';
import { expect, fireEvent, fn, spyOn, waitFor, within } from 'storybook/test';
import { Preset } from '../FlexDiv';
import { Video } from './Video';
import type { VideoElement } from './_types';

const customControls = {
	play: true,
	progress: true,
	volume: true,
	fullscreen: true,
	quit: true,
};

const meta: Meta<typeof Video> = {
	title: 'Components/Video',
	component: Video,
	args: {
		src: 'https://player.vimeo.com/progressive_redirect/playback/481754051/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=ee67f15d70122bb1a1e900e51e60e3c5384450a3c256412e15fe188ef841a6d2',
		height: 'auto',
		width: '100%',
		playing: false,
		objectFit: 'cover',
		controls: 'simple',
		muted: false,
		showProgressIndicator: false,
		customControls,
		onPlayStateChange: fn(),
		onFullScreenChange: fn(),
		onVolumeChange: fn(),
		onPlay: fn(),
		onPause: fn(),
		onEnd: fn(),
		onProgress: fn(),
		onLoadProgress: fn(),
		onPlaybackRateChange: fn(),
		onCanPlayThrough: fn(),
		onLoadMetaData: fn(),
		onLoadedFrameData: fn(),
		onQuit: fn(),
		onCanPlay: fn(),
	},
};

export default meta;

function VideoDemo(args: Parameters<Exclude<StoryObj<typeof Video>['render'], undefined>>[0]) {
	return (
		<FlexDiv absolute preset={Preset.FillScroll} direction={'column'} scrollY={true} scrollX={false} padding={64}>
			<FlexDiv height={'auto'} width={'fill'}>
				<Video {...args} />
			</FlexDiv>
		</FlexDiv>
	);
}

// exposes every method the imperative ref exposes (play/stop/restart/
// setVolume/mute/fullscreen/playbackRate/videoElement) behind its own plain
// buttons, so a play function can exercise the useImperativeHandle wiring
// directly instead of only through the UI it happens to be wired to elsewhere.
function VideoWithRefControls(args: Parameters<Exclude<StoryObj<typeof Video>['render'], undefined>>[0]) {
	const videoRef = useRef<VideoElement>(null);
	const [videoElementFound, setVideoElementFound] = useState(false);

	return (
		<FlexDiv
			absolute
			preset={Preset.FillScroll}
			direction={'column'}
			scrollY={true}
			scrollX={false}
			padding={64}
			gap={16}
		>
			<FlexDiv gap={8} wrap={true}>
				<button type={'button'} onClick={() => videoRef.current?.play?.()}>
					ref-play
				</button>
				<button type={'button'} onClick={() => videoRef.current?.stop?.()}>
					ref-stop
				</button>
				<button type={'button'} onClick={() => videoRef.current?.restart?.()}>
					ref-restart
				</button>
				<button type={'button'} onClick={() => videoRef.current?.setVolume?.(0.6)}>
					ref-set-volume
				</button>
				<button type={'button'} onClick={() => videoRef.current?.setVolume?.(-1)}>
					ref-set-volume-low
				</button>
				<button type={'button'} onClick={() => videoRef.current?.setVolume?.(2)}>
					ref-set-volume-high
				</button>
				<button type={'button'} onClick={() => videoRef.current?.mute?.(true)}>
					ref-mute
				</button>
				<button type={'button'} onClick={() => videoRef.current?.mute?.(false)}>
					ref-unmute
				</button>
				<button type={'button'} onClick={() => videoRef.current?.playbackRate?.(2)}>
					ref-rate-normal
				</button>
				<button type={'button'} onClick={() => videoRef.current?.playbackRate?.(0.1)}>
					ref-rate-low
				</button>
				<button type={'button'} onClick={() => videoRef.current?.playbackRate?.(10)}>
					ref-rate-high
				</button>
				<button type={'button'} onClick={() => videoRef.current?.fullscreen?.(true)}>
					ref-fullscreen-on
				</button>
				<button type={'button'} onClick={() => videoRef.current?.fullscreen?.(false)}>
					ref-fullscreen-off
				</button>
				<button type={'button'} onClick={() => setVideoElementFound(!!videoRef.current?.videoElement)}>
					ref-check-element
				</button>
			</FlexDiv>
			{videoElementFound && <span data-testid={'video-element-found'}>found</span>}
			<FlexDiv height={'auto'} width={'fill'}>
				<Video ref={videoRef} {...args} />
			</FlexDiv>
		</FlexDiv>
	);
}

// visible/documentation story: a light smoke pass over the real demo clip.
// It doesn't depend on that remote clip actually loading/playing (network
// dependent, and slow/blocked in CI) — the real play/pause/seek/ended
// lifecycle is covered for real by the dedicated PlaybackLifecycle story below.
export const Default: StoryObj<typeof Video> = {
	render: (args) => <VideoDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		await runVideoPlay({ canvasElement, args });
	},
};

// this story's own args point at a small, local, always-decodable, muted
// clip (see public/video/sample.mp4) instead of the story's own remote demo
// URL, so play/pause/seek/ended all happen for real — no network dependency,
// and no autoplay-policy workaround needed since it's muted from the start.
export const PlaybackLifecycle: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
		muted: true,
	},
	render: (args) => <VideoDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		await runVideoPlaybackLifecyclePlay({ canvasElement, args });
	},
};

// showCustomControls is false whenever controls is 'default' or 'none' — the
// Default/PlaybackLifecycle stories are both fixed to 'simple', so neither
// ever reaches that branch. These two only need to render, not interact.
export const NativeControls: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
		controls: 'default',
	},
	render: (args) => <VideoDemo {...args} />,
};

export const ControlsHidden: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
		controls: 'none',
	},
	render: (args) => <VideoDemo {...args} />,
};

// nothing else in this file calls the ref imperatively, so play/stop/restart/
// setVolume/mute/fullscreen/playbackRate/videoElement (the whole
// useImperativeHandle block) otherwise sit at zero coverage. Local muted clip
// so every play() call is safe under Chromium's autoplay policy regardless.
export const ImperativeRefControls: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
		muted: true,
		customControls: { play: false, progress: false, volume: false, fullscreen: false },
	},
	render: (args) => <VideoWithRefControls {...args} />,
	play: async ({ canvasElement, args }) => {
		await runVideoImperativeRefPlay({ canvasElement, args });
	},
};

// Default/PlaybackLifecycle hover canvasElement itself, which never actually
// reaches the player's own wrapper div — so `hovered` never flips true there
// and every custom-control button/slider (fullscreen, mute, volume,
// play-toggle, progress, quit) stays pointer-events:none and untouched.
// This story hovers the actual wrapper so those onClick/onChange handlers,
// and the mouse-over/mouse-out handlers themselves, really fire.
export const HoverAndCustomControls: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
		muted: true,
	},
	render: (args) => <VideoDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		await runVideoHoverControlsPlay({ canvasElement, args });
	},
};

export const CustomClassName: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
		className: 'story-video-class',
	},
	render: (args) => <VideoDemo {...args} />,
	play: async ({ canvasElement }) => {
		await runVideoCustomClassNamePlay({ canvasElement });
	},
};

// playing/muted/volume all left entirely undefined (rather than explicitly
// false/true/a number, as every other story sets them) exercises the `??`
// fallbacks seeding the initial ref/state values, plus the mount-sync
// effect's `if (playing === undefined) return;` true branch.
export const UndefinedControlledProps: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
		playing: undefined,
		muted: undefined,
		volume: undefined,
	},
	render: (args) => <VideoDemo {...args} />,
	play: async ({ canvasElement }) => {
		await runVideoUndefinedControlledPropsPlay({ canvasElement });
	},
};

export const NullableObjectFit: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
		objectFit: null as unknown as 'contain',
	},
	render: (args) => <VideoDemo {...args} />,
	play: async ({ canvasElement }) => {
		await runVideoNullableObjectFitPlay({ canvasElement });
	},
};

export const CustomControlsChildren: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
		controls: 'custom',
		children: <div data-testid={'video-custom-children'}>Custom overlay</div>,
	},
	render: (args) => <VideoDemo {...args} />,
	play: async ({ canvasElement }) => {
		await runVideoCustomControlsChildrenPlay({ canvasElement });
	},
};

export const LoadProgressWithDuration: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
	},
	render: (args) => <VideoDemo {...args} />,
	play: async ({ canvasElement }) => {
		await runVideoLoadProgressPlay({ canvasElement });
	},
};

export const LoadProgressZeroDuration: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
	},
	render: (args) => <VideoDemo {...args} />,
	play: async ({ canvasElement }) => {
		await runVideoLoadProgressZeroDurationPlay({ canvasElement });
	},
};

// No source means readiness cannot race the assertions; dispatch media events
// explicitly to cover the loading UI independently of network/decoder timing.
const playLoadingIndicator: NonNullable<StoryObj<typeof Video>['play']> = async ({ canvasElement, args }) => {
	const canvas = within(canvasElement);
	const video = canvasElement.querySelector('video');
	if (!video) throw new Error('Expected a video element');
	const spinner = () => canvas.queryByRole('img', { name: 'Loading spinner' });
	if (args.showProgressIndicator !== false) {
		await expect(spinner()).toBeInTheDocument();
	} else {
		await expect(spinner()).not.toBeInTheDocument();
	}
	await expect(args.onCanPlay).not.toHaveBeenCalled();
	fireEvent.loadedData(video);
	if (args.showProgressIndicator !== false) {
		await expect(spinner()).toBeInTheDocument();
	}
	fireEvent.canPlay(video);
	await waitFor(() => expect(spinner()).not.toBeInTheDocument());
	await expect(args.onCanPlay).toHaveBeenCalledTimes(1);
	await expect(args.onCanPlayThrough).not.toHaveBeenCalled();
};

export const LoadingIndicatorDefault: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined, showProgressIndicator: undefined },
	render: (args) => <VideoDemo {...args} />,
	play: playLoadingIndicator,
};

export const LoadingIndicatorEnabled: StoryObj<typeof Video> = {
	...LoadingIndicatorDefault,
	tags: ['tests'],
	args: { src: undefined, showProgressIndicator: true },
};

export const LoadingIndicatorDisabled: StoryObj<typeof Video> = {
	...LoadingIndicatorDefault,
	tags: ['tests'],
	args: { src: undefined, showProgressIndicator: false },
};

export const CanPlayWithoutCallback: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined, showProgressIndicator: true, onCanPlay: undefined },
	render: (args) => <VideoDemo {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('img', { name: 'Loading spinner' })).toBeInTheDocument();
		const video = canvasElement.querySelector('video');
		if (!video) throw new Error('Expected a video element');
		fireEvent.canPlay(video);
		await waitFor(() => expect(canvas.queryByRole('img', { name: 'Loading spinner' })).not.toBeInTheDocument());
	},
};

export const InterruptedRestart: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined, muted: true },
	render: (args) => <VideoWithRefControls {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const video = canvasElement.querySelector('video');
		if (!video) throw new Error('Expected a video element');
		let rejectPlay: (reason: DOMException) => void = () => undefined;
		const play = spyOn(video, 'play').mockImplementation(
			() =>
				new Promise<void>((_, reject) => {
					rejectPlay = reject;
				}),
		);
		try {
			fireEvent.click(canvas.getByRole('button', { name: 'ref-restart' }));
			await expect(play).toHaveBeenCalledTimes(1);
			fireEvent.click(canvas.getByRole('button', { name: 'ref-stop' }));
			rejectPlay(new DOMException('The play() request was interrupted by a call to pause().', 'AbortError'));
			// Let the browser report any unhandled rejection to the test runner.
			await new Promise((resolve) => setTimeout(resolve, 0));
			await expect(video.paused).toBe(true);
		} finally {
			play.mockRestore();
		}
	},
};

export const PlayEventAfterPause: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined },
	render: (args) => <VideoDemo {...args} />,
	play: async ({ canvasElement, args }) => {
		const video = canvasElement.querySelector('video');
		if (!video) throw new Error('Expected a video element');
		const play = spyOn(video, 'play').mockResolvedValue(undefined);
		try {
			// A queued play event can arrive after a synchronous pause.
			await expect(video.paused).toBe(true);
			fireEvent.play(video);
			await expect(args.onPlay).toHaveBeenCalledTimes(1);
			await expect(play).not.toHaveBeenCalled();
		} finally {
			play.mockRestore();
		}
	},
};
