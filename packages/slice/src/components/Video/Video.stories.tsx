import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { FlexBox } from 'src/components/FlexBox/FlexBox';
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
import { Button } from '../Button';
import { Preset } from '../FlexBox';
import { Slider } from '../Slider';
import { Video } from './Video';
import type { VideoElement, VideoProps } from './_types';

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
		customControls: undefined,
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
		<FlexBox absolute preset={Preset.FillScroll} direction={'column'} scrollY={true} scrollX={false} padding={64}>
			<FlexBox height={'auto'} width={'fill'}>
				<Video {...args} />
			</FlexBox>
		</FlexBox>
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
		<FlexBox
			absolute
			preset={Preset.FillScroll}
			direction={'column'}
			scrollY={true}
			scrollX={false}
			padding={64}
			gap={16}
		>
			<FlexBox gap={8} wrap={true}>
				<button type={'button'} onClick={() => videoRef.current?.play?.().catch(() => undefined)}>
					ref-play
				</button>
				<button type={'button'} onClick={() => videoRef.current?.stop?.()}>
					ref-stop
				</button>
				<button type={'button'} onClick={() => videoRef.current?.restart?.().catch(() => undefined)}>
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
				<button type={'button'} onClick={() => videoRef.current?.fullscreen?.(true).catch(() => undefined)}>
					ref-fullscreen-on
				</button>
				<button type={'button'} onClick={() => videoRef.current?.fullscreen?.(false).catch(() => undefined)}>
					ref-fullscreen-off
				</button>
				<button type={'button'} onClick={() => setVideoElementFound(!!videoRef.current?.videoElement)}>
					ref-check-element
				</button>
			</FlexBox>
			{videoElementFound && <span data-testid={'video-element-found'}>found</span>}
			<FlexBox height={'auto'} width={'fill'}>
				<Video ref={videoRef} {...args} />
			</FlexBox>
		</FlexBox>
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
	const spinner = () => canvas.queryByText('Loading video');
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
		await expect(canvas.getByText('Loading video')).toBeInTheDocument();
		const video = canvasElement.querySelector('video');
		if (!video) throw new Error('Expected a video element');
		fireEvent.canPlay(video);
		await waitFor(() => expect(canvas.queryByText('Loading video')).not.toBeInTheDocument());
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

function PlaybackPromiseDemo({ restart = false }: { restart?: boolean }) {
	const ref = useRef<VideoElement>(null);
	const [result, setResult] = useState('Idle');
	return (
		<>
			<button
				type="button"
				onClick={() => {
					setResult('Pending');
					const request = restart ? ref.current?.restart() : ref.current?.play();
					void request?.then(
						() => setResult('Started'),
						() => setResult('Rejected'),
					);
				}}
			>
				Await playback
			</button>
			<span data-testid="playback-result">{result}</span>
			<Video ref={ref} showProgressIndicator={false} />
		</>
	);
}

export const AwaitPlayback: StoryObj<typeof Video> = {
	tags: ['tests'],
	render: () => <PlaybackPromiseDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const video = getStoryVideo(canvasElement);
		let resolve = () => {};
		const play = spyOn(video, 'play').mockImplementation(
			() =>
				new Promise<void>((done) => {
					resolve = done;
				}),
		);
		try {
			await fireEvent.click(canvas.getByRole('button', { name: 'Await playback' }));
			await expect(canvas.getByTestId('playback-result')).toHaveTextContent('Pending');
			resolve();
			await waitFor(() => expect(canvas.getByTestId('playback-result')).toHaveTextContent('Started'));
		} finally {
			play.mockRestore();
		}
	},
};
export const RejectedRestart: StoryObj<typeof Video> = {
	tags: ['tests'],
	render: () => <PlaybackPromiseDemo restart />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const play = spyOn(getStoryVideo(canvasElement), 'play').mockRejectedValue(
			new DOMException('Blocked', 'NotAllowedError'),
		);
		try {
			fireEvent.click(canvas.getByRole('button', { name: 'Await playback' }));
			await waitFor(() => expect(canvas.getByTestId('playback-result')).toHaveTextContent('Rejected'));
		} finally {
			play.mockRestore();
		}
	},
};

function SourceReplacementDemo() {
	const [replaced, setReplaced] = useState(false);
	return (
		<>
			<button type="button" onClick={() => setReplaced(true)}>
				Replace source
			</button>
			<Video src={replaced ? undefined : '/public/video/sample.mp4'} muted />
		</>
	);
}

