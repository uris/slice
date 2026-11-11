import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { TextArea } from './TextArea';

const meta = {
	title: 'Components/TextArea',
	component: TextArea,
	args: {
		name: 'notes',
		label: 'Notes',
		width: 360,
		rows: 3,
		defaultValue: '',
		onChange: fn(),
		onSubmit: fn(),
		onFocus: fn(),
		onBlur: fn(),
		onKeyDown: fn(),
		onPaste: fn(),
	},
} satisfies Meta<typeof TextArea>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LocalEditing: Story = {
	tags: ['tests'],
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox', { name: 'Notes' });
		await userEvent.type(input, 'Line one{enter}Line two');
		expect(input).toHaveValue('Line one\nLine two');
		expect(args.onChange).toHaveBeenLastCalledWith('Line one\nLine two');
		await userEvent.tab();
		expect(args.onFocus).toHaveBeenCalledTimes(1);
		expect(args.onBlur).toHaveBeenCalledTimes(1);
	},
};
export const ControlledValue: Story = {
	tags: ['tests'],
	args: { value: 'Locked' },
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox');
		await userEvent.type(input, 'x');
		expect(input).toHaveValue('Locked');
		expect(args.onChange).toHaveBeenLastCalledWith('Lockedx');
	},
};
export const ControlledEditing: Story = {
	tags: ['tests'],
	render: (args) => {
		const [value, setValue] = useState('');
		return <TextArea {...args} value={value} onChange={setValue} showSendButton />;
	},
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.type(input, 'Message');
		await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
		expect(args.onSubmit).toHaveBeenCalledWith('Message');
		expect(input).toHaveValue('');
		expect(input).toHaveFocus();
	},
};
export const KeyboardSend: Story = {
	tags: ['tests'],
	args: { showSendButton: true, defaultValue: 'Send this' },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('textbox'));
		await userEvent.tab();
		expect(canvas.getByRole('button', { name: 'Send' })).toHaveFocus();
		await userEvent.keyboard('{enter}');
		expect(args.onSubmit).toHaveBeenCalledTimes(1);
		expect(args.onSubmit).toHaveBeenCalledWith('Send this');
		expect(args.onChange).toHaveBeenLastCalledWith('');
		expect(canvas.getByRole('textbox')).toHaveValue('');
		expect(canvas.getByRole('textbox')).toHaveFocus();
	},
};
export const EnterSubmission: Story = {
	tags: ['tests'],
	args: { returnSubmits: true, submitClears: false },
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox');
		await userEvent.type(input, 'First');
		await userEvent.keyboard('{Shift>}{enter}{/Shift}Second');
		expect(input).toHaveValue('First\nSecond');
		expect(args.onSubmit).not.toHaveBeenCalled();
		await userEvent.keyboard('{enter}');
		expect(args.onSubmit).toHaveBeenCalledTimes(1);
		expect(args.onSubmit).toHaveBeenCalledWith('First\nSecond');
		expect(input).toHaveValue('First\nSecond');
		expect(input).toHaveFocus();
	},
};
export const CanceledEnter: Story = {
	tags: ['tests'],
	args: { returnSubmits: true, defaultValue: 'Keep', onKeyDown: fn((event) => event.preventDefault()) },
	play: async ({ canvasElement, args }) => {
		await userEvent.type(within(canvasElement).getByRole('textbox'), '{enter}');
		expect(args.onSubmit).not.toHaveBeenCalled();
	},
};
export const CompositionAndModifiedEnter: Story = {
	tags: ['tests'],
	args: { returnSubmits: true, defaultValue: 'Composing' },
	play: async ({ canvasElement, args }) => {
		const input = within(canvasElement).getByRole('textbox');
		fireEvent.keyDown(input, { key: 'Enter', isComposing: true });
		fireEvent.keyDown(input, { key: 'Enter', keyCode: 229 });
		fireEvent.keyDown(input, { key: 'Enter', ctrlKey: true });
		fireEvent.keyDown(input, { key: 'Enter', metaKey: true });
		fireEvent.keyDown(input, { key: 'Enter', altKey: true });
		expect(args.onSubmit).not.toHaveBeenCalled();
	},
};
export const EmptySend: Story = {
	tags: ['tests'],
	args: { showSendButton: true, returnSubmits: true, defaultValue: '  ' },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('button', { name: 'Send' })).toBeDisabled();
		await userEvent.type(canvas.getByRole('textbox'), '{enter}');
		expect(args.onSubmit).not.toHaveBeenCalled();
	},
};
export const WithoutHandlers: Story = {
	tags: ['tests'],
	args: {
		onSubmit: undefined,
		onChange: undefined,
		onFocus: undefined,
		onBlur: undefined,
		onKeyDown: undefined,
		returnSubmits: true,
		showSendButton: true,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByRole('textbox'), 'First{enter}Second');
		expect(canvas.getByRole('textbox')).toHaveValue('First\nSecond');
		expect(canvas.getByRole('button', { name: 'Send' })).toBeDisabled();
	},
};
export const ReadOnly: Story = {
	tags: ['tests'],
	args: { readOnly: true, defaultValue: 'Read this', showSendButton: true, returnSubmits: true },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		await userEvent.type(input, 'x{enter}');
		expect(input).toHaveFocus();
		expect(input).toHaveValue('Read this');
		expect(canvas.getByRole('button', { name: 'Send' })).toBeDisabled();
		expect(args.onChange).not.toHaveBeenCalled();
		expect(args.onSubmit).not.toHaveBeenCalled();
	},
};
export const Disabled: Story = {
	tags: ['tests'],
	args: { disabled: true, defaultValue: 'Disabled', showSendButton: true, focused: true },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		expect(input).toBeDisabled();
		expect(input).not.toHaveFocus();
		expect(canvas.getByRole('button', { name: 'Send' })).toBeDisabled();
		await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
		expect(args.onSubmit).not.toHaveBeenCalled();
	},
};
export const FocusRequest: Story = {
	tags: ['tests'],
	render: (args) => {
		const [focused, setFocused] = useState<boolean>();
		return (
			<>
				<TextArea {...args} focused={focused} />
				<button type="button" onClick={() => setFocused(true)}>
					Focus
				</button>
				<button type="button" onClick={() => setFocused(false)}>
					Blur
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Focus' }));
		expect(canvas.getByRole('textbox')).toHaveFocus();
		await userEvent.click(canvas.getByRole('button', { name: 'Blur' }));
		expect(canvas.getByRole('textbox')).not.toHaveFocus();
	},
};
export const FormReset: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Initial' },
	render: (args) => (
		<form>
			<TextArea {...args} />
			<button type="reset">Reset</button>
		</form>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByRole('textbox'), ' changed');
		const calls = args.onChange?.mock.calls.length ?? 0;
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		await waitFor(() => expect(canvas.getByRole('textbox')).toHaveValue('Initial'));
		expect(args.onChange).toHaveBeenCalledTimes(calls);
	},
};
export const CanceledReset: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Initial' },
	render: (args) => (
		<form onReset={(event) => event.preventDefault()}>
			<TextArea {...args} />
			<button type="reset">Reset</button>
		</form>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByRole('textbox'), ' changed');
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		expect(canvas.getByRole('textbox')).toHaveValue('Initial changed');
	},
};
export const ExternalFormReset: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Initial', inputAttributes: { form: 'textarea-form' } },
	render: (args) => (
		<>
			<form id="textarea-form">
				<button type="reset">Reset</button>
			</form>
			<TextArea {...args} />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.type(canvas.getByRole('textbox'), ' changed');
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		await waitFor(() => expect(canvas.getByRole('textbox')).toHaveValue('Initial'));
	},
};
export const NativeAttributes: Story = {
	tags: ['tests'],
	args: {
		inputId: 'notes-input',
		inputAttributes: { required: true, minLength: 5, autoComplete: 'off', spellCheck: false },
		maxLength: 30,
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByLabelText('Notes');
		expect(input).toHaveAttribute('id', 'notes-input');
		expect(input).toHaveAttribute('name', 'notes');
		expect(input).toHaveAttribute('autocomplete', 'off');
		expect(input).toHaveAttribute('spellcheck', 'false');
		expect(input).toBeRequired();
		await userEvent.click(canvas.getByText('Notes', { selector: 'label' }));
		expect(input).toHaveFocus();
	},
};
export const AccessibleNames: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			<TextArea {...args} inputName="Custom notes" />
			<TextArea {...args} label={undefined} name="Form notes" />
			<TextArea {...args} label=" " name={undefined} />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const name of ['Custom notes', 'Form notes', 'Text input'])
			expect(canvas.getByRole('textbox', { name })).toBeInTheDocument();
	},
};
export const BrowserAutocomplete: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByRole('textbox')).not.toHaveAttribute('autocomplete');
	},
};
export const ManagedAria: Story = {
	tags: ['tests'],
	render: (args) => {
		const raw = { 'aria-label': 'Wrong', 'aria-invalid': true, role: 'button' };
		return <TextArea {...args} {...raw} inputAttributes={{ ...raw, required: true }} />;
	},
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox', { name: 'Notes' });
		expect(input).not.toHaveAttribute('role');
		expect(input).not.toHaveAttribute('aria-invalid');
		expect(within(canvasElement).queryByRole('button')).not.toBeInTheDocument();
	},
};
export const SupportingMessages: Story = {
	tags: ['tests'],
	render: (args) => {
		const [error, setError] = useState(false);
		return (
			<>
				<TextArea
					{...args}
					error={error}
					tip="Share useful details."
					errorMessage="Add more detail."
					padding="12px 24px"
					textColor="#123456"
					textColorError="#abcdef"
				/>
				<button type="button" onClick={() => setError(!error)}>
					Toggle error
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		expect(input).toHaveAccessibleDescription('Share useful details.');
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle error' }));
		expect(input).toHaveAccessibleDescription('Add more detail.');
		expect(input).toHaveAttribute('aria-invalid', 'true');
		await waitFor(() => expect(getComputedStyle(input).color).toBe('rgb(18, 52, 86)'));
		const message = canvas.getByText('Add more detail.');
		expect(getComputedStyle(message).color).toBe('rgb(171, 205, 239)');
		expect(getComputedStyle(message).paddingTop).toBe('4px');
		expect(getComputedStyle(message).paddingLeft).toBe('24px');
		expect(canvas.queryByText('Share useful details.')).not.toBeInTheDocument();
	},
};
export const BlankMessages: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			<TextArea {...args} tip=" " />
			<TextArea {...args} error errorMessage=" " tip="Hidden tip" />
		</>
	),
	play: async ({ canvasElement }) => {
		for (const input of within(canvasElement).getAllByRole('textbox'))
			expect(input).not.toHaveAttribute('aria-describedby');
		expect(within(canvasElement).queryByText('Hidden tip')).not.toBeInTheDocument();
	},
};
export const AutoGrowExternalValue: Story = {
	tags: ['tests'],
	args: { rows: 2 },
	render: (args) => {
		const [value, setValue] = useState('');
		return (
			<>
				<TextArea {...args} value={value} />
				<button type="button" onClick={() => setValue('Line\n'.repeat(12))}>
					Expand
				</button>
				<button type="button" onClick={() => setValue('')}>
					Shrink
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		const initialHeight = input.getBoundingClientRect().height;
		await userEvent.click(canvas.getByRole('button', { name: 'Expand' }));
		await waitFor(() => expect(input.getBoundingClientRect().height).toBeGreaterThan(initialHeight * 2));
		await userEvent.click(canvas.getByRole('button', { name: 'Shrink' }));
		await waitFor(() => expect(input.getBoundingClientRect().height).toBeCloseTo(initialHeight, 0));
	},
};
export const AutoGrowWrapping: Story = {
	tags: ['tests'],
	args: {
		rows: 1,
		defaultValue: 'A longer note that wraps into several lines when the parent becomes narrower. '.repeat(4),
	},
	render: (args) => {
		const [narrow, setNarrow] = useState(false);
		return (
			<>
				<div style={{ width: narrow ? 200 : 500 }}>
					<TextArea {...args} width="100%" />
				</div>
				<button type="button" onClick={() => setNarrow(!narrow)}>
					Resize parent
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		const initialHeight = input.getBoundingClientRect().height;
		await userEvent.click(canvas.getByRole('button', { name: 'Resize parent' }));
		await waitFor(() => expect(input.getBoundingClientRect().height).toBeGreaterThan(initialHeight));
	},
};
export const FixedHeight: Story = {
	tags: ['tests'],
	args: { height: 150, minWidth: '240px', width: 300, defaultValue: 'Line\n'.repeat(25) },
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		const wrapper = input.parentElement;
		if (!wrapper) throw new Error('Missing field');
		expect(wrapper.getBoundingClientRect().height).toBe(150);
		expect(getComputedStyle(wrapper.parentElement as HTMLElement).minWidth).toBe('240px');
		expect(getComputedStyle(input).resize).toBe('none');
		expect(input.scrollHeight).toBeGreaterThan(input.clientHeight);
	},
};
export const CappedGrowth: Story = {
	tags: ['tests'],
	args: { maxHeight: 180, defaultValue: 'Line\n'.repeat(25) },
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		expect(input.parentElement?.getBoundingClientRect().height).toBe(180);
		expect(input.scrollHeight).toBeGreaterThan(input.clientHeight);
	},
};
export const NativeResize: Story = {
	tags: ['tests'],
	args: { autoGrow: false, resizable: true },
	play: async ({ canvasElement }) => {
		expect(getComputedStyle(within(canvasElement).getByRole('textbox')).resize).toBe('vertical');
	},
};
export const NoResize: Story = {
	tags: ['tests'],
	args: { autoGrow: false, resizable: false, padding: 0, borderStyle: 'none', minWidth: 0 },
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		expect(getComputedStyle(input).resize).toBe('none');
		expect(getComputedStyle(input.parentElement as HTMLElement).padding).toBe('0px');
		expect(getComputedStyle(input.parentElement as HTMLElement).boxShadow).toBe('none');
	},
};
export const SendGeometry: Story = {
	tags: ['tests'],
	args: {
		showSendButton: true,
		sendSize: 44,
		sendOffset: { right: 12, bottom: 8 },
		defaultValue: 'Ready',
		sendActionName: 'Post comment',
	},
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Post comment' });
		expect(button.getBoundingClientRect().width).toBe(44);
		expect(button.getBoundingClientRect().height).toBe(44);
		expect(getComputedStyle(button).right).toBe('12px');
		expect(getComputedStyle(button).bottom).toBe('8px');
		expect(button.getBoundingClientRect().top).toBeGreaterThanOrEqual(
			within(canvasElement).getByRole('textbox').getBoundingClientRect().bottom,
		);
	},
};
export const ErrorBorderPriority: Story = {
	tags: ['tests'],
	args: { error: true, borderColorError: '#123456', borderColorFocused: '#abcdef', borderStyle: 'underline' },
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		await userEvent.click(input);
		await waitFor(() =>
			expect(getComputedStyle(input.parentElement as HTMLElement).boxShadow).toContain('rgb(18, 52, 86)'),
		);
	},
};
export const AllTextSizes: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			{(['xs', 's', 'm', 'l', 'xl'] as const).map((textSize) => (
				<TextArea {...args} key={textSize} textSize={textSize} inputName={textSize} rows={1} />
			))}
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const sizes = ['xs', 's', 'm', 'l', 'xl'].map((name) =>
			Number.parseFloat(getComputedStyle(canvas.getByRole('textbox', { name })).fontSize),
		);
		for (let i = 1; i < sizes.length; i++) expect(sizes[i]).toBeGreaterThan(sizes[i - 1]);
	},
};
export const ServerRendering: Story = {
	tags: ['tests'],
	play: async () => {
		const html = renderToString(<TextArea defaultValue="Initial" label="Notes" error errorMessage="Required" />);
		expect(html).toContain('Initial');
		expect(html).toContain('aria-invalid="true"');
		expect(html).toContain('aria-describedby=');
	},
};

