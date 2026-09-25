import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { useTip, useTipActions } from 'src/stores/tip';
import { IconButton } from '../../components/IconButton';
import { Tip } from '../../components/Tip';
import type { ToolTipProps as TipProps } from '../../components/Tip/_types';
import { useToolTip } from '../../hooks';

const meta: Meta<typeof Tip> = {
	title: 'Stores/Tip Store',
	component: Tip,
	parameters: {
		a11y: { test: 'todo' },
	},
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
