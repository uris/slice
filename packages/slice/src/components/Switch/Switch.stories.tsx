import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { FlexDiv } from '../FlexDiv';
import { Switch } from './Switch';

const meta = {
	title: 'Components/Switch',
	component: Switch,
	argTypes: {
		checked: { control: 'boolean', description: 'Controlled on/off state. Omit for uncontrolled use.' },
		defaultChecked: { control: 'boolean', description: 'Initial uncontrolled state.' },
		disabled: { control: 'boolean' },
		height: { control: { type: 'number', min: 1 } },
		width: { control: { type: 'number', min: 1 } },
		padding: { control: { type: 'number', min: 0 } },
		backgroundColorOn: { control: 'text' },
		backgroundColorOff: { control: 'text' },
		knobColor: { control: 'text' },
		knobWidth: { control: { type: 'number', min: 1 } },
		knobRadius: { control: 'text' },
		borderRadius: { control: 'text' },
		transition: { control: 'object' },
		value: { control: 'object' },
		'aria-label': { control: 'text' },
	},
	args: {
		'aria-label': 'Notifications',
		defaultChecked: false,
		disabled: false,
		height: 22,
		width: 48,
		knobWidth: 26,
		backgroundColorOn: 'feedback-positive',
		backgroundColorOff: 'core-text-disabled',
		knobColor: 'core-surface-primary',
		onChange: fn(),
	},
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<FlexDiv absolute justify="center" align="center" padding={64}>
			<Switch {...args} />
		</FlexDiv>
	),
};
export const CustomTransition: Story = {
	args: { transition: { duration: 0.35 } },
	render: Default.render,
};
export const Controlled: Story = {
	render: (args) => {
		const [checked, setChecked] = useState(false);
		return (
			<Switch
				{...args}
				checked={checked}
				onChange={(value, next) => {
					setChecked(next);
					args.onChange?.(value, next);
				}}
			/>
		);
	},
};
export const Disabled: Story = {
	args: { checked: true, disabled: true },
	render: Default.render,
};

