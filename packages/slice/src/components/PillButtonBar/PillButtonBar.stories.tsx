import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Tab } from '../Tab';
import css from '../TabBar/TabBar.module.css';
import { installReducedMotionPreference } from '../playHelpers';
import { PillButtonBar } from './PillButtonBar';
import type { PillButtonBarProps } from './_types';

function ProjectViews(props: PillButtonBarProps) {
	const id = useId();
	const [value, setValue] = useState('overview');
	return (
		<>
			<PillButtonBar {...props} tabBarName="Project views" value={value} onChange={setValue}>
				<Tab value="overview" label="Overview" id={`${id}-overview`} panelId={`${id}-overview-panel`} />
				<Tab value="activity" label="Activity" disabled />
				<Tab value="settings" label="Settings" id={`${id}-settings`} panelId={`${id}-settings-panel`} />
			</PillButtonBar>
			<div role="tabpanel" id={`${id}-overview-panel`} aria-labelledby={`${id}-overview`} hidden={value !== 'overview'}>
				Project summary
			</div>
			<div role="tabpanel" id={`${id}-settings-panel`} aria-labelledby={`${id}-settings`} hidden={value !== 'settings'}>
				Project settings
			</div>
		</>
	);
}

const meta = {
	title: 'Components/PillButtonBar',
	component: PillButtonBar<string>,
} satisfies Meta<typeof PillButtonBar<string>>;
export default meta;
type Story = StoryObj<typeof meta>;

function expectPillOverTab(list: HTMLElement, tab: HTMLElement) {
	const indicator = list.querySelector(`.${css.pillIndicator}`);
	if (!indicator) throw new Error('Missing selection pill');
	const pill = indicator.getBoundingClientRect();
	const target = tab.getBoundingClientRect();
	expect(Math.abs(pill.left - target.left)).toBeLessThan(1);
	expect(Math.abs(pill.width - target.width)).toBeLessThan(1);
	expect(Math.abs(pill.top - target.top)).toBeLessThan(1);
	expect(Math.abs(pill.height - target.height)).toBeLessThan(1);
}

export const Default: Story = {
	args: { pillInset: 4, borderWidth: 2, pillBorderWidth: 1, pillElevation: 2, tabGap: 6 },
	render: (args) => (
		<div style={{ width: 400 }}>
			<ProjectViews {...args} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const list = canvas.getByRole('tablist', { name: 'Project views' });
		const overview = canvas.getByRole('tab', { name: 'Overview' });
		const settings = canvas.getByRole('tab', { name: 'Settings' });
		await expect(canvas.getByRole('tab', { name: 'Activity' })).toBeDisabled();
		await expect(list).toHaveStyle({ padding: '4px', borderTopWidth: '2px' });
		await expect(overview).toHaveStyle({ padding: '1px 8px' });
		await expect(list.offsetHeight).toBe(overview.offsetHeight + 12);
		await expect(list.querySelector(`.${css.pillIndicator}`)).toHaveStyle({ borderTopWidth: '1px' });
		await waitFor(() => expectPillOverTab(list, overview));
		const tabWidth = canvas.getAllByRole('tab').reduce((total, tab) => total + tab.getBoundingClientRect().width, 0);
		const trackWidth = list.getBoundingClientRect().width;
		await expect(trackWidth).toBeLessThan(400);
		await expect(trackWidth - tabWidth).toBeCloseTo(24, 0);
		overview.focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect(settings).toHaveFocus();
		await expect(settings).toHaveAttribute('aria-selected', 'true');
		await expect(canvas.getByRole('tabpanel', { name: 'Settings' })).toBeVisible();
		await waitFor(() => expectPillOverTab(list, settings));
	},
};

export const ReducedMotion: Story = {
	tags: ['tests'],
	args: {
		options: [
			{ value: 'day', label: 'Day' },
			{ value: 'week', label: 'Week', icon: 'time.calendar-dates' },
		],
		defaultValue: 'day',
		height: 48,
		transition: { delay: 5, duration: 5 },
	},
	beforeEach: () => {
		const preference = installReducedMotionPreference(true);
		return () => preference.restore();
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const week = canvas.getByRole('tab', { name: 'Week' });
		const list = canvas.getByRole('tablist');
		await expect(list.offsetHeight).toBe(48);
		await expect(list).toHaveStyle({ padding: '4px', gap: '4px', borderTopWidth: '1px' });
		await expect(week.querySelector('svg')?.parentElement).toHaveStyle({ width: '18px', height: '18px' });
		await userEvent.click(week);
		await expect(week).toHaveAttribute('aria-selected', 'true');
		await waitFor(() => expectPillOverTab(canvas.getByRole('tablist'), week));
	},
};
