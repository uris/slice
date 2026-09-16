import type React from 'react';
import type { ToolTip } from '../sharedTypes';

export type TabOption = {
	name?: string;
	value?: any;
	icon?: string | null;
	toolTip?: string;
	count?: number;
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

// Render props for TabBar's internal, unexported Option sub-component. Field names
// mirror TabOption's directly where they carry that same data through unchanged
// (name, toolTip); `index` is deliberately its own name rather than `value` — it's
// the option's render position (used for click/keyboard handling), a different
// concept from TabOption.value (arbitrary consumer data used for selectedValue
// matching), and the two must not share a prop name. See figma-manifest-punchlist.md
// #1 for the reconciliation this followed.
export interface TabOptionProps {
	name?: string;
	index?: number;
	icon?: string | null;
	toolTip?: string | null;
	selected?: boolean;
	padding?: number | string;
	iconSize?: number;
	iconGap?: number;
	disabled?: boolean;
	count?: number;
	iconFill?: boolean;
	tabWidth?: 'compact' | 'fill' | number;
	underline?: boolean;
	onClick?: (index: number) => void;
	onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => void;
	onToolTip?: (tip: ToolTip | null) => void;
	buttonRef?: (element: HTMLButtonElement | null) => void;
	borderColor?: string;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
}