export const SourceReplacement: StoryObj<typeof Video> = {
	tags: ['tests'],
	render: () => <SourceReplacementDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const oldVideo = getStoryVideo(canvasElement);
		await waitFor(() => expect(oldVideo.readyState).toBeGreaterThanOrEqual(3));
		await waitFor(() => expect(canvas.queryByRole('status')).not.toBeInTheDocument());
		fireEvent.click(canvas.getByRole('button', { name: 'Replace source' }));
		await waitFor(() => expect(oldVideo.isConnected).toBe(false));
		await expect(canvas.getByRole('status')).toHaveTextContent('Loading video');
		await expect(canvas.getByRole('slider', { name: 'Playback position' })).toBeDisabled();
	},
};
export const NativeVolumeSynchronization: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined, muted: true, onVolumeChange: fn() },
	render: (args) => <Video {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const video = getStoryVideo(canvasElement);
		video.volume = 0.35;
		video.muted = false;
		await waitFor(() => expect(canvas.getByRole('slider', { name: 'Volume' })).toHaveValue('0.35'));
		await expect(canvas.getByRole('button', { name: 'Mute' })).toBeInTheDocument();
		await expect(args.onVolumeChange).toHaveBeenCalledWith(0.35);
	},
};
export const InvalidDuration: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined, onProgress: fn() },
	render: (args) => <Video {...args} />,
	play: async ({ canvasElement, args }) => {
		const video = getStoryVideo(canvasElement);
		for (const duration of [0, Number.NaN, Number.POSITIVE_INFINITY]) {
			Object.defineProperty(video, 'duration', { configurable: true, value: duration });
			fireEvent.durationChange(video);
			fireEvent.timeUpdate(video);
			await expect(within(canvasElement).getByRole('slider', { name: 'Playback position' })).toBeDisabled();
		}
		await expect(args.onProgress).toHaveBeenCalledWith(0);
	},
};
export const BufferingAndFailure: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined, showProgressIndicator: true, onError: fn() },
	render: (args) => <Video {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const video = getStoryVideo(canvasElement);
		await new Promise((resolve) => setTimeout(resolve, 0));
		fireEvent.canPlay(video);
		await waitFor(() => expect(canvas.queryByRole('status')).not.toBeInTheDocument());
		fireEvent.waiting(video);
		await expect(canvas.getByRole('status')).toHaveTextContent('Loading video');
		fireEvent.error(video);
		await expect(canvas.getByRole('alert')).toHaveTextContent('Unable to load video');
		await expect(canvas.queryByRole('status')).not.toBeInTheDocument();
		await expect(args.onError).toHaveBeenCalledWith(null);
		fireEvent.loadStart(video);
		await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
	},
};
export const NativeAttributesAndCaptions: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: '/public/video/sample.mp4',
		muted: true,
		videoName: 'Training clip',
		videoAttributes: { preload: 'metadata', crossOrigin: 'anonymous', className: 'native-video' },
		captionsSrc: '/public/video/sample.vtt',
		captionsLanguage: 'en',
		captionsLabel: 'English',
		captionsDefault: true,
	},
	render: (args) => <Video {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const video = getStoryVideo(canvasElement);
		await expect(video).toHaveAttribute('aria-label', 'Training clip');
		await expect(video).toHaveAttribute('preload', 'metadata');
		await expect(video).toHaveClass('native-video');
		await expect(video).toHaveAttribute('crossorigin', 'anonymous');
		await expect(video.querySelector('track')).toHaveAttribute('srclang', 'en');
		await waitFor(() => expect(video.textTracks[0]?.mode).toBe('showing'));
		fireEvent.click(canvas.getByRole('button', { name: 'Captions' }));
		await waitFor(() => expect(video.textTracks[0]?.mode).toBe('hidden'));
		await expect(canvas.getByRole('button', { name: 'Captions' })).toHaveAttribute('aria-pressed', 'false');
	},
};
export const FullscreenContainsControls: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined },
	render: (args) => <VideoWithRefControls {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const video = getStoryVideo(canvasElement);
		const wrapper = video.parentElement;
		if (!wrapper) throw new Error('Expected player wrapper');
		const request = spyOn(wrapper, 'requestFullscreen').mockResolvedValue(undefined);
		const exit = spyOn(document, 'exitFullscreen').mockResolvedValue(undefined);
		const fullscreen = spyOn(document, 'fullscreenElement', 'get').mockReturnValue(wrapper);
		try {
			fireEvent.click(canvas.getByRole('button', { name: 'ref-fullscreen-on' }));
			await expect(request).toHaveBeenCalledTimes(1);
			fireEvent(document, new Event('fullscreenchange'));
			await expect(args.onFullScreenChange).toHaveBeenCalledWith(true);
			fireEvent.click(canvas.getByRole('button', { name: 'Exit fullscreen' }));
			await expect(exit).toHaveBeenCalledTimes(1);
		} finally {
			request.mockRestore();
			exit.mockRestore();
			fullscreen.mockRestore();
		}
	},
};

