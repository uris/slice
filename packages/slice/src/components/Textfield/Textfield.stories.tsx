import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { installReducedMotionPreference } from '../playHelpers';
import { TextField } from './TextField';

const meta = {
	title: 'Components/Textfield',
	component: TextField,
	args: {
		name: 'email',
		label: 'Email',
		defaultValue: '',
		placeholder: 'Enter your email',
		width: 340,
		height: 'auto',
		borderStyle: 'box',
		variant: 'simple',
		behavior: 'persistent',
		stackedGap: 2,
		stackedLabelTextSize: 'body-xs-regular',
		labelBackgroundColor: 'core-surface-primary',
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
	argTypes: {
		borderStyle: { control: 'select', options: ['box', 'underline', 'none'] },
		textSize: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
	},
} satisfies Meta<typeof TextField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox', { name: 'Email' });
		await userEvent.type(input, 'hello');
		expect(input).toHaveValue('hello');
		expect(args.onChange).toHaveBeenLastCalledWith('hello');
		await userEvent.keyboard('{Enter}');
		expect(args.onSubmit).toHaveBeenCalledOnce();
		expect(args.onSubmit).toHaveBeenLastCalledWith('hello');
		expect(args.onBlur).toHaveBeenCalledOnce();
		expect(args.onBlur).toHaveBeenLastCalledWith('hello');
		expect(input).not.toHaveFocus();
	},
};
export const Password: Story = {
	args: { label: 'Password', inputType: 'password', defaultValue: 'secret' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText('Password', { selector: 'input' });
		await userEvent.click(canvas.getByRole('button', { name: 'Show password' }));
		expect(input).toHaveAttribute('type', 'text');
		await userEvent.click(canvas.getByRole('button', { name: 'Hide password' }));
		expect(input).toHaveAttribute('type', 'password');
	},
};
export const Action: Story = {
	args: { actionButton: true, actionLabel: 'Search', defaultValue: 'Planning' },
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Search' }));
		expect(args.onAction).toHaveBeenCalledOnce();
	},
};
export const Controlled: Story = {
	tags: ['tests'],
	args: { value: 'Fixed' },
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox');
		await userEvent.type(input, 'x');
		expect(args.onChange).toHaveBeenLastCalledWith('Fixedx');
		expect(input).toHaveValue('Fixed');
	},
};
function ControlledField() {
	const [value, setValue] = useState('');
	return <TextField label="Search" value={value} onChange={setValue} />;
}
export const ControlledUpdates: Story = {
	tags: ['tests'],
	render: () => <ControlledField />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox', { name: 'Search' });
		await userEvent.type(input, 'planning');
		expect(input).toHaveValue('planning');
		await userEvent.click(canvas.getByRole('button', { name: 'Clear text' }));
		expect(input).toHaveValue('');
		expect(input).toHaveFocus();
	},
};
export const Disabled: Story = {
	tags: ['tests'],
	args: { disabled: true, inputType: 'password', defaultValue: 'Secret', actionButton: true },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByLabelText('Email', { selector: 'input' })).toBeDisabled();
		for (const button of canvas.getAllByRole('button')) {
			expect(button).toBeDisabled();
			await userEvent.click(button);
		}
		expect(args.onAction).not.toHaveBeenCalled();
		expect(args.onChange).not.toHaveBeenCalled();
		expect(args.onClear).not.toHaveBeenCalled();
	},
};
export const ReadOnly: Story = {
	tags: ['tests'],
	args: { readOnly: true, defaultValue: 'Copy me', actionButton: true },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.click(input);
		expect(input).not.toBeDisabled();
		expect(input).toHaveAttribute('readonly');
		await userEvent.type(input, 'x');
		expect(input).toHaveValue('Copy me');
		for (const button of canvas.getAllByRole('button')) expect(button).toBeDisabled();
		expect(args.onChange).not.toHaveBeenCalled();
		await userEvent.keyboard('{Enter}');
		expect(args.onSubmit).not.toHaveBeenCalled();
	},
};
export const ClearKeepsFocus: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Hello' },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.click(input);
		await userEvent.click(canvas.getByRole('button', { name: 'Clear text' }));
		expect(input).toHaveValue('');
		expect(input).toHaveFocus();
		expect(args.onChange).toHaveBeenCalledOnce();
		expect(args.onChange).toHaveBeenLastCalledWith('');
		expect(args.onClear).toHaveBeenCalledOnce();
		expect(canvas.queryByRole('button', { name: 'Clear text' })).not.toBeInTheDocument();
	},
};
export const ClearBlurs: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Hello', clearBlurs: true },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.click(input);
		await userEvent.click(canvas.getByRole('button', { name: 'Clear text' }));
		expect(input).toHaveValue('');
		expect(input).not.toHaveFocus();
	},
};
export const CancelledSubmit: Story = {
	tags: ['tests'],
	args: {
		defaultValue: 'Hello',
		onKeyDown: fn((event) => {
			if (event.key === 'Enter') event.preventDefault();
		}),
	},
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox');
		await userEvent.click(input);
		await userEvent.keyboard('{Enter}');
		expect(args.onSubmit).not.toHaveBeenCalled();
		expect(input).toHaveFocus();
	},
};
export const Composition: Story = {
	tags: ['tests'],
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox');
		input.focus();
		fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
		fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
		expect(args.onSubmit).not.toHaveBeenCalled();
		expect(input).toHaveFocus();
	},
};
export const NativeAttributes: Story = {
	tags: ['tests'],
	args: {
		name: 'email',
		inputName: 'Contact email',
		inputId: 'contact-email',
		inputAttributes: { autoComplete: 'email', required: true, minLength: 3, pattern: '.+@.+' },
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox', { name: 'Contact email' });
		expect(input).toHaveAttribute('id', 'contact-email');
		expect(input).toHaveAttribute('name', 'email');
		expect(input).toHaveAttribute('autocomplete', 'email');
		expect(input).toBeRequired();
		expect(input).toHaveAttribute('minlength', '3');
		await userEvent.click(canvas.getByText('Email'));
		expect(input).toHaveFocus();
	},
};
export const BrowserAutocomplete: Story = {
	tags: ['tests'],
	render: (args) => (
		<form autoComplete="on">
			<TextField {...args} />
		</form>
	),
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		expect(input).not.toHaveAttribute('autocomplete');
		expect(input.closest('form')).toHaveAttribute('autocomplete', 'on');
	},
};
export const AutocompleteDisabled: Story = {
	tags: ['tests'],
	args: { inputAttributes: { autoComplete: 'off' } },
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByRole('textbox')).toHaveAttribute('autocomplete', 'off');
	},
};
export const FallbackName: Story = {
	tags: ['tests'],
	args: { label: ' ', name: undefined, inputName: ' ' },
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByRole('textbox', { name: 'Text input' })).toBeInTheDocument();
	},
};
export const NameWithoutLabel: Story = {
	tags: ['tests'],
	args: { label: undefined, name: 'Search projects' },
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByRole('textbox', { name: 'Search projects' })).toBeInTheDocument();
	},
};
export const NativeForm: Story = {
	tags: ['tests'],
	render: (args) => (
		<form>
			<TextField {...args} defaultValue="Initial" />
			<button type="reset">Reset</button>
		</form>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.clear(input);
		await userEvent.type(input, 'Updated');
		const form = canvasElement.querySelector('form');
		if (!form) throw new Error('Missing form');
		expect(new FormData(form).get('email')).toBe('Updated');
		const count = args.onChange?.mock.calls.length ?? 0;
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		await waitFor(() => expect(input).toHaveValue('Initial'));
		expect(args.onChange).toHaveBeenCalledTimes(count);
	},
};
export const CustomColors: Story = {
	tags: ['tests'],
	args: {
		defaultValue: 'Text',
		textColorBlurred: '#123456',
		textColorFocused: '#654321',
		textColorError: '#abcdef',
		textColorDisabled: '#fedcba',
	},
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		expect(getComputedStyle(input).color).toBe('rgb(18, 52, 86)');
		await userEvent.click(input);
		await waitFor(() => expect(getComputedStyle(input).color).toBe('rgb(101, 67, 33)'));
	},
};
export const ErrorColor: Story = {
	tags: ['tests'],
	args: {
		error: true,
		defaultValue: 'Text',
		errorMessage: 'Check this value.',
		textColorError: '#abcdef',
		textColorBlurred: '#123456',
		textColorFocused: '#654321',
	},
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(getComputedStyle(input).color).toBe('rgb(18, 52, 86)');
		expect(getComputedStyle(within(canvasElement).getByText('Check this value.')).color).toBe('rgb(171, 205, 239)');
		await userEvent.click(input);
		await userEvent.type(input, ' edited');
		await waitFor(() => expect(getComputedStyle(input).color).toBe('rgb(101, 67, 33)'));
		await userEvent.tab();
		await waitFor(() => expect(getComputedStyle(input).color).toBe('rgb(18, 52, 86)'));
	},
};
export const DisabledColor: Story = {
	tags: ['tests'],
	args: { disabled: true, defaultValue: 'Text', textColorDisabled: '#123456' },
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		expect(getComputedStyle(input).color).toBe('rgb(18, 52, 86)');
	},
};
export const HiddenPasswordToggle: Story = {
	tags: ['tests'],
	args: { inputType: 'password', showPasswordToggle: false },
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).queryByRole('button', { name: 'Show password' })).not.toBeInTheDocument();
	},
};
export const Underline: Story = {
	tags: ['tests'],
	args: { borderStyle: 'underline', clearButton: null, padding: 0, inline: true },
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		const wrapper = input.closest('[data-variant]');
		if (!wrapper) throw new Error('Missing wrapper');
		expect(getComputedStyle(wrapper).padding).toBe('0px');
		expect(getComputedStyle(wrapper).backgroundColor).toBe('rgba(0, 0, 0, 0)');
		expect(getComputedStyle(wrapper).boxShadow).not.toBe('none');
	},
};
export const NoBorder: Story = {
	tags: ['tests'],
	args: { borderStyle: 'none' },
	play: async ({ canvasElement }) => {
		const wrapper = within(canvasElement).getByRole('textbox').closest('[data-variant]');
		if (!wrapper) throw new Error('Missing wrapper');
		expect(getComputedStyle(wrapper).boxShadow).toBe('none');
	},
};
function UpdatedField() {
	const [updated, setUpdated] = useState(false);
	const [message, setMessage] = useState('');
	return (
		<>
			<button type="button" onClick={() => setUpdated(true)}>
				Update props
			</button>
			<TextField
				inputName={updated ? 'Updated name' : 'Old name'}
				width={updated ? 280 : 200}
				maxLength={updated ? 3 : 10}
				onChange={(text) => setMessage((updated ? 'new:' : 'old:') + text)}
			/>
			<output>{message}</output>
		</>
	);
}
export const UpdatedPropsAndHandlers: Story = {
	tags: ['tests'],
	render: () => <UpdatedField />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Update props' }));
		const input = canvas.getByRole('textbox', { name: 'Updated name' });
		await userEvent.type(input, 'abcdef');
		expect(input).toHaveValue('abc');
		expect(canvas.getByText('new:abc')).toBeInTheDocument();
		expect(input.closest('[data-variant]')?.getBoundingClientRect().width).toBe(280);
	},
};
export const ServerRendering: Story = {
	tags: ['tests'],
	play: () => {
		const html = renderToString(<TextField label="Server label" defaultValue="Server value" />);
		const doc = new DOMParser().parseFromString(html, 'text/html');
		const input = doc.querySelector('input');
		expect(input?.value).toBe('Server value');
		expect(doc.querySelector('label')?.htmlFor).toBe(input?.id);
	},
};
let preference: ReturnType<typeof installReducedMotionPreference>;
function MotionField() {
	const [shown, setShown] = useState(true);
	return (
		<>
			<button type="button" onClick={() => setShown((previous) => !previous)}>
				Toggle action
			</button>
			<TextField
				label="Search"
				defaultValue="Text"
				actionButton={shown}
				transition={{ duration: 3, delay: 1, repeat: Number.POSITIVE_INFINITY }}
			/>
		</>
	);
}
export const LiveReducedMotion: Story = {
	tags: ['tests'],
	render: () => <MotionField />,
	beforeEach: () => {
		preference = installReducedMotionPreference(false);
		return () => preference.restore();
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const action = canvas.getByRole('button', { name: 'Action' });
		action.focus();
		preference.set(true);
		await waitFor(() => expect(getComputedStyle(action.parentElement as HTMLElement).opacity).toBe('1'));
		expect(action).toHaveFocus();
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle action' }));
		await waitFor(() => expect(canvas.queryByRole('button', { name: 'Action' })).not.toBeInTheDocument());
	},
};

