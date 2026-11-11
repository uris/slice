import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { SliceIcon } from '../Icon/_types';
import type { ButtonSize, ToolTip } from '../sharedTypes';

type IconButtonBaseProps = {
	actionName?: string;
	buttonSize?: Exclude<ButtonSize, 'auto'>;
	iconSize?: number;
	/** Icon stroke width in the 20-unit viewBox. Omit to use Icon’s default. */
	iconStrokeWidth?: number;
	icon?: SliceIcon;
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
