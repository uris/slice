import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useEffect, useMemo } from 'react';
import { FlexBox } from 'src/components/FlexBox/FlexBox';
import { VideoController } from 'src/components/VideoController/VideoController';
import { expect, fireEvent, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { getVideo, useVideoActions, videoActions } from '../../stores';
import { corners } from '../../theme/corners/corners';
import { Button } from '../Button';
import { Video, type VideoProps } from '../Video';
import { runVideoControllerQuitOutsidePlay, runVideoControllerShowAndHidePlay } from '../playHelpers';

// a small, local, always-decodable, muted clip (see public/video/sample.mp4)
// instead of a remote demo URL - removes a network dependency from CI and,
// combined with muted: true, sidesteps Chromium's autoplay-gesture policy
// entirely (see contributor-docs/writing-tests.md).
const demoVideoProps: VideoProps = {
	src: '/public/video/sample.mp4',
	height: 'auto',
	width: '100%',
	playing: true,
	objectFit: 'cover',
	controls: 'simple',
	muted: true,
	borderRadius: corners['corner-xl'],
	customControls: {
		play: false,
		progress: true,
		volume: false,
		fullscreen: false,
	},
};

const meta: Meta<typeof VideoController> = {
	title: 'Components/VideoController',
	component: VideoController,
	args: {
		onQuit: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof VideoController> = {
	render: (args) => {
		return (
			<VideoControllerDemo
				{...args}
				demoSrc="https://player.vimeo.com/progressive_redirect/playback/481754051/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=ee67f15d70122bb1a1e900e51e60e3c5384450a3c256412e15fe188ef841a6d2"
			/>
		);
	},
};

export const ShowAndHide: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	render: (args) => {
		return <VideoControllerDemo {...args} />;
	},
	play: async ({ canvasElement, args }) => {
		// the video store is a module-level singleton shared across every story
		// in this file - reset it before this one runs so a previous story's
		// leftover shown video can never bleed into this run
		videoActions.clear();
		await runVideoControllerShowAndHidePlay({ canvasElement, args });
	},
};

export const QuitOutside: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	render: (args) => {
		return <VideoControllerDemo {...args} quit={'outside'} />;
	},
	play: async ({ canvasElement }) => {
		videoActions.clear();
		await runVideoControllerQuitOutsidePlay({ canvasElement });
	},
};

export const NotDraggable: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	render: (args) => {
		return <VideoControllerDemo {...args} draggable={false} />;
	},
	play: async ({ canvasElement, args }) => {
		videoActions.clear();
		await runVideoControllerShowAndHidePlay({ canvasElement, args });
	},
};

function VideoControllerDemo({
	demoSrc,
	...args
}: React.ComponentProps<typeof VideoController> & { demoSrc?: string }) {
	const show = useVideoActions().show;

	// await the modal response value
	const handleShowVideo = () => {
		const videoToShow = {
			id: 'demo-video',
			component: Video,
			props: { ...demoVideoProps, src: demoSrc ?? demoVideoProps.src },
		};
		show(videoToShow);
	};

	return (
		<FlexBox absolute justify={'center'} align={'center'}>
			<Button iconRight={'arrows.arrow-right'} onClick={handleShowVideo}>
				Show Video
			</Button>
			<VideoController {...args} quit={args.quit ?? 'inside'} />
		</FlexBox>
	);
}

const playLoadingIndicator: NonNullable<StoryObj<typeof VideoController>['play']> = async ({ canvasElement, args }) => {
	videoActions.clear();
	const canvas = within(canvasElement);
	try {
		videoActions.show({
			id: 'loading-video',
			component: Video,
			// An opposing descriptor value verifies the controller owns this option.
			props: { playing: false, showProgressIndicator: args.showProgressIndicator === false },
		});
		await waitFor(() => expect(canvasElement.querySelector('video')).toBeInTheDocument());
		const video = canvasElement.querySelector('video');
		if (!video) throw new Error('Expected a video element');
		await new Promise((resolve) => setTimeout(resolve, 0));
		// Loading and dismissal remain visible before the first frame.
		fireEvent.loadedData(video);
		if (args.showProgressIndicator !== false) {
			await waitFor(() => expect(canvas.getByRole('status')).toBeVisible());
		} else {
			await expect(canvas.queryByText('Loading video')).not.toBeInTheDocument();
		}
		fireEvent.canPlay(video);
		await waitFor(() => expect(canvas.queryByText('Loading video')).not.toBeInTheDocument());
	} finally {
		videoActions.clear();
		await waitFor(() => expect(canvasElement.querySelector('video')).not.toBeInTheDocument());
	}
};

