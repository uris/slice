import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { VideoController } from 'src/components/VideoController/VideoController';
import { expect, fireEvent, fn, waitFor, within } from 'storybook/test';
import { useVideoActions, videoActions } from '../../stores';
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
		return <VideoControllerDemo {...args} />;
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

function VideoControllerDemo(args: any) {
	const show = useVideoActions().show;

	// await the modal response value
	const handleShowVideo = () => {
		const videoToShow = {
			id: 'demo-video',
			component: Video,
			props: demoVideoProps,
		};
		show(videoToShow);
	};

	return (
		<FlexDiv absolute justify={'center'} align={'center'}>
			<Button iconRight={'arrow right'} onClick={handleShowVideo}>
				Show Video
			</Button>
			<VideoController {...args} quit={args.quit ?? 'inside'} />
		</FlexDiv>
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
		// The controller hides its contents until the first frame is available.
		fireEvent.loadedData(video);
		if (args.showProgressIndicator !== false) {
			await waitFor(() => expect(canvas.getByRole('img', { name: 'Loading spinner' })).toBeVisible());
		} else {
			await expect(canvas.queryByRole('img', { name: 'Loading spinner', hidden: true })).not.toBeInTheDocument();
		}
		fireEvent.canPlay(video);
		await waitFor(() =>
			expect(canvas.queryByRole('img', { name: 'Loading spinner', hidden: true })).not.toBeInTheDocument(),
		);
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
