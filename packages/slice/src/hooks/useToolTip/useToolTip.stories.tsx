import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { FlexBox } from '../../components/FlexBox';
import { IconButton } from '../../components/IconButton';
import { Tip } from '../../components/Tip/Tip';
import type { ToolTip } from '../../components/sharedTypes';
import { useToolTip } from './useToolTip';

function UseToolTipDemo() {
	const [tip, setTip] = useState<ToolTip | null>(null);
	const tipRef = useRef<HTMLDivElement>(null);
	const coords = useToolTip(tip, tipRef);

	return (
		<FlexBox absolute justify={'center'} align={'center'} padding={64}>
			<IconButton
				actionName={'Click Me'}
				icon={'basic.home'}
				tooltip={'Click Me'}
				onToolTip={(nextTip) => setTip(nextTip)}
			/>
			<Tip coords={coords} tip={tip} ref={tipRef} textSize={'m'} />
		</FlexBox>
	);
}

const meta: Meta<typeof UseToolTipDemo> = {
	title: 'Hooks/useToolTip',
	component: UseToolTipDemo,
	parameters: {
		a11y: { test: 'todo' },
		layout: 'padded',
	},
};

export default meta;

export const Demo: StoryObj<typeof UseToolTipDemo> = {};
