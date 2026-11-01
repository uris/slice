import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type SwitchBaseProps<T = string> = {
	fieldName?: string;
	state?: boolean;
	height?: number;
	width?: number;
	backgroundColorOff?: ColorValue;
	backgroundColorOn?: ColorValue;
	knobColor?: ColorValue;
	padding?: number;
	value?: T;
	onChange?: (value: T | undefined, state: boolean) => void;
};

export type SwitchProps<T = string> = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof SwitchBaseProps> &
	SwitchBaseProps<T>;
