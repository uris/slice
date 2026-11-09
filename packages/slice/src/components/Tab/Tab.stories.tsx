import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { TabBar } from '../TabBar';
import { Tab } from './Tab';

const tooltip = fn();
const meta = {
	title: 'Components/Tab',
	component: Tab,
	args: { value: 'details', label: 'Details', disabled: false, onClick: fn() },
	render: (args) => (
		<TabBar tabBarName="Project views" defaultValue="overview" width={360} onToolTip={tooltip}>
			<Tab value="overview" label="Overview" />
			<Tab {...args} />
		</TabBar>
	),
} satisfies Meta<typeof Tab>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const tab = canvas.getByRole('tab', { name: 'Details' });
		await userEvent.click(tab);
		expect(tab).toHaveAttribute('aria-selected', 'true');
		expect(args.onClick).toHaveBeenCalledOnce();
		expect(canvas.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'false');
	},
};
export const IconAndCount: Story = {
	args: { icon: 'basic.home', count: 12 },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('tab', { name: 'Details 12' })).toBeInTheDocument();
		expect(canvas.queryByRole('img')).not.toBeInTheDocument();
	},
};
export const CustomContent: Story = {
	args: {
		label: undefined,
		children: (
			<span>
				Details <em>Live</em>
			</span>
		),
	},
	play: async ({ canvasElement }) => {
		expect(within(canvasElement).getByRole('tab', { name: 'Details Live' })).toBeInTheDocument();
	},
};
export const Disabled: Story = {
	tags: ['tests'],
	args: { disabled: true },
	play: async ({ canvasElement, args }) => {
		const tab = within(canvasElement).getByRole('tab', { name: 'Details' });
		expect(tab).toBeDisabled();
		await userEvent.click(tab);
		expect(args.onClick).not.toHaveBeenCalled();
		expect(tab).toHaveAttribute('aria-selected', 'false');
	},
};
export const CancelledClick: Story = {
	tags: ['tests'],
	args: { onClick: fn((event) => event.preventDefault()) },
	play: async ({ canvasElement, args }) => {
		const tab = within(canvasElement).getByRole('tab', { name: 'Details' });
		await userEvent.click(tab);
		expect(args.onClick).toHaveBeenCalledOnce();
		expect(tab).toHaveAttribute('aria-selected', 'false');
	},
};
export const Tooltip: Story = {
	tags: ['tests'],
	args: { toolTip: 'View details' },
	play: async ({ canvasElement }) => {
		const tab = within(canvasElement).getByRole('tab', { name: 'Details' });
		await userEvent.hover(tab);
		expect(tooltip).toHaveBeenLastCalledWith(expect.objectContaining({ payload: { label: 'View details' } }));
		await userEvent.unhover(tab);
		expect(tooltip).toHaveBeenLastCalledWith(null);
	},
};
export const LabelPriority: Story = {
	tags: ['tests'],
	args: { children: 'Hidden child' },
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('tab', { name: 'Details' })).toBeInTheDocument();
		expect(canvas.queryByText('Hidden child')).not.toBeInTheDocument();
	},
};
export const PanelRelationship: Story = {
	tags: ['tests'],
	args: { id: 'details-tab', panelId: 'details-panel' },
	render: (args) => (
		<>
			<TabBar tabBarName="Project views" defaultValue="details">
				<Tab {...args} />
			</TabBar>
			<div id="details-panel" role="tabpanel" aria-labelledby="details-tab">
				Details content
			</div>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		expect(canvas.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-controls', 'details-panel');
		expect(canvas.getByRole('tabpanel', { name: 'Details' })).toBeInTheDocument();
	},
};

export const IconSizeOverride: Story = {
	tags: ['tests'],
	render: () => (
		<>
			<TabBar
				iconSize={28}
				options={[
					{ value: 'inherit', label: 'Inherited', icon: 'basic.home' },
					{ value: 'override', label: 'Override', icon: 'basic.home', iconSize: 36 },
				]}
			/>
			<TabBar iconSize={24}>
				<Tab value="child" label="Child" icon="basic.home" iconSize={32} />
			</TabBar>
		</>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		for (const [name, size] of [
			['Inherited', 28],
			['Override', 36],
			['Child', 32],
		] as const) {
			const svg = canvas.getByRole('tab', { name }).querySelector('svg');
			await expect(svg).toBeVisible();
			await expect(svg?.getBoundingClientRect().width).toBe(size);
			await expect(svg?.getBoundingClientRect().height).toBe(size);
		}
	},
};
