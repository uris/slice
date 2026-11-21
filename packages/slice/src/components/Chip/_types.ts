import type { Transition } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { RadiusValue, SizeValue } from '../../theme/resolveSize';
import type { SliceIcon } from '../Icon/_types';
import type { ToolTip } from '../sharedTypes';

type ChipBaseProps = {
	children?: React.ReactNode;
	label?: string;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	textColor?: ColorValue;
	textColorHover?: ColorValue;
	icon?: SliceIcon;
	iconSize?: number;
	iconPosition?: 'left' | 'right';
	iconStroke?: number;
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
	borderRadius?: RadiusValue;
	gap?: SizeValue;
	padding?: SizeValue;
	paddingTop?: SizeValue;
	paddingRight?: SizeValue;
	paddingBottom?: SizeValue;
	paddingLeft?: SizeValue;
	onToolTip?: (tip: ToolTip | null) => void;
};

type StaticChipProps = ChipBaseProps & { onClick?: undefined } & Omit<
		React.HTMLAttributes<HTMLSpanElement>,
		keyof ChipBaseProps | 'color' | 'onClick'
	>;
type ActionChipProps = ChipBaseProps & { onClick: React.MouseEventHandler<HTMLButtonElement> } & Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		keyof ChipBaseProps | 'color' | 'onClick'
	>;

export type ChipProps = StaticChipProps | ActionChipProps;
