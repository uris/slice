import type React from 'react';

type SwitchBaseProps<T = string> = {
	fieldName?: string;
	state?: boolean;
	height?: number;
	width?: number;
	backgroundColorOff?: string;
	backgroundColorOn?: string;
	bgColorOff?: string;
	bgColorOn?: string;
	knobColor?: string;
	padding?: number;
	value?: T;
	onChange?: (value: T | undefined, state: boolean) => void;
};

export type SwitchProps<T = string> = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof SwitchBaseProps> &
	SwitchBaseProps<T>;