export const ControlledClearRequest: Story = {
	tags: ['tests'],
	args: { value: 'Keep until accepted', showSendButton: true },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
		expect(args.onChange).toHaveBeenCalledWith('');
		expect(canvas.getByRole('textbox')).toHaveValue('Keep until accepted');
	},
};
export const PointerSendFocus: Story = {
	tags: ['tests'],
	args: { defaultValue: 'Message', showSendButton: true },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('textbox'));
		await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
		expect(canvas.getByRole('textbox')).toHaveFocus();
		expect(args.onFocus).toHaveBeenCalledTimes(1);
		expect(args.onBlur).not.toHaveBeenCalled();
	},
};
export const FormSubmission: Story = {
	tags: ['tests'],
	args: { returnSubmits: true, defaultValue: 'Message', submitClears: false },
	render: (args) => (
		<form
			onSubmit={(event) => {
				event.preventDefault();
				throw new Error('Unexpected native submission');
			}}
		>
			<TextArea {...args} />
		</form>
	),
	play: async ({ canvasElement, args }) => {
		await userEvent.type(within(canvasElement).getByRole('textbox'), '{enter}');
		expect(args.onSubmit).toHaveBeenCalledTimes(1);
	},
};
export const AutoGrowTypography: Story = {
	tags: ['tests'],
	args: { rows: 2, defaultValue: 'A longer note that grows with its font size. '.repeat(10) },
	render: (args) => {
		const [large, setLarge] = useState(false);
		return (
			<>
				<TextArea {...args} textSize={large ? 'xl' : 'xs'} />
				<button type="button" onClick={() => setLarge(true)}>
					Larger text
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const input = canvas.getByRole('textbox');
		const height = input.getBoundingClientRect().height;
		await userEvent.click(canvas.getByRole('button', { name: 'Larger text' }));
		await waitFor(() => expect(input.getBoundingClientRect().height).toBeGreaterThan(height));
	},
};

export const FixedHeightContainment: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			{[false, true].map((showSendButton) => (
				<TextArea
					{...args}
					key={String(showSendButton)}
					height={100}
					autoGrow={false}
					resizable={false}
					showSendButton={showSendButton}
					defaultValue={'Long note\n'.repeat(40)}
				/>
			))}
		</>
	),
	play: async ({ canvasElement }) => {
		for (const input of within(canvasElement).getAllByRole('textbox')) {
			const wrapper = input.parentElement;
			if (!wrapper) throw new Error('Missing field');
			const box = wrapper.getBoundingClientRect();
			const value = input.getBoundingClientRect();
			expect(box.height).toBe(100);
			expect(value.top).toBeGreaterThanOrEqual(box.top + 16);
			expect(value.bottom).toBeLessThanOrEqual(box.bottom - 16);
			expect(getComputedStyle(wrapper).overflow).toBe('hidden');
			expect(getComputedStyle(input).resize).toBe('none');
			expect(input.scrollHeight).toBeGreaterThan(input.clientHeight);
			input.scrollTop = input.scrollHeight;
			expect(input.scrollTop).toBeGreaterThan(0);
		}
	},
};
export const SupportingMessageDefaultInset: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			<TextArea {...args} tip="Helpful context." />
			<TextArea {...args} error errorMessage="Check this value." />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const input of canvas.getAllByRole('textbox')) {
			const wrapper = input.parentElement;
			const message = canvasElement.querySelector<HTMLElement>(`[id="${input.getAttribute('aria-describedby')}"]`);
			if (!wrapper || !message) throw new Error('Missing supporting text');
			await waitFor(() => {
				const style = getComputedStyle(message);
				expect(style.paddingTop).toBe('4px');
				expect(style.paddingLeft).toBe('16px');
				expect(style.paddingRight).toBe('8px');
				expect(
					Math.abs(
						message.getBoundingClientRect().left +
							Number.parseFloat(style.paddingLeft) -
							input.getBoundingClientRect().left,
					),
				).toBeLessThan(1);
			});
			expect(getComputedStyle(wrapper).paddingTop).toBe('16px');
			expect(getComputedStyle(wrapper).paddingBottom).toBe('16px');
		}
	},
};

