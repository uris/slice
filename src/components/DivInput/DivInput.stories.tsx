import type { Meta, StoryObj } from '@storybook/react-vite';
import { DivInput } from 'src/components/DivInput';
import { FlexDiv } from 'src/components/FlexDiv';
import { runDivInputPlay } from 'src/components/playHelpers';
import { expect, fn } from 'storybook/test';

const meta: Meta<typeof DivInput> = {
	title: 'Components/DivInput',
	component: DivInput,
	argTypes: {
		textAlign: {
			control: { type: 'radio' }, // Dropdown selection
			options: ['left', 'center', 'right', undefined], // Enum values as options
		},
	},
	args: {
		value: '',
		placeholder: 'Placeholder',
		isEditable: true,
		wrap: false,
		focus: false,
		width: 'auto',
		textAlign: 'left',
		clamp: 3,
		padding: '16px',
		radius: 4,
		onChange: fn(),
		onSubmit: fn(),
		onFocus: fn(),
		onBlur: fn(),
		onDblClick: fn(),
		onClick: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof DivInput> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<DivInput {...args} />
			</FlexDiv>
		);
	},
};

export const DefaultDivInput: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<DivInput {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runDivInputPlay({ canvasElement, args });
	},
};

export const Focused: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		value: 'Focus me',
		focus: true,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runDivInputPlay({ canvasElement, args });
	},
};

export const ReadOnly: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		isEditable: false,
		value: 'Read only text',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		const textbox = canvasElement.querySelector('[role="textbox"]');
		await expect(textbox).toBeInTheDocument();
		await expect(textbox).toHaveAttribute('contenteditable', 'false');
	},
};