const changed = fn();
const canceled = fn();
const clicked = fn();
const locked = fn();
const controlledChange = fn();
const disabledChange = fn();
const disabledClick = fn();
export const InteractionSemantics: Story = {
	tags: ['tests'],
	render: () => {
		const [checked, setChecked] = useState(false);
		const [initial, setInitial] = useState(true);
		return (
			<div style={{ display: 'grid', gap: 12 }}>
				<Switch aria-label="Local" value={{ id: 42 }} onChange={changed} onClick={clicked} />
				<Switch aria-label="Locked" checked={false} onChange={locked} />
				<Switch
					aria-label="Controlled"
					checked={checked}
					onChange={(_, next) => {
						controlledChange(next);
						setChecked(next);
					}}
				/>
				<button type="button" onClick={() => setChecked(false)}>
					Reset controlled
				</button>
				<Switch aria-label="Canceled" onClick={(event) => event.preventDefault()} onChange={canceled} />
				<Switch aria-label="Disabled" disabled defaultChecked onChange={disabledChange} onClick={disabledClick} />
				<Switch aria-label="Initial" defaultChecked={initial} />
				<button type="button" onClick={() => setInitial(false)}>
					Change initial prop
				</button>
				<span id="switch-visible-label">Visible setting</span>
				<Switch aria-labelledby="switch-visible-label" />
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		for (const mock of [changed, canceled, clicked, locked, controlledChange, disabledChange, disabledClick])
			mock.mockClear();
		const c = within(canvasElement);
		const local = c.getByRole('switch', { name: 'Local' });
		await userEvent.click(local);
		await expect(local).toHaveAttribute('aria-checked', 'true');
		await expect(changed).toHaveBeenLastCalledWith({ id: 42 }, true);
		await expect(clicked).toHaveBeenCalledTimes(1);
		await expect(local).toHaveFocus();
		await userEvent.keyboard(' ');
		await expect(local).toHaveAttribute('aria-checked', 'false');
		await userEvent.keyboard('{Enter}');
		await expect(local).toHaveAttribute('aria-checked', 'true');
		await expect(changed).toHaveBeenCalledTimes(3);
		await userEvent.click(c.getByRole('switch', { name: 'Locked' }));
		await expect(c.getByRole('switch', { name: 'Locked' })).toHaveAttribute('aria-checked', 'false');
		await expect(locked).toHaveBeenCalledWith(undefined, true);
		await userEvent.click(c.getByRole('switch', { name: 'Controlled' }));
		await expect(c.getByRole('switch', { name: 'Controlled' })).toHaveAttribute('aria-checked', 'true');
		await userEvent.click(c.getByRole('button', { name: 'Reset controlled' }));
		await expect(c.getByRole('switch', { name: 'Controlled' })).toHaveAttribute('aria-checked', 'false');
		await expect(controlledChange).toHaveBeenCalledTimes(1);
		await userEvent.click(c.getByRole('switch', { name: 'Canceled' }));
		await expect(c.getByRole('switch', { name: 'Canceled' })).toHaveAttribute('aria-checked', 'false');
		await expect(canceled).not.toHaveBeenCalled();
		const disabled = c.getByRole('switch', { name: 'Disabled' });
		await userEvent.click(disabled);
		await expect(disabled).toHaveAttribute('aria-checked', 'true');
		await expect(disabledChange).not.toHaveBeenCalled();
		await expect(disabledClick).not.toHaveBeenCalled();
		c.getByRole('switch', { name: 'Canceled' }).focus();
		await userEvent.tab();
		await expect(c.getByRole('switch', { name: 'Initial' })).toHaveFocus();
		await userEvent.click(c.getByRole('button', { name: 'Change initial prop' }));
		await expect(c.getByRole('switch', { name: 'Initial' })).toHaveAttribute('aria-checked', 'true');
		await expect(c.getByRole('switch', { name: 'Visible setting' })).not.toHaveAttribute('aria-label');
		local.focus();
		await userEvent.tab();
		await expect(c.getByRole('switch', { name: 'Locked' })).toHaveFocus();
	},
};
export const Geometry: Story = {
	tags: ['tests'],
	render: () => (
		<div style={{ display: 'flex', width: 1, gap: 8 }}>
			<Switch aria-label="Default geometry" />
			<Switch aria-label="Clamped geometry" height={12} width={3} padding={100} />
			<Switch aria-label="Negative padding" padding={-10} />
			<Switch aria-label="Invalid geometry" width={Number.NaN} height={Number.POSITIVE_INFINITY} padding={Number.NaN} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		for (const name of ['Default geometry', 'Clamped geometry', 'Negative padding', 'Invalid geometry']) {
			const root = c.getByRole('switch', { name });
			const track = root.getBoundingClientRect();
			const knobElement = root.firstElementChild;
			if (!knobElement) throw new Error('Switch knob is missing');
			const knob = knobElement.getBoundingClientRect();
			await expect(knob.width).toBeGreaterThanOrEqual(1);
			await expect(knob.height).toBeGreaterThanOrEqual(1);
			await expect(knob.left).toBeGreaterThanOrEqual(track.left);
			await expect(knob.right).toBeLessThanOrEqual(track.right);
			await expect(knob.bottom).toBeLessThanOrEqual(track.bottom);
		}
		const defaultSwitch = c.getByRole('switch', { name: 'Default geometry' });
		await expect(defaultSwitch.getBoundingClientRect().width).toBe(48);
		await expect(defaultSwitch.firstElementChild?.getBoundingClientRect().width).toBe(26);
		await expect(defaultSwitch.firstElementChild?.getBoundingClientRect().height).toBe(18);
		await expect(getComputedStyle(c.getByRole('switch', { name: 'Negative padding' })).paddingLeft).toBe('0px');
	},
};

export const PillKnob: Story = {
	args: { width: 64, knobWidth: 30 },
	render: Default.render,
};
export const CustomCorners: Story = {
	args: { width: 60, height: 26, knobWidth: 24, knobRadius: 4, borderRadius: 6 },
	render: Default.render,
};
export const KnobShapes: Story = {
	tags: ['tests'],
	render: () => (
		<div style={{ display: 'grid', gap: 16 }}>
			<Switch aria-label="Pill knob" width={64} knobWidth={30} />
			<Switch aria-label="Custom corners" width={60} height={26} knobWidth={24} knobRadius={4} borderRadius={6} />
			<Switch aria-label="Clamped knob" knobWidth={1000} knobRadius={0} borderRadius={0} />
			<Switch aria-label="Invalid knob" knobWidth={Number.NaN} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const pill = c.getByRole('switch', { name: 'Pill knob' });
		const knob = pill.firstElementChild as HTMLElement;
		await expect(knob.getBoundingClientRect().width).toBe(30);
		await expect(knob.getBoundingClientRect().height).toBe(18);
		const corners = c.getByRole('switch', { name: 'Custom corners' });
		await expect(getComputedStyle(corners).borderRadius).toBe('6px');
		await expect(getComputedStyle(corners.firstElementChild as Element).borderRadius).toBe('4px');
		const clamped = c.getByRole('switch', { name: 'Clamped knob' });
		await expect(clamped.firstElementChild?.getBoundingClientRect().width).toBe(44);
		await expect(getComputedStyle(clamped.firstElementChild as Element).borderRadius).toBe('0px');
		const invalid = c.getByRole('switch', { name: 'Invalid knob' });
		await expect(invalid.firstElementChild?.getBoundingClientRect().width).toBe(26);
		await userEvent.click(pill);
		await waitFor(() => {
			const trackRect = pill.getBoundingClientRect();
			const knobRect = knob.getBoundingClientRect();
			expect(trackRect.right - knobRect.right).toBeCloseTo(2, 1);
		});
	},
};

export const SharedTransition: Story = {
	args: { transition: { duration: 0.4, delay: 0.15 }, backgroundColorOff: '#ff0000', backgroundColorOn: '#00ff00' },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const root = within(canvasElement).getByRole('switch', { name: 'Notifications' });
		const track = root.lastElementChild as HTMLElement;
		const knob = root.firstElementChild as HTMLElement;
		const startX = knob.getBoundingClientRect().left;
		await userEvent.click(root);
		// Both animations honor the same configured delay.
		await expect(getComputedStyle(track).backgroundColor).toBe('rgb(255, 0, 0)');
		await expect(knob.getBoundingClientRect().left).toBeCloseTo(startX, 1);
		await waitFor(() => {
			expect(getComputedStyle(track).backgroundColor).not.toBe('rgb(255, 0, 0)');
			expect(getComputedStyle(track).backgroundColor).not.toBe('rgb(0, 255, 0)');
			expect(knob.getBoundingClientRect().left).toBeGreaterThan(startX);
		});
		await waitFor(() => {
			expect(getComputedStyle(track).backgroundColor).toBe('rgb(0, 255, 0)');
			expect(root.getBoundingClientRect().right - knob.getBoundingClientRect().right).toBeCloseTo(2, 1);
		});
	},
};