export const LoadingIndicatorDefault: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	render: (args) => <VideoController {...args} />,
	play: playLoadingIndicator,
};

export const LoadingIndicatorEnabled: StoryObj<typeof VideoController> = {
	...LoadingIndicatorDefault,
	args: { showProgressIndicator: true },
};

export const LoadingIndicatorDisabled: StoryObj<typeof VideoController> = {
	...LoadingIndicatorDefault,
	args: { showProgressIndicator: false },
};

export const ExplicitControllerControlsReplaceDescriptor: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	args: { draggable: false, transition: { duration: 0 }, customControls: { play: true } },
	render: (args) => <VideoController {...args} />,
	play: async ({ canvasElement }) => {
		videoActions.clear();
		const canvas = within(canvasElement);
		try {
			videoActions.show({ component: Video, props: { customControls: { progress: true, volume: true } } });
			const dialog = await canvas.findByRole('dialog', { name: 'Video player' });
			await waitFor(() => expect(dialog).toBeVisible());
			const video = dialog.querySelector('video');
			if (!video) throw new Error('Expected video element');
			fireEvent.canPlay(video);
			await expect(canvas.getByRole('button', { name: 'Play' })).toBeInTheDocument();
			await expect(canvas.queryByRole('slider', { name: 'Playback position' })).not.toBeInTheDocument();
			await expect(canvas.queryByRole('slider', { name: 'Volume' })).not.toBeInTheDocument();
			await expect(canvas.queryByRole('button', { name: 'Enter fullscreen' })).not.toBeInTheDocument();
			await userEvent.click(canvas.getByRole('button', { name: 'Close video' }));
			await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
		} finally {
			videoActions.clear();
		}
	},
};
export const FocusAndEscape: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	args: { draggable: false, dialogName: 'Preview video', transition: { duration: 0 } },
	render: (args) => <VideoControllerDemo {...args} />,
	play: async ({ canvasElement }) => {
		videoActions.clear();
		const canvas = within(canvasElement);
		const opener = canvas.getByRole('button', { name: 'Show Video' });
		const overflow = document.body.style.overflow;
		try {
			await userEvent.click(opener);
			const dialog = await canvas.findByRole('dialog', { name: 'Preview video' });
			await expect(dialog).toHaveAttribute('aria-modal', 'true');
			await expect(opener.inert).toBe(true);
			await expect(dialog.contains(document.activeElement)).toBe(true);
			await userEvent.tab({ shift: true });
			await expect(dialog.contains(document.activeElement)).toBe(true);
			await userEvent.keyboard('{Escape}');
			await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
			await expect(opener).toHaveFocus();
			await expect(opener.inert).toBe(false);
			await expect(document.body.style.overflow).toBe(overflow);
		} finally {
			videoActions.clear();
		}
	},
};
export const DescriptorReplacement: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	args: { draggable: false, transition: { duration: 0 } },
	render: (args) => <VideoController {...args} />,
	play: async ({ canvasElement }) => {
		videoActions.clear();
		const canvas = within(canvasElement);
		try {
			videoActions.show({ id: 'same', component: Video, props: { src: '/public/video/sample.mp4', playing: true } });
			await canvas.findByRole('dialog');
			const oldVideo = canvasElement.querySelector('video');
			if (!oldVideo) throw new Error('Expected original video');
			await waitFor(() => expect(oldVideo.readyState).toBeGreaterThanOrEqual(2));
			videoActions.show({ id: 'same', component: Video, props: { videoName: 'Replacement' } });
			await waitFor(() => expect(oldVideo.isConnected).toBe(false));
			await expect(canvasElement.querySelector('video')).toHaveAttribute('aria-label', 'Replacement');
			await expect(canvas.getByRole('status')).toHaveTextContent('Loading video');
			videoActions.show({ component: Video, props: { videoName: 'No ID' } });
			await waitFor(() => expect(canvasElement.querySelector('video')).toHaveAttribute('aria-label', 'No ID'));
			await expect(canvas.queryByRole('button', { name: 'Close video' })).not.toBeInTheDocument();
		} finally {
			videoActions.clear();
		}
	},
};
export const FailureCanBeDismissed: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	args: { draggable: false, onQuit: fn(), transition: { duration: 0 } },
	render: (args) => <VideoController {...args} />,
	play: async ({ canvasElement, args }) => {
		videoActions.clear();
		const canvas = within(canvasElement);
		const descriptorQuit = fn();
		const error = fn();
		try {
			videoActions.show({ component: Video, props: { onQuit: descriptorQuit, onError: error } });
			await canvas.findByRole('dialog');
			const video = canvasElement.querySelector('video');
			if (!video) throw new Error('Expected video');
			await new Promise((resolve) => setTimeout(resolve, 0));
			fireEvent.error(video);
			await waitFor(() => expect(canvas.getByRole('alert')).toBeVisible());
			await expect(error).toHaveBeenCalledWith(null);
			await expect(canvas.queryByRole('button', { name: 'Close video' })).not.toBeInTheDocument();
			await userEvent.keyboard('{Escape}');
			await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
			await expect(args.onQuit).toHaveBeenCalledTimes(1);
			await expect(descriptorQuit).toHaveBeenCalledTimes(1);
		} finally {
			videoActions.clear();
		}
	},
};
export const ReducedMotion: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	args: {
		transition: { duration: 20, delay: 20 },
		variants: {
			initial: { opacity: 0, scale: 0 },
			animate: { opacity: 1, rotate: 90, transition: { delay: 20 } },
			exit: { opacity: 0, transition: { duration: 20, delay: 20 } },
		},
	},
	render: (args) => <VideoController {...args} />,
	beforeEach: () => {
		const original = window.matchMedia.bind(window);
		const mock = spyOn(window, 'matchMedia').mockImplementation((query) => {
			const result = original(query);
			if (query === '(prefers-reduced-motion: reduce)') Object.defineProperty(result, 'matches', { value: true });
			return result;
		});
		return () => mock.mockRestore();
	},
	play: async ({ canvasElement }) => {
		videoActions.clear();
		const canvas = within(canvasElement);
		try {
			videoActions.show({ component: Video });
			const dialog = await canvas.findByRole('dialog');
			await expect(getComputedStyle(dialog).opacity).toBe('1');
			await expect(getComputedStyle(dialog).transform).toBe('none');
			await userEvent.keyboard('{Escape}');
			await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument(), { timeout: 500 });
		} finally {
			videoActions.clear();
		}
	},
};
export const KeyboardMovement: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	args: { padding: 64, transition: { duration: 0 } },
	render: (args) => <VideoController {...args} />,
	play: async ({ canvasElement }) => {
		videoActions.clear();
		const canvas = within(canvasElement);
		try {
			videoActions.show({ component: Video, props: { width: 320, height: 180 } });
			const dialog = await canvas.findByRole('dialog');
			const video = dialog.querySelector('video');
			if (!video) throw new Error('Expected video element');
			fireEvent.canPlay(video);
			const initial = dialog.getBoundingClientRect().left;
			await userEvent.click(canvas.getByRole('button', { name: 'Move video' }));
			await userEvent.keyboard('{ArrowRight}');
			await waitFor(() => expect(dialog.getBoundingClientRect().left).toBeGreaterThan(initial));
			await userEvent.keyboard('{Escape}');
		} finally {
			videoActions.clear();
		}
	},
};

