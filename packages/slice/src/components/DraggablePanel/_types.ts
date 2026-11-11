import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

export type Constraint = { initial: number; max: number; min: number };
export type DraggablePanelResizeInfo = {
	div: React.RefObject<HTMLDivElement | null>;
	divWidth: number;
	divHeight: number;
	/** Pointer movement from the start of the gesture; zero for start/end notifications. */
	deltaWidth: number;
};
export type DragHandleProps = {
	width?: number;
	height?: number;
	radius?: number | string;
	stroke?: number;
	strokeColor?: ColorValue;
	color?: ColorValue;
};
export type ResizeHandle = {
	width?: number;
	color?: ColorValue;
	/** Retained for compatibility; the resize rail remains centered on the panel edge. */
	offsetX?: boolean;
};
type BaseProps = {
	children?: React.ReactNode;
	onResize?: (info: DraggablePanelResizeInfo) => void;
	onResizeEnd?: (info: DraggablePanelResizeInfo) => void;
	onResizeStart?: (info: DraggablePanelResizeInfo) => void;
	containerRef?: React.RefObject<HTMLDivElement | null>;
	sizeConstraints?: Constraint;
	isClosed?: boolean;
	resizeHandle?: ResizeHandle;
	resizeHandleLabel?: string;
	borderRight?: React.CSSProperties['borderRight'] | null;
	borderLeft?: React.CSSProperties['borderLeft'] | null;
	backgroundColor?: ColorValue;
	drags?: 'left' | 'right' | false;
	dragHandle?: boolean;
	dragHandleStyle?: DragHandleProps;
	disableOnContext?: boolean;
	isTouchDevice?: boolean;
	/** Milliseconds or a CSS duration, used only while initial relative sizing settles. */
	transitionDurationOnInit?: string | number;
};
export type DraggablePanelProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof BaseProps | 'dangerouslySetInnerHTML'
> &
	BaseProps;
