import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { DraggablePanel, type DraggablePanelProps } from 'src/components/DraggablePanel/DrggablePanel';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { IconButton } from 'src/components/IconButton';
import {
	runDraggablePanelAllowsWithinBoundsPlay,
	runDraggablePanelBlocksExcessiveGrowthPlay,
	runDraggablePanelBlocksExcessiveShrinkPlay,
	runDraggablePanelContextMenuAllowedPlay,
	runDraggablePanelContextMenuBlockedPlay,
	runDraggablePanelCustomBackgroundColorPlay,
	runDraggablePanelInstantInitialOpenPlay,
	runDraggablePanelLeftDirectionPlay,
	runDraggablePanelNoHandleAffordancePlay,
	runDraggablePanelPlay,
	runDraggablePanelTouchPlay,
} from 'src/components/playHelpers';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';

const meta: Meta<typeof DraggablePanel> = {
	title: 'Components/DraggablePanel',
	component: DraggablePanel,
	parameters: {
		layout: 'fullscreen',
	},
	args: {
		children: undefined,
		sizeConstraints: { initial: 0.5, min: 100, max: 0.75 },
		isClosed: false,
		resizeHandle: {
			width: 10,
			color: 'transparent',
			offsetX: true,
		},
		dragHandle: true,
		dragHandleStyle: {
			width: 6,
			height: 6,
			radius: 100,
			stroke: 1,
			color: 'var(--core-surface-primary-tint)',
			strokeColor: 'var(--core-outline-secondary)',
		},
		borderRight: undefined,
		borderLeft: undefined,
		backgroundColor: undefined,
		drags: 'right',
		isTouchDevice: false,
		containerRef: undefined,
		onResize: fn(),
		onResizeStart: fn(),
		onResizeEnd: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof DraggablePanel> = {
	render: (args) => {
		return <DraggablePanelWithChildren {...args} />;
	},
};

export const NoDrag: StoryObj<typeof DraggablePanel> = {
	args: {
		...meta.args,
		drags: false,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		const handle = Array.from(canvasElement.querySelectorAll('div')).find(
			(node) => (node as HTMLElement).style.cursor === 'col-resize',
		);
		expect(handle).toHaveStyle({ display: 'none' });
	},
};

export const InitiallyClosed: StoryObj<typeof DraggablePanel> = {
	args: {
		...meta.args,
		isClosed: true,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runDraggablePanelPlay({ canvasElement, args });
	},
};

export const LeftDragDirection: StoryObj<typeof DraggablePanel> = {
	tags: ['tests'],
	args: {
		...meta.args,
		drags: 'left',
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runDraggablePanelLeftDirectionPlay({ canvasElement, args });
	},
};

export const TouchInteraction: StoryObj<typeof DraggablePanel> = {
	tags: ['tests'],
	args: {
		...meta.args,
		isTouchDevice: true,
	},
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runDraggablePanelTouchPlay({ canvasElement, args });
	},
};

// fixed absolute sizeConstraints (not fractions of container width) keep
// these three drag assertions independent of viewport size - each gets its
// own fresh mount rather than chaining multiple drags in one play function
const fixedConstraintsArgs = {
	...meta.args,
	sizeConstraints: { initial: 250, min: 150, max: 400 },
};

export const BlocksExcessiveGrowth: StoryObj<typeof DraggablePanel> = {
	tags: ['tests'],
	args: fixedConstraintsArgs,
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDraggablePanelBlocksExcessiveGrowthPlay({ canvasElement });
	},
};

export const AllowsWithinBounds: StoryObj<typeof DraggablePanel> = {
	tags: ['tests'],
	args: fixedConstraintsArgs,
	render: Default.render,
	play: async ({ canvasElement, args }) => {
		await runDraggablePanelAllowsWithinBoundsPlay({ canvasElement, args });
	},
};

export const BlocksExcessiveShrink: StoryObj<typeof DraggablePanel> = {
	tags: ['tests'],
	args: fixedConstraintsArgs,
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDraggablePanelBlocksExcessiveShrinkPlay({ canvasElement });
	},
};

export const NoHandleAffordance: StoryObj<typeof DraggablePanel> = {
	tags: ['tests'],
	args: {
		...meta.args,
		dragHandle: false,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDraggablePanelNoHandleAffordancePlay({ canvasElement });
	},
};

export const ContextMenuBlocked: StoryObj<typeof DraggablePanel> = {
	tags: ['tests'],
	args: {
		...meta.args,
		disableOnContext: true,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDraggablePanelContextMenuBlockedPlay({ canvasElement });
	},
};

