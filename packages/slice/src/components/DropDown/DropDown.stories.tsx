import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { installReducedMotionPreference } from '../playHelpers';
import { DropDown } from './DropDown';
import type { DropDownOption, DropDownProps } from './_types';

const options: DropDownOption<string>[] = [
	{ label: '-- Choose a status', value: '' },
	{ label: 'In progress', value: 'active' },
	{ label: 'Complete', value: 'complete' },
];
const meta = {
	title: 'Components/DropDown',
	component: DropDown<string>,
	args: {
		name: 'status',
		inputName: 'Status',
		width: 340,
		options,
		variant: 'simple',
		behavior: 'persistent',
		stackedGap: 2,
		stackedLabelTextSize: 'body-xs-regular',
		labelSize: 'm',
		onChange: fn(),
	},
} satisfies Meta<typeof DropDown<string>>;
export default meta;
type Story = StoryObj<typeof meta>;
const arrayArgs = ({ children: _children, ...args }: DropDownProps<string>) => args;
export const Default: Story = {};
export const LocalSelection: Story = {
	tags: ['tests'],
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox', { name: 'Status' });
		expect(select).toHaveValue('');
		expect(canvas.getByText('Choose a status', { selector: 'span' })).toBeVisible();
		await userEvent.selectOptions(select, 'complete');
		expect(select).toHaveValue('complete');
		expect(canvas.getByText('Complete', { selector: 'span' })).toBeVisible();
		expect(args.onChange).toHaveBeenCalledTimes(1);
		expect(args.onChange).toHaveBeenCalledWith('complete', options[2], 2);
		fireEvent.mouseUp(canvas.getByRole('option', { name: 'In progress' }));
		expect(args.onChange).toHaveBeenCalledTimes(1);
		await userEvent.selectOptions(select, '');
		expect(select).toHaveValue('');
		expect(args.onChange).toHaveBeenLastCalledWith('', options[0], 0);
	},
};
export const ControlledValue: Story = {
	tags: ['tests'],
	args: { value: 'active' },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox');
		await userEvent.selectOptions(select, 'complete');
		expect(args.onChange).toHaveBeenCalledWith('complete', options[2], 2);
		expect(select).toHaveValue('active');
		expect(canvas.getByText('In progress', { selector: 'span' })).toBeVisible();
	},
};
export const ControlledEditing: Story = {
	tags: ['tests'],
	render: (args) => {
		const [value, setValue] = useState('active');
		return <DropDown {...args} value={value} onChange={setValue} />;
	},
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox');
		await userEvent.selectOptions(select, 'complete');
		expect(select).toHaveValue('complete');
	},
};
export const DefaultValue: Story = {
	tags: ['tests'],
	args: { defaultValue: 'active' },
	play: async ({ canvasElement, args }) => {
		const select = within(canvasElement).getByRole('combobox');
		expect(select).toHaveValue('active');
		await userEvent.selectOptions(select, 'active');
		expect(args.onChange).not.toHaveBeenCalled();
	},
};
export const Disabled: Story = {
	tags: ['tests'],
	args: { disabled: true, defaultValue: 'active' },
	play: async ({ canvasElement, args }) => {
		const select = within(canvasElement).getByRole('combobox');
		expect(select).toBeDisabled();
		await userEvent.selectOptions(select, 'complete');
		expect(select).toHaveValue('active');
		fireEvent.change(select, { target: { value: 'complete' } });
		expect(args.onChange).not.toHaveBeenCalled();
	},
};
export const DisabledOption: Story = {
	tags: ['tests'],
	args: { options: [...options, { label: 'Archived', value: 'archived', disabled: true }] },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('option', { name: 'Archived' })).toBeDisabled();
		fireEvent.change(canvas.getByRole('combobox'), { target: { value: 'archived' } });
		expect(args.onChange).not.toHaveBeenCalled();
	},
};
export const InitialFaceMatchesSelection: Story = {
	tags: ['tests'],
	args: { options: options.slice(1), placeholder: false },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('combobox')).toHaveValue('active');
		expect(canvas.getByText('In progress', { selector: 'span' })).toBeVisible();
	},
};
export const UnmatchedValue: Story = {
	tags: ['tests'],
	render: (args) => {
		const [value, setValue] = useState('active');
		return (
			<>
				<DropDown {...args} value={value} />
				<button type="button" onClick={() => setValue('missing')}>
					Remove match
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Remove match' }));
		expect(canvas.queryByText('In progress', { selector: 'span' })).not.toBeInTheDocument();
		expect(canvas.getByText('Select an option', { selector: 'span' })).toBeVisible();
		expect(canvas.getByRole('combobox')).toHaveValue('');
	},
};
export const EmptyOptions: Story = {
	tags: ['tests'],
	args: { options: [], value: null },
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByRole('combobox')).toHaveValue('');
	},
};
export const NullSelection: Story = {
	tags: ['tests'],
	args: { value: null, placeholder: false },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('combobox')).toHaveValue('');
		expect(canvas.queryByText('Select an option', { selector: 'span' })).not.toBeInTheDocument();
	},
};
export const ObjectValues: Story = {
	tags: ['tests'],
	render: () => (
		<DropDown<{ id: number }>
			name="owner"
			inputName="Owner"
			value={{ id: 2 }}
			valueKey="id"
			placeholder={false}
			options={[
				{ label: 'Alex', value: { id: 1 } },
				{ label: 'Sam', value: { id: 2 } },
			]}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('combobox', { name: 'Owner' })).toHaveValue('2');
		expect(canvas.getByText('Sam', { selector: 'span' })).toBeVisible();
	},
};
const objectChoice = { id: 2 };
export const ObjectIdentityAndFormValue: Story = {
	tags: ['tests'],
	render: () => (
		<form>
			<DropDown
				name="owner"
				inputName="Owner"
				defaultValue={objectChoice}
				options={[{ label: 'Sam', value: objectChoice, formValue: 'sam' }]}
			/>
		</form>
	),
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox') as HTMLSelectElement;
		expect(select).toHaveValue('sam');
		if (!select.form) throw new Error('Missing form');
		expect(new FormData(select.form).get('owner')).toBe('sam');
	},
};
export const ReorderedOptions: Story = {
	tags: ['tests'],
	render: (args) => {
		const [reverse, setReverse] = useState(false);
		return (
			<>
				<DropDown {...arrayArgs(args)} defaultValue="active" options={reverse ? [...options].reverse() : options} />
				<button type="button" onClick={() => setReverse(true)}>
					Reorder
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Reorder' }));
		expect(canvas.getByRole('combobox')).toHaveValue('active');
		expect(canvas.getByText('In progress', { selector: 'span' })).toBeVisible();
	},
};
export const OptionsArriveLater: Story = {
	tags: ['tests'],
	render: (args) => {
		const [ready, setReady] = useState(false);
		return (
			<>
				<DropDown {...arrayArgs(args)} options={ready ? options : []} />
				<button type="button" onClick={() => setReady(true)}>
					Load
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Load' }));
		expect(canvas.getByRole('combobox')).toHaveValue('');
		expect(canvas.getByText('Choose a status', { selector: 'span' })).toBeVisible();
	},
};
export const NoLabelGuessing: Story = {
	tags: ['tests'],
	args: { value: 'In progress', options: options.map((option) => ({ ...option, alt: 'In progress' })) },
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByText('Select an option', { selector: 'span' })).toBeVisible();
	},
};
export const LeadingMarkerOnly: Story = {
	tags: ['tests'],
	args: { options: [{ label: 'Draft -- internal', value: 'draft' }], placeholder: false },
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByText('Draft -- internal', { selector: 'span' })).toBeVisible();
	},
};
export const AssociatedLabel: Story = {
	tags: ['tests'],
	args: { label: 'Status', inputName: undefined, inputId: 'status-select' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByLabelText('Status');
		expect(select).toHaveAttribute('id', 'status-select');
		expect(select).not.toHaveAttribute('aria-label');
		await userEvent.click(canvas.getByText('Status', { selector: 'label' }));
		expect(select).toHaveFocus();
	},
};
export const AccessibleNames: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			<DropDown {...args} inputName="Choose status" />
			<DropDown {...args} inputName={undefined} name="Form status" />
			<DropDown {...args} inputName=" " label=" " name={undefined} />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const name of ['Choose status', 'Form status', 'Select an option'])
			expect(canvas.getByRole('combobox', { name })).toBeInTheDocument();
	},
};
export const NativeSettings: Story = {
	tags: ['tests'],
	args: { inputAttributes: { required: true, autoComplete: 'off' } },
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox');
		expect(select).toBeRequired();
		expect(select).toHaveAttribute('autocomplete', 'off');
		expect(select).toHaveAttribute('name', 'status');
	},
};
export const ManagedAria: Story = {
	tags: ['tests'],
	render: (args) => {
		const raw = { 'aria-label': 'Wrong', 'aria-invalid': true, role: 'button' };
		return <DropDown {...args} {...raw} inputAttributes={{ ...raw, required: true }} />;
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('combobox', { name: 'Status' })).not.toHaveAttribute('aria-invalid');
		expect(canvas.queryByRole('button')).not.toBeInTheDocument();
	},
};
export const FormSerialization: Story = {
	tags: ['tests'],
	args: { defaultValue: 'active' },
	render: (args) => (
		<form>
			<DropDown {...args} />
		</form>
	),
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox') as HTMLSelectElement;
		if (!select.form) throw new Error('Missing form');
		expect(new FormData(select.form).get('status')).toBe('active');
	},
};
export const FormReset: Story = {
	tags: ['tests'],
	args: { defaultValue: 'active' },
	render: (args) => (
		<form>
			<DropDown {...args} />
			<button type="reset">Reset</button>
		</form>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox');
		await userEvent.selectOptions(select, 'complete');
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		await waitFor(() => expect(select).toHaveValue('active'));
		expect(canvas.getByText('In progress', { selector: 'span' })).toBeVisible();
		expect(args.onChange).toHaveBeenCalledTimes(1);
	},
};
export const CanceledReset: Story = {
	tags: ['tests'],
	args: { defaultValue: 'active' },
	render: (args) => (
		<form onReset={(event) => event.preventDefault()}>
			<DropDown {...args} />
			<button type="reset">Reset</button>
		</form>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox');
		await userEvent.selectOptions(select, 'complete');
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		expect(select).toHaveValue('complete');
	},
};
export const ControlledFormReset: Story = {
	tags: ['tests'],
	render: (args) => {
		const [value, setValue] = useState('active');
		return (
			<form>
				<DropDown {...args} value={value} onChange={setValue} />
				<button type="reset">Reset</button>
			</form>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox');
		await userEvent.selectOptions(select, 'complete');
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		await waitFor(() => expect(select).toHaveValue('complete'));
		expect(canvas.getByText('Complete', { selector: 'span' })).toBeVisible();
	},
};
export const ExternalFormOwner: Story = {
	tags: ['tests'],
	args: { defaultValue: 'active', inputAttributes: { form: 'dropdown-form' } },
	render: (args) => (
		<>
			<form id="dropdown-form">
				<button type="reset">Reset</button>
			</form>
			<DropDown {...args} />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox') as HTMLSelectElement;
		if (!select.form) throw new Error('Missing form');
		expect(new FormData(select.form).get('status')).toBe('active');
		await userEvent.selectOptions(select, 'complete');
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		await waitFor(() => expect(select).toHaveValue('active'));
	},
};
export const Dimensions: Story = {
	tags: ['tests'],
	args: {
		width: 280,
		height: 64,
		paddingLeft: 0,
		paddingRight: 0,
		paddingTop: 0,
		paddingBottom: 0,
		iconSize: 16,
		borderWidth: 0,
		gap: 4,
	},
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox');
		const wrapper = select.parentElement;
		if (!wrapper) throw new Error('Missing wrapper');
		expect(wrapper.getBoundingClientRect().width).toBe(280);
		expect(wrapper.getBoundingClientRect().height).toBe(64);
		expect(getComputedStyle(wrapper).padding).toBe('0px');
		expect(select.getBoundingClientRect().width).toBe(280);
		expect(select.getBoundingClientRect().height).toBe(64);
	},
};
export const BorderStates: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			{(['box', 'underline', 'none'] as const).map((borderStyle) => (
				<DropDown {...args} key={borderStyle} borderStyle={borderStyle} error borderColorError="#123456" />
			))}
		</>
	),
	play: async ({ canvasElement }) => {
		for (const select of within(canvasElement).getAllByRole('combobox')) {
			const wrapper = select.parentElement;
			if (!wrapper) throw new Error('Missing wrapper');
			if (getComputedStyle(wrapper).borderBottomStyle !== 'none')
				expect(getComputedStyle(wrapper).borderBottomColor).toBe('rgb(18, 52, 86)');
			expect(select).toHaveAttribute('aria-invalid', 'true');
		}
	},
};
export const UnderlineExplicitPadding: Story = {
	tags: ['tests'],
	args: { borderStyle: 'underline', paddingLeft: 20, paddingRight: '2rem', paddingTop: 4, paddingBottom: 0 },
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox');
		const wrapper = select.parentElement;
		if (!wrapper) throw new Error('Missing wrapper');
		expect(getComputedStyle(wrapper).paddingLeft).toBe('20px');
		expect(getComputedStyle(wrapper).paddingTop).toBe('4px');
		expect(getComputedStyle(wrapper).paddingBottom).toBe('0px');
	},
};
export const FocusBorder: Story = {
	tags: ['tests'],
	args: { borderColorFocused: '#123456' },
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox');
		await userEvent.tab();
		expect(select).toHaveFocus();
		await waitFor(() =>
			expect(getComputedStyle(select.parentElement as HTMLElement).borderColor).toBe('rgb(18, 52, 86)'),
		);
	},
};
export const LongLabels: Story = {
	tags: ['tests'],
	args: {
		width: 180,
		label: 'Status',
		options: [{ label: 'A very long choice that should stay inside the dropdown', value: 'long' }],
	},
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox');
		const wrapper = select.parentElement;
		if (!wrapper) throw new Error('Missing wrapper');
		expect(wrapper.getBoundingClientRect().width).toBe(180);
		expect(wrapper.scrollWidth).toBeLessThanOrEqual(180);
	},
};
export const ServerRendering: Story = {
	tags: ['tests'],
	play: async () => {
		const html = renderToString(<DropDown name="status" defaultValue="complete" options={options} />);
		const document = new DOMParser().parseFromString(html, 'text/html');
		expect(document.querySelector('option[selected]')?.getAttribute('value')).toBe('complete');
		expect(html).toContain('Complete</span>');
	},
};

