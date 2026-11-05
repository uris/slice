import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { installReducedMotionPreference } from '../playHelpers';
import { Overlay } from './Overlay';
import type { OverlayProps } from './_types';

function MenuDemo(args: OverlayProps) {
	const [show, setShow] = useState(args.show ?? true);
	useEffect(() => setShow(args.show ?? true), [args.show]);
	return (
		<div style={{ position: 'relative', transform: 'translateZ(0)', width: 480, maxWidth: '100%', height: 280 }}>
			<Button label="Show overlay" onClick={() => setShow(true)} />
			<Overlay
				{...args}
				show={show}
				data-testid="overlay"
				onPointerDown={(event) => {
					args.onPointerDown?.(event);
					if (!event.defaultPrevented) setShow(false);
				}}
			>
				<div
					role="group"
					aria-label="Project actions"
					onPointerDown={(event) => event.stopPropagation()}
					onClick={(event) => event.stopPropagation()}
					onKeyDown={(event) => {
						if (event.key === 'Escape') setShow(false);
					}}
					style={{
						position: 'absolute',
						top: 48,
						left: 24,
						width: 220,
						padding: 'var(--spacing-s)',
						borderRadius: 8,
						background: 'var(--core-surface-secondary)',
						border: '1px solid var(--core-outline-primary)',
					}}
				>
					<Button label="Rename project" size="small" variant="text" width="100%" />
					<Button label="Duplicate project" size="small" variant="text" width="100%" />
				</div>
			</Overlay>
		</div>
	);
}
const meta = {
	title: 'Components/Overlay',
	component: Overlay,
	args: {
		show: true,
		position: 'fixed',
		pointerEvents: 'auto',
		opacity: 0,
		backgroundColor: 'rgb(0,0,0)',
		transition: { duration: 0 },
	},
	argTypes: {
		position: { control: 'select', options: ['fixed', 'absolute'] },
		pointerEvents: { control: 'select', options: ['auto', 'none'] },
		opacity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
		backgroundColor: { control: 'text' },
		transition: { control: 'object' },
		motionValues: { control: 'object' },
	},
} satisfies Meta<typeof Overlay>;
export default meta;
type Story = StoryObj<typeof meta>;
const layer = (root: HTMLElement) => within(root).getByTestId('overlay');
const backdrop = (root: HTMLElement) => layer(root).querySelector('[data-overlay-backdrop]') as HTMLElement;
export const Default: Story = { args: { transition: undefined }, render: (args) => <MenuDemo {...args} /> };
export const ClearCapturesPointers: Story = {
	tags: ['tests'],
	args: { onPointerDown: fn(), onClick: fn() },
	render: (args) => (
		<>
			<button type="button" data-testid="behind">
				Background action
			</button>
			<Overlay {...args} data-testid="overlay" />
		</>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const root = layer(canvasElement);
		const button = canvas.getByTestId('behind');
		const bounds = button.getBoundingClientRect();
		const hit = root.ownerDocument.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
		await expect(hit).toBe(root);
		await expect(getComputedStyle(root).pointerEvents).toBe('auto');
		await waitFor(() => expect(getComputedStyle(backdrop(canvasElement)).opacity).toBe('0'));
		await userEvent.click(hit as HTMLElement);
		await expect(args.onPointerDown).toHaveBeenCalledTimes(1);
		await expect(args.onClick).toHaveBeenCalledTimes(1);
	},
};
export const ChildrenStayOpaque: Story = {
	tags: ['tests'],
	args: { opacity: 0.7, backgroundColor: '#123456', style: { pointerEvents: 'none' } },
	render: (args) => (
		<Overlay {...args} data-testid="overlay">
			<button type="button">Menu action</button>
		</Overlay>
	),
	play: async ({ canvasElement }) => {
		const root = layer(canvasElement);
		await waitFor(() => expect(getComputedStyle(backdrop(canvasElement)).opacity).toBe('0.7'));
		await expect(getComputedStyle(root).opacity).toBe('1');
		await expect(getComputedStyle(root).pointerEvents).toBe('auto');
		await expect(getComputedStyle(within(canvasElement).getByRole('button', { name: 'Menu action' })).opacity).toBe(
			'1',
		);
		await expect(getComputedStyle(backdrop(canvasElement)).backgroundColor).toBe('rgb(18, 52, 86)');
		await expect(backdrop(canvasElement)).toHaveAttribute('aria-hidden', 'true');
		await expect(getComputedStyle(backdrop(canvasElement)).pointerEvents).toBe('none');
	},
};
export const StoppedChildEvents: Story = {
	tags: ['tests'],
	args: { onPointerDown: fn(), onClick: fn() },
	render: (args) => (
		<Overlay {...args} data-testid="overlay">
			<div
				onPointerDown={(event) => event.stopPropagation()}
				onClick={(event) => event.stopPropagation()}
				onKeyDown={(event) => event.stopPropagation()}
			>
				<button type="button">Menu action</button>
			</div>
		</Overlay>
	),
	play: async ({ canvasElement, args }) => {
		await userEvent.click(within(canvasElement).getByRole('button', { name: 'Menu action' }));
		await expect(args.onPointerDown).not.toHaveBeenCalled();
		await expect(args.onClick).not.toHaveBeenCalled();
	},
};
export const PointerAndClickAreSeparate: Story = {
	tags: ['tests'],
	args: { onPointerDown: fn(), onClick: fn() },
	render: (args) => (
		<Overlay {...args} data-testid="overlay">
			<button type="button" onPointerDown={(event) => event.stopPropagation()}>
				Menu action
			</button>
		</Overlay>
	),
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Menu action' });
		await userEvent.click(button);
		await expect(args.onPointerDown).not.toHaveBeenCalled();
		await expect(args.onClick).toHaveBeenCalledTimes(1);
		await expect(args.onClick).toHaveBeenCalledWith(expect.objectContaining({ target: button }));
	},
};
export const BubblingChildEvents: Story = {
	tags: ['tests'],
	args: { onPointerDown: fn(), onClick: fn() },
	render: (args) => (
		<Overlay {...args} data-testid="overlay">
			<button type="button">Menu action</button>
		</Overlay>
	),
	play: async ({ canvasElement, args }) => {
		const button = within(canvasElement).getByRole('button', { name: 'Menu action' });
		await userEvent.click(button);
		await expect(args.onPointerDown).toHaveBeenCalledTimes(1);
		await expect(args.onClick).toHaveBeenCalledWith(expect.objectContaining({ target: button, type: 'click' }));
	},
};
export const NativeContextMenu: Story = {
	tags: ['tests'],
	render: (args) => <Overlay {...args} data-testid="overlay" />,
	play: async ({ canvasElement }) => {
		await expect(fireEvent.contextMenu(layer(canvasElement))).toBe(true);
	},
};
export const PreventedContextMenu: Story = {
	tags: ['tests'],
	args: { onContextMenu: fn((event) => event.preventDefault()) },
	render: NativeContextMenu.render,
	play: async ({ canvasElement, args }) => {
		await expect(fireEvent.contextMenu(layer(canvasElement))).toBe(false);
		await expect(args.onContextMenu).toHaveBeenCalledTimes(1);
	},
};
export const ControlledDismissal: Story = {
	tags: ['tests'],
	render: (args) => <MenuDemo {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Rename project' }));
		await expect(layer(canvasElement)).toBeInTheDocument();
		await userEvent.click(layer(canvasElement));
		await waitFor(() => expect(canvas.queryByTestId('overlay')).toBeNull());
		await userEvent.click(canvas.getByRole('button', { name: 'Show overlay' }));
		await expect(layer(canvasElement)).toBeInTheDocument();
	},
};
export const Hidden: Story = {
	tags: ['tests'],
	args: { show: false },
	render: NativeContextMenu.render,
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).queryByTestId('overlay')).toBeNull();
	},
};
export const OpacityBounds: Story = {
	tags: ['tests'],
	render: (args) => (
		<>
			<Overlay {...args} opacity={3} data-testid="high" />
			<Overlay {...args} opacity={-1} data-testid="low" />
			<Overlay {...args} opacity={Number.NaN} data-testid="invalid" />
		</>
	),
	play: async ({ canvasElement }) => {
		for (const [id, value] of [
			['high', '1'],
			['low', '0'],
			['invalid', '0'],
		]) {
			const node = within(canvasElement).getByTestId(id).querySelector('[data-overlay-backdrop]') as HTMLElement;
			await waitFor(() => expect(getComputedStyle(node).opacity).toBe(value));
		}
	},
};
export const CustomMotion: Story = {
	tags: ['tests'],
	args: { opacity: 0.5, motionValues: { initial: { x: -8 }, animate: { x: 6 }, exit: { x: 8 } } },
	render: NativeContextMenu.render,
	play: async ({ canvasElement }) => {
		await waitFor(() => expect(new DOMMatrix(getComputedStyle(backdrop(canvasElement)).transform).m41).toBe(6));
		await expect(getComputedStyle(backdrop(canvasElement)).opacity).toBe('0.5');
		await expect(getComputedStyle(layer(canvasElement)).transform).toBe('none');
	},
};
function ToggleLayer(args: OverlayProps) {
	const [show, setShow] = useState(false);
	return (
		<>
			<button type="button" onClick={() => setShow(true)}>
				Open
			</button>
			<Overlay {...args} show={show} data-testid="overlay" onClick={() => setShow(false)}>
				<button type="button">Foreground action</button>
			</Overlay>
		</>
	);
}
export const ExitStillIntercepts: Story = {
	tags: ['tests'],
	args: { opacity: 0.7, transition: { duration: 0.2 } },
	render: (args) => <ToggleLayer {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
		await waitFor(() => expect(getComputedStyle(backdrop(canvasElement)).opacity).toBe('0.7'));
		const root = layer(canvasElement);
		await userEvent.click(root);
		await expect(root).toBeInTheDocument();
		await expect(getComputedStyle(root).pointerEvents).toBe('auto');
		await waitFor(() => expect(canvas.queryByTestId('overlay')).toBeNull());
	},
};
let motionPreference: ReturnType<typeof installReducedMotionPreference>;
export const LiveReducedMotion: Story = {
	tags: ['tests'],
	args: {
		opacity: 0.7,
		transition: { duration: 4, delay: 1, repeat: Number.POSITIVE_INFINITY },
		motionValues: { initial: { x: 200 }, animate: { x: 100, opacity: 0.1 } },
	},
	beforeEach: () => {
		motionPreference = installReducedMotionPreference(false);
		return () => motionPreference.restore();
	},
	render: (args) => <ToggleLayer {...args} />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await userEvent.click(canvas.getByRole('button', { name: 'Open' }));
		const foreground = canvas.getByRole('button', { name: 'Foreground action' });
		foreground.focus();
		motionPreference.set(true);
		await waitFor(() => expect(getComputedStyle(backdrop(canvasElement)).opacity).toBe('0.7'));
		await expect(getComputedStyle(backdrop(canvasElement)).transform).toBe('none');
		await expect(foreground).toHaveFocus();
		await expect(canvas.getByRole('button', { name: 'Foreground action' })).toBe(foreground);
		motionPreference.set(false);
		await userEvent.click(layer(canvasElement));
		motionPreference.set(true);
		await waitFor(() => expect(canvas.queryByTestId('overlay')).toBeNull());
	},
};

