import type { HTMLMotionProps, Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme';
import type { SliceIcon } from '../Icon';
import type { ButtonStyleProps, FixedSize, ToolTip } from '../sharedTypes';

type ButtonBaseProps = ButtonStyleProps & {
	children?: React.ReactNode;
	variant?: 'solid' | 'outline' | 'text';
	state?: 'normal' | 'hover' | 'disabled';
	width?: string;
	label?: string;
	iconRight?: SliceIcon;
	iconLeft?: SliceIcon;
	iconDualTone?: boolean;
	fill?: boolean;
	count?: number;
	showDot?: boolean;
	round?: boolean;
	tooltip?: string;
	/** Icon size in pixels, clamped to a minimum of 14. */
	iconSize?: number;
	/** Defaults to 1.5 at 14px; otherwise uses Icon’s default. */
	iconStrokeWidth?: number;
	borderRadius?: number | string;
	/** Overrides the variant border width in every state. Numbers use pixels. */
	borderWidth?: number | string;
	/** Overrides the variant border color in every state. */
	borderColor?: ColorValue;
	iconColor?: ColorValue;
	iconColorHover?: ColorValue;
	backgroundColor?: ColorValue;
	backgroundColorHover?: ColorValue;
	backgroundColorDisabled?: ColorValue;
	textColor?: ColorValue;
	textColorHover?: ColorValue;
	textSize?: FixedSize;
	transition?: Transition;
	variants?: Variants;
	initial?: string;
	animate?: string;
	exit?: string;
	underline?: boolean;
	progress?: boolean;
	working?: boolean;
	duration?: number;
	trigger?: boolean;
	destructive?: boolean;
	link?: string;
	target?: '_blank' | '_self' | '_parent' | '_top';
	onToolTip?: (tip: ToolTip | null) => void;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => void;
};

// Motion owns these event names; use its callback signatures rather than native DOM event signatures.
type MotionEvents = Pick<HTMLMotionProps<'button'>, 'onAnimationStart' | 'onDrag' | 'onDragStart' | 'onDragEnd'>;

export type ButtonProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	keyof ButtonBaseProps | keyof MotionEvents | 'color'
> &
	ButtonBaseProps &
	MotionEvents;

export interface ButtonHandle {
	triggerClick: () => void;
}
