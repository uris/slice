import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { fn } from 'storybook/test';
import { Preset } from '../FlexDiv';
import { Video } from './Video';

const customControls = {
	play: false,
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
		customControls,
		onPlayStateChange: fn(),
		onFullScreenChange: fn(),
		onVolumeChange: fn(),
		onLoad: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Video> = {
	render: (args) => {
		return (
			<FlexDiv
				absolute
				preset={Preset.FillScroll}
				direction={'column'}
				scrollY={true}
				scrollX={false}
				padding={64}
			>
				<FlexDiv height={'auto'} width={'fill'}>
					<Video {...args} />
				</FlexDiv>
			</FlexDiv>
		);
	},
};
