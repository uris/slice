import type React from 'react';

export type ErrorMessage = {
	title: string;
	message?: string | string[];
};

type ErrorSummaryBaseProps = {
	entries?: ErrorMessage[];
	textColor?: string;
	autoNumber?: boolean;
	backgroundColor?: string;
	bgColor?: string;
	textSize?: 'xs' | 's' | 'm' | 'l';
};

export type ErrorSummaryProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof ErrorSummaryBaseProps> &
	ErrorSummaryBaseProps;