export const RequiredEmptyChoice: Story = {
	tags: ['tests'],
	args: { inputAttributes: { required: true } },
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox') as HTMLSelectElement;
		expect(select.checkValidity()).toBe(false);
		await userEvent.selectOptions(select, 'active');
		expect(select.checkValidity()).toBe(true);
		await userEvent.selectOptions(select, '');
		expect(select.checkValidity()).toBe(false);
	},
};
export const ZeroAndBooleanValues: Story = {
	tags: ['tests'],
	render: () => (
		<>
			<DropDown<number> inputName="Count" value={0} placeholder={false} options={[{ value: 0 }, { value: 1 }]} />
			<DropDown<boolean>
				inputName="Enabled"
				value={false}
				placeholder={false}
				options={[{ value: false }, { value: true }]}
			/>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('combobox', { name: 'Count' })).toHaveValue('0');
		expect(canvas.getByRole('combobox', { name: 'Enabled' })).toHaveValue('false');
		expect(canvas.getByText('0', { selector: 'span' })).toBeVisible();
		expect(canvas.getByText('false', { selector: 'span' })).toBeVisible();
	},
};
export const WithoutChangeHandler: Story = {
	tags: ['tests'],
	args: { onChange: undefined },
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox');
		await userEvent.selectOptions(select, 'active');
		expect(select).toHaveValue('active');
	},
};
export const RemovedChoice: Story = {
	tags: ['tests'],
	render: (args) => {
		const [removed, setRemoved] = useState(false);
		return (
			<>
				<DropDown
					{...arrayArgs(args)}
					defaultValue="active"
					options={removed ? options.filter((item) => item.value !== 'active') : options}
				/>
				<button type="button" onClick={() => setRemoved(true)}>
					Remove active
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Remove active' }));
		expect(canvas.getByRole('combobox')).toHaveValue('');
		expect(canvas.getByText('Select an option', { selector: 'span' })).toBeVisible();
	},
};
export const DisabledFormData: Story = {
	tags: ['tests'],
	args: { disabled: true, defaultValue: 'active' },
	render: (args) => (
		<form>
			<DropDown {...args} />
		</form>
	),
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox') as HTMLSelectElement;
		if (!select.form) throw new Error('Missing form');
		expect(new FormData(select.form).has('status')).toBe(false);
	},
};

