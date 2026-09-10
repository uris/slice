import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv';
import { SliceIcons } from 'src/components/Icon/_types';
import { AnimationType, type ButtonAnimation, IconButton } from 'src/components/IconButton';
import { runIconButtonPlay } from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const customAnimation: ButtonAnimation = {
	animation: [{ type: AnimationType.Rotate, value: { off: 0, on: 135 } }],
	transition: {
		on: { duration: 0.25, ease: 'linear' },
		off: { duration: 0.25, ease: 'easeInOut' },
	},
};

const categories = Object.values(SliceIcons);
const icons = categories.flatMap((category) => Object.values(category));
const meta: Meta<typeof IconButton> = {
	title: 'Components/IconButton',
	component: IconButton,
	argTypes: {
		icon: {
			control: { type: 'select' }, // Dropdown selection
			options: icons, // Enum values as options
		},
	},
	args: {
		frameSize: 36,
		iconSize: 20,
		icon: 'plus',
		borderRadius: 4,
		tooltip: undefined,
		color: undefined,
		colorOn: undefined,
		bgColor: undefined,
		bgColorHover: undefined,
		bgColorOn: undefined,
		transition: undefined,
		variants: undefined,
		initial: undefined,
		animate: undefined,
		exit: undefined,
		fillColor: undefined,
		label: undefined,
		hover: true,
		count: 0,
		toggle: true,
		toggleIcon: false,
		isToggled: false,
		disabled: false,
		showDot: false,
		border: false,
		presetAnimations: undefined,
		customAnimations: undefined,
		onClick: fn(),
		onToolTip: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof IconButton> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<IconButton {...args} />
			</FlexDiv>
		);
	},
};

export const Animated: StoryObj<typeof IconButton> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<IconButton {...args} customAnimations={customAnimation} />
			</FlexDiv>
		);
	},
};

export const Test: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<IconButton {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runIconButtonPlay({ canvasElement, args });
	},
};
