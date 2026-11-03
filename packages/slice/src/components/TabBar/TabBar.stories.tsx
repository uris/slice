import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { renderToString } from 'react-dom/server';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { Tab } from '../Tab';
import { installReducedMotionPreference } from '../playHelpers';
import { TabBar } from './TabBar';

const options = [
	{ value: 'overview', label: 'Overview', icon: 'home' },
	{ value: 'activity', label: 'Recent activity', count: 12 },
	{ value: 'settings', label: 'Settings' },
];
const meta = {
	title: 'Components/TabBar',
	component: TabBar,
	args: {
		options,
		defaultValue: 'overview',
		tabBarName: 'Project views',
		width: 400,
		height: 44,
		tabWidth: 'compact',
		border: true,
		underline: true,
		disabled: false,
		hasClose: false,
		closeWidth: 'auto',
		padding: 'var(--spacing-s)',
		iconSize: 20,
		iconFill: false,
		iconGap: 8,
		tabGap: 8,
		justify: 'start',
		borderColor: 'core-outline-secondary',
		textSize: 'm',
		onChange: fn(),
		onClose: fn(),
		onToolTip: fn(),
	},
	argTypes: {
		tabWidth: { control: 'select', options: ['fill', 'compact', 120] },
		justify: { control: 'select', options: ['start', 'center', 'end'] },
		textSize: { control: 'select', options: ['xs', 's', 'm', 'l', 'xl'] },
	},
} satisfies Meta<typeof TabBar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('tab', { name: 'Settings' }));
		expect(args.onChange).toHaveBeenLastCalledWith('settings', expect.objectContaining({ value: 'settings' }));
		expect(canvas.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
		await userEvent.click(canvas.getByRole('tab', { name: 'Settings' }));
		expect(args.onChange).toHaveBeenCalledTimes(1);
	},
};
export const Composed: Story = {
	render: (args) => (
		<TabBar {...args}>
			<Tab value="overview" label="Overview" />
			<Tab value="activity" label="Activity" />
			<Tab value="settings" label="Settings" />
		</TabBar>
	),
};
export const Fill: Story = { args: { tabWidth: 'fill' } };
export const Disabled: Story = {
	tags: ['tests'],
	args: { disabled: true, hasClose: true },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		for (const tab of canvas.getAllByRole('tab')) expect(tab).toBeDisabled();
		await userEvent.click(canvas.getByRole('button', { name: 'Close tabs' }));
		expect(args.onClose).not.toHaveBeenCalled();
		expect(args.onChange).not.toHaveBeenCalled();
	},
};
export const Controlled: Story = {
	tags: ['tests'],
	args: { value: 'overview' },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('tab', { name: 'Settings' }));
		expect(args.onChange).toHaveBeenCalled();
		expect(canvas.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
	},
};
export const Keyboard: Story = {
	tags: ['tests'],
	args: { options: [options[0], { ...options[1], disabled: true }, options[2]] },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const first = canvas.getByRole('tab', { name: 'Overview' });
		first.focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(canvas.getByRole('tab', { name: 'Settings' })).toHaveFocus();
		await userEvent.keyboard('{ArrowRight}');
		expect(first).toHaveFocus();
		await userEvent.keyboard('{End}');
		expect(canvas.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
		await userEvent.keyboard('{Home}');
		expect(first).toHaveAttribute('aria-selected', 'true');
	},
};
export const PanelsAndClose: Story = {
	tags: ['tests'],
	args: { hasClose: true },
	render: (args) => (
		<TabBar {...args}>
			<Tab value="overview" id="overview-tab" panelId="overview-panel" icon="home" label="Overview" />
			<Tab value="settings" label="Settings" />
		</TabBar>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const list = canvas.getByRole('tablist');
		expect(within(list).queryByRole('button')).not.toBeInTheDocument();
		expect(canvas.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-controls', 'overview-panel');
		expect(canvas.queryByRole('img')).not.toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: 'Close tabs' }));
		expect(args.onClose).toHaveBeenCalledTimes(1);
	},
};
export const Empty: Story = {
	tags: ['tests'],
	args: { options: [] },
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).queryAllByRole('tab')).toHaveLength(0);
	},
};
export const SnapIndicator: Story = {
	tags: ['tests'],
	args: { tabWidth: 'compact', transition: { duration: 0 }, closeWidth: 52, hasClose: true },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const target = canvas.getByRole('tab', { name: 'Settings' });
		await userEvent.click(target);
		await waitFor(() => {
			const line = canvas.getByRole('tablist').querySelector('[aria-hidden="true"][class*="indicator"]');
			if (!line) throw new Error('Missing selection indicator');
			expect(Math.abs(line.getBoundingClientRect().width - target.getBoundingClientRect().width)).toBeLessThan(1);
			expect(Math.abs(line.getBoundingClientRect().left - target.getBoundingClientRect().left)).toBeLessThan(1);
		});
		expect(canvas.getByRole('tablist').parentElement?.getBoundingClientRect().height).toBe(44);
		expect(canvas.getByRole('button', { name: 'Close tabs' }).parentElement?.getBoundingClientRect().width).toBe(52);
	},
};
function ChangingTabs() {
	const [changed, setChanged] = useState(false);
	const [value, setValue] = useState('overview');
	return (
		<>
			<button type="button" onClick={() => setChanged(!changed)}>
				Update tabs
			</button>
			<TabBar
				tabBarName="Project views"
				width={400}
				value={value}
				onChange={setValue}
				iconFill={changed}
				options={
					changed
						? [...options].reverse().map((o) => ({
								...o,
								label: o.value === 'overview' ? 'Updated overview' : o.label,
								toolTip: 'Updated tip',
							}))
						: options
				}
			/>
		</>
	);
}
export const ReorderAndUpdate: Story = {
	tags: ['tests'],
	render: () => <ChangingTabs />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Update tabs' }));
		expect(canvas.getByRole('tab', { name: 'Updated overview' })).toHaveAttribute('aria-selected', 'true');
		await userEvent.click(canvas.getByRole('tab', { name: 'Settings' }));
		expect(canvas.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
	},
};

