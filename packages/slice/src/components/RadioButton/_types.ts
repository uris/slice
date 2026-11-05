import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { SliceIcon } from '../Icon/_types';

export type RadioButtonOption<T = string> = { fieldName?: string; label?: string; value?: T };

type RadioButtonBaseProps<T = string> = {
	actionName?: string;
	align?: 'top' | 'middle' | 'bottom';
	children?: React.ReactNode;
	label?: string;
	checked?: boolean;
	defaultChecked?: boolean;
	disabled?: boolean;
	fieldName?: string;
	value?: T;
	formValue?: string | number;
	iconChecked?: SliceIcon;
	iconUnChecked?: SliceIcon;
	iconColor?: ColorValue;
	iconColorSelected?: ColorValue;
	iconSize?: number;
	gap?: number;
	textColor?: ColorValue;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	textTopOffset?: number;
	backgroundColor?: ColorValue;
	backgroundColorSelected?: ColorValue;
	borderColor?: ColorValue;
	borderWidth?: number;
	borderRadius?: number | string;
	padding?: number | string;
	onChange?: (option: RadioButtonOption<T>, checked: boolean) => void;
};
export type RadioButtonProps<T = string> = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	| keyof RadioButtonBaseProps<T>
	| 'list'
	| 'type'
	| 'role'
	| 'size'
	| 'color'
	| 'aria-label'
	| 'aria-labelledby'
	| 'aria-checked'
> &
	RadioButtonBaseProps<T>;