export const ContextMenuAllowed: StoryObj<typeof DraggablePanel> = {
	tags: ['tests'],
	args: {
		...meta.args,
		disableOnContext: false,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDraggablePanelContextMenuAllowedPlay({ canvasElement });
	},
};

export const CustomBackgroundColor: StoryObj<typeof DraggablePanel> = {
	tags: ['tests'],
	args: {
		...meta.args,
		backgroundColor: 'rgb(10, 20, 30)',
	},
	render: (args) => <DraggablePanelWithCustomColor {...args} />,
	play: async ({ canvasElement }) => {
		await runDraggablePanelCustomBackgroundColorPlay({ canvasElement });
	},
};

export const InstantInitialOpen: StoryObj<typeof DraggablePanel> = {
	tags: ['tests'],
	args: {
		...fixedConstraintsArgs,
		transitionDurationOnInit: 0,
	},
	render: Default.render,
	play: async ({ canvasElement }) => {
		await runDraggablePanelInstantInitialOpenPlay({ canvasElement });
	},
};

// create a component to pass in ref from a use ref hook
function DraggablePanelWithChildren(args: Readonly<DraggablePanelProps>) {
	const containerRef = useRef<HTMLDivElement>(null);
	const [closed, setClosed] = useState(args.isClosed);
	useEffect(() => setClosed(args.isClosed), [args.isClosed]);
	return (
		<FlexDiv width={'viewport'} height={'viewport'} direction={'row'} ref={containerRef}>
			<DraggablePanel
				{...args}
				containerRef={containerRef}
				isClosed={closed}
				backgroundColor={'var(--core-surface-primary-tint)'}
			/>
			<FlexDiv width={'auto'} height={'fill'} justify={'start'} padding={24}>
				<IconButton icon={closed ? 'arrow right' : 'arrow left'} iconSize={20} onClick={() => setClosed(!closed)} />
			</FlexDiv>
		</FlexDiv>
	);
}

// same proven full-viewport single-panel layout as `DraggablePanelWithChildren`,
// but without that wrapper's hardcoded `backgroundColor` override, so a
// caller-supplied `backgroundColor` arg actually takes effect
function DraggablePanelWithCustomColor(args: Readonly<DraggablePanelProps>) {
	const containerRef = useRef<HTMLDivElement>(null);
	return (
		<FlexDiv width={'viewport'} height={'viewport'} direction={'row'} ref={containerRef}>
			<DraggablePanel {...args} containerRef={containerRef} />
		</FlexDiv>
	);
}

export const HandleFeedbackAndDefaultCallbacks: StoryObj<typeof DraggablePanel> = {
	tags: ['tests'],
	args: {
		...fixedConstraintsArgs,
		onResize: undefined,
		onResizeStart: undefined,
		onResizeEnd: undefined,
		transitionDurationOnInit: 0,
		className: 'feedback-panel',
		backgroundColor: null as unknown as string,
	},
	render: (args) => <DraggablePanel {...args} data-testid="feedback-panel" />,
	play: async ({ canvasElement }) => {
		const panel = within(canvasElement).getByTestId('feedback-panel');
		// The resize handle has no semantic role; identify it by its public cursor affordance.
		const handle = Array.from(panel.querySelectorAll('div')).find((node) => node.style.cursor === 'col-resize');
		if (!handle) throw new Error('Resize handle not found');
		const highlight = handle.lastElementChild as HTMLElement;
		await waitFor(() => expect(panel.getBoundingClientRect().width).toBe(250));
		await expect(panel).toHaveClass('feedback-panel');
		await expect(panel.style.getPropertyValue('--panel-bg')).toBe('transparent');
		await userEvent.hover(handle);
		await waitFor(() => expect(highlight.style.backgroundColor).not.toBe('transparent'));
		await userEvent.unhover(handle);
		await waitFor(() => expect(highlight.style.backgroundColor).toBe('transparent'));
		fireEvent.focusIn(handle);
		await waitFor(() => expect(highlight.style.backgroundColor).not.toBe('transparent'));
		fireEvent.focusOut(handle);
		await waitFor(() => expect(highlight.style.backgroundColor).toBe('transparent'));
		fireEvent.mouseDown(handle, { clientX: 250 });
		fireEvent.mouseMove(document.documentElement, { clientX: 300 });
		await waitFor(() => expect(panel.getBoundingClientRect().width).toBe(300));
		fireEvent.mouseUp(document.documentElement);
		await waitFor(() => expect(panel.getBoundingClientRect().width).toBe(300));
		fireEvent(window, new Event('resize'));
		await expect(panel.getBoundingClientRect().width).toBe(300);
	},
};
