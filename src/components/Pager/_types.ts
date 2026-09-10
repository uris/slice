import type React from 'react';

type PagerBaseProps = {
	size?: number;
	index?: number;
	color?: string;
	colorOn?: string;
	colorHover?: string;
	pages?: number;
	gap?: number;
	onChange?: (index: number) => void;
};

export type PagerProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof PagerBaseProps> & PagerBaseProps;
