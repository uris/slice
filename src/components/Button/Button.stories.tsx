import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from 'src/components/Button/Button';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { runButtonPlay } from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const meta: Meta<typeof Button> = {
	title: 'Components/Button',
	component: Button,
	argTypes: {
		children: {
			table: {
				disable: true,
			},
		},
	},
	args: {
		size: 'large',
		variant: 'solid',
		label: 'Button Label',
		labelSize: 'm',
		iconRight: 'arrow right',
		iconLeft: undefined,
		count: undefined,
		showDot: undefined,
		tooltip: undefined,
		round: false,
		state: 'normal',
		fill: false,
		iconSize: undefined,
		width: 'min-content',
		underline: false,
		borderRadius: undefined,
		iconColor: undefined,
		labelColor: undefined,
		transition: undefined,
		variants: undefined,
		initial: undefined,
		animate: undefined,
		exit: undefined,
		progress: false,
		working: false,
		duration: undefined,
		trigger: false,
		destructive: false,
		link: undefined,
		target: undefined,
		onClick: fn(),
		onToolTip: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Button> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Button {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runButtonPlay({ canvasElement, args });
	},
};

export const Small: StoryObj<typeof Button> = {
	args: {
		size: 'small',
		label: 'Small Button',
		iconRight: undefined,
	},
	render: Default.render,
	play: Default.play,
};
