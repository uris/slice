import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type PagerBaseProps = {
	size?: number;
	index?: number;
	color?: ColorValue;
	colorOn?: string;
	colorHover?: string;
	pages?: number;
	gap?: number;
	onChange?: (index: number) => void;
};

export type PagerProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof PagerBaseProps> & PagerBaseProps;