export const ResetWithoutValueChange: Story = {
	tags: ['tests'],
	args: { defaultValue: 'active' },
	render: (args) => (
		<form>
			<DropDown {...args} />
			<button type="reset">Reset</button>
		</form>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		await waitFor(() => expect(canvas.getByRole('combobox')).toHaveValue('active'));
		expect(canvas.getByText('In progress', { selector: 'span' })).toBeVisible();
		expect(args.onChange).not.toHaveBeenCalled();
	},
};

export const UnderlineBackground: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			<DropDown {...args} borderStyle="underline" />
			<DropDown {...args} borderStyle="underline" backgroundColor="#123456" />
		</>
	),
	play: async ({ canvasElement }) => {
		const selects = within(canvasElement).getAllByRole('combobox');
		expect(getComputedStyle(selects[0].parentElement as HTMLElement).backgroundColor).toBe('rgba(0, 0, 0, 0)');
		expect(getComputedStyle(selects[1].parentElement as HTMLElement).backgroundColor).toBe('rgb(18, 52, 86)');
	},
};
export const StackedLabel: Story = {
	tags: ['tests'],
	args: { variant: 'stacked', label: 'Status', inputName: undefined, defaultValue: 'active' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox', { name: 'Status' });
		const label = canvas.getByText('Status', { selector: 'label' });
		const value = canvas.getByText('In progress', { selector: 'span' });
		expect(value.getBoundingClientRect().top - label.getBoundingClientRect().bottom).toBeCloseTo(2, 0);
		expect(value.getBoundingClientRect().left).toBeCloseTo(label.getBoundingClientRect().left, 0);
		expect(select).not.toHaveAttribute('aria-label');
	},
};
export const AppearingLabel: Story = {
	tags: ['tests'],
	args: { variant: 'stacked', behavior: 'appear', label: 'Status', inputName: undefined },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox', { name: 'Status' });
		const label = canvas.getByText('Status', { selector: 'label' });
		const slot = label.parentElement;
		const wrapper = select.parentElement;
		if (!slot || !wrapper) throw new Error('Missing label layout');
		await document.fonts.ready;
		const height = wrapper.getBoundingClientRect().height;
		expect(wrapper).toHaveAttribute('data-collapsed-label');
		await userEvent.click(select);
		expect(wrapper).toHaveAttribute('data-collapsed-label');
		await userEvent.selectOptions(select, 'active');
		await waitFor(() => expect(getComputedStyle(slot).opacity).toBe('1'));
		expect(wrapper).not.toHaveAttribute('data-collapsed-label');
		expect(wrapper.getBoundingClientRect().height).toBeCloseTo(height, 0);
		expect(select).toHaveFocus();
		await userEvent.selectOptions(select, '');
		await waitFor(() => expect(getComputedStyle(slot).opacity).toBe('0'));
		expect(wrapper.getBoundingClientRect().height).toBeCloseTo(height, 0);
	},
};
export const OutlinedLabel: Story = {
	tags: ['tests'],
	args: { variant: 'outlined', label: 'Status', inputName: undefined, labelBackgroundColor: '#123456' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox', { name: 'Status' });
		const label = canvas.getByText('Status', { selector: 'label' });
		const wrapper = select.parentElement;
		const slot = label.parentElement;
		if (!wrapper || !slot) throw new Error('Missing outlined layout');
		expect(getComputedStyle(slot).backgroundColor).toBe('rgb(18, 52, 86)');
		expect(getComputedStyle(label).lineHeight).toBe(getComputedStyle(label).fontSize);
		await waitFor(() =>
			expect(
				Math.abs(
					label.getBoundingClientRect().top +
						label.getBoundingClientRect().height / 2 -
						wrapper.getBoundingClientRect().top,
				),
			).toBeLessThan(1.1),
		);
	},
};
export const SupportingMessages: Story = {
	tags: ['tests'],
	render: (args) => {
		const [error, setError] = useState(false);
		return (
			<>
				<DropDown
					{...args}
					variant="stacked"
					label="Status"
					tip="Choose the current status."
					error={error}
					errorMessage="Choose a status before continuing."
					padding="10px 24px"
					textColor="#123456"
					textColorError="#abcdef"
					defaultValue="active"
				/>
				<button type="button" onClick={() => setError(!error)}>
					Toggle error
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox');
		expect(select).toHaveAccessibleDescription('Choose the current status.');
		await userEvent.click(canvas.getByRole('button', { name: 'Toggle error' }));
		expect(select).toHaveAccessibleDescription('Choose a status before continuing.');
		expect(canvas.queryByText('Choose the current status.')).not.toBeInTheDocument();
		const message = canvas.getByText('Choose a status before continuing.');
		expect(getComputedStyle(message).color).toBe('rgb(171, 205, 239)');
		expect(getComputedStyle(message).paddingTop).toBe('4px');
		expect(getComputedStyle(message).paddingLeft).toBe('25px');
		expect(
			Math.abs(
				message.getBoundingClientRect().left +
					Number.parseFloat(getComputedStyle(message).paddingLeft) -
					canvas.getByText('Status', { selector: 'label' }).getBoundingClientRect().left,
			),
		).toBeLessThan(1);
		expect(getComputedStyle(message).paddingRight).toBe('25px');
		expect(getComputedStyle(canvas.getByText('In progress', { selector: 'span' })).color).toBe('rgb(18, 52, 86)');
	},
};
export const EmptySupportingMessages: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			<DropDown {...args} tip=" " />
			<DropDown {...args} error errorMessage=" " tip="Hidden tip" />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const select of canvas.getAllByRole('combobox')) expect(select).not.toHaveAttribute('aria-describedby');
		expect(canvas.queryByText('Hidden tip')).not.toBeInTheDocument();
	},
};
export const SimpleAndOutlinedIgnoreAppear: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			{(['simple', 'outlined'] as const).map((variant) => (
				<DropDown {...args} key={variant} variant={variant} behavior="appear" label="Status" />
			))}
		</>
	),
	play: async ({ canvasElement }) => {
		for (const select of within(canvasElement).getAllByRole('combobox'))
			expect(select.parentElement).not.toHaveAttribute('data-appear');
	},
};
export const ShorthandWithSideOverride: Story = {
	tags: ['tests'],
	args: { padding: '10px 24px', paddingLeft: 0 },
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox');
		const wrapper = select.parentElement;
		if (!wrapper) throw new Error('Missing field');
		expect(getComputedStyle(wrapper).paddingTop).toBe('10px');
		expect(getComputedStyle(wrapper).paddingLeft).toBe('0px');
		expect(getComputedStyle(wrapper).paddingRight).toBe('24px');
	},
};

