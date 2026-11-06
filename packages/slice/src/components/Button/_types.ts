import type { HTMLMotionProps, Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { SliceIcon } from '../Icon/_types';
import type { ButtonStyleProps, FixedSize, ToolTip } from '../sharedTypes';

type ButtonBaseProps = ButtonStyleProps & {
	children?: React.ReactNode;
	variant?: 'solid' | 'outline' | 'text';
	state?: 'normal' | 'hover' | 'disabled';
	width?: string;
	label?: string;
	iconRight?: SliceIcon;
	iconLeft?: SliceIcon;
	iconFill?: boolean;
	fill?: boolean;
	count?: number;
	showDot?: boolean;
	round?: boolean;
	tooltip?: string;
	iconSize?: number;
	borderRadius?: number | string;
	iconColor?: ColorValue;
	backgroundColor?: ColorValue;
	backgroundColorDisabled?: ColorValue;
	textColor?: ColorValue;
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