export const NativeFormSubmit: Story = {
	tags: ['tests'],
	args: { onSubmit: undefined },
	render: (args) => (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				args.onAction?.();
			}}
		>
			<TextField {...args} />
			<button type="submit">Submit form</button>
		</form>
	),
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox');
		await userEvent.type(input, 'Text');
		await userEvent.keyboard('{Enter}');
		expect(args.onAction).toHaveBeenCalledOnce();
	},
};
export const ControlledClearRequest: Story = {
	tags: ['tests'],
	args: { value: 'Fixed' },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.click(input);
		await userEvent.click(canvas.getByRole('button', { name: 'Clear text' }));
		expect(args.onChange).toHaveBeenLastCalledWith('');
		expect(args.onClear).toHaveBeenCalledOnce();
		expect(input).toHaveValue('Fixed');
	},
};
export const CancelledReset: Story = {
	tags: ['tests'],
	render: (args) => (
		<form onReset={(event) => event.preventDefault()}>
			<TextField {...args} defaultValue="Initial" />
			<button type="reset">Reset</button>
		</form>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.clear(input);
		await userEvent.type(input, 'Updated');
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		expect(input).toHaveValue('Updated');
	},
};
export const Paste: Story = {
	tags: ['tests'],
	args: { onPaste: fn() },
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox');
		await userEvent.click(input);
		await userEvent.paste('Pasted text');
		expect(args.onPaste).toHaveBeenCalledOnce();
		expect(input).toHaveValue('Pasted text');
	},
};
export const FocusRequests: Story = {
	tags: ['tests'],
	render: () => {
		const [focused, setFocused] = useState<boolean>();
		return (
			<>
				<button type="button" onClick={() => setFocused(true)}>
					Focus field
				</button>
				<button type="button" onClick={() => setFocused(false)}>
					Blur field
				</button>
				<TextField label="Request focus" focused={focused} />
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.click(canvas.getByRole('button', { name: 'Focus field' }));
		expect(input).toHaveFocus();
		await userEvent.click(canvas.getByRole('button', { name: 'Blur field' }));
		expect(input).not.toHaveFocus();
	},
};
export const ManagedAria: Story = {
	tags: ['tests'],
	render: (args) => {
		const raw = { 'aria-label': 'Override', 'aria-hidden': true };
		return <TextField {...args} {...raw} inputAttributes={{ ...raw, required: true }} />;
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox', { name: 'Email' });
		expect(input).not.toHaveAttribute('aria-label');
		expect(input).not.toHaveAttribute('aria-hidden');
		expect(input.closest('[data-variant]')).not.toHaveAttribute('aria-hidden');
		expect(input).toBeRequired();
	},
};

function ActionVisibility() {
	const [shown, setShown] = useState(true);
	return (
		<>
			<button type="button" onClick={() => setShown((previous) => !previous)}>
				Toggle action
			</button>
			<TextField
				label="Search"
				defaultValue="Planning"
				actionButton={shown}
				actionLabel="Find"
				transition={{ duration: 0.05 }}
			/>
		</>
	);
}
export const ActionPresence: Story = {
	tags: ['tests'],
	render: () => <ActionVisibility />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('button', { name: 'Find' })).toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle action' }));
		await waitFor(() => expect(canvas.queryByRole('button', { name: 'Find' })).not.toBeInTheDocument());
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle action' }));
		const action = canvas.getByRole('button', { name: 'Find' });
		await waitFor(() => expect(getComputedStyle(action.parentElement as HTMLElement).opacity).toBe('1'));
	},
};
export const ExternalForm: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			<TextField {...args} defaultValue="Initial" inputAttributes={{ form: 'external-text-field-form' }} />
			<form id="external-text-field-form">
				<button type="reset">Reset external form</button>
			</form>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.clear(input);
		await userEvent.type(input, 'Updated');
		const form = canvasElement.querySelector('form');
		if (!form) throw new Error('Missing external form');
		expect(new FormData(form).get('email')).toBe('Updated');
		await userEvent.click(canvas.getByRole('button', { name: 'Reset external form' }));
		await waitFor(() => expect(input).toHaveValue('Initial'));
	},
};
export const NoCallbackDefaults: Story = {
	tags: ['tests'],
	render: () => <TextField inputName="Defaults" actionButton defaultValue="Text" />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.click(input);
		await userEvent.click(canvas.getByRole('button', { name: 'Action' }));
		await userEvent.click(input);
		await userEvent.click(canvas.getByRole('button', { name: 'Clear text' }));
		expect(input).toHaveValue('');
		await userEvent.type(input, 'Edited');
		await userEvent.tab();
		expect(input).toHaveValue('Edited');
	},
};

