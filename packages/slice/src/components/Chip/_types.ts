import type { Transition } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { ToolTip } from '../sharedTypes';

type ChipBaseProps = {
	children?: React.ReactNode;
	label?: string;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	textColor?: ColorValue;
	textColorHover?: ColorValue;
	icon?: string;
	iconSize?: number;
	iconPosition?: 'left' | 'right';
	iconColor?: ColorValue;
	iconColorHover?: ColorValue;
	backgroundColor?: ColorValue;
	backgroundColorHover?: ColorValue;
	disabled?: boolean;
	selected?: boolean;
	textColorSelected?: ColorValue;
	iconColorSelected?: ColorValue;
	backgroundColorSelected?: ColorValue;
	borderColorSelected?: ColorValue;
	layout?: boolean;
	transition?: Transition;
	removeLabel?: string;
	onRemove?: React.MouseEventHandler<HTMLButtonElement>;
	tooltip?: string;
	borderWidth?: number;
	borderColor?: ColorValue;
	borderColorHover?: ColorValue;
	borderColorDisabled?: ColorValue;
	borderRadius?: number | string;
	gap?: number;
	padding?: number;
	paddingTop?: number;
	paddingRight?: number;
	paddingBottom?: number;
	paddingLeft?: number;
	onToolTip?: (tip: ToolTip | null) => void;
};

type StaticChipProps = ChipBaseProps & { onClick?: undefined } & Omit<
		React.HTMLAttributes<HTMLDivElement>,
		keyof ChipBaseProps | 'color' | 'onClick'
	>;
type ActionChipProps = ChipBaseProps & { onClick: React.MouseEventHandler<HTMLButtonElement> } & Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		keyof ChipBaseProps | 'color' | 'onClick'
	>;

export type ChipProps = StaticChipProps | ActionChipProps;
