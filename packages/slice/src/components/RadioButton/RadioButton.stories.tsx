import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, within } from 'storybook/test';
import { FlexBox } from '../FlexBox';
import { RadioButton } from './RadioButton';
import type { RadioButtonProps } from './_types';

const meta = {
	title: 'Components/RadioButton',
	component: RadioButton,
	render: (args) => (
		<FlexBox padding={64}>
			<RadioButton {...args} />
		</FlexBox>
	),
	args: {
		label: 'Monthly',
		name: 'billing',
		fieldName: 'monthly',
		value: 'monthly',
		checked: undefined,
		defaultChecked: false,
		disabled: false,
		align: 'middle',
		iconChecked: 'system.check-circle',
		iconUnChecked: 'system.circle',
		iconSize: 20,
		iconColor: 'core-text-primary',
		iconColorSelected: 'core-text-primary',
		gap: 6,
		textColor: 'core-text-primary',
		textSize: 'm',
		textTopOffset: 0,
		padding: 0,
		borderWidth: 0,
		borderRadius: 8,
		borderColor: 'core-outline-primary',
		backgroundColor: 'transparent',
		backgroundColorSelected: 'transparent',
		onChange: fn(),
		onClick: fn(),
	},
	argTypes: {
		align: { control: 'select', options: ['top', 'middle', 'bottom'] },
		textSize: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
		iconColor: { control: 'text' },
		iconColorSelected: { control: 'text' },
		textColor: { control: 'text' },
		backgroundColor: { control: 'text' },
		backgroundColorSelected: { control: 'text' },
		borderColor: { control: 'text' },
		padding: { control: 'text' },
	},
} satisfies Meta<typeof RadioButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	play: async ({ canvasElement, args }) => {
		const c = within(canvasElement);
		const r = c.getByRole('radio', { name: 'Monthly' });
		await userEvent.click(c.getByText('Monthly'));
		await expect(r).toBeChecked();
		await expect(args.onClick).toHaveBeenCalled();
		await expect(args.onChange).toHaveBeenLastCalledWith(
			{ fieldName: 'monthly', label: 'Monthly', value: 'monthly' },
			true,
		);
		await userEvent.click(r);
		await expect(args.onChange).toHaveBeenCalledOnce();
		await expect(c.queryByRole('img')).not.toBeInTheDocument();
	},
};
export const Controlled: Story = {
	tags: ['tests'],
	args: { checked: false },
	play: async ({ canvasElement, args }) => {
		const r = within(canvasElement).getByRole('radio');
		await userEvent.click(r);
		await expect(args.onChange).toHaveBeenCalledWith(expect.anything(), true);
		await expect(r).not.toBeChecked();
	},
};
export const Disabled: Story = {
	tags: ['tests'],
	args: { disabled: true },
	play: async ({ canvasElement, args }) => {
		const r = within(canvasElement).getByRole('radio');
		await userEvent.click(r);
		await expect(r).toBeDisabled();
		await expect(args.onClick).not.toHaveBeenCalled();
		await expect(args.onChange).not.toHaveBeenCalled();
	},
};
export const Cancelled: Story = {
	tags: ['tests'],
	args: { onClick: fn((event) => event.preventDefault()) },
	play: async ({ canvasElement, args }) => {
		const r = within(canvasElement).getByRole('radio');
		await userEvent.click(r);
		await expect(r).not.toBeChecked();
		await expect(args.onChange).not.toHaveBeenCalled();
	},
};
export const Group: Story = {
	tags: ['tests'],
	render: () => (
		<FlexBox padding={64} gap={16}>
			<RadioButton label="Monthly" name="schedule" value="monthly" defaultChecked />
			<RadioButton label="Annual" name="schedule" value="annual" />
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const first = c.getByRole('radio', { name: 'Monthly' });
		const last = c.getByRole('radio', { name: 'Annual' });
		await userEvent.click(last);
		await expect(last).toBeChecked();
		await expect(first).not.toBeChecked();
	},
};
export const Framed: Story = {
	args: { padding: '8px 16px', borderWidth: 1, backgroundColorSelected: 'core-surface-secondary' },
};
export const Multiline: Story = {
	args: {
		label: 'I would like the annual plan, including access for everyone on my team.',
		align: 'top',
		textTopOffset: 2,
		style: { maxWidth: 280 },
	},
};
export const TypedValue: Story = {
	tags: ['tests'],
	args: { value: { id: 123 }, formValue: '123' },
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole('radio'));
		await expect(args.onChange).toHaveBeenCalledWith(expect.objectContaining({ value: { id: 123 } }), true);
	},
};
export const Children: Story = {
	tags: ['tests'],
	args: {
		label: undefined,
		children: (
			<>
				Annual <strong>billing</strong>
			</>
		),
	},
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('radio', { name: 'Annual billing' })).toBeInTheDocument();
	},
};
export const NoIcon: Story = {
	tags: ['tests'],
	args: { iconSize: 0 },
	play: async ({ canvasElement }) => {
		await expect(canvasElement.querySelector('svg')).not.toBeInTheDocument();
		await userEvent.click(within(canvasElement).getByRole('radio'));
		await expect(within(canvasElement).getByRole('radio')).toBeChecked();
	},
};
export const Form: Story = {
	tags: ['tests'],
	render: () => (
		<form>
			<RadioButton name="plan" label="Monthly" value="monthly" defaultChecked />
			<RadioButton name="plan" label="Annual" value="annual" />
			<button type="reset">Reset</button>
		</form>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await userEvent.click(c.getByRole('radio', { name: 'Annual' }));
		await expect(new FormData(canvasElement.querySelector('form') as HTMLFormElement).get('plan')).toBe('annual');
		await userEvent.click(c.getByRole('button', { name: 'Reset' }));
		await expect(c.getByRole('radio', { name: 'Monthly' })).toBeChecked();
		await expect(c.getByRole('radio', { name: 'Annual' })).not.toBeChecked();
	},
};