export const Stacked: Story = {
	args: { variant: 'stacked', placeholder: 'Enter your email' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox', { name: 'Email' });
		const label = canvas.getByText('Email', { selector: 'label' });
		expect(input).toHaveAttribute('placeholder', 'Enter your email');
		expect(Math.abs(label.getBoundingClientRect().left - input.getBoundingClientRect().left)).toBeLessThan(1);
		expect(input.getBoundingClientRect().top - label.getBoundingClientRect().bottom).toBeCloseTo(2, 0);
	},
};
export const Outlined: Story = {
	args: {
		variant: 'outlined',
		iconLeft: { name: 'basic.search', size: 20 },
		padding: '20px 30px',
		labelBackgroundColor: '#123456',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		const label = canvas.getByText('Email', { selector: 'label' });
		const wrapper = input.closest('[data-variant]');
		if (!wrapper) throw new Error('Missing wrapper');
		expect(Math.abs(label.getBoundingClientRect().left - input.getBoundingClientRect().left)).toBeLessThan(1);
		expect(
			Math.abs(
				label.getBoundingClientRect().top +
					label.getBoundingClientRect().height / 2 -
					wrapper.getBoundingClientRect().top,
			),
		).toBeLessThan(1);
		expect(getComputedStyle(label.parentElement as HTMLElement).backgroundColor).toBe('rgb(18, 52, 86)');
		expect(getComputedStyle(label.parentElement as HTMLElement).paddingLeft).toBe('4px');
		expect(getComputedStyle(label.parentElement as HTMLElement).paddingTop).toBe('2px');
		expect(getComputedStyle(label).lineHeight).toBe(getComputedStyle(label).fontSize);
		await userEvent.click(label);
		expect(input).toHaveFocus();
	},
};
export const AppearingLabel: Story = {
	args: { variant: 'stacked', behavior: 'appear', placeholder: 'Your email address' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox', { name: 'Email' });
		const label = canvas.getByText('Email', { selector: 'label' });
		const slot = label.parentElement as HTMLElement;
		const wrapper = input.closest('[data-variant]');
		if (!wrapper) throw new Error('Missing wrapper');
		await waitFor(() => {
			const field = wrapper.getBoundingClientRect();
			const value = input.getBoundingClientRect();
			expect(Math.abs(value.top + value.height / 2 - field.top - field.height / 2)).toBeLessThan(1);
		});
		const initialHeight = wrapper.getBoundingClientRect().height;
		const labelStyle = getComputedStyle(slot);
		const adjustment = Number.parseFloat(labelStyle.height) + Number.parseFloat(labelStyle.marginBottom);
		const initialInputTop = input.getBoundingClientRect().top;
		expect(input).toHaveAttribute('placeholder', 'Email');
		expect(getComputedStyle(slot).opacity).toBe('0');
		await userEvent.click(input);
		expect(getComputedStyle(slot).opacity).toBe('0');
		await userEvent.type(input, 'a');
		await waitFor(() => {
			expect(getComputedStyle(slot).opacity).toBe('1');
			expect(label.getBoundingClientRect().height).toBeGreaterThan(10);
			expect(input.getBoundingClientRect().top - label.getBoundingClientRect().bottom).toBeCloseTo(2, 0);
		});
		expect(wrapper.getBoundingClientRect().height).toBe(initialHeight);
		expect(input.getBoundingClientRect().top - initialInputTop).toBeCloseTo(adjustment / 2, 0);
		expect(input).toHaveAttribute('placeholder', 'Your email address');
		expect(input).toHaveFocus();
		await userEvent.clear(input);
		await waitFor(() => expect(getComputedStyle(slot).opacity).toBe('0'));
		expect(input).toHaveAttribute('placeholder', 'Email');
		expect(wrapper.getBoundingClientRect().height).toBe(initialHeight);
		await waitFor(() => expect(input.getBoundingClientRect().top).toBeCloseTo(initialInputTop, 0));
		expect(input).toHaveFocus();
	},
};
let labelPreference: ReturnType<typeof installReducedMotionPreference>;
export const ReducedMotionLabel: Story = {
	tags: ['tests'],
	args: { variant: 'stacked', behavior: 'appear', placeholder: 'Your email address' },
	beforeEach: () => {
		labelPreference = installReducedMotionPreference(true);
		return () => labelPreference.restore();
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		const label = canvas.getByText('Email', { selector: 'label' });
		expect(input).toHaveAttribute('placeholder', 'Your email address');
		expect(getComputedStyle(label.parentElement as HTMLElement).opacity).toBe('1');
		expect(input.getBoundingClientRect().top - label.getBoundingClientRect().bottom).toBeCloseTo(2, 0);
		await userEvent.click(input);
		labelPreference.set(false);
		await waitFor(() => expect(input).toHaveAttribute('placeholder', 'Email'));
		labelPreference.set(true);
		await waitFor(() => expect(input).toHaveAttribute('placeholder', 'Your email address'));
		expect(input).toHaveFocus();
	},
};
export const SimpleIgnoresAppear: Story = {
	tags: ['tests'],
	args: { behavior: 'appear', labelBackgroundColor: '#123456' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		const label = canvas.getByText('Email', { selector: 'label' });
		expect(label.getBoundingClientRect().left).toBeLessThan(input.getBoundingClientRect().left);
		expect(input).toHaveAttribute('placeholder', 'Enter your email');
		expect(getComputedStyle(label).backgroundColor).toBe('rgba(0, 0, 0, 0)');
	},
};
export const OutlinedIgnoresAppear: Story = {
	tags: ['tests'],
	args: { variant: 'outlined', behavior: 'appear' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		const label = canvas.getByText('Email', { selector: 'label' });
		expect(getComputedStyle(label.parentElement as HTMLElement).opacity).toBe('1');
		expect(input).toHaveAttribute('placeholder', 'Enter your email');
	},
};
export const StackedTypography: Story = {
	tags: ['tests'],
	args: {
		variant: 'stacked',
		stackedGap: 8,
		stackedLabelTextSize: 'body-s-medium',
		iconLeft: { name: 'basic.search', size: 20 },
		labelBackgroundColor: '#123456',
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		const label = canvas.getByText('Email', { selector: 'label' });
		expect(input.getBoundingClientRect().top - label.getBoundingClientRect().bottom).toBeCloseTo(8, 0);
		expect(Math.abs(label.getBoundingClientRect().left - input.getBoundingClientRect().left)).toBeLessThan(1);
		expect(getComputedStyle(label.parentElement as HTMLElement).backgroundColor).toBe('rgba(0, 0, 0, 0)');
		expect(getComputedStyle(label).fontWeight).toBe('420');
	},
};
export const UnlabeledStacked: Story = {
	tags: ['tests'],
	args: { variant: 'stacked', behavior: 'appear', label: undefined, inputName: 'Unlabeled field' },
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox', { name: 'Unlabeled field' });
		expect(input).toHaveAttribute('placeholder', 'Enter your email');
		expect(canvasElement.querySelector('label')).not.toBeInTheDocument();
	},
};

