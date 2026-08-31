import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { VideoController } from 'src/components/VideoController/VideoController';
import { useVideoActions } from '../../stores';
import { Button } from '../Button';
import { Video, type VideoProps } from '../Video';
// import {fn} from "storybook/test";

const demoVideoProps: VideoProps = {
	src: 'https://player.vimeo.com/progressive_redirect/playback/481754051/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=ee67f15d70122bb1a1e900e51e60e3c5384450a3c256412e15fe188ef841a6d2',
	height: 'auto',
	width: '100%',
	playing: true,
	objectFit: 'cover',
	controls: 'simple',
	muted: false,
	borderRadius: 16,
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
	args: {},
};

export default meta;

export const Default: StoryObj<typeof VideoController> = {
	render: () => {
		return <VideoControllerDemo />;
	},
};

function VideoControllerDemo() {
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
			<VideoController quit={'inside'} />
		</FlexDiv>
	);
}
