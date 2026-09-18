import type { Meta, StoryObj } from '@storybook/react-vite';
import { DivInput } from 'src/components/DivInput';
import { FlexDiv } from 'src/components/FlexDiv';
import {
	runDivInputAngleBracketBlockedPlay,
	runDivInputClearWithPlaceholderPlay,
	runDivInputCustomClassPlay,
	runDivInputEmptyPlaceholderPlay,
	runDivInputNullableBackgroundWhileFocusedPlay,
	runDivInputNullableStyleDefaultsPlay,
	runDivInputNullableValuePlay,
	runDivInputNumericWidthPlay,
	runDivInputPasteGuardsPlay,
	runDivInputPlay,
	runDivInputWithoutHandlersPlay,
} from 'src/components/playHelpers';
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

export const WithoutHandlers: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		onChange: undefined,
		onSubmit: undefined,
		onFocus: undefined,
		onBlur: undefined,
		onDblClick: undefined,
		onClick: undefined,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDivInputWithoutHandlersPlay({ canvasElement });
	},
};

export const CustomClassName: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		className: 'story-custom-class',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDivInputCustomClassPlay({ canvasElement });
	},
};

export const EmptyPlaceholder: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		placeholder: '',
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDivInputEmptyPlaceholderPlay({ canvasElement });
	},
};

export const ClearRestoresPlaceholder: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDivInputClearWithPlaceholderPlay({ canvasElement });
	},
};

export const AngleBracketBlocked: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDivInputAngleBracketBlockedPlay({ canvasElement });
	},
};

export const PasteGuards: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDivInputPasteGuardsPlay({ canvasElement });
	},
};

export const NullableStyleDefaults: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		padding: null as unknown as string,
		textAlign: null as unknown as 'left',
		clamp: null as unknown as number,
		backgroundColor: null as unknown as string,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDivInputNullableStyleDefaultsPlay({ canvasElement });
	},
};

export const NullableBackgroundWhileFocused: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		value: 'Focused text',
		focus: true,
		backgroundColor: null as unknown as string,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDivInputNullableBackgroundWhileFocusedPlay({ canvasElement });
	},
};

export const NumericWidth: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		width: 320,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDivInputNumericWidthPlay({ canvasElement });
	},
};

export const NullableValue: StoryObj<typeof DivInput> = {
	tags: ['tests'],
	args: {
		...meta.args,
		value: null as unknown as string,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDivInputNullableValuePlay({ canvasElement });
	},
};
