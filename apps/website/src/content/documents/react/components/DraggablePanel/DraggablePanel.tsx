import { CodeBlock } from '@/components/CodeBlock';
import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, Method, P, Prop, TypeDef } from '@/components/Type/Type';
import { FlexDiv, Preset } from '@apple-pie/slice';
import { Fragment } from 'react';
import { ConstraintsPreview, DraggablePanelPreview } from './DraggablePanelPreview';
import { constraintsCode, constraintsExampleCode, usageCode } from './code';

const panelProps = [
	['backgroundColor', 'ColorValue', 'transparent', 'Panel background; accepts Slice tokens and CSS colors.'],
	[
		'borderLeft',
		'CSSProperties["borderLeft"] | null',
		'1px solid var(--core-outline-secondary)',
		'Border on the left resize edge while open.',
	],
	[
		'borderRight',
		'CSSProperties["borderRight"] | null',
		'1px solid var(--core-outline-secondary)',
		'Border on the right resize edge while open.',
	],
	[
		'children',
		'ReactNode',
		'undefined',
		'Content inside the panel. Closed content stays mounted and becomes inert and hidden from assistive technology.',
	],
	[
		'containerRef',
		'RefObject<HTMLDivElement | null>',
		'undefined',
		'Container whose width resolves relative constraints. Without one, constraints use the viewport width.',
	],
	['disableOnContext', 'boolean', 'false', 'Prevents the panel context menu after calling your onContextMenu handler.'],
	['dragHandle', 'boolean', 'true', 'Shows the visual grip. The resize rail remains usable when the grip is hidden.'],
	[
		'dragHandleStyle',
		'DragHandleProps',
		'{ height: 24, width: 9 }',
		'Grip appearance: width, height, radius, stroke, strokeColor, and color.',
	],
	[
		'drags',
		"'left' | 'right' | false",
		"'right'",
		'Resize edge: right for a left sidebar, left for a right sidebar. False fills available width without a resize rail; isClosed still collapses it.',
	],
	[
		'isClosed',
		'boolean',
		'true',
		'Collapses the panel to zero width. Reopening restores its last resized width within the current constraints.',
	],
	[
		'isTouchDevice',
		'boolean',
		'false',
		'Expands the resize rail to 44px and removes the pointer highlight delay. Touch resizing also works without this presentation option.',
	],
	[
		'resizeHandle',
		'ResizeHandle',
		"{ width: 10, color: 'transparent', offsetX: true }",
		'Rail width and background color. offsetX is retained for compatibility and has no effect; the rail stays centered on the edge.',
	],
	[
		'resizeHandleLabel',
		'string',
		'Resize panel',
		'Accessible name of the resize rail. Use distinct names when a layout contains several panels.',
	],
	[
		'sizeConstraints',
		'Constraint',
		'{ initial: 250, min: 250, max: 500 }',
		'Initial, minimum, and maximum widths. Values from 0 through 1 are container ratios; values above 1 are pixels, with a 50px floor. Invalid numbers use defaults; maximum is at least minimum and initial is clamped into range.',
	],
	[
		'transitionDurationOnInit',
		'number | string',
		'undefined',
		'Overrides only the initial transition while relative sizing settles. Numbers use milliseconds; strings are CSS durations. Later changes use the theme’s Water timing; reduced motion disables transitions.',
	],
	[
		'divAttributes',
		'HTMLAttributes<HTMLDivElement>',
		'undefined',
		'Native wrapper attributes, styles, classes, and events. The panel owns its width and resize layout.',
	],
];

function eventDescription(name: string) {
	if (name === 'onResizeStart') return 'Called when a pointer resize begins, or before a keyboard resize.';
	if (name === 'onResizeEnd')
		return 'Called when resizing ends, including cancellation while mounted. Unmount cleanup does not emit callbacks.';
	return 'Called at resize start, for accepted width changes, and at the end with the final dimensions.';
}

