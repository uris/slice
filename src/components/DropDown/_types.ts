import type React from 'react';

export type DropDownOption<T = string> = {
	label?: string;
	value?: T;
	alt?: string;
};

type DropDownBaseProps<T = string> = {
	name?: string;
	label?: string;
	labelColor?: string;
	options?: DropDownOption<T>[];
	selectedIndex?: number;
	selectedValue?: T;
	valueKey?: string;
	placeholder?: boolean;
	borderRadius?: number;
	borderStyle?: 'bottom' | 'box' | 'none';
	validate?: boolean;
	iconColor?: string;
	backgroundColor?: string;
	bgColor?: string;
	textColor?: string;
	borderColor?: string;
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
	size?: 'xs' | 's' | 'm' | 'l';
	onChange?: (index: number, option: DropDownOption<T>) => void;
	onOption?: (option: DropDownOption<T>) => void;
};

export type DropDownProps<T = string> = Omit<React.HTMLAttributes<HTMLDivElement>, keyof DropDownBaseProps<T>> &
	DropDownBaseProps<T>;
