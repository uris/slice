import type { Meta, StoryObj } from '@storybook/react-vite';
import { memo, useContext, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { FlexBox } from '../FlexBox';
import { RadioButton } from '../RadioButton';
import { RadioGroupContext } from '../RadioButton/RadioGroupContext';
import { RadioButtonList } from './RadioButtonList';
const options = [
	{ fieldName: 'monthly', label: 'Monthly', value: 'monthly' },
	{ fieldName: 'annual', label: 'Annual', value: 'annual' },
];
const meta = {
	title: 'Components/RadioButtonList',
	component: RadioButtonList,
	render: (args) => (
		<FlexBox padding={64}>
			<RadioButtonList {...args} />
		</FlexBox>
	),
	args: {
		options,
		label: 'Billing',
		value: undefined,
		defaultValue: null,
		disabled: false,
		direction: 'column',
		wrap: false,
		gap: 16,
		itemGap: 6,
		marginBottom: 0,
		width: 'min-content',
		iconChecked: 'system.check-circle',
		iconUnChecked: 'system.circle',
		iconSize: 20,
		iconColor: 'core-text-primary',
		iconColorSelected: 'core-text-primary',
		textColor: 'core-text-primary',
		textSize: 'm',
		align: 'middle',
		textTopOffset: 0,
		borderWidth: 0,
		borderColor: 'core-outline-primary',
		borderRadius: 8,
		padding: 0,
		backgroundColor: 'transparent',
		backgroundColorSelected: 'transparent',
		onChange: fn(),
	},
	argTypes: {
		direction: { control: 'select', options: ['row', 'column'] },
		align: { control: 'select', options: ['top', 'middle', 'bottom'] },
		textSize: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
		iconColor: { control: 'text' },
		iconColorSelected: { control: 'text' },
		backgroundColor: { control: 'text' },
		backgroundColorSelected: { control: 'text' },
		textColor: { control: 'text' },
		borderColor: { control: 'text' },
		padding: { control: 'text' },
		width: { control: 'text' },
		marginBottom: { control: 'text' },
	},
} satisfies Meta<typeof RadioButtonList>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Framed: Story = {
	args: { borderWidth: 1, padding: '8px 16px', backgroundColorSelected: 'core-surface-secondary' },
};
export const Horizontal: Story = { args: { direction: 'row' } };
export const SingleSelection: Story = {
	tags: ['tests'],
	play: async ({ canvasElement, args }) => {
		const c = within(canvasElement);
		await expect(c.queryAllByRole('checkbox')).toHaveLength(0);
		const monthly = c.getByRole('radio', { name: 'Monthly' });
		const annual = c.getByRole('radio', { name: 'Annual' });
		await userEvent.click(monthly);
		await expect(monthly).toBeChecked();
		await expect(args.onChange).toHaveBeenLastCalledWith('monthly', expect.objectContaining(options[0]));
		await userEvent.click(annual);
		await expect(annual).toBeChecked();
		await expect(monthly).not.toBeChecked();
		await expect(args.onChange).toHaveBeenLastCalledWith('annual', expect.objectContaining(options[1]));
	},
};
export const KeepSelection: Story = {
	tags: ['tests'],
	args: { defaultValue: 'monthly' },
	play: async ({ canvasElement, args }) => {
		const r = within(canvasElement).getByRole('radio', { name: 'Monthly' });
		await userEvent.click(r);
		await expect(r).toBeChecked();
		await expect(args.onChange).not.toHaveBeenCalled();
	},
};
export const Controlled: Story = {
	tags: ['tests'],
	args: { value: 'monthly' },
	play: async ({ canvasElement, args }) => {
		const c = within(canvasElement);
		await userEvent.click(c.getByRole('radio', { name: 'Annual' }));
		await expect(args.onChange).toHaveBeenCalledWith('annual', expect.objectContaining(options[1]));
		await expect(c.getByRole('radio', { name: 'Monthly' })).toBeChecked();
		await expect(c.getByRole('radio', { name: 'Annual' })).not.toBeChecked();
	},
};
export const Disabled: Story = {
	tags: ['tests'],
	args: { disabled: true, defaultValue: 'monthly' },
	play: async ({ canvasElement, args }) => {
		const c = within(canvasElement);
		for (const r of c.getAllByRole('radio')) await expect(r).toBeDisabled();
		await userEvent.click(c.getByRole('radio', { name: 'Annual' }));
		await expect(args.onChange).not.toHaveBeenCalled();
		await expect(c.getByRole('radio', { name: 'Monthly' })).toBeChecked();
	},
};
export const UnmatchedValue: Story = {
	tags: ['tests'],
	args: { value: 'missing' },
	play: async ({ canvasElement }) => {
		for (const r of within(canvasElement).getAllByRole('radio')) await expect(r).not.toBeChecked();
	},
};
export const Empty: Story = {
	tags: ['tests'],
	args: { options: [], value: 'monthly' },
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await expect(c.getByRole('radiogroup', { name: 'Billing' })).toBeInTheDocument();
		await expect(c.queryAllByRole('radio')).toHaveLength(0);
	},
};
function ControlledUpdatesExample() {
	const [value, setValue] = useState<string | null>(null);
	return (
		<>
			<RadioButtonList options={options} label="Billing" value={value} onChange={setValue} />
			<button type="button" onClick={() => setValue(null)}>
				Clear selection
			</button>
		</>
	);
}
export const ControlledUpdates: Story = {
	tags: ['tests'],
	render: () => <ControlledUpdatesExample />,
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await userEvent.click(c.getByRole('radio', { name: 'Annual' }));
		await expect(c.getByRole('radio', { name: 'Annual' })).toBeChecked();
		await userEvent.click(c.getByRole('button', { name: 'Clear selection' }));
		for (const r of c.getAllByRole('radio')) await expect(r).not.toBeChecked();
	},
};
export const IndependentGroups: Story = {
	tags: ['tests'],
	render: () => (
		<FlexBox gap={32}>
			<RadioButtonList label="First plan" options={options} />
			<RadioButtonList label="Second plan" options={options} />
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const first = within(c.getByRole('radiogroup', { name: 'First plan' }));
		const second = within(c.getByRole('radiogroup', { name: 'Second plan' }));
		await userEvent.click(first.getByRole('radio', { name: 'Annual' }));
		await userEvent.click(second.getByRole('radio', { name: 'Monthly' }));
		await expect(first.getByRole('radio', { name: 'Annual' })).toBeChecked();
		await expect(second.getByRole('radio', { name: 'Monthly' })).toBeChecked();
	},
};
export const Form: Story = {
	tags: ['tests'],
	render: () => (
		<form>
			<RadioButtonList label="Billing" name="billing" options={options} defaultValue="monthly" />
		</form>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await userEvent.click(c.getByRole('radio', { name: 'Annual' }));
		await expect(new FormData(canvasElement.querySelector('form') as HTMLFormElement).getAll('billing')).toEqual([
			'annual',
		]);
	},
};

