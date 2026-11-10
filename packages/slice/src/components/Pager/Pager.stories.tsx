import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FlexBox } from 'src/components/FlexBox/FlexBox';
import { Pager } from 'src/components/Pager/Pager';
import { runPagerPlay } from 'src/components/playHelpers';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

const meta: Meta<typeof Pager> = {
	title: 'Components/Pager',
	component: Pager,
	argTypes: {
		selectedIndex: { control: 'number' },
		defaultSelectedIndex: { control: 'number' },
		maxVisiblePages: { control: 'number' },
		showMoreOn: { control: 'number' },
		scale: { control: 'number' },
		scaleFactor: { control: { type: 'number', min: 0, max: 1, step: 0.05 } },
		minScale: { control: 'number' },
		opacityScales: { control: 'boolean' },
		transition: { control: 'object' },
	},
	args: {
		size: 10,
		defaultSelectedIndex: 0,
		color: 'var(--core-text-disabled)',
		colorHover: undefined,
		colorOn: undefined,
		pages: 2,
		gap: 8,
		onChange: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof Pager> = {
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<Pager {...args} />
			</FlexBox>
		);
	},
};

// **** TESTS ONLY **** //
export const DefaultTest: StoryObj<typeof Pager> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<Pager {...args} />
			</FlexBox>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runPagerPlay({ canvasElement, args });
	},
};

export const ConstrainedDots: StoryObj<typeof Pager> = {
	tags: ['tests'],
	render: () => (
		<div style={{ display: 'flex', alignItems: 'stretch', width: 4, fontSize: 32, lineHeight: '80px' }}>
			<Pager pages={3} size={5} />
		</div>
	),
	play: async ({ canvasElement }) => {
		const dots = canvasElement.querySelectorAll('button');
		await expect(dots).toHaveLength(3);
		const wrapper = dots[0].parentElement?.parentElement;
		if (!wrapper) throw new Error('Pager wrapper is missing');
		await expect(wrapper.getBoundingClientRect().width).toBe(31);
		await expect(getComputedStyle(wrapper).flex).toBe('0 0 auto');
		for (const dot of Array.from(dots)) {
			const rect = dot.getBoundingClientRect();
			await expect(rect.width).toBe(5);
			await expect(rect.height).toBe(5);
			await expect(getComputedStyle(dot).appearance).toBe('none');
		}
	},
};

export const ThemeColors: StoryObj<typeof Pager> = {
	args: { color: 'core-text-disabled', colorOn: 'core-text-primary', colorHover: 'core-text-special', pages: 3 },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const root = canvasElement.querySelector('[style*="--pager-size"]') as HTMLElement;
		await expect(root.style.getPropertyValue('--pager-color')).toBe('var(--core-text-disabled)');
		await expect(root.style.getPropertyValue('--pager-colorOn')).toBe('var(--core-text-primary)');
		await expect(root.style.getPropertyValue('--pager-colorHover')).toBe('var(--core-text-special)');
		const dots = root.querySelectorAll('button > span');
		const first = getComputedStyle(dots[0]).backgroundColor;
		await expect(first).not.toBe('rgba(0, 0, 0, 0)');
		await expect(first).not.toBe(getComputedStyle(dots[1]).backgroundColor);
	},
};

