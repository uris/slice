import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../Button';
import { installReducedMotionPreference } from '../playHelpers';
import { DraggablePanel, type DraggablePanelProps } from './DrggablePanel';

function Workspace(args: DraggablePanelProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [closed, setClosed] = useState(args.isClosed ?? false);
	return (
		<div
			style={{
				width: '100%',
				height: 320,
				display: 'flex',
				flexDirection: args.drags === 'left' ? 'row-reverse' : 'row',
				border: '1px solid var(--core-outline-primary)',
				borderRadius: 8,
			}}
			ref={containerRef}
		>
			<DraggablePanel
				{...args}
				containerRef={containerRef}
				isClosed={closed}
				resizeHandleLabel="Resize project sidebar"
			>
				<div style={{ padding: 20, display: 'grid', gap: 16 }}>
					<strong>Project workspace</strong>
					<span>Research</span>
					<span>Design explorations</span>
					<span>Release notes</span>
					<Button label="New project" variant="outline" />
				</div>
			</DraggablePanel>
			<div
				style={{
					flex: 1,
					minWidth: 0,
					padding: 24,
					display: 'flex',
					flexDirection: 'column',
					gap: 16,
					alignItems: 'flex-start',
				}}
			>
				<Button label={closed ? 'Open sidebar' : 'Close sidebar'} variant="text" onClick={() => setClosed(!closed)} />
				<strong>Room for your work</strong>
				<p>Resize the sidebar to keep your projects close and give the main canvas more space.</p>
			</div>
		</div>
	);
}
const meta = {
	title: 'Components/DraggablePanel',
	component: DraggablePanel,
	args: {
		isClosed: false,
		sizeConstraints: { initial: 250, min: 150, max: 400 },
		backgroundColor: 'core-surface-secondary',
		onResize: fn(),
		onResizeStart: fn(),
		onResizeEnd: fn(),
	},
	render: (args) => <Workspace {...args} />,
} satisfies Meta<typeof DraggablePanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const InitiallyClosed: Story = { args: { isClosed: true } };
export const LeftDragDirection: Story = { args: { drags: 'left' } };
export const NoDrag: Story = { args: { drags: false } };
export const TouchInteraction: Story = { args: { isTouchDevice: true } };
const PanelFixture = (args: DraggablePanelProps) => (
	<div style={{ width: 700, height: 200, display: 'flex' }}>
		<DraggablePanel {...args} data-testid="panel">
			<Button label="Inside panel" />
		</DraggablePanel>
	</div>
);
const fixture: Story['render'] = (args) => <PanelFixture {...args} />;
async function pointer(target: Element, type: string, x: number, extra: PointerEventInit = {}) {
	await fireEvent(
		target,
		new PointerEvent(type, {
			bubbles: true,
			cancelable: true,
			pointerId: 7,
			isPrimary: true,
			button: 0,
			clientX: x,
			...extra,
		}),
	);
}
export const PointerResize: Story = {
	tags: ['tests'],
	render: fixture,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const rail = canvas.getByRole('separator');
		const panel = canvas.getByTestId('panel');
		await pointer(rail, 'pointerdown', 250);
		await pointer(document.documentElement, 'pointermove', 300);
		await pointer(document.documentElement, 'pointerup', 300);
		await waitFor(() => expect(panel.getBoundingClientRect().width).toBe(300));
		await expect(args.onResizeStart).toHaveBeenCalledWith(expect.objectContaining({ divWidth: 250, deltaWidth: 0 }));
		await expect(args.onResize).toHaveBeenCalledWith(expect.objectContaining({ divWidth: 300, deltaWidth: 50 }));
		await expect(args.onResizeEnd).toHaveBeenCalledWith(expect.objectContaining({ divWidth: 300, deltaWidth: 0 }));
	},
};
export const LeftPointerResize: Story = {
	...PointerResize,
	args: { drags: 'left' },
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const rail = canvas.getByRole('separator');
		await pointer(rail, 'pointerdown', 300);
		await pointer(document.documentElement, 'pointermove', 250);
		await pointer(document.documentElement, 'pointerup', 250);
		await expect(args.onResize).toHaveBeenCalledWith(expect.objectContaining({ divWidth: 300, deltaWidth: -50 }));
	},
};
export const Bounds: Story = {
	tags: ['tests'],
	render: fixture,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const rail = canvas.getByRole('separator');
		await pointer(rail, 'pointerdown', 250);
		await pointer(document.documentElement, 'pointermove', 1000);
		await pointer(document.documentElement, 'pointermove', 0);
		await expect(rail).toHaveAttribute('aria-valuenow', '250');
		await expect(args.onResize).toHaveBeenCalledTimes(1);
		await pointer(document.documentElement, 'pointerup', 0);
	},
};
export const LeftBounds: Story = { ...Bounds, args: { drags: 'left' } };
export const KeyboardResize: Story = {
	tags: ['tests'],
	render: fixture,
	play: async ({ canvasElement, args }) => {
		const rail = within(canvasElement).getByRole('separator', { name: 'Resize panel' });
		rail.focus();
		await userEvent.keyboard('{ArrowRight}');
		await expect(rail).toHaveAttribute('aria-valuenow', '260');
		await userEvent.keyboard('{End}');
		await expect(rail).toHaveAttribute('aria-valuenow', '400');
		await userEvent.keyboard('{Home}');
		await expect(rail).toHaveAttribute('aria-valuenow', '150');
		await expect(args.onResizeEnd).toHaveBeenCalledTimes(3);
	},
};
export const ClosedContent: Story = {
	tags: ['tests'],
	args: { isClosed: true, drags: false },
	render: fixture,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		await expect(canvas.queryByRole('button', { name: 'Inside panel' })).not.toBeInTheDocument();
		await expect(canvas.queryByRole('separator')).not.toBeInTheDocument();
		await expect(canvas.getByTestId('panel')).toHaveStyle({ width: '0px' });
	},
};
export const RestoresSelection: Story = {
	tags: ['tests'],
	render: fixture,
	play: async ({ canvasElement, args }) => {
		const root = document.documentElement;
		const previous = root.style.userSelect;
		try {
			root.style.userSelect = 'text';
			const rail = within(canvasElement).getByRole('separator');
			await pointer(rail, 'pointerdown', 250);
			await expect(root.style.userSelect).toBe('none');
			await fireEvent(window, new Event('blur'));
			await expect(root.style.userSelect).toBe('text');
			await pointer(document.documentElement, 'pointermove', 300);
			await expect(args.onResizeEnd).toHaveBeenCalledTimes(1);
		} finally {
			root.style.userSelect = previous;
		}
	},
};
export const PointerCancel: Story = {
	tags: ['tests'],
	render: fixture,
	play: async ({ canvasElement, args }) => {
		const rail = within(canvasElement).getByRole('separator');
		await pointer(rail, 'pointerdown', 250);
		await pointer(document.documentElement, 'pointercancel', 250);
		await pointer(document.documentElement, 'pointermove', 300);
		await expect(args.onResizeEnd).toHaveBeenCalledTimes(1);
	},
};
function Removable(args: DraggablePanelProps) {
	const [show, setShow] = useState(true);
	return (
		<>
			<Button label="Remove panel" onClick={() => setShow(false)} />
			{show && <PanelFixture {...args} />}
		</>
	);
}
export const UnmountDuringDrag: Story = {
	tags: ['tests'],
	render: (args) => <Removable {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const previous = document.documentElement.style.userSelect;
		await pointer(canvas.getByRole('separator'), 'pointerdown', 250);
		await userEvent.click(canvas.getByRole('button', { name: 'Remove panel' }));
		await expect(document.documentElement.style.userSelect).toBe(previous);
		await pointer(document.documentElement, 'pointermove', 350);
		await expect(args.onResizeEnd).not.toHaveBeenCalled();
	},
};
export const ReducedMotion: Story = {
	tags: ['tests'],
	render: fixture,
	beforeEach: () => {
		const preference = installReducedMotionPreference(true);
		return preference.restore;
	},
	play: async ({ canvasElement }) => {
		await expect(within(canvasElement).getByTestId('panel')).toHaveStyle({ transition: 'none' });
	},
};
export const ContextMenuComposition: Story = {
	tags: ['tests'],
	args: { disableOnContext: true, onContextMenu: fn() },
	render: fixture,
	play: async ({ canvasElement, args }) => {
		const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
		await fireEvent(within(canvasElement).getByTestId('panel'), event);
		await expect(event.defaultPrevented).toBe(true);
		await expect(args.onContextMenu).toHaveBeenCalledOnce();
	},
};

