import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { ToolTip } from '../sharedTypes';

export type BarButton = {
	icon?: string;
	action?: string;
	/** Accessible button name and tooltip text. */
	tip: string;
};

type ButtonBarBaseProps = {
	buttons?: BarButton[];
	buttonGap?: number;
	padding?: number;
	selectionRadius?: number | string;
	buttonSize?: 's' | 'm' | 'l' | 'xl' | number;
	iconSize?: number;
	toggle?: boolean;
	selectedIndex?: number | null;
	defaultSelectedIndex?: number | null;
	borderRadius?: number | string;
	borderWidth?: number;
	borderColor?: ColorValue;
	backgroundColor?: ColorValue;
	backgroundColorHover?: ColorValue;
	backgroundColorSelected?: ColorValue;
	onClick?: (button: BarButton) => void;
	onChange?: (button: BarButton) => void;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type ButtonBarProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof ButtonBarBaseProps> & ButtonBarBaseProps;