export const LeadingIconBeforeSimpleLabel: Story = {
	tags: ['tests'],
	args: { iconLeft: { name: 'basic.search', size: 20 } },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox', { name: 'Email' });
		const label = canvas.getByText('Email', { selector: 'label' });
		const wrapper = input.closest('[data-variant]');
		if (!wrapper) throw new Error('Missing wrapper');
		const icon = wrapper.firstElementChild;
		if (!icon) throw new Error('Missing leading icon');
		expect(icon).toHaveAttribute('aria-hidden', 'true');
		expect(icon.nextElementSibling).toBe(label);
		expect(icon.getBoundingClientRect().right).toBeLessThan(label.getBoundingClientRect().left);
		expect(label.getBoundingClientRect().right).toBeLessThan(input.getBoundingClientRect().left);
		expect(getComputedStyle(wrapper).paddingLeft).toBe('12px');
		await userEvent.click(label);
		expect(input).toHaveFocus();
	},
};

export const PasswordPreviewRequiresValue: Story = {
	tags: ['tests'],
	args: { label: 'Password', inputType: 'password', defaultValue: '' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText('Password', { selector: 'input' });
		const preview = canvas.getByRole('button', { name: 'Show password' });
		expect(preview).toBeDisabled();
		await userEvent.click(preview);
		expect(input).toHaveAttribute('type', 'password');
		await userEvent.type(input, 'secret');
		expect(preview).toBeEnabled();
		await userEvent.click(preview);
		expect(input).toHaveAttribute('type', 'text');
		await userEvent.clear(input);
		expect(canvas.getByRole('button', { name: 'Hide password' })).toBeDisabled();
		await userEvent.type(input, 'new secret');
		expect(canvas.getByRole('button', { name: 'Hide password' })).toBeEnabled();
		await userEvent.click(canvas.getByRole('button', { name: 'Hide password' }));
		expect(input).toHaveAttribute('type', 'password');
	},
};

