import type React from 'react';

export type RadioButtonOption<T = string> = {
	fieldName?: string;
	label?: string;
	value?: T;
};

type RadioButtonBaseProps<T = string> = {
	children?: React.ReactNode;
	label?: string;
	fieldName?: string;
	value?: T;
	selected?: boolean;
	controlType?: 'radio' | 'checkbox';
	deselect?: boolean;
	tabIndex?: number;
	wrap?: boolean;
	list?: boolean;
	hideRadio?: boolean;
	iconColor?: string;
	noFrame?: boolean;
	gap?: number;
	icon?: string;
	checkedIcon?: string;
	onChange?: (option: RadioButtonOption<T>, selected: boolean) => void;
};

export type RadioButtonProps<T = string> = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	keyof RadioButtonBaseProps
> &
	RadioButtonBaseProps<T>;