export const ManualHeightSurvivesEditing: Story = {
	tags: ['tests'],
	args: { autoGrow: false, resizable: true, rows: 2 },
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		input.style.height = '180px';
		await userEvent.type(input, 'Keep the height I chose.');
		expect(input.getBoundingClientRect().height).toBe(180);
		expect(input.style.height).toBe('180px');
	},
};

export const ResizeGripWithOverflow: Story = {
	tags: ['tests'],
	args: { autoGrow: false, resizable: true, rows: 2 },
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		const grip = input.nextElementSibling;
		if (!grip || grip.tagName !== 'SPAN') throw new Error('Missing resize grip');
		const checkGrip = () => {
			const box = grip.getBoundingClientRect();
			const value = input.getBoundingClientRect();
			expect(box.width).toBe(16);
			expect(box.height).toBe(16);
			expect(Math.abs(box.bottom - value.bottom)).toBeLessThan(1);
			expect(Math.abs(box.right - value.right)).toBeLessThan(1);
		};
		checkGrip();
		expect(grip).toHaveAttribute('aria-hidden', 'true');
		expect(getComputedStyle(grip).pointerEvents).toBe('none');
		const image = getComputedStyle(grip).backgroundImage;
		expect(image).not.toBe('none');
		fireEvent.change(input, { target: { value: 'Long note\n'.repeat(50) } });
		expect(input.scrollHeight).toBeGreaterThan(input.clientHeight);
		checkGrip();
		expect(getComputedStyle(grip).backgroundImage).toBe(image);
		expect(getComputedStyle(input, '::-webkit-scrollbar').width).toBe('6px');
		input.style.height = '180px';
		await waitFor(checkGrip);
	},
};