function getStoryVideo(canvasElement: HTMLElement) {
	const video = canvasElement.querySelector('video');
	if (!video) throw new Error('Expected video element');
	return video;
}

export const KeyboardFocusKeepsControlsVisible: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined, onFocus: fn(), onMouseEnter: fn() },
	render: (args) => <Video {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const video = getStoryVideo(canvasElement);
		const root = video.parentElement;
		if (!root) throw new Error('Expected video wrapper');
		fireEvent.mouseOver(root);
		const fullscreen = canvas.getByRole('button', { name: 'Enter fullscreen' });
		fullscreen.focus();
		await new Promise((resolve) => setTimeout(resolve, 2100));
		await expect(getComputedStyle(root).getPropertyValue('--video-controls-opacity').trim()).toBe('1');
		await expect(args.onFocus).toHaveBeenCalled();
		await expect(args.onMouseEnter).toHaveBeenCalled();
		canvas.getByRole('slider', { name: 'Volume' }).focus();
		await expect(getComputedStyle(root).getPropertyValue('--video-controls-opacity').trim()).toBe('1');
	},
};
const playSeekState: NonNullable<StoryObj<typeof Video>['play']> = async ({ canvasElement, args }) => {
	const video = getStoryVideo(canvasElement);
	const canvas = within(canvasElement);
	await waitFor(() => expect(video.readyState).toBeGreaterThanOrEqual(3));
	await waitFor(() => expect(video.paused).toBe(!args.playing));
	canvas.getByRole('slider', { name: 'Playback position' }).focus();
	fireEvent.keyDown(canvas.getByRole('slider', { name: 'Playback position' }), { key: 'ArrowRight' });
	await expect(video.paused).toBe(true);
	fireEvent.keyUp(canvas.getByRole('slider', { name: 'Playback position' }), { key: 'ArrowRight' });
	await waitFor(() => expect(video.paused).toBe(!args.playing));
};
export const PausedSeekStaysPaused: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: '/public/video/sample.mp4', muted: true, loop: true, playing: false },
	render: (args) => <Video {...args} />,
	play: playSeekState,
};
export const PlayingSeekResumes: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: '/public/video/sample.mp4', muted: true, loop: true, playing: true },
	render: (args) => <Video {...args} />,
	play: playSeekState,
};

export const ExplicitPlayOnly: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined, controls: 'default', customControls: { play: true } },
	render: (args) => <Video {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getAllByRole('button')).toHaveLength(1);
		await expect(canvas.getByRole('button', { name: 'Play' })).toBeInTheDocument();
		await expect(canvas.queryByRole('slider')).not.toBeInTheDocument();
		await expect(getStoryVideo(canvasElement).controls).toBe(false);
	},
};
export const ExplicitEmptyControls: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined, customControls: {} },
	render: (args) => <Video {...args} />,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument();
		await expect(within(canvasElement).queryByRole('slider')).not.toBeInTheDocument();
	},
};
export const ExplicitControlsReplaceChildren: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: {
		src: undefined,
		controls: 'custom',
		customControls: { play: true },
		children: <button type="button">Custom action</button>,
	},
	render: (args) => <Video {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('button', { name: 'Play' })).toBeInTheDocument();
		await expect(canvas.queryByRole('button', { name: 'Custom action' })).not.toBeInTheDocument();
	},
};

