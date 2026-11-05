import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type BadgeBaseProps = {
	/** Override the variant's background with a theme token or CSS color. */
	backgroundColor?: ColorValue;
	/** Override the variant's text with a theme token or CSS color. */
	textColor?: ColorValue;
	/** Number or short label. Missing, blank, and non-finite values are hidden. Numbers above 99 display as 99+. */
	count?: number | string | null;
	/** Hide numeric zero. Defaults to true; string labels are not parsed as numbers. */
	hideZero?: boolean;
	/** Theme color preset. Defaults to dark. */
	variant?: 'light' | 'dark';
};

export type BadgeProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof BadgeBaseProps | 'children' | 'color'> &
	BadgeBaseProps;