let labelPreference: ReturnType<typeof installReducedMotionPreference>;
export const ReducedMotionLabels: Story = {
	tags: ['tests'],
	args: { variant: 'stacked', behavior: 'appear', label: 'Status' },
	beforeEach: () => {
		labelPreference = installReducedMotionPreference(true);
		return () => labelPreference.restore();
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox');
		const label = canvas.getByText('Status', { selector: 'label' });
		const wrapper = select.parentElement;
		if (!wrapper || !label.parentElement) throw new Error('Missing label layout');
		expect(wrapper).not.toHaveAttribute('data-appear');
		expect(getComputedStyle(label.parentElement).opacity).toBe('1');
		expect(canvas.getByText('Choose a status', { selector: 'span' })).toBeVisible();
		await userEvent.click(select);
		labelPreference.set(false);
		await waitFor(() => expect(wrapper).toHaveAttribute('data-appear'));
		labelPreference.set(true);
		await waitFor(() => expect(wrapper).not.toHaveAttribute('data-appear'));
		expect(select).toHaveFocus();
	},
};

export const UnderlineDefaultInsets: Story = {
	tags: ['tests'],
	args: { borderStyle: 'underline' },
	play: async ({ canvasElement }) => {
		const wrapper = within(canvasElement).getByRole('combobox').parentElement;
		if (!wrapper) throw new Error('Missing field');
		const style = getComputedStyle(wrapper);
		expect(style.paddingLeft).toBe('16px');
		expect(style.paddingRight).toBe('12px');
		expect(style.paddingTop).toBe('8px');
		expect(style.paddingBottom).toBe('8px');
		expect(style.backgroundColor).toBe('rgba(0, 0, 0, 0)');
	},
};
export const InlineLabelSeparator: Story = {
	tags: ['tests'],
	args: { label: 'Status', inputName: undefined },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const label = canvas.getByText('Status', { selector: 'label' });
		expect(label.nextElementSibling).toHaveTextContent('|');
		expect(label.nextElementSibling).toHaveAttribute('aria-hidden', 'true');
		expect(canvas.getByRole('combobox')).toHaveAccessibleName('Status');
	},
};