export const Composed: Story = {
	render: () => (
		<RadioButtonList label="Billing" defaultValue="monthly">
			<RadioButton value="monthly" label="Monthly" />
			<RadioButton value="annual" label="Annual" />
		</RadioButtonList>
	),
};
function WrappedChoice({ value, label, disabled = false }: { value: string; label: string; disabled?: boolean }) {
	return (
		<div>
			<RadioButton value={value} label={label} disabled={disabled} />
		</div>
	);
}
export const WrappedChildren: Story = {
	tags: ['tests'],
	render: () => (
		<RadioButtonList label="Billing" defaultValue="monthly">
			<WrappedChoice value="monthly" label="Monthly" />
			<WrappedChoice value="annual" label="Annual" />
		</RadioButtonList>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await userEvent.click(c.getByRole('radio', { name: 'Annual' }));
		await expect(c.getByRole('radio', { name: 'Annual' })).toBeChecked();
		await expect(c.getByRole('radio', { name: 'Monthly' })).not.toBeChecked();
	},
};
function ReorderExample() {
	const [reversed, setReversed] = useState(false);
	return (
		<>
			<RadioButtonList label="Billing" defaultValue="annual">
				{(reversed ? [...options].reverse() : options).map((option) => (
					<RadioButton key={option.value} value={option.value} label={option.label} />
				))}
			</RadioButtonList>
			<button type="button" onClick={() => setReversed((value) => !value)}>
				Reverse choices
			</button>
		</>
	);
}
export const ReorderedChildren: Story = {
	tags: ['tests'],
	render: () => <ReorderExample />,
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await expect(c.getByRole('radio', { name: 'Annual' })).toBeChecked();
		await userEvent.click(c.getByRole('button', { name: 'Reverse choices' }));
		await expect(c.getAllByRole('radio')[0]).toHaveAccessibleName('Annual');
		await expect(c.getByRole('radio', { name: 'Annual' })).toBeChecked();
	},
};
export const ChildOverrides: Story = {
	tags: ['tests'],
	render: () => (
		<RadioButtonList label="Billing" iconSize={24} textSize="s" disabled>
			<RadioButton value="monthly" label="Monthly" iconSize={16} disabled={false} />
			<RadioButton value="annual" label="Annual" />
		</RadioButtonList>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		for (const r of c.getAllByRole('radio')) await expect(r).toBeDisabled();
		await expect(
			c.getByRole('radio', { name: 'Monthly' }).closest('label')?.style.getPropertyValue('--rb-icon-size'),
		).toBe('16px');
		await expect(
			c.getByRole('radio', { name: 'Annual' }).closest('label')?.style.getPropertyValue('--rb-icon-size'),
		).toBe('24px');
	},
};
export const DisabledChild: Story = {
	tags: ['tests'],
	render: () => (
		<RadioButtonList label="Billing">
			<RadioButton value="monthly" label="Monthly" disabled />
			<RadioButton value="annual" label="Annual" />
		</RadioButtonList>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await userEvent.click(c.getByRole('radio', { name: 'Monthly' }));
		await expect(c.getByRole('radio', { name: 'Monthly' })).not.toBeChecked();
		await userEvent.click(c.getByRole('radio', { name: 'Annual' }));
		await expect(c.getByRole('radio', { name: 'Annual' })).toBeChecked();
	},
};
export const ChildrenTakePriority: Story = {
	tags: ['tests'],
	args: { children: <RadioButton value="custom" label="Custom choice" /> },
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await expect(c.getAllByRole('radio')).toHaveLength(1);
		await expect(c.getByRole('radio', { name: 'Custom choice' })).toBeInTheDocument();
	},
};
export const ChildHandlers: Story = {
	tags: ['tests'],
	args: { children: <RadioButton value="custom" label="Custom choice" onChange={fn()} /> },
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole('radio'));
		await expect(args.onChange).toHaveBeenCalledWith('custom', expect.objectContaining({ value: 'custom' }));
	},
};
export const FormReset: Story = {
	tags: ['tests'],
	render: () => (
		<form>
			<RadioButtonList label="Billing" name="billing" defaultValue="monthly">
				<RadioButton value="monthly" label="Monthly" />
				<RadioButton value="annual" label="Annual" />
			</RadioButtonList>
			<button type="reset">Reset</button>
		</form>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await userEvent.click(c.getByRole('radio', { name: 'Annual' }));
		await userEvent.click(c.getByRole('button', { name: 'Reset' }));
		await expect(c.getByRole('radio', { name: 'Monthly' })).toBeChecked();
	},
};

