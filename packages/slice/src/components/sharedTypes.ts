import type React from 'react';

/** Shared named sizes. Components exclude tiers they do not support. */
export type ComponentSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'auto';
export type FixedSize = Exclude<ComponentSize, 'auto'>;
export type ButtonSize = Exclude<ComponentSize, 'xs'> | number;

export type PaddingProps = {
	padding?: number | string;
	paddingTop?: number | string;
	paddingRight?: number | string;
	paddingBottom?: number | string;
	paddingLeft?: number | string;
};

export type ButtonStyleProps = PaddingProps & {
	buttonSize?: ButtonSize;
	gap?: number;
};

export const buttonStyleDefaults = {
	gap: 6,
	iconSize: 20,
	minIconSize: 14,
	minIconStrokeWidth: 1.5,
	sizes: { s: 24, m: 36, l: 44, xl: 56 },
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
