import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { Grouper } from 'src/components/Grouper/Grouper';
import {
	runGrouperCustomClassPlay,
	runGrouperFilterBadgePlay,
	runGrouperNoBorderPlay,
	runGrouperPlay,
	runGrouperToggleDisabledPlay,
	runGrouperUnframedPlay,
	runGrouperWithoutHandlersPlay,
} from 'src/components/playHelpers';
import { fn } from 'storybook/test';

const meta: Meta<typeof Grouper> = {
	title: 'Components/Grouper',
	component: Grouper,
	args: {
		title: 'Group Title',
		toggle: true,
		open: true,
		hasIcon: true,
		iconName: 'chevron down',
		iconSize: 18,
		frameSize: 64,
		border: 1,
		count: 0,
		unframed: false,
		variant: 'group',
		hideNull: true,
		showFilterBadge: false,
		onChange: fn(),
		onClick: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Grouper> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<Grouper {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runGrouperPlay({ canvasElement, args });
	},
};

export const WithoutHandlers: StoryObj<typeof Grouper> = {
	tags: ['tests'],
	args: {
		...meta.args,
		onChange: undefined,
		onClick: undefined,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runGrouperWithoutHandlersPlay({ canvasElement });
	},
};

export const CustomClassName: StoryObj<typeof Grouper> = {
	tags: ['tests'],
	args: {
		...meta.args,
		className: 'story-grouper-class',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runGrouperCustomClassPlay({ canvasElement });
	},
};

export const ToggleDisabled: StoryObj<typeof Grouper> = {
	tags: ['tests'],
	args: {
		...meta.args,
		toggle: false,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runGrouperToggleDisabledPlay({ canvasElement, args });
	},
};

export const Unframed: StoryObj<typeof Grouper> = {
	tags: ['tests'],
	args: {
		...meta.args,
		unframed: true,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runGrouperUnframedPlay({ canvasElement });
	},
};

export const NoBorder: StoryObj<typeof Grouper> = {
	tags: ['tests'],
	args: {
		...meta.args,
		border: 0,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runGrouperNoBorderPlay({ canvasElement });
	},
};

export const WithFilterBadge: StoryObj<typeof Grouper> = {
	tags: ['tests'],
	args: {
		...meta.args,
		showFilterBadge: true,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runGrouperFilterBadgePlay({ canvasElement });
	},
};
