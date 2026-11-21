import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme';
import type { RadiusValue, SizeValue } from '../../theme/resolveSize';
import type { ElevationProps } from '../sharedTypes';

export type ErrorMessage = {
	id?: string;
	title: string;
	message?: string | string[];
	fieldName?: string;
};

type ErrorSummaryBaseProps = ElevationProps & {
	entries?: ErrorMessage[];
	announcement?: 'polite' | 'assertive' | 'off';
	summaryName?: string;
	textColor?: ColorValue;
	backgroundColor?: ColorValue;
	borderColor?: ColorValue;
	borderWidth?: number | string;
	borderRadius?: RadiusValue;
	padding?: SizeValue;
	gap?: SizeValue;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	transition?: Transition;
	motionValues?: Variants;
};

export type ErrorSummaryProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof ErrorSummaryBaseProps | keyof React.AriaAttributes | 'role' | 'children' | 'dangerouslySetInnerHTML'
> &
	ErrorSummaryBaseProps;
