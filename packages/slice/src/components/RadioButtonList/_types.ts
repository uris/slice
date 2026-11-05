import type React from 'react';
import type { RadioButtonOption, RadioButtonProps } from '../RadioButton';

export type RadioButtonListOption<T = string> = Omit<RadioButtonProps<T>, 'checked' | 'defaultChecked' | 'name'> & {
	value: T;
};

type RadioButtonListBaseProps<T = string> = {
	children?: React.ReactNode;
	options?: RadioButtonListOption<T>[];
	value?: T | null;
	defaultValue?: T | null;
	name?: string;
	label?: string;
	disabled?: boolean;
	direction?: 'row' | 'column';
	wrap?: boolean;
	gap?: number;
	itemGap?: number;
	marginBottom?: number | string;
	width?: number | string;
	onChange?: (value: T, option: RadioButtonOption<T>) => void;
};

type OptionStyleProps<T> = Pick<
	RadioButtonProps<T>,
	| 'align'
	| 'iconChecked'
	| 'iconUnChecked'
	| 'iconSize'
	| 'iconColor'
	| 'iconColorSelected'
	| 'textColor'
	| 'textSize'
	| 'textTopOffset'
	| 'backgroundColor'
	| 'backgroundColorSelected'
	| 'borderWidth'
	| 'borderColor'
	| 'borderRadius'
	| 'padding'
>;
export type RadioButtonListProps<T = string> = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof RadioButtonListBaseProps<T> | keyof OptionStyleProps<T> | 'children' | 'role' | 'color'
> &
	RadioButtonListBaseProps<T> &
	OptionStyleProps<T>;