export const ComposedOptions: Story = {
	tags: ['tests'],
	render: (args) => (
		<DropDown {...args} options={undefined}>
			<option value="">-- Choose a status</option>
			<option value="active">In progress</option>
			<option value="complete">Complete</option>
		</DropDown>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox');
		await userEvent.selectOptions(select, 'complete');
		expect(select).toHaveValue('complete');
		expect(canvas.getByText('Complete', { selector: 'span' })).toBeVisible();
		expect(args.onChange).toHaveBeenCalledTimes(1);
		expect(args.onChange).toHaveBeenCalledWith(
			'complete',
			{ label: 'Complete', value: 'complete', disabled: undefined },
			2,
		);
		await userEvent.selectOptions(select, '');
		expect(canvas.getByText('Choose a status', { selector: 'span' })).toBeVisible();
	},
};
export const ComposedControlled: Story = {
	tags: ['tests'],
	render: (args) => {
		const [value, setValue] = useState('active');
		return (
			<DropDown {...args} options={undefined} value={value} onChange={setValue}>
				<option value="active">In progress</option>
				<option value="complete">Complete</option>
			</DropDown>
		);
	},
	play: async ({ canvasElement }) => {
		const select = within(canvasElement).getByRole('combobox');
		await userEvent.selectOptions(select, 'complete');
		expect(select).toHaveValue('complete');
	},
};
export const FragmentAndConditionalOptions: Story = {
	tags: ['tests'],
	render: (args) => (
		<DropDown {...args} options={undefined}>
			<>
				<option value="active">In progress</option>
				{false && <option value="unused">Unused</option>}
				{null}
				<>
					<option value="complete">Complete</option>
					<option value="archived">Archived</option>
				</>
			</>
		</DropDown>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getAllByRole('option')).toHaveLength(3);
		await userEvent.selectOptions(canvas.getByRole('combobox'), 'complete');
		expect(canvas.getByRole('combobox')).toHaveValue('complete');
	},
};
export const ComposedNativeAttributes: Story = {
	tags: ['tests'],
	render: (args) => (
		<DropDown {...args} options={undefined}>
			<option value="active" label="In progress" title="Current work" data-code="work">
				Active
			</option>
			<option value="complete" disabled>
				Complete
			</option>
			<option value="hidden" hidden>
				Hidden choice
			</option>
		</DropDown>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const option = canvas.getByRole('option', { name: 'Active' });
		expect(option).toHaveAttribute('label', 'In progress');
		expect(option).toHaveAttribute('title', 'Current work');
		expect(option).toHaveAttribute('data-code', 'work');
		expect(canvas.getByText('In progress', { selector: 'span' })).toBeVisible();
		expect(canvas.getByRole('option', { name: 'Complete' })).toBeDisabled();
		expect(canvasElement.querySelector('option[value="hidden"]')).toHaveAttribute('hidden');
	},
};
export const ComposedDefaultValueAndReset: Story = {
	tags: ['tests'],
	render: (args) => (
		<form>
			<DropDown {...args} options={undefined} defaultValue="complete">
				<option value="active">In progress</option>
				<option value="complete">Complete</option>
			</DropDown>
			<button type="reset">Reset</button>
		</form>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox') as HTMLSelectElement;
		expect(select).toHaveValue('complete');
		if (!select.form) throw new Error('Missing form');
		expect(new FormData(select.form).get('status')).toBe('complete');
		await userEvent.selectOptions(select, 'active');
		await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
		await waitFor(() => expect(select).toHaveValue('complete'));
	},
};
export const ImplicitAndNumericOptionValues: Story = {
	tags: ['tests'],
	render: (args) => (
		<DropDown {...args} options={undefined}>
			<option> In {' progress '} </option>
			<option value={0}>Zero</option>
		</DropDown>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const select = canvas.getByRole('combobox');
		expect(select).toHaveValue('In progress');
		await userEvent.selectOptions(select, '0');
		expect(args.onChange).toHaveBeenLastCalledWith('0', expect.objectContaining({ value: '0', label: 'Zero' }), 1);
	},
};
export const ComposedOptionsReorder: Story = {
	tags: ['tests'],
	render: (args) => {
		const [reverse, setReverse] = useState(false);
		const choices = [
			<option key="active" value="active">
				In progress
			</option>,
			<option key="complete" value="complete">
				Complete
			</option>,
		];
		return (
			<>
				<DropDown {...args} options={undefined} defaultValue="complete">
					{reverse ? choices.reverse() : choices}
				</DropDown>
				<button type="button" onClick={() => setReverse(true)}>
					Reorder
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Reorder' }));
		expect(canvas.getByRole('combobox')).toHaveValue('complete');
		expect(canvas.getByText('Complete', { selector: 'span' })).toBeVisible();
	},
};
export const RejectNonOptionChildren: Story = {
	tags: ['tests'],
	play: async () => {
		for (const child of [
			<div key="div">Invalid</div>,
			<optgroup key="group" label="Group">
				<option>Invalid</option>
			</optgroup>,
			'Invalid text',
			42,
		]) {
			expect(() => renderToString(<DropDown>{child}</DropDown>)).toThrow(
				'DropDown children must be native <option> elements',
			);
		}
		const CustomOption = () => <option value="active">In progress</option>;
		expect(() =>
			renderToString(
				<DropDown>
					<CustomOption />
				</DropDown>,
			),
		).toThrow('DropDown children must be native <option> elements');
	},
};
export const RejectMixedSources: Story = {
	tags: ['tests'],
	play: async () => {
		const mixed = { options, children: <option value="active">In progress</option> } as unknown as DropDownProps;
		expect(() => renderToString(<DropDown {...mixed} />)).toThrow(
			'DropDown accepts either options or <option> children, not both',
		);
	},
};
export const RejectOptionSelectedAndMarkup: Story = {
	tags: ['tests'],
	play: async () => {
		expect(() =>
			renderToString(
				<DropDown>
					<option value="active" selected>
						In progress
					</option>
				</DropDown>,
			),
		).toThrow('Use DropDown value or defaultValue');
		expect(() =>
			renderToString(
				<DropDown>
					<option value="active">
						<span>In progress</span>
					</option>
				</DropDown>,
			),
		).toThrow('DropDown option content must be plain text');
		expect(() =>
			renderToString(
				<DropDown>
					<option value={['active']}>In progress</option>
				</DropDown>,
			),
		).toThrow('DropDown <option> values must be strings or numbers');
	},
};
