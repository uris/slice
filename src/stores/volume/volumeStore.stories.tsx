import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useMemo } from 'react';
import { Button } from '../../components/Button';
import { FlexDiv } from '../../components/FlexDiv';
import { Slider } from '../../components/Slider';
import { useMuted, useStoredVolume, useVolume, useVolumeActions } from './volumeStore';
function VolumeStoreDemo() {
	const volume = useVolume();
	const storedVolume = useStoredVolume();
	const muted = useMuted();
	const actions = useVolumeActions();
	const audioElement = useMemo(() => {
		if (typeof Audio === 'undefined') return null;
		return new Audio();
	}, []);
	const feedbackElement = useMemo(() => {
		if (typeof Audio === 'undefined') return null;
		return new Audio('../public/audio/beep.mp3');
	}, []);

	useEffect(() => {
		if (!audioElement || !feedbackElement) return;
		actions.attachMedia(audioElement);
		actions.attachFeedbackElement(feedbackElement);
		return () => {
			actions.detachMedia(audioElement);
			actions.detachFeedbackElement(feedbackElement);
		};
	}, [actions, audioElement, feedbackElement]);

	return (
		<FlexDiv absolute width={'fill'} height={'fill'} align={'center'} justify={'center'} padding={24}>
			<FlexDiv
				width={420}
				height={'auto'}
				direction={'column'}
				gap={12}
				padding={16}
				border={'1px solid var(--core-outline-primary)'}
				background={'var(--core-surface-secondary)'}
			>
				<span>Volume: {volume.toFixed(2)}</span>
				<span>Stored Volume: {storedVolume.toFixed(2)}</span>
				<span>Muted: {muted ? 'true' : 'false'}</span>
				<Slider
					value={muted ? storedVolume : volume}
					scaleMin={0}
					scaleMax={1}
					step={0.05}
					width={'100%'}
					height={4}
					trackHeadSize={16}
					onChange={(value) => actions.setVolume(value)}
					onDragChange={(value, _percent) => {
						actions.playFeedback(value);
					}}
				/>
				<FlexDiv gap={8}>
					<Button label={muted ? 'Unmute' : 'Mute'} onClick={() => (muted ? actions.unmute() : actions.mute())} />
					<Button label={'Set 25%'} onClick={() => actions.setVolume(0.25, { playFeedback: true })} />
					<Button label={'Set 75%'} onClick={() => actions.setVolume(0.75, { playFeedback: true })} />
				</FlexDiv>
				<span>Attached Media Elements: {audioElement ? '1' : '0'}</span>
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof VolumeStoreDemo> = {
	title: 'Stores/Volume Store',
	component: VolumeStoreDemo,
	parameters: {
		layout: 'padded',
	},
};

export default meta;

export const Demo: StoryObj<typeof VolumeStoreDemo> = {};
