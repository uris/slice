import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { SliceIcon } from '../Icon/_types';

export type TabColorProps = {
	accentColor?: ColorValue;
	textColor?: ColorValue;
	textColorSelected?: ColorValue;
	underlineColor?: ColorValue;
	underlineSelectedColor?: ColorValue;
	iconColor?: ColorValue;
	iconColorSelected?: ColorValue;
};

export type TabOption<T = string> = TabColorProps & {
	value: T;
	label?: string;
	children?: React.ReactNode;
	icon?: SliceIcon | null;
	/** Overrides the inherited TabBar icon size in pixels. */
	iconSize?: number;
	toolTip?: string;
	count?: number;
	disabled?: boolean;
	id?: string;
	panelId?: string;
};
export type TabProps<T = string> = TabOption<T> &
	Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		keyof TabOption<T> | keyof React.AriaAttributes | 'onChange' | 'role' | 'type' | 'tabIndex'
	>;
