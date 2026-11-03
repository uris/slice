import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { ToolTip } from '../sharedTypes';

type IconButtonBaseProps = {
	actionName?: string;
	buttonSize?: 's' | 'm' | 'l' | 'xl' | number;
	iconSize?: number;
	icon?: string;
	iconFill?: boolean;
	iconColor?: ColorValue;
	iconColorHover?: ColorValue;
	iconColorSelected?: ColorValue;
	backgroundColor?: ColorValue;
	backgroundColorHover?: ColorValue;
	backgroundColorSelected?: ColorValue;
	borderWidth?: number;
	borderColor?: ColorValue;
	borderRadius?: number | string;
	disabled?: boolean;
	hover?: boolean;
	toggle?: boolean;
	selected?: boolean;
	defaultSelected?: boolean;
	toggleIcon?: boolean;
	showDot?: boolean;
	count?: number;
	tooltip?: string;
	motionValues?: Variants;
	transition?: Transition;
	onChange?: (selected: boolean) => void;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type IconButtonProps = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	keyof IconButtonBaseProps | 'color' | 'children' | 'aria-label' | 'aria-labelledby' | 'aria-pressed'
> &
	IconButtonBaseProps;
