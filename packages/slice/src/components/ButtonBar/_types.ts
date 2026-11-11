import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { SliceIcon } from '../Icon/_types';
import type { ButtonSize, ToolTip } from '../sharedTypes';

export type BarButton = {
	icon?: SliceIcon;
	action?: string;
	/** Accessible button name and tooltip text. */
	tip: string;
};

type ButtonBarBaseProps = {
	buttons?: BarButton[];
	buttonGap?: number;
	padding?: number;
	selectionRadius?: number | string;
	buttonSize?: Exclude<ButtonSize, 'auto'>;
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
