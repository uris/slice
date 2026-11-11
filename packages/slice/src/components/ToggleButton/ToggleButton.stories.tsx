import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Avatar } from '../Avatar';
import { FlexBox } from '../FlexBox';
import { SliceIcons } from '../Icon/_types';
import { installReducedMotionPreference } from '../playHelpers';
import type { ToolTip } from '../sharedTypes';
import { ToggleButton } from './ToggleButton';

const meta = {
	title: 'Components/ToggleButton',
	component: ToggleButton,
	render: (args) => (
		<FlexBox padding={64}>
			<ToggleButton {...args} />
		</FlexBox>
	),
	argTypes: {
		icon: { control: 'select', options: Object.values(SliceIcons).flatMap(Object.values) },
		buttonSize: { control: 'select', options: ['auto', 's', 'm', 'l', 'xl', 48] },
		textSize: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
		textColor: { control: 'text' },
		textColorHover: { control: 'text' },
		textColorSelected: { control: 'text' },
		iconColor: { control: 'text' },
		iconColorHover: { control: 'text' },
		iconColorSelected: { control: 'text' },
		backgroundColor: { control: 'text' },
		backgroundColorHover: { control: 'text' },
		backgroundColorSelected: { control: 'text' },
		borderColor: { control: 'text' },
		borderRadius: { control: 'text' },
		motionValues: { control: 'object' },
		transition: { control: 'object' },
	},
	args: {
		label: 'Highlight',
		icon: 'weather.sun',
		buttonSize: 'm',
		iconSize: 20,
		textSize: 's',
		selected: undefined,
		defaultSelected: false,
		deselect: true,
		disabled: false,
		hover: true,
		iconFill: false,
		toggleIcon: false,
		gap: 4,
		borderWidth: 0,
		borderRadius: 4,
		borderColor: 'core-outline-primary',
		backgroundColor: 'core-surface-secondary',
		backgroundColorHover: 'core-surface-secondary',
		backgroundColorSelected: 'core-text-special',
		iconColor: 'core-text-primary',
		iconColorHover: 'core-text-primary',
		iconColorSelected: 'core-surface-primary',
		textColor: 'core-text-primary',
		textColorHover: 'core-text-primary',
		textColorSelected: 'core-surface-primary',
		onChange: fn(),
		onClick: fn(),
		onToolTip: fn(),
	},
} satisfies Meta<typeof ToggleButton>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	play: async ({ canvasElement, args }) => {
		const c = within(canvasElement);
		const b = c.getByRole('button', { name: 'Highlight' });
		await expect(c.getAllByRole('button')).toHaveLength(1);
		await userEvent.click(c.getByText('Highlight'));
		await expect(b).toHaveAttribute('aria-pressed', 'true');
		await expect(args.onChange).toHaveBeenLastCalledWith(true);
		b.focus();
		await userEvent.keyboard(' ');
		await expect(b).toHaveAttribute('aria-pressed', 'false');
		await userEvent.keyboard('{Enter}');
		await expect(b).toHaveAttribute('aria-pressed', 'true');
		await expect(c.queryByRole('img')).not.toBeInTheDocument();
		await expect(b.querySelector('svg')).toHaveAttribute('tabindex', '-1');
	},
};
export const Disabled: Story = {
	tags: ['tests'],
	args: { disabled: true, tooltip: 'Highlight' },
	play: async ({ canvasElement, args }) => {
		const c = within(canvasElement);
		const b = c.getByRole('button');
		await expect(b).toBeDisabled();
		await userEvent.click(c.getByText('Highlight'));
		await userEvent.hover(b);
		await expect(args.onChange).not.toHaveBeenCalled();
		await expect(args.onClick).not.toHaveBeenCalled();
		await expect(args.onToolTip).not.toHaveBeenCalled();
	},
};
export const Controlled: Story = {
	tags: ['tests'],
	args: { selected: false },
	play: async ({ canvasElement, args }) => {
		const b = within(canvasElement).getByRole('button');
		await userEvent.click(b);
		await expect(args.onChange).toHaveBeenCalledWith(true);
		await expect(b).toHaveAttribute('aria-pressed', 'false');
	},
};
export const KeepSelection: Story = {
	tags: ['tests'],
	args: { defaultSelected: true, deselect: false },
	play: async ({ canvasElement, args }) => {
		const b = within(canvasElement).getByRole('button');
		await userEvent.click(b);
		await expect(b).toHaveAttribute('aria-pressed', 'true');
		await expect(args.onChange).not.toHaveBeenCalled();
		await expect(args.onClick).toHaveBeenCalledOnce();
	},
};
export const Cancelled: Story = {
	tags: ['tests'],
	args: { onClick: fn((event) => event.preventDefault()) },
	play: async ({ canvasElement, args }) => {
		const b = within(canvasElement).getByRole('button');
		await userEvent.click(b);
		await expect(b).toHaveAttribute('aria-pressed', 'false');
		await expect(args.onChange).not.toHaveBeenCalled();
	},
};
export const TextOnly: Story = {
	tags: ['tests'],
	args: { icon: undefined, label: 'Follow' },
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		expect(getComputedStyle(c.getByRole('button')).padding).toBe('0px 12px');
		await userEvent.click(c.getByRole('button', { name: 'Follow' }));
		await expect(c.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
		await expect(canvasElement.querySelector('svg')).not.toBeInTheDocument();
	},
};
export const IconOnly: Story = {
	tags: ['tests'],
	args: { label: undefined, actionName: 'Highlight' },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('button', { name: 'Highlight' })).toBeInTheDocument();
	},
};
export const ChildrenRow: Story = {
	tags: ['tests'],
	args: {
		label: undefined,
		actionName: 'Custom content',
		buttonSize: 'auto',
		gap: 8,
		children: (
			<>
				<span style={{ display: 'block' }}>First</span>
				<span style={{ display: 'block' }}>Second</span>
			</>
		),
	},
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const first = c.getByText('First').getBoundingClientRect();
		const second = c.getByText('Second').getBoundingClientRect();
		const button = c.getByRole('button', { name: 'Custom content' });
		expect(getComputedStyle(button).padding).toBe('6px 12px 6px 8px');
		expect(button.getBoundingClientRect().height).toBeLessThan(56);
		expect(second.top).toBeCloseTo(first.top, 1);
		expect(second.left - first.right).toBeCloseTo(8, 1);
		await userEvent.click(c.getByRole('button', { name: 'Custom content' }));
		expect(c.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
	},
};
export const ChildrenPaddingOverride: Story = {
	tags: ['tests'],
	args: { ...ChildrenRow.args, padding: '2px 10px', paddingTop: 6, paddingRight: 20 },
	play: async ({ canvasElement }) => {
		const styles = getComputedStyle(within(canvasElement).getByRole('button', { name: 'Custom content' }));
		expect(styles.paddingTop).toBe('6px');
		expect(styles.paddingRight).toBe('20px');
		expect(styles.paddingBottom).toBe('2px');
		expect(styles.paddingLeft).toBe('10px');
	},
};
export const ChildrenWithoutGap: Story = {
	tags: ['tests'],
	args: { ...ChildrenRow.args, gap: 0 },
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const first = c.getByText('First').getBoundingClientRect();
		const second = c.getByText('Second').getBoundingClientRect();
		expect(second.left - first.right).toBeCloseTo(0, 1);
	},
};
export const ChildrenWithoutIcon: Story = {
	tags: ['tests'],
	args: { ...ChildrenRow.args, icon: undefined },
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const button = c.getByRole('button', { name: 'Custom content' });
		expect(getComputedStyle(button).padding).toBe('6px 12px');
		expect(button.getBoundingClientRect().height).toBeCloseTo(
			c.getByText('First').getBoundingClientRect().height + 12,
			1,
		);
	},
};
export const ChildrenDefaultSize: Story = {
	tags: ['tests'],
	args: { ...ChildrenRow.args, buttonSize: undefined, icon: undefined },
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Custom content' });
		expect(getComputedStyle(button).minHeight).toBe('36px');
		expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(36);
	},
};
export const AvatarAndText: Story = {
	args: {
		label: undefined,
		icon: undefined,
		buttonSize: 'auto',
		actionName: 'Profile Info',
		children: (
			<>
				<Avatar name="John Wick" />
				<span>Profile Info</span>
			</>
		),
	},
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const button = c.getByRole('button', { name: 'Profile Info' }).getBoundingClientRect();
		const avatar = c.getByLabelText('User Avatar - John Wick').getBoundingClientRect();
		expect(avatar.top - button.top).toBeCloseTo(6, 1);
		expect(button.bottom - avatar.bottom).toBeCloseTo(6, 1);
		expect(avatar.left - button.left).toBeCloseTo(12, 1);
		const text = c.getByText('Profile Info').getBoundingClientRect();
		expect(text.left).toBeGreaterThanOrEqual(avatar.right);
		expect(text.top + text.height / 2).toBeCloseTo(avatar.top + avatar.height / 2, 1);
	},
};
export const ChildrenFixedSize: Story = {
	tags: ['tests'],
	args: { ...ChildrenRow.args, buttonSize: 'xl' },
	play: async ({ canvasElement }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Custom content' });
		expect(getComputedStyle(button).minHeight).toBe('56px');
		expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(56);
	},
};
export const SelectedIcon: Story = {
	tags: ['tests'],
	args: { icon: 'media.play', iconSelected: 'media.pause', label: 'Playback' },
	play: async ({ canvasElement }) => {
		const b = within(canvasElement).getByRole('button');
		await userEvent.click(b);
		await expect(b.querySelector('svg')).toHaveAttribute('aria-label', 'media.pause icon');
	},
};
export const Tooltip: Story = {
	tags: ['tests'],
	args: { tooltip: 'Highlight', onFocus: fn(), onBlur: fn() },
	play: async ({ canvasElement, args }) => {
		const b = within(canvasElement).getByRole('button');
		b.focus();
		await expect(args.onFocus).toHaveBeenCalled();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(
			expect.objectContaining({ payload: { label: 'Highlight' }, event: undefined }),
		);
		b.blur();
		await expect(args.onBlur).toHaveBeenCalled();
		await expect(args.onToolTip).toHaveBeenLastCalledWith(null);
	},
};
export const CustomColors: Story = {
	tags: ['tests'],
	args: {
		backgroundColorSelected: '#123456',
		textColorSelected: '#abcdef',
		iconColorSelected: '#fedcba',
		transition: { duration: 0 },
	},
	play: async ({ canvasElement }) => {
		const b = within(canvasElement).getByRole('button');
		await userEvent.click(b);
		await waitFor(() =>
			expect(getComputedStyle(b.querySelector('[class*="background"]') as HTMLElement).backgroundColor).toBe(
				'rgb(18, 52, 86)',
			),
		);
		await waitFor(() =>
			expect(getComputedStyle(b.querySelector('[class*="label"]') as HTMLElement).color).toBe('rgb(171, 205, 239)'),
		);
		await waitFor(() =>
			expect(getComputedStyle(b.querySelector('[class*="icon"]') as HTMLElement).color).toBe('rgb(254, 220, 186)'),
		);
	},
};
export const Animated: Story = {
	args: { motionValues: { unselected: { rotate: 0 }, selected: { rotate: 135 } }, transition: { duration: 0.2 } },
};
export const ReducedMotion: Story = {
	args: {
		motionValues: { unselected: { rotate: 0 }, selected: { rotate: [0, 90, 180] } },
		transition: { delay: 1, duration: 2, repeat: Number.POSITIVE_INFINITY },
	},
};
function GroupedExample() {
	const [theme, setTheme] = useState('system');
	return (
		<FlexBox gap={12}>
			{(
				[
					{ label: 'System', icon: 'electronics.laptop', value: 'system' },
					{ label: 'Light', icon: 'weather.sun', value: 'light' },
					{ label: 'Dark', icon: 'weather.moon', value: 'dark' },
				] as const
			).map((option) => (
				<ToggleButton
					key={option.value}
					label={option.label}
					icon={option.icon}
					selected={theme === option.value}
					deselect={false}
					onChange={(next) => {
						if (next) setTheme(option.value);
					}}
				/>
			))}
		</FlexBox>
	);
}
export const Grouped: Story = {
	tags: ['tests'],
	render: () => (
		<FlexBox padding={64}>
			<GroupedExample />
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await userEvent.click(c.getByRole('button', { name: 'Light' }));
		await expect(c.getByRole('button', { name: 'Light' })).toHaveAttribute('aria-pressed', 'true');
		await expect(c.getByRole('button', { name: 'System' })).toHaveAttribute('aria-pressed', 'false');
	},
};

