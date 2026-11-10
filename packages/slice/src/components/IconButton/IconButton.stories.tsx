import type { Meta, StoryObj } from '@storybook/react-vite';
import { spring } from 'motion/react';
import { useState } from 'react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { FlexBox } from '../FlexBox';
import { SliceIcons } from '../Icon/_types';
import { ToggleButton } from '../ToggleButton';
import { installReducedMotionPreference } from '../playHelpers';
import { IconButton } from './IconButton';
import type { IconButtonProps } from './_types';

const meta = {
	title: 'Components/IconButton',
	component: IconButton,
	render: (args) => (
		<FlexBox padding={64}>
			<IconButton {...args} />
		</FlexBox>
	),
	argTypes: {
		icon: { control: 'select', options: Object.values(SliceIcons).flatMap(Object.values) },
		buttonSize: { control: 'select', options: ['s', 'm', 'l', 'xl', 48] },
		backgroundColor: { control: 'text' },
		backgroundColorHover: { control: 'text' },
		backgroundColorSelected: { control: 'text' },
		iconColor: { control: 'text' },
		iconColorHover: { control: 'text' },
		iconColorSelected: { control: 'text' },
		borderColor: { control: 'text' },
		motionValues: { control: 'object' },
		transition: { control: 'object' },
	},
	args: {
		actionName: 'More options',
		icon: 'basic.more-horiz',
		buttonSize: 'm',
		iconSize: 20,
		borderRadius: '50%',
		borderWidth: 0,
		borderColor: 'core-outline-primary',
		backgroundColor: 'core-surface-secondary',
		backgroundColorHover: 'core-outline-primary',
		backgroundColorSelected: 'core-outline-primary',
		iconColor: 'core-text-primary',
		iconColorHover: 'core-text-primary',
		iconColorSelected: 'core-text-primary',
		toggle: false,
		defaultSelected: false,
		selected: undefined,
		hover: true,
		iconFill: false,
		toggleIcon: false,
		disabled: false,
		count: 0,
		showDot: false,
		tooltip: undefined,
		onClick: fn(),
		onChange: fn(),
		onToolTip: fn(),
	},
} satisfies Meta<typeof IconButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Toggle: Story = {
	tags: ['tests'],
	args: { toggle: true, actionName: 'Highlight' },
	play: async ({ canvasElement, args }) => {
		const c = within(canvasElement);
		const b = c.getByRole('button', { name: 'Highlight' });
		await expect(b).toHaveAttribute('aria-pressed', 'false');
		await userEvent.click(b);
		await expect(b).toHaveAttribute('aria-pressed', 'true');
		await expect(args.onChange).toHaveBeenLastCalledWith(true);
		await b.focus();
		await userEvent.keyboard(' ');
		await expect(b).toHaveAttribute('aria-pressed', 'false');
		await userEvent.keyboard('{Enter}');
		await expect(b).toHaveAttribute('aria-pressed', 'true');
		await expect(c.queryByRole('img')).not.toBeInTheDocument();
		await expect(b.querySelector('svg')).toHaveAttribute('tabindex', '-1');
	},
};
export const Controlled: Story = {
	tags: ['tests'],
	args: { toggle: true, selected: false },
	play: async ({ canvasElement, args }) => {
		const b = within(canvasElement).getByRole('button');
		await userEvent.click(b);
		await expect(args.onChange).toHaveBeenCalledWith(true);
		await expect(b).toHaveAttribute('aria-pressed', 'false');
	},
};
function ControlledExample() {
	const [selected, setSelected] = useState(false);
	return <IconButton actionName="Highlight" icon="weather.sun" toggle selected={selected} onChange={setSelected} />;
}
export const ControlledSelection: Story = {
	render: () => (
		<FlexBox padding={64}>
			<ControlledExample />
		</FlexBox>
	),
};
export const Cancelled: Story = {
	tags: ['tests'],
	args: { toggle: true, onClick: fn((event) => event.preventDefault()) },
	play: async ({ canvasElement, args }) => {
		const b = within(canvasElement).getByRole('button');
		await userEvent.click(b);
		await expect(b).toHaveAttribute('aria-pressed', 'false');
		await expect(args.onChange).not.toHaveBeenCalled();
	},
};
export const Disabled: Story = {
	tags: ['tests'],
	args: { disabled: true, toggle: true, tooltip: 'More options' },
	play: async ({ canvasElement, args }) => {
		const b = within(canvasElement).getByRole('button');
		await userEvent.click(b);
		await userEvent.hover(b);
		await expect(b).toBeDisabled();
		await expect(args.onClick).not.toHaveBeenCalled();
		await expect(args.onChange).not.toHaveBeenCalled();
		await expect(args.onToolTip).not.toHaveBeenCalled();
	},
};
export const Tooltip: Story = {
	tags: ['tests'],
	args: { tooltip: 'More options', onMouseEnter: fn(), onFocus: fn(), onBlur: fn() },
	play: async ({ canvasElement, args }) => {
		const c = within(canvasElement);
		const b = c.getByRole('button');
		await userEvent.hover(b);
		await expect(args.onMouseEnter).toHaveBeenCalled();
		await expect(args.onToolTip).toHaveBeenCalledWith(
			expect.objectContaining({ payload: { label: 'More options' }, ref: expect.anything(), event: expect.anything() }),
		);
		await userEvent.unhover(b);
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null);
		b.focus();
		await expect(args.onFocus).toHaveBeenCalled();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(expect.objectContaining({ event: undefined }));
		await userEvent.hover(b);
		await userEvent.unhover(b);
		await expect(args.onToolTip).not.toHaveBeenLastCalledWith(null);
		b.blur();
		await expect(args.onBlur).toHaveBeenCalled();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null);
	},
};
export const NoHover: Story = {
	tags: ['tests'],
	args: {
		hover: false,
		backgroundColor: '#123456',
		backgroundColorHover: '#ffffff',
		iconColor: '#112233',
		iconColorHover: '#ffffff',
		transition: { duration: 0 },
	},
	play: async ({ canvasElement }) => {
		const b = within(canvasElement).getByRole('button');
		await userEvent.hover(b);
		await waitFor(() =>
			expect(getComputedStyle(b.querySelector('[class*="background"]') as HTMLElement).backgroundColor).toBe(
				'rgb(18, 52, 86)',
			),
		);
		await waitFor(() =>
			expect(getComputedStyle(b.querySelector('[class*="icon"]') as HTMLElement).color).toBe('rgb(17, 34, 51)'),
		);
	},
};
export const SelectedNoHover: Story = {
	...NoHover,
	args: {
		...NoHover.args,
		toggle: true,
		defaultSelected: true,
		backgroundColorSelected: '#123456',
		iconColorSelected: '#112233',
	},
};
export const CustomSize: Story = {
	tags: ['tests'],
	args: { buttonSize: 48, borderWidth: 2, borderRadius: 0 },
	play: async ({ canvasElement }) => {
		const b = within(canvasElement).getByRole('button');
		await expect(b).toHaveStyle({ width: '48px', height: '48px', borderRadius: '0px', borderWidth: '2px' });
	},
};
export const InvalidSize: Story = {
	tags: ['tests'],
	args: { buttonSize: Number.NaN, iconSize: -1, borderWidth: -2 },
	play: async ({ canvasElement }) => {
		const b = within(canvasElement).getByRole('button');
		await expect(b).toHaveStyle({ width: '36px', borderWidth: '0px' });
	},
};
export const Count: Story = {
	tags: ['tests'],
	args: { count: 12, showDot: true, actionName: '12 updates' },
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await expect(c.getByRole('button', { name: '12 updates' })).toBeInTheDocument();
		await expect(c.getByText('12')).toBeInTheDocument();
		await expect(c.queryByRole('status')).not.toBeInTheDocument();
	},
};
export const Animated: Story = {
	args: {
		toggle: true,
		motionValues: { unselected: { rotate: 0 }, selected: { rotate: 135 } },
		transition: { duration: 0.2 },
	},
};
export const FallbackActionName: Story = {
	tags: ['tests'],
	args: { actionName: undefined },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('button', { name: 'Action' })).toBeInTheDocument();
	},
};
export const EmptyActionName: Story = { ...FallbackActionName, args: { actionName: '   ' } };