export const InitialSelection: Story = {
	tags: ['tests'],
	args: { defaultValue: undefined, options: [{ ...options[0], disabled: true }, options[1], options[2]] },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('tab', { name: 'Recent activity 12' })).toHaveAttribute('aria-selected', 'true');
		expect(args.onChange).not.toHaveBeenCalled();
		const html = renderToString(
			<TabBar tabBarName="SSR tabs">
				<Tab value="first" label="First" />
				<Tab value="second" label="Second" />
			</TabBar>,
		);
		const document = new DOMParser().parseFromString(html, 'text/html');
		expect(document.querySelector('[role="tab"][aria-selected="true"]')?.textContent).toBe('First');
	},
};
export const UnmatchedValue: Story = {
	tags: ['tests'],
	args: { value: 'missing' },
	play: async ({ canvasElement }) => {
		const tabs = within(canvasElement).getAllByRole('tab');
		for (const tab of tabs) expect(tab).toHaveAttribute('aria-selected', 'false');
		expect(tabs[0]).toHaveAttribute('tabindex', '0');
	},
};
export const CancelledChild: Story = {
	tags: ['tests'],
	render: (args) => (
		<TabBar {...args}>
			<Tab value="overview" label="Overview" />
			<Tab value="settings" label="Settings" onClick={(event) => event.preventDefault()} />
		</TabBar>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('tab', { name: 'Settings' }));
		expect(args.onChange).not.toHaveBeenCalled();
		expect(canvas.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
	},
};
export const WrappedTabs: Story = {
	tags: ['tests'],
	render: (args) => (
		<TabBar {...args}>
			<div style={{ display: 'contents' }}>
				<Tab value="overview" label="Overview" />
				<Tab value="settings" label="Settings" />
			</div>
		</TabBar>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const first = canvas.getByRole('tab', { name: 'Overview' });
		first.focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(canvas.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
	},
};
function ResizingTabs() {
	const [width, setWidth] = useState(400);
	return (
		<>
			<button type="button" onClick={() => setWidth(600)}>
				Resize bar
			</button>
			<TabBar
				tabBarName="Project views"
				width={width}
				tabWidth="fill"
				options={options}
				defaultValue="overview"
				transition={{ duration: 0 }}
			/>
		</>
	);
}
export const Resizing: Story = {
	tags: ['tests'],
	render: () => <ResizingTabs />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('tab', { name: 'Settings' }));
		await userEvent.click(canvas.getByRole('button', { name: 'Resize bar' }));
		await waitFor(() => {
			const target = canvas.getByRole('tab', { name: 'Settings' });
			const line = canvas.getByRole('tablist').querySelector('[class*="indicator"]');
			if (!line) throw new Error('Missing indicator');
			expect(Math.abs(line.getBoundingClientRect().width - target.getBoundingClientRect().width)).toBeLessThan(1);
			expect(Math.abs(line.getBoundingClientRect().left - target.getBoundingClientRect().left)).toBeLessThan(1);
			expect(target.getBoundingClientRect().width).toBeCloseTo((600 - 16) / 3, 0);
		});
	},
};
let motionPreference: ReturnType<typeof installReducedMotionPreference>;
export const LiveReducedMotion: Story = {
	tags: ['tests'],
	args: { tabWidth: 'compact', transition: { duration: 4, delay: 1, repeat: Number.POSITIVE_INFINITY } },
	beforeEach: () => {
		motionPreference = installReducedMotionPreference(false);
		return () => motionPreference.restore();
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const target = canvas.getByRole('tab', { name: 'Settings' });
		await userEvent.click(target);
		motionPreference.set(true);
		await waitFor(() => {
			const line = canvas.getByRole('tablist').querySelector('[class*="indicator"]');
			if (!line) throw new Error('Missing indicator');
			expect(Math.abs(line.getBoundingClientRect().width - target.getBoundingClientRect().width)).toBeLessThan(1);
			expect(Math.abs(line.getBoundingClientRect().left - target.getBoundingClientRect().left)).toBeLessThan(1);
		});
		expect(target).toHaveFocus();
	},
};
export const MovingIndicator: Story = {
	tags: ['tests'],
	args: { tabWidth: 'compact', transition: { duration: 0.4, ease: 'linear' } },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const first = canvas.getByRole('tab', { name: 'Overview' });
		const target = canvas.getByRole('tab', { name: 'Recent activity 12' });
		const line = canvas.getByRole('tablist').querySelector('[class*="indicator"]');
		if (!line) throw new Error('Missing indicator');
		const start = line.getBoundingClientRect();
		await userEvent.click(target);
		await waitFor(
			() => {
				const current = line.getBoundingClientRect();
				expect(current.left).toBeGreaterThan(start.left + 1);
				expect(current.left).toBeLessThan(target.getBoundingClientRect().left - 1);
				expect(current.width).toBeGreaterThan(start.width);
			},
			{ interval: 10 },
		);
		await waitFor(() =>
			expect(Math.abs(line.getBoundingClientRect().left - target.getBoundingClientRect().left)).toBeLessThan(1),
		);
		expect(first).toHaveAttribute('aria-selected', 'false');
	},
};