export const CustomPadding: Story = {
	tags: ['tests'],
	args: { padding: '2px 12px', paddingLeft: 20 },
	play: async ({ canvasElement }) => {
		const b = within(canvasElement).getByRole('button');
		const styles = getComputedStyle(b);
		await expect(styles.paddingTop).toBe('2px');
		await expect(styles.paddingRight).toBe('12px');
		await expect(styles.paddingLeft).toBe('20px');
	},
};

export const SmallSize: Story = {
	tags: ['tests'],
	args: { buttonSize: 's' },
	play: async ({ canvasElement }) => {
		const b = within(canvasElement).getByRole('button');
		await expect(b.getBoundingClientRect().height).toBe(24);
	},
};

export const LabelOutside: Story = {
	tags: ['tests'],
	// Exercise the outside-label default instead of inheriting the meta's selected text color.
	args: { labelOutside: true, textColorSelected: undefined, transition: { duration: 0 } },
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const b = c.getByRole('button');
		const frame = b.querySelector('[class*="frame"]') as HTMLElement;
		const background = b.querySelector('[class*="background"]') as HTMLElement;
		const label = c.getByText('Highlight');
		await expect(frame.getBoundingClientRect().width).toBe(36);
		await expect(background.getBoundingClientRect().width).toBeLessThan(b.getBoundingClientRect().width);
		await expect(label.getBoundingClientRect().left).toBeGreaterThanOrEqual(frame.getBoundingClientRect().right);
		const textColor = getComputedStyle(label).color;
		const backgroundColor = getComputedStyle(background).backgroundColor;
		await userEvent.click(label);
		await expect(b).toHaveAttribute('aria-pressed', 'true');
		await waitFor(() => expect(getComputedStyle(background).backgroundColor).not.toBe(backgroundColor));
		await waitFor(() => expect(getComputedStyle(label).color).toBe(textColor));
		await expect(c.getAllByRole('button')).toHaveLength(1);
	},
};
export const LabelOutsideWithoutIcon: Story = { ...TextOnly, args: { ...TextOnly.args, labelOutside: true } };

