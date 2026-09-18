import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv';
import { SliceIcons } from 'src/components/Icon/_types';
import { AnimationType, type ButtonAnimation, IconButton } from 'src/components/IconButton';
import {
	runIconButtonBorderedPlay,
	runIconButtonCustomClassPlay,
	runIconButtonDisabledPlay,
	runIconButtonHoverLeaveWithTooltipPlay,
	runIconButtonHoverLeaveWithoutTooltipPlay,
	runIconButtonInvalidSizePlay,
	runIconButtonLabelAndCountPlay,
	runIconButtonNoHoverEffectPlay,
	runIconButtonNoRoundNoBorderRadiusPlay,
	runIconButtonNullColorsPlay,
	runIconButtonPlay,
	runIconButtonSmallSizePlay,
	runIconButtonUnmatchedSizePlay,
	runIconButtonWithoutHandlersPlay,
} from 'src/components/playHelpers';
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
		backgroundColor: undefined,
		backgroundColorHover: undefined,
		backgroundColorOn: undefined,
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

export const WithoutHandlers: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		onClick: undefined,
		onToolTip: undefined,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runIconButtonWithoutHandlersPlay({ canvasElement });
	},
};

export const CustomClassName: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		className: 'story-iconbutton-class',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runIconButtonCustomClassPlay({ canvasElement });
	},
};

export const Disabled: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		disabled: true,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runIconButtonDisabledPlay({ canvasElement, args });
	},
};

export const HoverLeaveWithTooltip: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		tooltip: 'Tip text',
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runIconButtonHoverLeaveWithTooltipPlay({ canvasElement, args });
	},
};

export const HoverLeaveWithoutTooltip: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runIconButtonHoverLeaveWithoutTooltipPlay({ canvasElement });
	},
};

export const NoHoverEffect: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		hover: false,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runIconButtonNoHoverEffectPlay({ canvasElement });
	},
};

export const NullColors: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		hover: false,
		backgroundColor: null as unknown as string,
		iconColor: null as unknown as string,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runIconButtonNullColorsPlay({ canvasElement });
	},
};

export const NoRoundNoBorderRadius: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		round: false,
		borderRadius: null as unknown as number,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runIconButtonNoRoundNoBorderRadiusPlay({ canvasElement });
	},
};

export const Bordered: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		border: true,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runIconButtonBorderedPlay({ canvasElement });
	},
};

export const InvalidButtonSize: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		buttonSize: '' as unknown as 's',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runIconButtonInvalidSizePlay({ canvasElement });
	},
};

export const SmallButtonSize: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		buttonSize: 's',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runIconButtonSmallSizePlay({ canvasElement });
	},
};

export const UnmatchedButtonSize: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		buttonSize: 'huge' as unknown as 'xl',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runIconButtonUnmatchedSizePlay({ canvasElement });
	},
};

export const LabelAndCount: StoryObj<typeof IconButton> = {
	tags: ['tests'],
	args: {
		...meta.args,
		label: 'Label text',
		count: 5,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runIconButtonLabelAndCountPlay({ canvasElement });
	},
};
