import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

export type ErrorMessage = {
	title: string;
	message?: string | string[];
};

type ErrorSummaryBaseProps = {
	entries?: ErrorMessage[];
	textColor?: ColorValue;
	autoNumber?: boolean;
	backgroundColor?: ColorValue;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
};

export type ErrorSummaryProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof ErrorSummaryBaseProps> &
	ErrorSummaryBaseProps;