export const ContentAndNaming: Story = {
	tags: ['tests'],
	render: () => (
		<FlexBox gap={16}>
			<ToggleButton label="Follow">Other</ToggleButton>
			<ToggleButton>{0}</ToggleButton>
			<ToggleButton icon="weather.sun" />
			<ToggleButton label="Follow" actionName="Follow Jane" />
		</FlexBox>
	),
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		await expect(c.getByRole('button', { name: 'Follow' })).toHaveTextContent('Follow');
		for (const name of ['0', 'Action', 'Follow Jane'])
			await expect(c.getByRole('button', { name })).toBeInTheDocument();
	},
};
function SelectionUpdatesExample() {
	const [selected, setSelected] = useState(false);
	return (
		<>
			<ToggleButton label="Controlled" selected={selected} />
			<ToggleButton label="Local" defaultSelected />
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
export const ZeroPadding: Story = {
	tags: ['tests'],
	args: { padding: 0, paddingLeft: 12 },
	play: async ({ canvasElement }) => {
		const styles = getComputedStyle(within(canvasElement).getByRole('button'));
		await expect(styles.paddingTop).toBe('0px');
		await expect(styles.paddingRight).toBe('0px');
		await expect(styles.paddingLeft).toBe('12px');
	},
};
function InlineTooltipExample() {
	const [tip, setTip] = useState<ToolTip | null>(null);
	return (
		<>
			<ToggleButton label="Highlight" tooltip="Highlight" onToolTip={(next) => setTip(next)} />
			<output data-testid="tooltip">{tip?.payload?.label ?? 'none'}</output>
		</>
	);
}
export const InlineTooltip: Story = {
	tags: ['tests'],
	render: () => <InlineTooltipExample />,
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const button = c.getByRole('button');
		await userEvent.hover(button);
		await expect(c.getByTestId('tooltip')).toHaveTextContent('Highlight');
		await userEvent.unhover(button);
		await expect(c.getByTestId('tooltip')).toHaveTextContent('none');
	},
};
let motionPreference: ReturnType<typeof installReducedMotionPreference>;
export const LiveReducedMotion: Story = {
	tags: ['tests'],
	args: {
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

export const IconStrokeWidth: Story = {
	tags: ['tests'],
	render: () => (
		<>
			<ToggleButton actionName="Default stroke" icon="media.play" iconSelected="media.pause" />
			<ToggleButton actionName="Stroke 0" icon="media.play" iconSelected="media.pause" iconStrokeWidth={0} />
			<ToggleButton actionName="Stroke 2.5" icon="media.play" iconSelected="media.pause" iconStrokeWidth={2.5} />
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

export const LabelBelow: Story = {
	args: { labelPosition: 'bottom', labelOutside: true },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const button = canvas.getByRole('button');
		const label = canvas.getByText('Highlight');
		const icon = button.querySelector('svg');
		if (!icon) throw new Error('Expected icon');
		await expect(label.getBoundingClientRect().top).toBeGreaterThanOrEqual(icon.getBoundingClientRect().bottom);
		await userEvent.click(label);
		await expect(button).toHaveAttribute('aria-pressed', 'true');
	},
};
