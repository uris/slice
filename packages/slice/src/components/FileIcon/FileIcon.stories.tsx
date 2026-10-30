import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileIcon, FileIconNames } from 'src/components/FileIcon';
import { FlexDiv } from 'src/components/FlexDiv';
import { fn } from 'storybook/test';
import {
	runFileIconDisabledPlay,
	runFileIconInteractionsPlay,
	runFileIconNonPointerPlay,
	runFileIconUnknownNamePlay,
} from '../playHelpers';

const icons = Object.values(FileIconNames);
const meta: Meta<typeof FileIcon> = {
	title: 'Components/FileIcon',
	component: FileIcon,
	argTypes: {
		name: {
			control: { type: 'select' }, // Dropdown selection
			options: icons, // Enum values as options
		},
	},
	args: {
		name: 'pdf',
		size: 24,
		pointer: true,
		disabled: false,
		onClick: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof FileIcon> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<FileIcon {...args} />
			</FlexDiv>
		);
	},
};

export const KeyboardAndClickInteractions: StoryObj<typeof FileIcon> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<FileIcon {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runFileIconInteractionsPlay({ canvasElement, args });
	},
};

export const DisabledPointer: StoryObj<typeof FileIcon> = {
	tags: ['tests'],
	args: { disabled: true },
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<FileIcon {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runFileIconDisabledPlay({ canvasElement, args });
	},
};

export const NonPointer: StoryObj<typeof FileIcon> = {
	tags: ['tests'],
	args: { pointer: false },
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<FileIcon {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runFileIconNonPointerPlay({ canvasElement, args });
	},
};

export const UnknownName: StoryObj<typeof FileIcon> = {
	tags: ['tests'],
	args: { name: 'not-a-real-icon' },
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<FileIcon {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement }) => {
		await runFileIconUnknownNamePlay({ canvasElement });
	},
};
