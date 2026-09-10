import type React from 'react';
import type { ToolTip } from '../sharedTypes';

export type TabOption = {
	name?: string;
	value?: any;
	icon?: string | null;
	toolTip?: string;
	count?: number;
	component?: any;
};

export const placeholderOptions: TabOption[] = [
	{ name: 'Light', value: 'Option 1', icon: 'sun' },
	{ name: 'Dark', value: 'Option 2', icon: 'moon full' },
];

type TabBarBaseProps = {
	options?: TabOption[];
	selected?: number;
	underline?: boolean;
	border?: boolean;
	selectedValue?: string;
	height?: number | string;
	width?: number | string;
	tabWidth?: 'compact' | 'fill' | number;
	closeWidth?: number | string;
	padding?: number | string;
	iconSize?: number;
	iconFill?: boolean;
	iconGap?: number;
	tabGap?: number;
	disabled?: boolean;
	hasClose?: boolean;
	onToolTip?: (tip: ToolTip | null) => void;
	onChange?: (index: number) => void;
	onTabChange?: (option: TabOption) => void;
	onClose?: () => void;
	justify?: 'start' | 'center' | 'end';
	borderColor?: string;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
};

export type TabBarProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof TabBarBaseProps> & TabBarBaseProps;

export interface TabOptionProps {
	label?: string;
	value?: number;
	icon?: string | null;
	showToolTip?: string | null;
	selected?: boolean;
	padding?: number | string;
	iconSize?: number;
	iconGap?: number;
	disabled?: boolean;
	count?: number;
	iconFill?: boolean;
	tabWidth?: 'compact' | 'fill' | number;
	underline?: boolean;
	onClick?: (value: number) => void;
	onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>, value: number) => void;
	onToolTip?: (tip: ToolTip | null) => void;
	buttonRef?: (element: HTMLButtonElement | null) => void;
	borderColor?: string;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
}
