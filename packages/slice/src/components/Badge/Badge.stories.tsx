import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Badge, type BadgeProps } from 'src/components/Badge';
import { expect, fn, userEvent, within } from 'storybook/test';

const meta: Meta<typeof Badge> = {
	title: 'Components/Badge',
	component: Badge,
	args: { count: 5 },
	render: (args) => <Badge {...args} />,
};
export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
	play: async ({ canvasElement }) => {
		const badge = within(canvasElement).getByRole('status');
		await expect(badge).toHaveTextContent('5');
		await expect(badge).toHaveAttribute('aria-live', 'polite');
		await expect(badge).toHaveAttribute('aria-atomic', 'true');
	},
};

function hiddenBadge(count: BadgeProps['count']): Story {
	return {
		tags: ['tests'],
		args: { count },
		play: async ({ canvasElement }) => {
			await expect(within(canvasElement).queryByRole('status')).toBeNull();
		},
	};
}

export const HiddenZero = hiddenBadge(0);
export const MissingCount = hiddenBadge(undefined);
export const NullCount = hiddenBadge(null);
export const EmptyLabel = hiddenBadge('');
export const WhitespaceLabel = hiddenBadge('   ');

export const VisibleZero: Story = {
	tags: ['tests'],
	args: { count: 0, hideZero: false },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('status')).toHaveTextContent('0');
	},
};

export const ExactLimit: Story = {
	tags: ['tests'],
	args: { count: 99 },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('status')).toHaveTextContent('99');
	},
};

export const CappedCount: Story = {
	tags: ['tests'],
	args: { count: 100, 'aria-label': '100 unread messages' },
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByRole('status', { name: '100 unread messages' })).toHaveTextContent('99+');
	},
};

export const StringLabels: Story = {
	tags: ['tests'],
	render: () => (
		<>
			<Badge count="New" />
			<Badge count="120" />
			<Badge count="0" />
		</>
	),
	play: async ({ canvasElement }) => {
		const badges = within(canvasElement).getAllByRole('status');
		await expect(badges[0]).toHaveTextContent('New');
		await expect(badges[1]).toHaveTextContent('120');
		await expect(badges[2]).toHaveTextContent('0');
	},
};

export const NonFiniteCounts: Story = {
	tags: ['tests'],
	render: () => (
		<>
			<Badge count={Number.NaN} />
			<Badge count={Number.POSITIVE_INFINITY} />
			<Badge count={Number.NEGATIVE_INFINITY} />
		</>
	),
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).queryByRole('status')).toBeNull();
	},
};

export const LightVariant: Story = {
	tags: ['tests'],
	args: { variant: 'light' },
	play: async ({ canvasElement }) => {
		const badge = within(canvasElement).getByRole('status');
		await expect(badge.style.getPropertyValue('--badge-color')).toBe('var(--core-text-primary)');
		await expect(badge.style.getPropertyValue('--badge-bg')).toBe('var(--core-badge-secondary)');
		await expect(getComputedStyle(badge).minWidth).toBe('24px');
		await expect(getComputedStyle(badge).paddingInlineStart).toBe('6px');
		await expect(getComputedStyle(badge).paddingInlineEnd).toBe('6px');
		await expect(getComputedStyle(badge).paddingTop).toBe('2px');
		await expect(getComputedStyle(badge).paddingBottom).toBe('2px');
	},
};

export const NativeAttributesAndEvents: Story = {
	tags: ['tests'],
	args: { id: 'unread-badge', className: 'custom-badge', style: { margin: 8 }, 'aria-live': 'off', onClick: fn() },
	play: async ({ canvasElement, args }) => {
		const badge = within(canvasElement).getByRole('status');
		await expect(badge).toHaveAttribute('id', 'unread-badge');
		await expect(badge).toHaveAttribute('aria-live', 'off');
		await expect(badge).toHaveClass('custom-badge');
		await expect(badge).toHaveStyle({ margin: '8px' });
		await userEvent.click(badge);
		await expect(args.onClick).toHaveBeenCalledWith(expect.objectContaining({ type: 'click' }));
		await expect(badge).not.toHaveAttribute('tabindex');
	},
};

