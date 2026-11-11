import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AudioBubble, type AudioBubbleProps } from 'src/components/AudioBubble';
import { FlexBox } from 'src/components/FlexBox';
import { expect, spyOn, userEvent, within } from 'storybook/test';
import { useMicrophone } from '../../hooks';
import { Button } from '../Button';
import { Chip } from '../Chip';
import { createFakeAudioOnlyStream, runAudioBubbleDemoPlay, runAudioBubbleStreamLifecyclePlay } from '../playHelpers';

const meta: Meta<typeof AudioBubble> = {
	title: 'Components/AudioBubble',
	component: AudioBubble,
	args: {
		audioStream: undefined,
		playing: true,
		size: 64,
		backgroundColor: 'var(--core-text-primary)',
		glow: true,
		glowColor: 'color-mix(in srgb, var(--core-text-primary) 10%, transparent)',
		glowSize: 48,
		minScale: 1,
		maxScale: 3,
		intensity: 2.2,
		peakIntensity: 0.5,
		risePerSeconds: 4,
		releasePerSeconds: 1.5,
	},
};

export default meta;

export const DecorativeByDefault: StoryObj<typeof AudioBubble> = {
	tags: ['tests'],
	render: () => <AudioBubble data-testid="decorative-bubble" />,
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByTestId('decorative-bubble')).toHaveAttribute('aria-hidden', 'true');
	},
};

export const AccessibleOverride: StoryObj<typeof AudioBubble> = {
	tags: ['tests'],
	render: () => <AudioBubble aria-hidden={false} role="img" aria-label="Voice activity" />,
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByRole('img', { name: 'Voice activity' })).toHaveAttribute('aria-hidden', 'false');
	},
};

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
		<FlexBox absolute justify={'center'} align={'center'} padding={64} gap={24}>
			<AudioBubble {...props} audioStream={isRequesting ? null : micStream.current} />
			<Chip>{error ? error.message : 'Say something!'}</Chip>
		</FlexBox>
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
		<FlexBox absolute justify={'center'} align={'center'} padding={64} gap={24}>
			<AudioBubble {...props} audioStream={stream} playing={playing} />
			<FlexBox direction={'row'} wrap gap={8}>
				<Button label={'Start Stream'} onClick={() => setStream(createFakeAudioOnlyStream())} />
				<Button label={'Stop Stream'} onClick={() => setStream(undefined)} />
				<Button label={'Toggle Playing'} onClick={() => setPlaying((previous) => !previous)} />
			</FlexBox>
		</FlexBox>
	);
}

export const StreamLifecycle: StoryObj<typeof AudioBubble> = {
	tags: ['tests'],
	render: (args) => <AudioBubbleStreamDemo {...args} />,
	play: async ({ canvasElement }) => {
		await runAudioBubbleStreamLifecyclePlay({ canvasElement });
	},
};

export const ReducedMotion: StoryObj<typeof AudioBubble> = {
	tags: ['tests'],
	beforeEach: () => {
		const original = window.matchMedia.bind(window);
		const media = spyOn(window, 'matchMedia').mockImplementation((text) => {
			if (text !== '(prefers-reduced-motion: reduce)') return original(text);
			return {
				matches: true,
				media: text,
				onchange: null,
				addEventListener: () => {},
				removeEventListener: () => {},
				addListener: () => {},
				removeListener: () => {},
				dispatchEvent: () => true,
			};
		});
		return () => media.mockRestore();
	},
	render: (args) => <AudioBubbleStreamDemo {...args} data-testid="reduced-bubble" minScale={1.5} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Start Stream' }));
		const bubble = canvas.getByTestId('reduced-bubble').firstElementChild as HTMLElement;
		expect(bubble.style.transform).toBe('scale(1.5)');
		expect(getComputedStyle(bubble).transitionDuration).toBe('0s');
	},
};
