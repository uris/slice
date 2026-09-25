import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { IconButton } from 'src/components/IconButton';
import { runTipHiddenAtOriginPlay, runTipShowsAndHidesPlay, runTipStyleVariantsPlay } from 'src/components/playHelpers';
import { ToolTipType } from 'src/components/sharedTypes';
import { useToolTip } from 'src/hooks';
import { useTip, useTipActions } from 'src/stores/tip';
import { corners } from '../../theme/corners/corners';
import { Tip } from './Tip';
import type { ToolTipProps as TipProps } from './_types';

const meta: Meta<typeof Tip> = {
	title: 'Components/Tip',
	component: Tip,
	args: {
		tip: undefined,
		border: true,
		borderColor: 'var(--core-outline-primary)',
		radius: undefined,
		backgroundColor: 'var(--core-surface-secondary)',
		textColor: 'var(--core-text-primary)',
		color: 'var(--core-text-primary)',
		coords: { x: 0, y: 0 },
		padding: undefined,
		textSize: 'm',
	},
};

export default meta;

function TipDemo(props: Readonly<TipProps>) {
	const tip = useTip();
	const actions = useTipActions();
	const tipRef = useRef<HTMLDivElement>(null);
	const coords = useToolTip(tip, tipRef);

	return (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={16}>
			Hover me!
			<IconButton icon={'home'} tooltip={'Home Button'} onToolTip={actions.push} toggle={false} hover={true} />
			<Tip {...props} coords={coords} tip={tip} ref={tipRef} />
		</FlexDiv>
	);
}

export const Demo: StoryObj<typeof Tip> = {
	render: (args) => <TipDemo {...args} />,
};

export const ShowsAndHidesOnCoords: StoryObj<typeof Tip> = {
	tags: ['tests'],
	args: {
		coords: { x: 50, y: 50 },
		showDelay: 20,
		hideDelay: 40,
		tip: { type: ToolTipType.general, payload: { label: 'Tip text' } },
	},
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Tip {...args} />
		</FlexDiv>
	),
	play: runTipShowsAndHidesPlay,
};

export const HiddenAtOrigin: StoryObj<typeof Tip> = {
	tags: ['tests'],
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<Tip {...args} />
		</FlexDiv>
	),
	play: runTipHiddenAtOriginPlay,
};

export const StyleVariants: StoryObj<typeof Tip> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv direction={'column'} gap={24}>
			<Tip className="no-border" coords={{ x: 0, y: 0 }} border={false} />
			<Tip className="custom-border-color" coords={{ x: 0, y: 0 }} borderColor="#ff0000" />
			<Tip className="text-color-priority" coords={{ x: 0, y: 0 }} textColor="#00ff00" color="#0000ff" />
			<Tip className="color-fallback" coords={{ x: 0, y: 0 }} color="#0000ff" />
			<Tip
				className="border-radius-priority"
				coords={{ x: 0, y: 0 }}
				borderRadius={corners['corner-l']}
				radius={corners['corner-xs']}
			/>
			<Tip className="radius-fallback" coords={{ x: 0, y: 0 }} radius={corners['corner-xs']} />
			<Tip className="custom-padding" coords={{ x: 0, y: 0 }} padding="10px 20px" />
			<Tip className="custom-bg" coords={{ x: 0, y: 0 }} backgroundColor="#123456" />
		</FlexDiv>
	),
	play: runTipStyleVariantsPlay,
};
