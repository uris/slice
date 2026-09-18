import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv';
import { TextField } from 'src/components/Textfield';
import {
	runTextFieldClearButtonRefocusPlay,
	runTextFieldDisabledGuardsPlay,
	runTextFieldPasswordTogglePlay,
	runTextFieldPlay,
	runTextFieldStyleVariantsPlay,
} from 'src/components/playHelpers';
import { expect, fn } from 'storybook/test';

const meta: Meta<typeof TextField> = {
	title: 'Components/Textfield',
	component: TextField,
	args: {
		name: 'user_email',
		placeholder: 'Enter your email',
		label: 'Email',
		value: '',
		size: { width: '50%', height: 'auto' },
		borderType: 'box',
		textSize: 'm',
		labelSize: 'm',
		inputType: 'text',
		onChange: fn(),
		onSubmit: fn(),
		onFocus: fn(),
		onBlur: fn(),
		onAction: fn(),
		onClear: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof TextField> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<TextField {...args} />
			</FlexDiv>
		);
	},
};

export const DefaultTextField: StoryObj<typeof TextField> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<TextField {...args} />
			</FlexDiv>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runTextFieldPlay({ canvasElement, args });
	},
};

export const PasswordWithAction: StoryObj<typeof TextField> = {
	tags: ['tests'],
	args: {
		...meta.args,
		placeholder: 'Enter password',
		inputType: 'password',
		actionButton: true,
		value: 'secret',
		focused: true,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runTextFieldPlay({ canvasElement, args });
		const translate = canvasElement.textContent ?? '';
		await expect(translate).toContain('Translate');
	},
};

export const DisabledFieldGuards: StoryObj<typeof TextField> = {
	tags: ['tests'],
	args: {
		...meta.args,
		disabled: true,
		value: 'existing text',
	},
	render: Default.render,
	play: runTextFieldDisabledGuardsPlay,
};

export const ClearButtonRefocus: StoryObj<typeof TextField> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv direction={'column'} gap={24}>
			<TextField className="refocus-keep" name="keep" value="hello" onChange={() => null} />
			<TextField className="refocus-blurs" name="blurs" value="hello" clearBlurs onChange={() => null} />
		</FlexDiv>
	),
	play: runTextFieldClearButtonRefocusPlay,
};

export const PasswordToggle: StoryObj<typeof TextField> = {
	tags: ['tests'],
	args: {
		inputType: 'password',
		value: 'secret',
	},
	render: (args) => (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
			<TextField {...args} />
		</FlexDiv>
	),
	play: runTextFieldPasswordTogglePlay,
};

export const StyleVariants: StoryObj<typeof TextField> = {
	tags: ['tests'],
	render: () => (
		<FlexDiv direction={'column'} gap={24}>
			<TextField className="underline-border" name="underline" borderType="underline" onChange={() => null} />
			<TextField className="none-border" name="none-border" borderType="none" onChange={() => null} />
			<TextField className="error-state" name="error" error onChange={() => null} />
			<TextField className="icon-left" name="icon-left" iconLeft={{ name: 'search', size: 18 }} onChange={() => null} />
			<TextField className="empty-label" name="empty-label" label="" onChange={() => null} />
			<TextField className="no-label" name="no-label" onChange={() => null} />
			<TextField
				className="auto-width"
				name="auto-width"
				size={{ width: 'auto', height: 'auto' }}
				onChange={() => null}
			/>
			<TextField
				className="unset-width"
				name="unset-width"
				size={{ width: 'unset', height: 'auto' }}
				onChange={() => null}
			/>
			<TextField className="padding-multi" name="padding-multi" padding="10px 20px" onChange={() => null} />
			<TextField className="padding-single" name="padding-single" padding="10px" onChange={() => null} />
			<TextField className="padding-invalid" name="padding-invalid" padding="abc" onChange={() => null} />
			<TextField className="padding-number" name="padding-number" padding={30} onChange={() => null} />
		</FlexDiv>
	),
	play: runTextFieldStyleVariantsPlay,
};
