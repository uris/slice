import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AudioBubble, type AudioBubbleProps } from 'src/components/AudioBubble';
import { FlexDiv } from 'src/components/FlexDiv';
import { useMicrophone } from '../../hooks';
import { Button } from '../Button';
import { Label } from '../Label';
import { createFakeAudioOnlyStream, runAudioBubbleDemoPlay, runAudioBubbleStreamLifecyclePlay } from '../playHelpers';

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
	play: async ({ canvasElement }) => {
		await runAudioBubbleDemoPlay({ canvasElement });
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

export const GlowDisabled: StoryObj<typeof AudioBubble> = {
	tags: ['tests'],
	args: { glow: false },
	render: (args) => <AudioBubbleDemo {...args} />,
	play: async ({ canvasElement }) => {
		await runAudioBubbleDemoPlay({ canvasElement });
	},
};

function AudioBubbleStreamDemo(props: Readonly<AudioBubbleProps>) {
	const [stream, setStream] = useState<MediaStream | undefined>(undefined);
	const [playing, setPlaying] = useState<boolean>(true);

	return (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={24}>
			<AudioBubble {...props} audioStream={stream} playing={playing} />
			<FlexDiv direction={'row'} wrap gap={8}>
				<Button label={'Start Stream'} onClick={() => setStream(createFakeAudioOnlyStream())} />
				<Button label={'Stop Stream'} onClick={() => setStream(undefined)} />
				<Button label={'Toggle Playing'} onClick={() => setPlaying((previous) => !previous)} />
			</FlexDiv>
		</FlexDiv>
	);
}

export const StreamLifecycle: StoryObj<typeof AudioBubble> = {
	tags: ['tests'],
	render: (args) => <AudioBubbleStreamDemo {...args} />,
	play: async ({ canvasElement }) => {
		await runAudioBubbleStreamLifecyclePlay({ canvasElement });
	},
};
