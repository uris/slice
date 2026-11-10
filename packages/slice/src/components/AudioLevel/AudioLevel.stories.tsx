import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { expect, spyOn, userEvent, waitFor, within } from 'storybook/test';
import { useMicrophone } from '../../hooks';
import { corners } from '../../theme/corners/corners';
import { Button } from '../Button';
import { Chip } from '../Chip';
import { FlexBox } from '../FlexBox';
import { createFakeAudioOnlyStream, runAudioLevelStreamLifecyclePlay } from '../playHelpers';
import { AudioLevel } from './AudioLevel';
import type { AudioLevelProps } from './_types';

const meta: Meta<typeof AudioLevel> = {
	title: 'Components/AudioLevel',
	component: AudioLevel,
	args: {
		audioStream: undefined,
		playing: true,
		width: 50,
		height: 4,
		gap: 0,
		backgroundColor: 'var(--core-surface-primary-tint)',
		backgroundColorActive: 'var(--feedback-positive)',
		minActiveBars: 0,
		barCount: 5,
		intensity: 3.5,
		peakIntensity: 0.5,
		risePerSeconds: 4,
		releasePerSeconds: 1.5,
		borderRadius: corners['corner-round'],
	},
};

export default meta;

export const Demo: StoryObj<typeof AudioLevel> = {
	render: (args) => {
		return <AudioLevelDemo {...args} />;
	},
};

function AudioLevelDemo(props: Readonly<AudioLevelProps>) {
	const { micStream, isRequesting, error } = useMicrophone(false);

	return (
		<FlexBox absolute justify={'center'} align={'center'} padding={64} gap={24}>
			<AudioLevel {...props} audioStream={isRequesting ? null : micStream.current} />
			<Chip>{error ? error.message : 'Say something!'}</Chip>
		</FlexBox>
	);
}

export const RestingBars: StoryObj<typeof AudioLevel> = {
	tags: ['tests'],
	render: () => <AudioLevel levelName="Microphone" barCount={8} minActiveBars={2} />,
	play: async ({ canvasElement }) => {
		const meter = within(canvasElement).getByRole('meter', { name: 'Microphone' });
		expect(meter.children).toHaveLength(8);
		expect(meter).toHaveAttribute('aria-valuenow', '2');
		expect(
			Array.from(meter.children).filter((bar) => (bar.firstElementChild as HTMLElement).style.opacity === '1'),
		).toHaveLength(2);
	},
};
export const Decorative: StoryObj<typeof AudioLevel> = {
	tags: ['tests'],
	render: () => <AudioLevel data-testid="level" levelName="  " />,
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByTestId('level')).toHaveAttribute('aria-hidden', 'true');
		expect(within(canvasElement).queryByRole('meter')).toBeNull();
	},
};
export const InvalidBarCounts: StoryObj<typeof AudioLevel> = {
	tags: ['tests'],
	render: () => (
		<>
			<AudioLevel levelName="Nonfinite" barCount={Number.NaN} minActiveBars={Number.POSITIVE_INFINITY} />
			<AudioLevel levelName="Negative" barCount={-8} minActiveBars={-2} />
			<AudioLevel levelName="Clamped" barCount={3.9} minActiveBars={10} />
			<AudioLevel levelName="Bounded" barCount={100000} />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const [name, count, active] of [
			['Nonfinite', 5, 0],
			['Negative', 1, 0],
			['Clamped', 3, 3],
			['Bounded', 1000, 0],
		] as const) {
			const meter = canvas.getByRole('meter', { name });
			expect(meter.children).toHaveLength(count);
			expect(meter).toHaveAttribute('aria-valuenow', String(active));
		}
	},
};
function SignalDemo() {
	const context = useRef<AudioContext | null>(null);
	const gain = useRef<GainNode | null>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [playing, setPlaying] = useState(true);
	useEffect(
		() => () => {
			void context.current?.close();
		},
		[],
	);
	const start = () => {
		const audio = new AudioContext();
		context.current = audio;
		const oscillator = audio.createOscillator();
		const volume = audio.createGain();
		gain.current = volume;
		const destination = audio.createMediaStreamDestination();
		oscillator.connect(volume);
		volume.connect(destination);
		oscillator.start();
		void audio.resume();
		setStream(destination.stream);
	};
	return (
		<>
			<AudioLevel
				audioStream={stream}
				playing={playing}
				levelName="Signal"
				barCount={8}
				risePerSeconds={100}
				releasePerSeconds={100}
			/>
			<Button onClick={start}>Start signal</Button>
			<Button
				onClick={() => {
					if (gain.current) gain.current.gain.value = 0;
				}}
			>
				Silence
			</Button>
			<Button onClick={() => setPlaying((value) => !value)}>Toggle analysis</Button>
		</>
	);
}
export const SignalAndSilence: StoryObj<typeof AudioLevel> = {
	tags: ['tests'],
	render: () => <SignalDemo />,
	play: async ({ canvasElement }) => {
		// Supply a deterministic waveform; headless audio devices need not produce sound.
		let sample = 255;
		const waveform = spyOn(AnalyserNode.prototype, 'getByteTimeDomainData').mockImplementation((array) =>
			array.fill(sample),
		);
		try {
			const canvas = within(canvasElement);
			const meter = canvas.getByRole('meter', { name: 'Signal' });
			await userEvent.click(canvas.getByRole('button', { name: 'Start signal' }));
			await waitFor(() => expect(meter).toHaveAttribute('aria-valuenow', '8'));
			await userEvent.click(canvas.getByRole('button', { name: 'Toggle analysis' }));
			await waitFor(() => expect(meter).toHaveAttribute('aria-valuenow', '0'));
			await userEvent.click(canvas.getByRole('button', { name: 'Toggle analysis' }));
			await waitFor(() => expect(meter).toHaveAttribute('aria-valuenow', '8'));
			sample = 128;
			await userEvent.click(canvas.getByRole('button', { name: 'Silence' }));
			await waitFor(() => expect(meter).toHaveAttribute('aria-valuenow', '0'));
		} finally {
			waveform.mockRestore();
		}
	},
};

export const AudioStreamLifecycle: StoryObj<typeof AudioLevel> = {
	tags: ['tests'],
	render: (args) => {
		return <AudioLevelStreamDemo {...args} />;
	},
	play: async ({ canvasElement }) => {
		await runAudioLevelStreamLifecyclePlay({ canvasElement });
	},
};

function AudioLevelStreamDemo(props: Readonly<AudioLevelProps>) {
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [playing, setPlaying] = useState(true);

	return (
		<FlexBox absolute justify={'center'} align={'center'} padding={64} gap={24}>
			<AudioLevel {...props} audioStream={stream} playing={playing} />
			<FlexBox gap={8}>
				<Button onClick={() => setStream(createFakeAudioOnlyStream())}>Start Stream</Button>
				<Button onClick={() => setStream(null)}>Stop Stream</Button>
				<Button onClick={() => setPlaying((current) => !current)}>Toggle Playing</Button>
			</FlexBox>
		</FlexBox>
	);
}