export const AutoplayProgressControl: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	args: { draggable: false, transition: { duration: 0 } },
	render: (args) => <VideoController {...args} />,
	play: async ({ canvasElement }) => {
		videoActions.clear();
		const canvas = within(canvasElement);
		try {
			videoActions.show({
				component: Video,
				props: { src: '/public/video/sample.mp4', playing: true, muted: true, loop: true },
			});
			const dialog = await canvas.findByRole('dialog', { name: 'Video player' });
			const video = dialog.querySelector('video');
			if (!video) throw new Error('Expected video element');
			await waitFor(() => expect(video.readyState).toBeGreaterThanOrEqual(3));
			await waitFor(() => expect(video.paused).toBe(false));
			await expect(canvas.getByRole('button', { name: 'Pause' })).toHaveAttribute('aria-pressed', 'true');
		} finally {
			videoActions.clear();
		}
	},
};

function HeldLoadingVideo(args: React.ComponentProps<typeof VideoController>) {
	const descriptor = useMemo(
		() => ({ component: Video, props: { width: '100%', height: 320, videoName: 'Loading preview' } }),
		[],
	);
	useEffect(() => {
		videoActions.show(descriptor);
		return () => {
			if (getVideo() === descriptor) videoActions.clear();
		};
	}, [descriptor]);
	return (
		<>
			<Button onClick={() => videoActions.show(descriptor)}>Show loading video</Button>
			<VideoController {...args} />
		</>
	);
}