export const ResizeGripBottomAlignment: Story = {
	tags: ['tests'],
	args: { autoGrow: false, resizable: true, rows: 2 },
	play: async ({ canvasElement }) => {
		const input = within(canvasElement).getByRole('textbox');
		const wrapper = input.parentElement;
		if (!wrapper) throw new Error('Missing field');
		const styles = getComputedStyle(input);
		expect(styles.paddingBottom).toBe('8px');
		expect(styles.marginBottom).toBe('-8px');
		expect(wrapper.getBoundingClientRect().bottom - input.getBoundingClientRect().bottom).toBe(8);
		fireEvent.change(input, { target: { value: 'Long note\n'.repeat(40) } });
		expect(wrapper.getBoundingClientRect().bottom - input.getBoundingClientRect().bottom).toBe(8);
	},
};

export const LabelValueAndTipAlignment: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			{[undefined, 0, '12px 24px'].map((padding) => (
				<TextArea {...args} key={String(padding)} padding={padding} tip="Useful context." />
			))}
		</>
	),
	play: async ({ canvasElement }) => {
		for (const input of within(canvasElement).getAllByRole('textbox')) {
			const field = input.parentElement?.parentElement;
			if (!field) throw new Error('Missing field');
			const label = within(field).getByText('Notes', { selector: 'label' });
			const tip = within(field).getByText('Useful context.');
			await waitFor(() => {
				const range = document.createRange();
				range.selectNodeContents(label);
				const valueLeft = input.getBoundingClientRect().left;
				expect(Math.abs(range.getBoundingClientRect().left - valueLeft)).toBeLessThan(1);
				expect(
					Math.abs(tip.getBoundingClientRect().left + Number.parseFloat(getComputedStyle(tip).paddingLeft) - valueLeft),
				).toBeLessThan(1);
				expect(getComputedStyle(label).paddingRight).toBe(getComputedStyle(tip).paddingRight);
			});
		}
	},
};

export const ComposedEditorRef: StoryObj<typeof TextArea> = {
	tags: ['tests'],
	render: (args) => (
		<TextArea
			{...args}
			inputRef={(element) => {
				if (element) element.dataset.composedRef = 'attached';
			}}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.getByRole('textbox')).toHaveAttribute('data-composed-ref', 'attached');
	},
};
