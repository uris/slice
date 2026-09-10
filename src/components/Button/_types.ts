import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ToolTip } from '../sharedTypes';

type ButtonBaseProps = {
	children?: React.ReactNode;
	size?: 'large' | 'medium' | 'small';
	variant?: 'solid' | 'outline' | 'text';
	state?: 'normal' | 'hover' | 'disabled';
	width?: string;
	label?: string;
	iconRight?: string;
	iconLeft?: string;
	iconFill?: boolean;
	fill?: boolean;
	count?: number;
	showDot?: boolean;
	round?: boolean;
	tooltip?: string;
	iconSize?: number;
	borderRadius?: number;
	iconColor?: string;
	backgroundColor?: string;
	backgroundColorDisabled?: string;
	bgColor?: string;
	bgColorDisabled?: string;
	labelColor?: string;
	labelSize?: 'xs' | 's' | 'm' | 'l';
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
	paddingRight?: number;
	paddingLeft?: number;
	link?: string;
	target?: '_blank' | '_self' | '_parent' | '_top';
	onToolTip?: (tip: ToolTip | null) => void;
	onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => void;
};

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & ButtonBaseProps;

export interface ButtonHandle {
	triggerClick: () => void;
}
