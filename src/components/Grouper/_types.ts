import type React from 'react';

type GrouperBaseProps = {
	title?: string;
	variant?: string;
	toggle?: boolean;
	open?: boolean;
	hasIcon?: boolean;
	iconName?: string;
	iconSize?: number;
	frameSize?: number;
	border?: number;
	count?: number | string;
	hideNull?: boolean;
	showFilterBadge?: boolean;
	unframed?: boolean;
	onChange?: (state: boolean) => void;
	onClick?: () => void;
};

export type GrouperProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof GrouperBaseProps> &
	GrouperBaseProps;
