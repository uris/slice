import type { Transition } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type SwitchBaseProps<T = string> = {
	checked?: boolean;
	defaultChecked?: boolean;
	borderRadius?: number | string;
	height?: number;
	width?: number;
	backgroundColorOff?: ColorValue;
	backgroundColorOn?: ColorValue;
	knobColor?: ColorValue;
	knobRadius?: number | string;
	knobWidth?: number;
	padding?: number;
	/** Settings merged with Water for knob movement and knob/track color changes. */
	transition?: Transition;
	/** Callback metadata, not a submitted form value. */
	value?: T;
	onChange?: (value: T | undefined, checked: boolean) => void;
};

/** Native button events are supported; Motion gestures and callbacks are not part of this API. */
export type SwitchProps<T = string> = Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	keyof SwitchBaseProps<T> | 'children' | 'dangerouslySetInnerHTML'
> &
	SwitchBaseProps<T>;
