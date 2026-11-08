import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme';

export type ErrorMessage = {
	id?: string;
	title: string;
	message?: string | string[];
	fieldName?: string;
};

type ErrorSummaryBaseProps = {
	entries?: ErrorMessage[];
	announcement?: 'polite' | 'assertive' | 'off';
	summaryName?: string;
	textColor?: ColorValue;
	backgroundColor?: ColorValue;
	borderColor?: ColorValue;
	borderWidth?: number | string;
	borderRadius?: number | string;
	padding?: number | string;
	gap?: number | string;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	transition?: Transition;
	motionValues?: Variants;
};

export type ErrorSummaryProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof ErrorSummaryBaseProps | keyof React.AriaAttributes | 'role' | 'children' | 'dangerouslySetInnerHTML'
> &
	ErrorSummaryBaseProps;
