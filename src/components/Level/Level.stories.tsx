import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { useMicrophone } from '../../hooks';
import { Button } from '../Button';
import { FlexDiv } from '../FlexDiv';
import { Label } from '../Label';
import { createFakeAudioOnlyStream, runLevelActiveBarsPlay, runLevelStreamLifecyclePlay } from '../playHelpers';
import { Level } from './Level';
import type { LevelProps } from './_types';

const meta: Meta<typeof Level> = {
	title: 'Components/Level',
	component: Level,
	args: {
		audioStream: undefined,
		playing: true,
		width: 50,
		height: 4,
		gap: 0,
		backgroundColor: 'var(--core-surface-primary-tint)',
		colorActive: 'var(--feedback-positive)',
		minIntensity: 0,
		maxIntensity: 5,
		intensity: 3.5,
		peakIntensity: 0.5,
		risePerSeconds: 4,
		releasePerSeconds: 1.5,
		borderRadius: 100,
	},
};

export default meta;

export const Demo: StoryObj<typeof Level> = {
	render: (args) => {
		return <LevelDemo {...args} />;
	},
};

function LevelDemo(props: Readonly<LevelProps>) {
	const { micStream, isRequesting, error } = useMicrophone(false);

	return (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={24}>
			<Level {...props} audioStream={isRequesting ? null : micStream.current} />
			<Label>{error ? error.message : 'Say something!'}</Label>
		</FlexDiv>
	);
}

export const ActiveBarsFromMinIntensity: StoryObj<typeof Level> = {
	tags: ['tests'],
	args: {
		minIntensity: 2,
		className: 'level-active-bars-test',
	},
	render: (args) => {
		// meta.args' `releasePerSeconds: 1.5` survives Storybook's args merge
		// even if this story's own `args` set it to undefined (an explicit
		// undefined doesn't override a defined default there) - so the
		// releasePerSecond `??` fallback needs the override applied here,
		// after the spread, instead.
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Level {...args} releasePerSeconds={undefined} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement }) => {
		await runLevelActiveBarsPlay({ canvasElement });
	},
};

export const AudioStreamLifecycle: StoryObj<typeof Level> = {
	tags: ['tests'],
	render: (args) => {
		return <LevelStreamDemo {...args} />;
	},
	play: async ({ canvasElement }) => {
		await runLevelStreamLifecyclePlay({ canvasElement });
	},
};

function LevelStreamDemo(props: Readonly<LevelProps>) {
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [playing, setPlaying] = useState(true);

	return (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={24}>
			<Level {...props} audioStream={stream} playing={playing} />
			<FlexDiv gap={8}>
				<Button onClick={() => setStream(createFakeAudioOnlyStream())}>Start Stream</Button>
				<Button onClick={() => setStream(null)}>Stop Stream</Button>
				<Button onClick={() => setPlaying((current) => !current)}>Toggle Playing</Button>
			</FlexDiv>
		</FlexDiv>
	);
}