function ControlledUpdatesExample({ onChange }: Readonly<{ onChange?: RadioButtonProps<unknown>['onChange'] }>) {
	const [checked, setChecked] = useState(false);
	return (
		<>
			<RadioButton
				label="Annual"
				name="controlled-update"
				checked={checked}
				value={{ id: 1 }}
				formValue="annual"
				onChange={onChange}
			/>
			<button type="button" onClick={() => setChecked((value) => !value)}>
				Toggle controlled state
			</button>
		</>
	);
}

export const ControlledUpdates: Story = {
	tags: ['tests'],
	render: (args) => <ControlledUpdatesExample onChange={args.onChange} />,
	play: async ({ canvasElement, args }) => {
		const c = within(canvasElement);
		const radio = c.getByRole('radio');
		await userEvent.click(radio);
		await expect(radio).not.toBeChecked();
		await expect(args.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: { id: 1 } }), true);
		await userEvent.click(c.getByRole('button', { name: 'Toggle controlled state' }));
		await expect(radio).toBeChecked();
		await userEvent.click(radio);
		await expect(args.onChange).toHaveBeenCalledOnce();
		await userEvent.click(c.getByRole('button', { name: 'Toggle controlled state' }));
		await expect(radio).not.toBeChecked();
	},
};
export const ContentAndNaming: Story = {
	tags: ['tests'],
	render: () => (
		<FlexBox direction="column" gap={16} padding={32}>
			<RadioButton label="Monthly">Annual</RadioButton>
			<RadioButton>{0}</RadioButton>
			<RadioButton actionName="Choose annual" />
			<RadioButton />
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		for (const name of ['Monthly', '0', 'Choose annual', 'Option'])
			await expect(c.getByRole('radio', { name })).toBeInTheDocument();
	},
};
export const TextOffset: Story = {
	tags: ['tests'],
	args: { align: 'top', textTopOffset: -3 },
	play: async ({ canvasElement }) => {
		const wrapper = within(canvasElement).getByRole('radio').closest('label');
		await expect(wrapper?.style.getPropertyValue('--rb-align')).toBe('flex-start');
		await expect(wrapper?.style.getPropertyValue('--rb-text-bottom')).toBe('3px');
		await expect(wrapper?.style.getPropertyValue('--rb-text-top')).toBe('0px');
	},
};

