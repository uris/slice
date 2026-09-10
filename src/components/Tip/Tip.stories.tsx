import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { IconButton } from 'src/components/IconButton';
import { useToolTip } from 'src/hooks';
import { useTip, useTipActions } from 'src/stores/tip';
import { Tip } from './Tip';

const meta: Meta<typeof Tip> = {
	title: 'Components/Tip',
	component: Tip,
	args: {
		tip: undefined,
		bgColor: undefined,
		border: undefined,
		borderColor: undefined,
		radius: undefined,
		color: undefined,
		coords: { x: 0, y: 0 },
		padding: undefined,
		size: 'm',
	},
};

export default meta;

export const Demo: StoryObj<typeof Tip> = {
	render: (args) => {
		const tip = useTip();
		const actions = useTipActions();
		const tipRef = useRef<HTMLDivElement>(null);
		const coords = useToolTip(tip, tipRef);

		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={16}>
				Hover me!
				<IconButton icon={'home'} tooltip={'Home Button'} onToolTip={actions.push} toggle={false} hover={true} />
				<Tip {...args} coords={coords} tip={tip} ref={tipRef} />
			</FlexDiv>
		);
	},
};
