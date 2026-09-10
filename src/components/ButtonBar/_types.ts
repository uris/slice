import type React from 'react';
import type { ToolTip } from '../sharedTypes';

export type BarButton = {
	icon?: string;
	action?: string;
	label?: string;
	tip: string;
};

type ButtonBarBaseProps = {
	buttons?: BarButton[];
	frameSize?: number;
	iconSize?: number;
	toggle?: boolean;
	selected?: number;
	borderRadius?: number | string;
	borderWidth?: number;
	borderSize?: number;
	borderColor?: string;
	backgroundColor?: string;
	backgroundColorHover?: string;
	backgroundColorActive?: string;
	bgColor?: string;
	bgColorHover?: string;
	bgColorActive?: string;
	labelColor?: string;
	buttonSize?: 's' | 'm' | 'l' | 'xl';
	onClick?: (button: BarButton) => void;
	onChange?: (option: BarButton) => void;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type ButtonBarProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof ButtonBarBaseProps> & ButtonBarBaseProps;