export const OutlinedDefaultPadding: Story = {
	tags: ['tests'],
	args: { variant: 'outlined', iconLeft: { name: 'basic.search', size: 20 } },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		const label = canvas.getByText('Email', { selector: 'label' });
		const wrapper = input.closest('[data-variant]');
		if (!wrapper) throw new Error('Missing wrapper');
		const style = getComputedStyle(wrapper);
		expect(Number.parseFloat(style.paddingTop)).toBe(8 + Number.parseFloat(getComputedStyle(label).fontSize) / 2);
		expect(style.paddingLeft).toBe('16px');
		expect(style.paddingRight).toBe('16px');
		expect(style.paddingBottom).toBe(style.paddingTop);
		const bounds = wrapper.getBoundingClientRect();
		const valueBounds = input.getBoundingClientRect();
		expect(Math.abs(valueBounds.top + valueBounds.height / 2 - bounds.top - bounds.height / 2)).toBeLessThan(0.5);
		expect(Math.abs(label.getBoundingClientRect().left - input.getBoundingClientRect().left)).toBeLessThan(1);
		expect(
			Math.abs(
				label.getBoundingClientRect().top +
					label.getBoundingClientRect().height / 2 -
					wrapper.getBoundingClientRect().top,
			),
		).toBeLessThan(1);
	},
};