const events = ['onResizeStart', 'onResize', 'onResizeEnd'];
export default function DraggablePanelDoc() {
	return (
		<FlexDiv preset={Preset.Column} maxWidth={760}>
			<Path />
			<H1 id="title">DraggablePanel component</H1>
			<P>
				Build a split workspace with a resizable sidebar. People can adjust the panel with a mouse, touch, pen, or
				keyboard while the main content uses the remaining space.
			</P>
			<H3>Left panel</H3>
			<TipBox inline noMargin noBorder>
				Drag the right edge to resize, or close and reopen Panel A to restore its width.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-draggablepanel--default"
				components={[
					{
						label: 'Left panel',
						component: <DraggablePanelPreview />,
						code: usageCode.trim(),
						codeFilename: 'ProjectWorkspace.tsx',
					},
				]}
			/>
			<H3>Right panel</H3>
			<TipBox inline noMargin noBorder>
				Drag the left edge to resize. You can also focus either resize rail and use the arrow keys.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-draggablepanel--left-drag-direction"
				components={[
					{
						label: 'Right panel',
						component: <DraggablePanelPreview edge="left" />,
						code: usageCode.replace("edge = 'right'", "edge = 'left'").trim(),
						codeFilename: 'ProjectWorkspace.tsx',
					},
				]}
			/>
			<H2 id="usage">Usage</H2>
			<P>
				Place <Code>DraggablePanel</Code> beside a content area with <Code>flex: 1</Code> and <Code>minWidth: 0</Code>.
				Give the row a height and pass its ref as <Code>containerRef</Code> when using ratio constraints. Set{' '}
				<Code>isClosed</Code> to control visibility.
			</P>
			<H3>Keep content stable while closing</H3>
			<P>
				When the minimum constraint is in pixels, give the inner content wrapper that same <Code>minWidth</Code>. The
				examples use <Code>{'style={{ minWidth: dragConstraints.min }}'}</Code>
				to prevent content from squeezing and rewrapping during the closing animation. Apply this to the content wrapper
				so the outer panel can still collapse to zero and clip its contents.
			</P>
			<H2 id="constraints">Absolute and percentage constraints</H2>
			<P>
				Each <Code>sizeConstraints</Code> value can use pixels or a percentage independently. Numbers above{' '}
				<Code>1</Code> are pixels; numbers from <Code>0</Code> through <Code>1</Code> are fractions of the container
				width. For example, <Code>0.4</Code> means 40%, and <Code>1</Code> means 100%.
			</P>
			<P>
				Use absolute constraints for a sidebar with a fixed size range. Use percentage constraints when the range should
				follow the available space, or mix both to keep a readable minimum while limiting how much of the layout the
				panel can occupy.
			</P>
			<CodeBlock code={constraintsCode.trim()} language="tsx" />
			<P>
				Pass <Code>containerRef</Code> to measure percentages against the surrounding layout. Without it, percentages
				use the viewport width. In an 800px container, the percentage example starts at 320px and allows widths from
				200px to 560px.
			</P>
			<ComponentCanvas
				components={[
					{
						label: 'Pixels versus percentages',
						component: <ConstraintsPreview />,
						code: constraintsExampleCode.trim(),
						codeFilename: 'ConstraintComparison.tsx',
					},
				]}
			/>
			<TipBox inline noMargin noBorder>
				Narrow the container to compare the fixed 240px initial width with the 40% initial width, then drag either edge
				to try its bounds. Once resized, a panel keeps its chosen pixel width within the updated bounds.
			</TipBox>
			<H2 id="behavior">Behavior</H2>
			<P>
				The panel starts closed by default. Fixed pixel widths render on the server; relative initial widths settle
				after the container is measured. Resizing stops at the configured bounds, and new constraints keep the saved
				width within range.
			</P>
			<P>
				Pointer resizing changes width directly without a React render for every move. Your resize callbacks can update
				surrounding UI; use <Code>onResizeEnd</Code> for work that only needs the final width. Cancellation, losing
				window focus, and unmounting release the drag and restore document selection.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The focusable vertical separator identifies the panel and announces its width and bounds. Left/Right arrows move
				the edge by 10px, Shift increases the step to 50px, and Home/End choose the minimum/maximum. Escape ends an
				active pointer resize. Focus outlines appear for keyboard focus; reduced motion makes width and highlight
				changes immediate.
			</P>
			<H2 id="props">Props</H2>
			{panelProps.map(([name, type, defaultValue, description]) => (
				<Fragment key={name}>
					<Definition id={`prop-${name}`}>
						<Prop>{name === 'divAttributes' ? '...divAttributes' : name}</Prop>
						<TypeDef>{type}</TypeDef>
						<DefaultVal>{defaultValue}</DefaultVal>
					</Definition>
					<P>{description}</P>
				</Fragment>
			))}
			<H2 id="events">Events</H2>
			<P>
				All resize callbacks receive <Code>DraggablePanelResizeInfo</Code>:{' '}
				<Code>{'{ div, divWidth, divHeight, deltaWidth }'}</Code>. The ref points to the panel; dimensions are in
				pixels. For compatibility, <Code>deltaWidth</Code> is pointer movement from the gesture start, so left-edge
				growth is negative; start/end notifications use zero.
			</P>
			{events.map((name) => (
				<Fragment key={name}>
					<Definition id={name}>
						<Method>{name}</Method>
						<TypeDef>(info: DraggablePanelResizeInfo) =&gt; void</TypeDef>
					</Definition>
					<P>{eventDescription(name)}</P>
				</Fragment>
			))}
		</FlexDiv>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'DraggablePanel component' },
	...['usage', 'constraints', 'behavior', 'accessibility'].map((id) => ({
		id,
		title: id[0].toUpperCase() + id.slice(1),
	})),
	{ id: 'props', title: 'Props', items: panelProps.map(([name]) => ({ id: `prop-${name}`, title: name, code: true })) },
	{ id: 'events', title: 'Events', items: events.map((id) => ({ id, title: id, code: true })) },
];
