import type { HTMLMotionProps } from 'motion/react';
import type { ToolTip } from '../sharedTypes';

export const tipBasePos = { left: 0, top: 0 };
export type PosCoords = { left: number; top: number };

type ToolTipBaseProps = {
	tip?: ToolTip | null;
	size?: 'xs' | 's' | 'm' | 'l';
	backgroundColor?: string;
	bgColor?: string;
	textColor?: string;
	color?: string;
	border?: boolean;
	borderColor?: string;
	padding?: number | string;
	borderRadius?: number;
	radius?: number;
	coords?: { x: number; y: number };
	showDelay?: number;
	hideDelay?: number;
};

export type ToolTipProps = Omit<HTMLMotionProps<'div'>, keyof ToolTipBaseProps> & ToolTipBaseProps;