export const AppearingLabelReservesCustomTypography: Story = {
	tags: ['tests'],
	args: { variant: 'stacked', behavior: 'appear', stackedLabelTextSize: 'body-l-medium', stackedGap: 8 },
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		const wrapper = input.closest('[data-variant]');
		if (!wrapper) throw new Error('Missing wrapper');
		const initialHeight = wrapper.getBoundingClientRect().height;
		await userEvent.type(input, 'Text');
		await waitFor(() => expect(wrapper.getBoundingClientRect().height).toBe(initialHeight));
		await userEvent.clear(input);
		expect(wrapper.getBoundingClientRect().height).toBe(initialHeight);
	},
};

export const AppearingValueAndIconMoveTogether: Story = {
	tags: ['tests'],
	args: {
		variant: 'stacked',
		behavior: 'appear',
		iconLeft: { name: 'basic.search', size: 20 },
		stackedLabelTextSize: 'body-l-medium',
		stackedGap: 8,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		const label = canvas.getByText('Email', { selector: 'label' });
		const wrapper = input.closest('[data-variant]');
		if (!wrapper) throw new Error('Missing wrapper');
		const icon = wrapper.querySelector('[class*="leadingIcon"]');
		if (!icon) throw new Error('Missing icon');
		await waitFor(() => {
			const value = input.getBoundingClientRect();
			const field = wrapper.getBoundingClientRect();
			expect(Math.abs(value.top + value.height / 2 - field.top - field.height / 2)).toBeLessThan(1);
		});
		const initialTop = input.getBoundingClientRect().top;
		const initialIconTop = icon.getBoundingClientRect().top;
		const initialHeight = wrapper.getBoundingClientRect().height;
		const slotStyle = getComputedStyle(label.parentElement as HTMLElement);
		const adjustment = Number.parseFloat(slotStyle.height) + Number.parseFloat(slotStyle.marginBottom);
		await userEvent.type(input, 'Text');
		await waitFor(() => {
			expect(input.getBoundingClientRect().top - initialTop).toBeCloseTo(adjustment / 2, 0);
			expect(icon.getBoundingClientRect().top - initialIconTop).toBeCloseTo(adjustment / 2, 0);
		});
		expect(wrapper.getBoundingClientRect().height).toBe(initialHeight);
		await userEvent.clear(input);
		await waitFor(() => expect(input.getBoundingClientRect().top).toBeCloseTo(initialTop, 0));
		expect(wrapper.getBoundingClientRect().height).toBe(initialHeight);
	},
};