function ChangingBounds(args: DraggablePanelProps) {
	const [bounds, setBounds] = useState({ initial: 250, min: 150, max: 400 });
	return (
		<>
			<Button label="Tighten bounds" onClick={() => setBounds({ initial: 250, min: 300, max: 350 })} />
			<PanelFixture {...args} sizeConstraints={bounds} />
		</>
	);
}
export const LiveConstraints: Story = {
	tags: ['tests'],
	render: (args) => <ChangingBounds {...args} />,
	play: async ({ canvasElement, args }) => {
		const canvas = within(canvasElement);
		const rail = canvas.getByRole('separator');
		await pointer(rail, 'pointerdown', 250);
		await pointer(document.documentElement, 'pointermove', 380);
		await userEvent.click(canvas.getByRole('button', { name: 'Tighten bounds' }));
		await expect(rail).toHaveAttribute('aria-valuemin', '300');
		await expect(rail).toHaveAttribute('aria-valuemax', '350');
		await expect(rail).toHaveAttribute('aria-valuenow', '350');
		await pointer(document.documentElement, 'pointermove', 320);
		await expect(args.onResizeEnd).toHaveBeenCalledTimes(1);
	},
};
export const RemembersReopenedWidth: Story = {
	tags: ['tests'],
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const rail = canvas.getByRole('separator');
		rail.focus();
		await userEvent.keyboard('{End}');
		await userEvent.click(canvas.getByRole('button', { name: 'Close sidebar' }));
		await expect(canvas.queryByRole('separator')).not.toBeInTheDocument();
		await userEvent.click(canvas.getByRole('button', { name: 'Open sidebar' }));
		await expect(canvas.getByRole('separator')).toHaveAttribute('aria-valuenow', '400');
	},
};

export const KeyboardOnlyOutline: Story = {
	tags: ['tests'],
	render: fixture,
	play: async ({ canvasElement }) => {
		const rail = within(canvasElement).getByRole('separator');
		await pointer(rail, 'pointerdown', 250);
		await expect(rail).toHaveFocus();
		await expect(getComputedStyle(rail).outlineStyle).toBe('none');
		await pointer(document.documentElement, 'pointerup', 250);
		await userEvent.keyboard('{ArrowRight}');
		await expect(getComputedStyle(rail).outlineStyle).toBe('solid');
		await expect(getComputedStyle(rail).outlineWidth).toBe('2px');
	},
};
