import type { Transition } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { SizeValue } from '../../theme/resolveSize';
import type { TabOption } from '../Tab';
import type { TabColorProps } from '../Tab/_types';
import type { ToolTip } from '../sharedTypes';

type TabBarBaseProps<T> = TabColorProps & {
	tabBarName?: string;
	children?: React.ReactNode;
	options?: TabOption<T>[];
	value?: T | null;
	defaultValue?: T | null;
	underline?: boolean;
	border?: boolean;
	height?: number | string;
	width?: number | string;
	tabWidth?: 'compact' | 'fill' | number;
	closeWidth?: number | string;
	padding?: SizeValue;
	iconSize?: number;
	/** Default icon stroke width in SVG viewBox units; individual tabs may override it. */
	iconStrokeWidth?: number;
	iconDualTone?: boolean;
	iconGap?: SizeValue;
	tabGap?: SizeValue;
	disabled?: boolean;
	hasClose?: boolean;
	onToolTip?: (tip: ToolTip | null) => void;
	onChange?: (value: T, option: TabOption<T>) => void;
	onClose?: () => void;
	justify?: 'start' | 'center' | 'end';
	borderColor?: ColorValue;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
	transition?: Transition;
};
export type TabBarProps<T = string> = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof TabBarBaseProps<T> | keyof React.AriaAttributes | 'role'
> &
	TabBarBaseProps<T>;
