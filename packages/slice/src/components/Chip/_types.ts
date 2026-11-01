import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { ToolTip } from '../sharedTypes';

type ChipBaseProps = {
	children?: React.ReactNode;
	label?: string;
	labelSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	labelColor?: ColorValue;
	labelColorHover?: ColorValue;
	icon?: string;
	iconSize?: number;
	iconPosition?: 'left' | 'right';
	iconColor?: ColorValue;
	iconColorHover?: ColorValue;
	backgroundColor?: ColorValue;
	backgroundColorHover?: ColorValue;
	disabled?: boolean;
	focused?: boolean;
	tooltip?: string;
	borderWidth?: number;
	borderSize?: number;
	borderColor?: ColorValue;
	borderColorHover?: ColorValue;
	borderColorDisabled?: ColorValue;
	borderRadius?: number | string;
	gap?: number;
	paddingTop?: number;
	paddingTops?: number;
	paddingSides?: number;
	variant?: 'button' | 'normal';
	onToolTip?: (tip: ToolTip | null) => void;
	onClick?: (e: React.MouseEvent<HTMLDivElement> | undefined) => void;
};

export type ChipProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof ChipBaseProps> & ChipBaseProps;