export const SupportingMessage: Story = {
	tags: ['tests'],
	render: (args) => {
		const [error, setError] = useState(false);
		return (
			<>
				<TextField {...args} error={error} tip="Use your work email." errorMessage="Enter a valid email." />
				<button type="button" onClick={() => setError(!error)}>
					Toggle error
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		expect(input).toHaveAccessibleDescription('Use your work email.');
		await userEvent.type(input, 'draft');
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle error' }));
		expect(input).toHaveAccessibleDescription('Enter a valid email.');
		expect(canvas.queryByText('Use your work email.')).not.toBeInTheDocument();
		expect(input).toHaveAttribute('aria-invalid', 'true');
		expect(input).toHaveValue('draft');
		const message = canvas.getByText('Enter a valid email.');
		const field = input.closest('[data-variant]');
		if (!field) throw new Error('Missing field');
		expect(message.getBoundingClientRect().top).toBeGreaterThanOrEqual(field.getBoundingClientRect().bottom);
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle error' }));
		expect(input).toHaveAccessibleDescription('Use your work email.');
	},
};
export const EmptySupportingMessages: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			<TextField {...args} inputName="Empty tip" tip="   " />
			<TextField {...args} inputName="Empty error" error tip="Hidden tip" errorMessage="   " />
			<TextField {...args} inputName="Inactive error" errorMessage="Hidden error" />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const input of canvas.getAllByRole('textbox')) expect(input).not.toHaveAttribute('aria-describedby');
		expect(canvas.queryByText('Hidden tip')).not.toBeInTheDocument();
		expect(canvas.queryByText('Hidden error')).not.toBeInTheDocument();
	},
};