export const ContentSizing: Story = {
	tags: ['tests'],
	args: { width: 700 },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const overview = canvas.getByRole('tab', { name: 'Overview' });
		const activity = canvas.getByRole('tab', { name: 'Recent activity 12' });
		const before = overview.getBoundingClientRect();
		const weight = getComputedStyle(overview).fontWeight;
		expect(activity.getBoundingClientRect().width).toBeGreaterThan(before.width);
		await userEvent.click(activity);
		expect(getComputedStyle(overview).fontWeight).toBe(weight);
		expect(getComputedStyle(activity).fontWeight).toBe(weight);
		expect(overview.getBoundingClientRect().width).toBe(before.width);
		await userEvent.click(overview);
		expect(overview.getBoundingClientRect().width).toBe(before.width);
	},
};
export const ClippedContent: Story = {
	tags: ['tests'],
	args: {
		width: 180,
		tabWidth: 'fill',
		options: [
			{ value: 'overview', label: 'Overview', icon: 'home' },
			{ value: 'activity', label: 'Recent activity', count: 12, icon: 'home' },
		],
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const tab of canvas.getAllByRole('tab')) {
			expect(getComputedStyle(tab).overflow).toBe('hidden');
			expect(tab.getBoundingClientRect().width).toBeCloseTo((180 - 8) / 2, 0);
		}
		const activity = canvas.getByRole('tab', { name: 'Recent activity 12' });
		expect(activity.scrollWidth).toBeGreaterThan(activity.clientWidth);
		await userEvent.click(activity);
		expect(activity).toHaveAttribute('aria-selected', 'true');
	},
};

export const AccessibleGroupName: Story = {
	tags: ['tests'],
	args: { tabBarName: '  Project navigation  ' },
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByRole('tablist', { name: 'Project navigation' })).toBeInTheDocument();
	},
};
export const FallbackGroupName: Story = {
	tags: ['tests'],
	args: { tabBarName: undefined },
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByRole('tablist', { name: 'Tabs' })).toBeInTheDocument();
	},
};
export const ManagedAria: Story = {
	tags: ['tests'],
	render: (args) => {
		// Simulate attributes arriving from untyped JavaScript consumers.
		const raw = { 'aria-label': 'Override', 'aria-labelledby': 'external-heading', 'aria-hidden': true };
		return (
			<TabBar {...args} {...raw} tabBarName="   ">
				<Tab {...raw} value="overview" label="Overview" panelId="overview-panel" />
				<Tab value="settings" label="Settings" />
			</TabBar>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const list = canvas.getByRole('tablist', { name: 'Tabs' });
		expect(list).not.toHaveAttribute('aria-labelledby');
		expect(list).not.toHaveAttribute('aria-hidden');
		const tab = canvas.getByRole('tab', { name: 'Overview' });
		expect(tab).not.toHaveAttribute('aria-label');
		expect(tab).not.toHaveAttribute('aria-labelledby');
		expect(tab).not.toHaveAttribute('aria-hidden');
		expect(tab).toHaveAttribute('aria-controls', 'overview-panel');
		expect(tab).toHaveAttribute('aria-selected', 'true');
	},
};