function RenderControlVideo(args: VideoProps) {
	return (
		<Video {...args} controls="custom">
			{({ playing, muted, progress, volume, canSeek, togglePlay, toggleMute, setProgress, setVolume }) => (
				<FlexBox direction="column" gap={8}>
					<Button
						onClick={() => {
							void togglePlay().catch(() => undefined);
						}}
					>
						{playing ? 'Pause custom' : 'Play custom'}
					</Button>
					<Button onClick={toggleMute}>{muted ? 'Unmute custom' : 'Mute custom'}</Button>
					<Slider
						aria-label="Custom progress"
						min={0}
						max={1}
						step={0.1}
						value={progress}
						disabled={!canSeek}
						onChange={setProgress}
					/>
					<Slider aria-label="Custom volume" min={0} max={1} step={0.1} value={volume} onChange={setVolume} />
				</FlexBox>
			)}
		</Video>
	);
}
export const RenderControlsActions: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: '/public/video/sample.mp4', muted: true, loop: true },
	render: (args) => <RenderControlVideo {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const video = getStoryVideo(canvasElement);
		await waitFor(() => expect(video.readyState).toBeGreaterThanOrEqual(3));
		fireEvent.click(canvas.getByRole('button', { name: 'Play custom' }));
		await waitFor(() => expect(video.paused).toBe(false));
		await expect(canvas.getByRole('button', { name: 'Pause custom' })).toBeInTheDocument();
		fireEvent.click(canvas.getByRole('button', { name: 'Unmute custom' }));
		await waitFor(() => expect(video.muted).toBe(false));
		await expect(canvas.getByRole('button', { name: 'Mute custom' })).toBeInTheDocument();
		fireEvent.keyDown(canvas.getByRole('slider', { name: 'Custom volume' }), { key: 'ArrowLeft' });
		await waitFor(() => expect(video.volume).toBeCloseTo(0.9));
		video.pause();
		await waitFor(() => expect(canvas.getByRole('button', { name: 'Play custom' })).toBeInTheDocument());
	},
};
const seekWithRenderControls: NonNullable<StoryObj<typeof Video>['play']> = async ({ canvasElement, args }) => {
	const canvas = within(canvasElement);
	const video = getStoryVideo(canvasElement);
	await waitFor(() => expect(video.readyState).toBeGreaterThanOrEqual(3));
	await waitFor(() => expect(video.paused).toBe(!args.playing));
	fireEvent.keyDown(canvas.getByRole('slider', { name: 'Custom progress' }), { key: 'Home' });
	fireEvent.keyDown(canvas.getByRole('slider', { name: 'Custom progress' }), { key: 'ArrowRight' });
	await waitFor(() => expect(video.currentTime).toBeGreaterThan(video.duration * 0.05));
	await expect(video.paused).toBe(!args.playing);
};
export const RenderControlsSeekWhilePaused: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: '/public/video/sample.mp4', muted: true, playing: false, loop: true },
	render: (args) => <RenderControlVideo {...args} />,
	play: seekWithRenderControls,
};
export const RenderControlsSeekWhilePlaying: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: '/public/video/sample.mp4', muted: true, playing: true, loop: true },
	render: (args) => <RenderControlVideo {...args} />,
	play: seekWithRenderControls,
};

export const AutoplayUpdatesProgressControl: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: '/public/video/sample.mp4', playing: true, muted: true, loop: true, customControls: { progress: true } },
	render: (args) => <Video {...args} />,
	play: async ({ canvasElement }) => {
		const video = getStoryVideo(canvasElement);
		await waitFor(() => expect(video.readyState).toBeGreaterThanOrEqual(3));
		await waitFor(() => expect(video.paused).toBe(false));
		await expect(within(canvasElement).getByRole('button', { name: 'Pause' })).toHaveAttribute('aria-pressed', 'true');
	},
};
export const PlayingEventRestoresProgressControl: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined, showProgressIndicator: false, customControls: { progress: true } },
	render: (args) => <Video {...args} />,
	play: async ({ canvasElement }) => {
		const video = getStoryVideo(canvasElement);
		const paused = spyOn(video, 'paused', 'get').mockReturnValue(false);
		try {
			fireEvent.play(video);
			fireEvent.loadStart(video);
			fireEvent.playing(video);
			await expect(within(canvasElement).getByRole('button', { name: 'Pause' })).toHaveAttribute(
				'aria-pressed',
				'true',
			);
		} finally {
			paused.mockRestore();
		}
	},
};

export const BlockedAutoplayKeepsPlayControl: StoryObj<typeof Video> = {
	tags: ['tests'],
	args: { src: undefined, playing: true, showProgressIndicator: false, customControls: { progress: true } },
	beforeEach: () => {
		const play = spyOn(HTMLMediaElement.prototype, 'play').mockRejectedValue(
			new DOMException('Autoplay blocked', 'NotAllowedError'),
		);
		return () => play.mockRestore();
	},
	render: (args) => <Video {...args} />,
	play: async ({ canvasElement }) => {
		await waitFor(() => expect(HTMLMediaElement.prototype.play).toHaveBeenCalled());
		await expect(within(canvasElement).getByRole('button', { name: 'Play' })).toHaveAttribute('aria-pressed', 'false');
	},
};