export const UpdatedCount: Story = {
	tags: ['tests'],
	render: function CountExample(args) {
		const [count, setCount] = useState(0);
		return (
			<>
				<Badge {...args} count={count} hideZero={false} />
				<button type="button" onClick={() => setCount(120)}>
					Update count
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const badge = canvas.getByRole('status');
		await expect(badge).toHaveTextContent('0');
		await userEvent.click(canvas.getByRole('button', { name: 'Update count' }));
		await expect(canvas.getByRole('status')).toBe(badge);
		await expect(badge).toHaveTextContent('99+');
	},
};

export const CustomColors: Story = {
	tags: ['tests'],
	args: { backgroundColor: '#2563eb', textColor: '#ffffff' },
	play: async ({ canvasElement }) => {
		const badge = within(canvasElement).getByRole('status');
		await expect(getComputedStyle(badge).backgroundColor).toBe('rgb(37, 99, 235)');
		await expect(getComputedStyle(badge).color).toBe('rgb(255, 255, 255)');
		await expect(badge).not.toHaveAttribute('backgroundColor');
		await expect(badge).not.toHaveAttribute('textColor');
	},
};

export const ThemeColorOverrides: Story = {
	tags: ['tests'],
	args: { backgroundColor: 'array-cyan-accent', textColor: 'core-text-dark' },
	play: async ({ canvasElement }) => {
		const badge = within(canvasElement).getByRole('status');
		await expect(badge.style.getPropertyValue('--badge-bg')).toBe('var(--array-cyan-accent)');
		await expect(badge.style.getPropertyValue('--badge-color')).toBe('var(--core-text-dark)');
	},
};

export const BackgroundOnlyOverride: Story = {
	tags: ['tests'],
	args: { variant: 'light', backgroundColor: '#2563eb' },
	play: async ({ canvasElement }) => {
		const badge = within(canvasElement).getByRole('status');
		await expect(badge.style.getPropertyValue('--badge-bg')).toBe('#2563eb');
		await expect(badge.style.getPropertyValue('--badge-color')).toBe('var(--core-text-primary)');
	},
};

export const TextOnlyOverride: Story = {
	tags: ['tests'],
	args: { textColor: '#ffffff' },
	play: async ({ canvasElement }) => {
		const badge = within(canvasElement).getByRole('status');
		await expect(badge.style.getPropertyValue('--badge-color')).toBe('#ffffff');
		await expect(badge.style.getPropertyValue('--badge-bg')).toBe('var(--core-badge-primary)');
	},
};

export const UpdatedColorOverrides: Story = {
	tags: ['tests'],
	render: function ColorsExample(args) {
		const [variant, setVariant] = useState<'dark' | 'light'>('light');
		const [backgroundColor, setBackgroundColor] = useState<string | undefined>('#2563eb');
		return (
			<>
				<Badge {...args} variant={variant} backgroundColor={backgroundColor} />
				<button type="button" onClick={() => setVariant('dark')}>
					Change variant
				</button>
				<button type="button" onClick={() => setBackgroundColor(undefined)}>
					Use preset
				</button>
			</>
		);
	},
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const badge = canvas.getByRole('status');
		await expect(badge.style.getPropertyValue('--badge-color')).toBe('var(--core-text-primary)');
		await userEvent.click(canvas.getByRole('button', { name: 'Change variant' }));
		await expect(badge.style.getPropertyValue('--badge-bg')).toBe('#2563eb');
		await expect(badge.style.getPropertyValue('--badge-color')).toBe('var(--core-text-light)');
		await userEvent.click(canvas.getByRole('button', { name: 'Use preset' }));
		await expect(badge.style.getPropertyValue('--badge-bg')).toBe('var(--core-badge-primary)');
	},
};