export const SupportingMessageAlignment: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			{(['simple', 'stacked', 'outlined'] as const).flatMap((variant) =>
				[true, false].map((withIcon) => (
					<TextField
						{...args}
						key={`${variant}-${withIcon}`}
						variant={variant}
						iconLeft={withIcon ? { name: 'basic.search', size: 20 } : undefined}
						padding="12px 24px"
						tip="Aligned with the field content."
					/>
				)),
			)}
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const input of canvas.getAllByRole('textbox')) {
			const message = canvasElement.querySelector<HTMLElement>(`[id="${input.getAttribute('aria-describedby')}"]`);
			if (!message) throw new Error('Missing message');
			await waitFor(() => {
				const bounds = message.getBoundingClientRect();
				const style = getComputedStyle(message);
				const wrapper = input.closest('[data-variant]');
				if (!wrapper) throw new Error('Missing field');
				let firstContent = wrapper.querySelector('[class*="leadingIcon"]');
				if (!firstContent && wrapper.getAttribute('data-variant') === 'simple')
					firstContent = wrapper.querySelector('label');
				firstContent ??= input;
				expect(
					Math.abs(bounds.left + Number.parseFloat(style.paddingLeft) - firstContent.getBoundingClientRect().left),
				).toBeLessThan(1);
				expect(style.paddingRight).toBe(getComputedStyle(wrapper).paddingRight);
				expect(style.paddingTop).toBe('4px');
			});
		}
	},
};

export const AppearingClearDelay: Story = {
	tags: ['tests'],
	args: { variant: 'stacked', behavior: 'appear' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.click(input);
		fireEvent.change(input, { target: { value: 'Text' } });
		const clear = canvasElement.querySelector<HTMLButtonElement>('button[aria-label="Clear text"]');
		if (!clear) throw new Error('Missing clear button');
		expect(getComputedStyle(clear).transitionDelay).toBe('0.1s, 0.1s');
		expect(getComputedStyle(clear).transform).toBe('none');
		await waitFor(() => expect(clear).toBeVisible());
		await userEvent.click(clear);
		expect(input).toHaveValue('');
		expect(clear).not.toBeVisible();
	},
};

export const InlineLabelSeparator: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const label = canvas.getByText('Email', { selector: 'label' });
		expect(label.nextElementSibling).toHaveTextContent('|');
		expect(label.nextElementSibling).toHaveAttribute('aria-hidden', 'true');
		expect(canvas.getByRole('textbox')).toHaveAccessibleName('Email');
	},
};
