'use client';

import { createContext } from 'react';
import type { RadioButtonOption, RadioButtonProps } from './_types';

export type RadioGroupStyleProps = Pick<
	RadioButtonProps<unknown>,
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
	| 'gap'
>;

type RadioGroupContextValue = {
	value: unknown;
	name: string;
	disabled: boolean;
	optionProps: RadioGroupStyleProps;
	select: (option: RadioButtonOption<unknown>) => void;
};
export const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);