export const ReducedMotion: Story = {
	args: {
		toggle: true,
		motionValues: { unselected: { rotate: 0 }, selected: { rotate: [0, 90, 180] } },
		transition: { duration: 2, delay: 1, repeat: Number.POSITIVE_INFINITY },
	},
};

export const ActionOnly: Story = {
	tags: ['tests'],
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button');
		await userEvent.click(button);
		await expect(args.onClick).toHaveBeenCalledOnce();
		await expect(args.onChange).not.toHaveBeenCalled();
		await expect(button).not.toHaveAttribute('aria-pressed');
	},
};
function SelectionUpdatesExample() {
	const [selected, setSelected] = useState(false);
	return (
		<>
			<IconButton actionName="Controlled" toggle selected={selected} />
			<IconButton actionName="Local" toggle defaultSelected />
			<button type="button" onClick={() => setSelected((value) => !value)}>
				Toggle controlled state
			</button>
		</>
	);
}
export const SelectionUpdates: Story = {
	tags: ['tests'],
	render: () => <SelectionUpdatesExample />,
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const local = c.getByRole('button', { name: 'Local' });
		await userEvent.click(local);
		await expect(local).toHaveAttribute('aria-pressed', 'false');
		await userEvent.click(c.getByRole('button', { name: 'Toggle controlled state' }));
		await expect(c.getByRole('button', { name: 'Controlled' })).toHaveAttribute('aria-pressed', 'true');
		await expect(local).toHaveAttribute('aria-pressed', 'false');
		await userEvent.click(c.getByRole('button', { name: 'Toggle controlled state' }));
		await expect(c.getByRole('button', { name: 'Controlled' })).toHaveAttribute('aria-pressed', 'false');
	},
};
function TooltipLifecycleExample({ onToolTip }: Pick<IconButtonProps, 'onToolTip'>) {
	const [disabled, setDisabled] = useState(false);
	const [visible, setVisible] = useState(true);
	return (
		<>
			{visible && <IconButton actionName="Open menu" tooltip="Menu" onToolTip={onToolTip} disabled={disabled} />}
			<button type="button" onClick={() => setDisabled((value) => !value)}>
				Toggle disabled
			</button>
			<button type="button" onClick={() => setVisible(false)}>
				Remove action
			</button>
		</>
	);
}
export const TooltipLifecycle: Story = {
	tags: ['tests'],
	render: (args) => <TooltipLifecycleExample onToolTip={args.onToolTip} />,
	play: async ({ canvasElement, args }) => {
		const c = within(canvasElement);
		await userEvent.hover(c.getByRole('button', { name: 'Open menu' }));
		await expect(args.onToolTip).toHaveBeenLastCalledWith(expect.objectContaining({ payload: { label: 'Menu' } }));
		fireEvent.click(c.getByRole('button', { name: 'Toggle disabled' }));
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null);
		fireEvent.click(c.getByRole('button', { name: 'Toggle disabled' }));
		await waitFor(() => expect(c.getByRole('button', { name: 'Open menu' })).not.toBeDisabled());
		c.getByRole('button', { name: 'Open menu' }).focus();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(expect.objectContaining({ payload: { label: 'Menu' } }));
		fireEvent.click(c.getByRole('button', { name: 'Remove action' }));
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null);
	},
};
let motionPreference: ReturnType<typeof installReducedMotionPreference>;
export const LiveReducedMotion: Story = {
	tags: ['tests'],
	args: {
		toggle: true,
		motionValues: { unselected: { rotate: 0 }, selected: { rotate: [0, 90, 180] } },
		transition: { duration: 2, delay: 1, repeat: Number.POSITIVE_INFINITY },
	},
	beforeEach: () => {
		motionPreference = installReducedMotionPreference();
		return () => motionPreference.restore();
	},
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button');
		await userEvent.click(button);
		const icon = button.querySelector('[class*="icon"]') as HTMLElement;
		await waitFor(() => expect(icon.style.transform).toContain('180deg'));
		motionPreference.set(false);
		await userEvent.click(button);
		motionPreference.set(true);
		await waitFor(() => expect(icon.style.transform).not.toContain('180deg'));
		await expect(document.activeElement).toBe(button);
	},
};
export const TrimmedActionName: Story = {
	tags: ['tests'],
	args: { actionName: '  Open profile  ' },
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Open profile' });
		await expect(button).toHaveAttribute('aria-label', 'Open profile');
		await expect(button).not.toHaveAttribute('aria-labelledby');
	},
};