export const ContainerPosition: Story = {
	tags: ['tests'],
	render: (args) => (
		<div data-testid="container" style={{ position: 'relative', width: 240, height: 140 }}>
			<Overlay {...args} position="absolute" data-testid="overlay" />
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const root = layer(canvasElement);
		await expect(getComputedStyle(root).position).toBe('absolute');
		const container = canvas.getByTestId('container').getBoundingClientRect();
		const bounds = root.getBoundingClientRect();
		await expect(bounds.width).toBe(container.width);
		await expect(bounds.height).toBe(container.height);
		await expect(bounds.left).toBe(container.left);
		await expect(bounds.top).toBe(container.top);
	},
};
export const PointerPassThrough: Story = {
	tags: ['tests'],
	args: { onPointerDown: fn(), onClick: fn() },
	render: (args) => (
		<>
			<button type="button" data-testid="behind" onClick={fn()}>
				Background action
			</button>
			<Overlay {...args} pointerEvents="none" data-testid="overlay">
				<button type="button" style={{ pointerEvents: 'auto' }}>
					Foreground action
				</button>
			</Overlay>
		</>
	),
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const root = layer(canvasElement);
		const button = canvas.getByTestId('behind');
		const bounds = button.getBoundingClientRect();
		await expect(getComputedStyle(root).position).toBe('fixed');
		await expect(getComputedStyle(root).pointerEvents).toBe('none');
		await expect(getComputedStyle(canvas.getByRole('button', { name: 'Foreground action' })).pointerEvents).toBe(
			'none',
		);
		await expect(
			root.ownerDocument.elementFromPoint(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2),
		).toBe(button);
		await userEvent.click(button);
		await expect(args.onClick).not.toHaveBeenCalled();
		await expect(args.onPointerDown).not.toHaveBeenCalled();
	},
};
