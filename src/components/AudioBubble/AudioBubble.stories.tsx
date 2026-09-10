import type { Meta, StoryObj } from '@storybook/react-vite';
import { AudioBubble, type AudioBubbleProps } from 'src/components/AudioBubble';
import { FlexDiv } from 'src/components/FlexDiv';
import { useMicrophone } from '../../hooks';
import { Label } from '../Label';

const meta: Meta<typeof AudioBubble> = {
	title: 'Components/AudioBubble',
	component: AudioBubble,
	args: {
		audioStream: undefined,
		playing: true,
		size: 64,
		backgroundColor: undefined,
		glow: true,
		glowColor: undefined,
		glowSize: undefined,
		minScale: 1,
		maxScale: 3,
		intensity: 2.2,
		peakIntensity: 0.5,
		risePerSeconds: 4,
		ReleasePerSeconds: 1.5,
	},
};

export default meta;

export const Demo: StoryObj<typeof AudioBubble> = {
	render: (args) => {
		return <AudioBubbleDemo {...args} />;
	},
};

function AudioBubbleDemo(props: Readonly<AudioBubbleProps>) {
	const { micStream, isRequesting, error } = useMicrophone(false);

	return (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={24}>
			<AudioBubble {...props} audioStream={isRequesting ? null : micStream.current} />
			<Label>{error ? error.message : 'Say something!'}</Label>
		</FlexDiv>
	);
}