export const TranslucentHover: Story = {
	args: {
		backgroundColor: 'core-fill-primary',
		backgroundColorHover: 'core-surface-secondary',
		transition: { duration: 0.6, ease: 'linear' },
	},
};

export const TranslucentTransitions: Story = {
	tags: ['tests'],
	render: () => (
		<div style={{ background: '#181818', padding: 32, display: 'flex', gap: 16 }}>
			<IconButton
				actionName="Translucent icon"
				backgroundColor="color-mix(in srgb, white 8%, transparent)"
				backgroundColorHover="#303030"
				transition={{ duration: 0.18, ease: 'linear' }}
			/>
			<ToggleButton
				actionName="Translucent toggle"
				icon="media.mic"
				backgroundColor="color-mix(in srgb, white 8%, transparent)"
				backgroundColorHover="#303030"
				transition={{ duration: 0.18, ease: 'linear' }}
			/>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const name of ['Translucent icon', 'Translucent toggle']) {
			const button = canvas.getByRole('button', { name });
			const background = button.querySelector<HTMLElement>('[class*="background"]');
			if (!background) throw Error('Missing background');
			const sampleFrames = () =>
				new Promise<number[]>((resolve) => {
					const context = document.createElement('canvas').getContext('2d');
					if (!context) throw Error('Missing color sampler');
					const deadline = performance.now() + 240;
					const frames: number[] = [];
					const sample = () => {
						context.clearRect(0, 0, 1, 1);
						context.fillStyle = getComputedStyle(background).backgroundColor;
						context.fillRect(0, 0, 1, 1);
						const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;
						const alpha = a / 255;
						frames.push(Math.max(r, g, b) * alpha + 24 * (1 - alpha));
						if (performance.now() < deadline) requestAnimationFrame(sample);
						else resolve(frames);
					};
					requestAnimationFrame(sample);
				});
			const entering = sampleFrames();
			await userEvent.hover(button);
			const enterFrames = await entering;
			await expect(enterFrames.length).toBeGreaterThan(2);
			await expect(Math.max(...enterFrames)).toBeLessThanOrEqual(50);
			await expect(getComputedStyle(background).backgroundColor).toBe('rgb(48, 48, 48)');
			const leaving = sampleFrames();
			await userEvent.unhover(button);
			await expect(Math.max(...(await leaving))).toBeLessThanOrEqual(50);
		}
	},
};

