import type React from 'react';
import type { ElevationLevel } from '../theme/elevations/_types';
import type { SizeValue } from '../theme/resolveSize';

/** Shadow depth of a component's own surface, independent of stacking order. */
export type ElevationProps = {
	/** Omitted uses the component default; 0 removes the elevation shadow. */
	elevation?: ElevationLevel;
};

/** Shared named sizes. Components exclude tiers they do not support. */
export type ComponentSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'auto';
export type FixedSize = Exclude<ComponentSize, 'auto'>;
export type ButtonSize = Exclude<ComponentSize, 'xs'> | number;

export type PaddingProps = {
	padding?: SizeValue;
	paddingTop?: SizeValue;
	paddingRight?: SizeValue;
	paddingBottom?: SizeValue;
	paddingLeft?: SizeValue;
};

export type ButtonStyleProps = PaddingProps & {
	buttonSize?: ButtonSize;
	gap?: SizeValue;
};

export const buttonStyleDefaults = {
	gap: 6,
	iconSize: 18,
	minIconSize: 14,
	minIconStrokeWidth: 1.25,
	sizes: { s: 24, m: 32, l: 44, xl: 56 },
	padding: {
		horizontal: 'calc(var(--spacing-s) + var(--spacing-xs))',
		icon: 'var(--spacing-s)',
		outside: 'var(--spacing-xs)',
		childrenTop: 6,
		childrenBottom: 6,
	},
} as const;

export type ToolTip = {
	type?: ToolTipType;
	payload?: { label: string; duration?: number };
	ref?: React.RefObject<any> | null;
	event?: MouseEvent | React.MouseEvent<any>;
};

export enum ToolTipType {
	menu = 'menu',
	button = 'button',
	general = 'general',
	other = 'other',
}

export type ToolTipInfo = {
	title?: string | null;
	description?: string | null;
	image?: string | null;
};