// No media source: this story deliberately stays loading until dismissed.
export const Loading: StoryObj<typeof VideoController> = {
	args: { showProgressIndicator: true },
	render: (args) => <HeldLoadingVideo {...args} />,
};

export const LoadingHidesAllPlaybackControls: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	args: { showProgressIndicator: true, quit: 'none', transition: { duration: 0 } },
	render: (args) => <VideoController {...args} />,
	play: async ({ canvasElement }) => {
		videoActions.clear();
		const canvas = within(canvasElement);
		try {
			videoActions.show({
				component: Video,
				props: { customControls: { play: true, volume: true, fullscreen: true, progress: true } },
			});
			const dialog = await canvas.findByRole('dialog', { name: 'Video player' });
			await waitFor(() => expect(within(dialog).getByRole('status')).toBeVisible());
			await expect(within(dialog).queryByRole('button')).not.toBeInTheDocument();
			await expect(within(dialog).queryByRole('slider')).not.toBeInTheDocument();
			const video = dialog.querySelector('video');
			if (!video) throw new Error('Expected video element');
			fireEvent.loadedData(video);
			await expect(within(dialog).queryByRole('button')).not.toBeInTheDocument();
			fireEvent.canPlay(video);
			await expect(canvas.getAllByRole('button', { name: 'Play' })).toHaveLength(2);
			await expect(canvas.getByRole('button', { name: 'Move video' })).toBeInTheDocument();
			fireEvent.waiting(video);
			await expect(within(dialog).queryByRole('button')).not.toBeInTheDocument();
			await waitFor(() => expect(within(dialog).getByRole('status')).toBeVisible());
			await userEvent.keyboard('{Escape}');
			await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
		} finally {
			videoActions.clear();
		}
	},
};

export const LoadingHidesNativeControls: StoryObj<typeof VideoController> = {
	tags: ['tests'],
	args: { transition: { duration: 0 } },
	render: (args) => <VideoController {...args} />,
	play: async ({ canvasElement }) => {
		videoActions.clear();
		const canvas = within(canvasElement);
		try {
			videoActions.show({ component: Video, props: { controls: 'default' } });
			const dialog = await canvas.findByRole('dialog');
			const video = dialog.querySelector('video');
			if (!video) throw new Error('Expected video element');
			await expect(video.controls).toBe(false);
			fireEvent.canPlay(video);
			await expect(video.controls).toBe(true);
			fireEvent.waiting(video);
			await expect(video.controls).toBe(false);
			fireEvent.playing(video);
			await expect(video.controls).toBe(false);
			fireEvent.canPlay(video);
			await expect(video.controls).toBe(true);
		} finally {
			videoActions.clear();
		}
	},
};