export const SpringBackground: Story = {
	tags: ['tests'],
	args: {
		backgroundColor: '#ffffff',
		backgroundColorHover: '#123456',
		transition: { backgroundColor: { type: 'spring', stiffness: 400, damping: 30 } },
	},
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button');
		await userEvent.hover(button);
		await waitFor(() =>
			expect(getComputedStyle(button.querySelector('[class*="background"]') as HTMLElement).backgroundColor).toBe(
				'rgb(18, 52, 86)',
			),
		);
	},
};
export const CustomGeneratorBackground: Story = {
	...SpringBackground,
	args: { ...SpringBackground.args, transition: { type: (options) => spring(options), duration: 0.1, bounce: 0 } },
};

export const IconStrokeWidth: Story = {
	tags: ['tests'],
	render: () => (
		<>
			<IconButton actionName="Default stroke" icon="media.play" toggle />
			<IconButton actionName="Stroke 0" icon="media.play" toggle iconStrokeWidth={0} />
			<IconButton actionName="Stroke 2.5" icon="media.play" toggle iconStrokeWidth={2.5} />
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const [name, width] of [
			['Default stroke', '1.25'],
			['Stroke 0', '0'],
			['Stroke 2.5', '2.5'],
		]) {
			const button = canvas.getByRole('button', { name });
			const path = button.querySelector('svg path');
			if (!path) throw new Error('Expected stroked icon');
			await expect(path).toHaveAttribute('stroke-width', width);
			await expect(button).not.toHaveAttribute('iconStrokeWidth');
			await userEvent.click(button);
			await expect(button.querySelector('svg path')).toHaveAttribute('stroke-width', width);
		}
	},
};