export const Required: Story = {
	tags: ['tests'],
	args: { required: true },
	play: async ({ canvasElement }) => {
		const radio = within(canvasElement).getByRole('radio') as HTMLInputElement;
		await expect(radio.checkValidity()).toBe(false);
		await userEvent.click(radio);
		await expect(radio.checkValidity()).toBe(true);
	},
};

export const BlankLabel: Story = {
	tags: ['tests'],
	args: { label: '   ' },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('radio', { name: 'Option' })).toBeInTheDocument();
	},
};

export const FlexParentLayout: Story = {
	tags: ['tests'],
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
			<div data-testid="row-parent" style={{ display: 'flex', alignItems: 'stretch', width: 320, height: 160 }}>
				<RadioButton label="Monthly" name="row-layout" />
			</div>
			<div
				data-testid="column-parent"
				style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', width: 320 }}
			>
				<RadioButton label="Annual" name="column-layout" />
			</div>
			<div data-testid="intrinsic-parent" style={{ display: 'flex', flexDirection: 'column', width: 'min-content' }}>
				<RadioButton label="Monthly billing" name="intrinsic-layout" />
			</div>
			<div data-testid="multiline-parent" style={{ display: 'flex', width: 180 }}>
				<RadioButton
					label="Choose annual billing for everyone on my team, with one renewal date for all seats."
					name="multiline-layout"
					align="top"
				/>
			</div>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const id of ['row-parent', 'column-parent']) {
			const parent = canvas.getByTestId(id);
			const input = within(parent).getByRole('radio');
			const wrapper = input.parentElement;
			if (!wrapper) throw new Error('Missing radio wrapper');
			expect(wrapper.getBoundingClientRect().width).toBeLessThan(parent.getBoundingClientRect().width);
			expect(wrapper.getBoundingClientRect().height).toBeLessThan(40);
			expect(getComputedStyle(wrapper).alignSelf).toBe('flex-start');
			const icon = input.nextElementSibling?.firstElementChild;
			const uncheckedIcon = icon?.firstElementChild;
			const checkedIcon = icon?.lastElementChild;
			if (!uncheckedIcon || !checkedIcon) throw new Error('Missing radio icons');
			expect(getComputedStyle(uncheckedIcon).display).toBe('flex');
			expect(getComputedStyle(checkedIcon).display).toBe('none');
			await userEvent.click(input);
			expect(input).toBeChecked();
			expect(getComputedStyle(uncheckedIcon).display).toBe('none');
			expect(getComputedStyle(checkedIcon).display).toBe('flex');
		}
		const intrinsic = canvas.getByTestId('intrinsic-parent');
		const intrinsicInput = within(intrinsic).getByRole('radio');
		const intrinsicWrapper = intrinsicInput.parentElement;
		const intrinsicText = intrinsicInput.nextElementSibling?.lastElementChild;
		if (!intrinsicWrapper || !intrinsicText) throw new Error('Missing intrinsic radio content');
		const intrinsicStyle = getComputedStyle(intrinsicText);
		expect(intrinsicText.getBoundingClientRect().height).toBeLessThanOrEqual(
			Number.parseFloat(intrinsicStyle.lineHeight) + 1,
		);
		expect(intrinsicWrapper.getBoundingClientRect().width).toBeGreaterThan(90);
		const parent = canvas.getByTestId('multiline-parent');
		const input = within(parent).getByRole('radio');
		const wrapper = input.parentElement;
		const surface = input.nextElementSibling;
		const icon = surface?.firstElementChild;
		const text = surface?.lastElementChild;
		if (!wrapper || !icon || !text) throw new Error('Missing multiline radio content');
		expect(wrapper.getBoundingClientRect().width).toBeLessThanOrEqual(180);
		expect(wrapper.scrollWidth).toBeLessThanOrEqual(180);
		expect(icon.getBoundingClientRect().width).toBe(20);
		expect(icon.getBoundingClientRect().height).toBe(20);
		expect(text.getBoundingClientRect().height).toBeGreaterThan(20);
		expect(Math.abs(icon.getBoundingClientRect().top - text.getBoundingClientRect().top)).toBeLessThan(1);
		await userEvent.click(input);
		expect(input).toBeChecked();
	},
};
