import type React from 'react';
import type { ToolTip } from '../sharedTypes';

type ChipBaseProps = {
	children?: React.ReactNode;
	label?: string;
	labelSize?: 'xs' | 's' | 'm' | 'l';
	labelColor?: string;
	labelColorHover?: string;
	icon?: string;
	iconSize?: number;
	iconPosition?: 'left' | 'right';
	iconColor?: string;
	iconColorHover?: string;
	backgroundColor?: string;
	backgroundColorHover?: string;
	bgColor?: string;
	bgColorHover?: string;
	disabled?: boolean;
	focused?: boolean;
	tooltip?: string;
	borderWidth?: number;
	borderSize?: number;
	borderColor?: string;
	borderColorHover?: string;
	borderColorDisabled?: string;
	borderRadius?: number;
	gap?: number;
	paddingTop?: number;
	paddingTops?: number;
	paddingSides?: number;
	variant?: 'button' | 'normal';
	onToolTip?: (tip: ToolTip | null) => void;
	onClick?: (e: React.MouseEvent<HTMLDivElement> | undefined) => void;
};

export type ChipProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof ChipBaseProps> & ChipBaseProps;
