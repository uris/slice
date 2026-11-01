import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

export type DropDownOption<T = string> = {
	label?: string;
	value?: T;
	alt?: string;
};

type DropDownBaseProps<T = string> = {
	name?: string;
	label?: string;
	labelColor?: ColorValue;
	options?: DropDownOption<T>[];
	selectedIndex?: number;
	selectedValue?: T;
	valueKey?: string;
	placeholder?: boolean;
	borderRadius?: number | string;
	borderStyle?: 'bottom' | 'box' | 'none';
	validate?: boolean;
	iconColor?: ColorValue;
	backgroundColor?: ColorValue;
	textColor?: ColorValue;
	borderColor?: ColorValue;
	borderWidth?: number;
	borderSize?: number;
	width?: string;
	height?: string;
	paddingLeft?: number | string;
	paddingRight?: number | string;
	paddingTop?: number | string;
	paddingBottom?: number | string;
	iconSize?: number;
	disabled?: boolean;
	error?: boolean;
	gap?: number;
	inline?: boolean;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	onChange?: (index: number, option: DropDownOption<T>) => void;
	onOption?: (option: DropDownOption<T>) => void;
};

export type DropDownProps<T = string> = Omit<React.HTMLAttributes<HTMLDivElement>, keyof DropDownBaseProps<T>> &
	DropDownBaseProps<T>;