export const DistanceScaling: StoryObj<typeof Pager> = {
	args: { pages: 7, defaultSelectedIndex: 3, size: 12, scale: 1.5, scaleFactor: 0.7, minScale: 0.4 },
	render: Default.render,
};
const localChanged = fn();
const controlledChanged = fn();
export const SelectionSemantics: StoryObj<typeof Pager> = {
	tags: ['tests'],
	render: () => {
		const [selected, setSelected] = useState(1);
		return (
			<div style={{ display: 'grid', gap: 20 }}>
				<Pager aria-label="Local pages" pages={4} defaultSelectedIndex={1} onChange={localChanged} />
				<Pager
					aria-label="Controlled pages"
					pages={4}
					selectedIndex={selected}
					onChange={(index) => {
						controlledChanged(index);
						setSelected(index);
					}}
				/>
				<Pager aria-label="Fixed pages" pages={4} selectedIndex={0} />
				<button type="button" onClick={() => setSelected(0)}>
					Reset selection
				</button>
				<Pager aria-label="Empty pages" pages={0} />
				<Pager aria-label="Clamped pages" pages={3} selectedIndex={99} />
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		localChanged.mockClear();
		controlledChanged.mockClear();
		const c = within(canvasElement);
		const local = within(c.getByRole('group', { name: 'Local pages' }));
		const current = local.getByRole('button', { name: 'Page 2 of 4' });
		await expect(current).toHaveAttribute('aria-current', 'page');
		await userEvent.click(current);
		await expect(localChanged).not.toHaveBeenCalled();
		const third = local.getByRole('button', { name: 'Page 3 of 4' });
		await userEvent.click(third);
		await expect(localChanged).toHaveBeenCalledTimes(1);
		await expect(localChanged).toHaveBeenLastCalledWith(2);
		await userEvent.tab();
		const fourth = local.getByRole('button', { name: 'Page 4 of 4' });
		await expect(fourth).toHaveFocus();
		await userEvent.keyboard(' ');
		await expect(fourth).toHaveAttribute('aria-current', 'page');
		await expect(localChanged).toHaveBeenCalledTimes(2);
		current.focus();
		await userEvent.keyboard('{Enter}');
		await expect(localChanged).toHaveBeenCalledTimes(3);
		for (const button of local.getAllByRole('button')) await expect(button.tabIndex).toBe(0);
		const controlled = within(c.getByRole('group', { name: 'Controlled pages' }));
		await userEvent.click(controlled.getByRole('button', { name: 'Page 4 of 4' }));
		await expect(controlled.getByRole('button', { name: 'Page 4 of 4' })).toHaveAttribute('aria-current', 'page');
		await userEvent.click(c.getByRole('button', { name: 'Reset selection' }));
		await expect(controlled.getByRole('button', { name: 'Page 1 of 4' })).toHaveAttribute('aria-current', 'page');
		await expect(controlledChanged).toHaveBeenCalledTimes(1);
		const fixed = within(c.getByRole('group', { name: 'Fixed pages' }));
		await userEvent.click(fixed.getByRole('button', { name: 'Page 3 of 4' }));
		await expect(fixed.getByRole('button', { name: 'Page 1 of 4' })).toHaveAttribute('aria-current', 'page');
		await expect(within(c.getByRole('group', { name: 'Empty pages' })).queryAllByRole('button')).toHaveLength(0);
		await expect(
			within(c.getByRole('group', { name: 'Clamped pages' })).getByRole('button', { name: 'Page 3 of 3' }),
		).toHaveAttribute('aria-current', 'page');
	},
};

export const SlidingWindow: StoryObj<typeof Pager> = {
	args: { pages: 20, maxVisiblePages: 5, showMoreOn: 4, size: 12, scale: 1.2, scaleFactor: 0.8, minScale: 0.4 },
	render: Default.render,
};

const windowChanged = fn();
const externalChanged = fn();
export const WindowSemantics: StoryObj<typeof Pager> = {
	tags: ['tests'],
	render: () => {
		const [pages, setPages] = useState(1000000);
		return (
			<div style={{ display: 'grid', gap: 20 }}>
				<Pager aria-label="Window pages" pages={10} maxVisiblePages={5} showMoreOn={4} onChange={windowChanged} />
				<Pager
					aria-label="Large page set"
					pages={pages}
					selectedIndex={999999}
					maxVisiblePages={5}
					onChange={externalChanged}
				/>
				<button type="button" onClick={() => setPages(3)}>
					Reduce pages
				</button>
			</div>
		);
	},
	play: async ({ canvasElement }) => {
		windowChanged.mockClear();
		externalChanged.mockClear();
		const c = within(canvasElement);
		const group = c.getByRole('group', { name: 'Window pages' });
		const w = within(group);
		const names = () => w.getAllByRole('button').map((button) => button.getAttribute('aria-label'));
		await expect(names()).toEqual(['Page 1 of 10', 'Page 2 of 10', 'Page 3 of 10', 'Page 4 of 10', 'Page 5 of 10']);
		const fourth = w.getByRole('button', { name: 'Page 4 of 10' });
		await userEvent.click(fourth);
		await expect(fourth).toHaveFocus();
		await expect(names()).toEqual(['Page 2 of 10', 'Page 3 of 10', 'Page 4 of 10', 'Page 5 of 10', 'Page 6 of 10']);
		await userEvent.click(w.getByRole('button', { name: 'Page 5 of 10' }));
		await expect(names()).toEqual(['Page 3 of 10', 'Page 4 of 10', 'Page 5 of 10', 'Page 6 of 10', 'Page 7 of 10']);
		await userEvent.click(w.getByRole('button', { name: 'Page 4 of 10' }));
		await expect(names()).toEqual(['Page 2 of 10', 'Page 3 of 10', 'Page 4 of 10', 'Page 5 of 10', 'Page 6 of 10']);
		await expect(windowChanged).toHaveBeenCalledTimes(3);
		await waitFor(() => expect(group.querySelectorAll('button')).toHaveLength(5));
		const large = c.getByRole('group', { name: 'Large page set' });
		await expect(large.querySelectorAll('button')).toHaveLength(5);
		await expect(within(large).getByRole('button', { name: 'Page 1000000 of 1000000' })).toHaveAttribute(
			'aria-current',
			'page',
		);
		await userEvent.click(c.getByRole('button', { name: 'Reduce pages' }));
		await expect(within(large).getByRole('button', { name: 'Page 3 of 3' })).toHaveAttribute('aria-current', 'page');
		await waitFor(() => expect(large.querySelectorAll('button')).toHaveLength(3));
		await expect(externalChanged).not.toHaveBeenCalled();
	},
};

export const CenteredWindow: StoryObj<typeof Pager> = {
	args: { pages: 20, maxVisiblePages: 7, size: 12 },
	render: Default.render,
};

export const CenteredWindowTest: StoryObj<typeof Pager> = {
	tags: ['tests'],
	args: CenteredWindow.args,
	render: Default.render,
	play: async ({ canvasElement }) => {
		const group = within(canvasElement).getByRole('group', { name: 'Pages' });
		const c = within(group);
		await userEvent.click(c.getByRole('button', { name: 'Page 6 of 20' }));
		await expect(c.getAllByRole('button').map((button) => button.getAttribute('aria-label'))).toEqual([
			'Page 3 of 20',
			'Page 4 of 20',
			'Page 5 of 20',
			'Page 6 of 20',
			'Page 7 of 20',
			'Page 8 of 20',
			'Page 9 of 20',
		]);
		await expect(c.getAllByRole('button')[3]).toHaveAttribute('aria-current', 'page');
		await userEvent.click(c.getByRole('button', { name: 'Page 4 of 20' }));
		await expect(c.getAllByRole('button')[0]).toHaveAttribute('aria-label', 'Page 1 of 20');
		await expect(c.getAllByRole('button')[3]).toHaveAttribute('aria-current', 'page');
		for (const page of [7, 10, 13, 16, 19, 20]) {
			await userEvent.click(c.getByRole('button', { name: `Page ${page} of 20` }));
		}
		await waitFor(() => expect(group.querySelectorAll('button')).toHaveLength(7));
		await expect(c.getAllByRole('button')[0]).toHaveAttribute('aria-label', 'Page 14 of 20');
		await expect(c.getAllByRole('button')[6]).toHaveAttribute('aria-current', 'page');
	},
};

export const CustomTransition: StoryObj<typeof Pager> = {
	args: {
		pages: 20,
		maxVisiblePages: 5,
		transition: { duration: 0.6, delay: 0.15 },
		color: '#ff0000',
		colorOn: '#00ff00',
		colorHover: '#0000ff',
	},
	render: Default.render,
};

export const OpacityScaling: StoryObj<typeof Pager> = {
	args: { pages: 7, defaultSelectedIndex: 3, opacityScales: true },
	render: Default.render,
};
export const OpacityScalingTest: StoryObj<typeof Pager> = {
	tags: ['tests'],
	args: { pages: 5, opacityScales: true, scaleFactor: 0.5, transition: { duration: 0 } },
	render: Default.render,
	play: async ({ canvasElement }) => {
		const c = within(canvasElement);
		const first = c.getByRole('button', { name: 'Page 1 of 5' });
		const fourth = c.getByRole('button', { name: 'Page 4 of 5' });
		await expect(getComputedStyle(first.firstElementChild as Element).opacity).toBe('1');
		await expect(getComputedStyle(fourth.firstElementChild as Element).opacity).toBe('0.125');
		await userEvent.click(fourth);
		await waitFor(() => expect(getComputedStyle(fourth.firstElementChild as Element).opacity).toBe('1'));
		await expect(getComputedStyle(first.firstElementChild as Element).opacity).toBe('0.125');
		await expect(fourth).toHaveAttribute('aria-current', 'page');
	},
};
