import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { DraggablePanel, type DraggablePanelProps } from 'src/components/DraggablePanel/DrggablePanel';
import { FlexDiv } from 'src/components/FlexDiv/FlexDiv';
import { IconButton } from 'src/components/IconButton';
import { runDraggablePanelPlay } from 'src/components/playHelpers';
import { expect, fn } from 'storybook/test';

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
		bgColor: undefined,
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
				bgColor={'var(--core-surface-primary-tint)'}
			/>
			<FlexDiv width={'auto'} height={'fill'} justify={'start'} padding={24}>
				<IconButton icon={closed ? 'arrow right' : 'arrow left'} iconSize={20} onClick={() => setClosed(!closed)} />
			</FlexDiv>
		</FlexDiv>
	);
}