export const CancelledChild: Story = {
	tags: ['tests'],
	args: { children: <RadioButton value="custom" label="Custom choice" onClick={(event) => event.preventDefault()} /> },
	play: async ({ canvasElement, args }) => {
		const radio = within(canvasElement).getByRole('radio');
		await userEvent.click(radio);
		await expect(radio).not.toBeChecked();
		await expect(args.onChange).not.toHaveBeenCalled();
	},
};
export const ServerRendering: Story = {
	tags: ['tests'],
	render: () => (
		<RadioButtonList label="Billing" defaultValue="annual">
			<RadioButton value="monthly" label="Monthly" />
			<RadioButton value="annual" label="Annual" />
		</RadioButtonList>
	),
	play: async () => {
		const html = renderToString(
			<RadioButtonList label="Billing" defaultValue="annual">
				<RadioButton value="monthly" label="Monthly" />
				<RadioButton value="annual" label="Annual" />
			</RadioButtonList>,
		);
		const document = new DOMParser().parseFromString(html, 'text/html');
		await expect(document.querySelector('input[value="annual"]')?.hasAttribute('checked')).toBe(true);
		await expect(document.querySelector('input[value="monthly"]')?.hasAttribute('checked')).toBe(false);
	},
};

const ContextRenderProbe = memo(function ContextRenderProbe() {
	useContext(RadioGroupContext);
	const renders = useRef(0);
	renders.current += 1;
	return <output aria-label="Context renders">{renders.current}</output>;
});
function StableContextExample() {
	const [gap, setGap] = useState(16);
	return (
		<>
			<button type="button" onClick={() => setGap(gap + 1)}>
				Change layout
			</button>
			<RadioButtonList label="Billing" defaultValue="monthly" gap={gap}>
				<RadioButton value="monthly" label="Monthly" />
				<RadioButton value="annual" label="Annual" />
				<ContextRenderProbe />
			</RadioButtonList>
		</>
	);
}
export const StableContext: Story = {
	tags: ['tests'],
	render: () => <StableContextExample />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const probe = canvas.getByLabelText('Context renders');
		const initial = probe.textContent;
		await userEvent.click(canvas.getByRole('button', { name: 'Change layout' }));
		expect(probe.textContent).toBe(initial);
		await userEvent.click(canvas.getByRole('radio', { name: 'Annual' }));
		await waitFor(() => expect(probe.textContent).not.toBe(initial));
		expect(canvas.getByRole('radio', { name: 'Annual' })).toBeChecked();
	},
};
