import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { Type } from '../../theme/type/types';

export type DropDownOption<T = string> = {
	label?: string;
	value: T;
	alt?: string;
	formValue?: string;
	disabled?: boolean;
};
type NativeInputAttributes = Omit<
	React.SelectHTMLAttributes<HTMLSelectElement>,
	| keyof React.AriaAttributes
	| 'children'
	| 'className'
	| 'style'
	| 'role'
	| 'id'
	| 'name'
	| 'value'
	| 'defaultValue'
	| 'disabled'
	| 'multiple'
	| 'size'
	| 'onChange'
>;
type DropDownBaseProps<T = string> = {
	name?: string;
	inputName?: string;
	inputId?: string;
	inputAttributes?: NativeInputAttributes;
	label?: string;
	variant?: 'simple' | 'stacked' | 'outlined';
	behavior?: 'persistent' | 'appear';
	labelSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	stackedGap?: number;
	stackedLabelTextSize?: keyof Type;
	labelBackgroundColor?: ColorValue;
	tip?: string;
	errorMessage?: string;
	textColorError?: ColorValue;
	labelColor?: ColorValue;
	options?: DropDownOption<T>[];
	children?: T extends string ? React.ReactNode : never;
	value?: T | null;
	defaultValue?: T | null;
	valueKey?: string;
	placeholder?: boolean;
	borderRadius?: number | string;
	borderStyle?: 'underline' | 'box' | 'none';
	iconColor?: ColorValue;
	backgroundColor?: ColorValue;
	textColor?: ColorValue;
	textColorDisabled?: ColorValue;
	textColorPlaceholder?: ColorValue;
	borderColor?: ColorValue;
	borderColorFocused?: ColorValue;
	borderColorError?: ColorValue;
	borderColorDisabled?: ColorValue;
	borderWidth?: number;
	width?: number | string;
	height?: number | string;
	padding?: number | string;
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
	onChange?: (value: T, option: DropDownOption<T>, index: number) => void;
};
export type DropDownProps<T = string> = Omit<
	React.HTMLAttributes<HTMLSpanElement>,
	keyof DropDownBaseProps<T> | keyof React.AriaAttributes | 'role'
> &
	DropDownBaseProps<T> &
	(
		| { options?: DropDownOption<T>[]; children?: never }
		| { options?: never; children: T extends string ? React.ReactNode : never }
	);
