import { light } from './colors';
import type { Colors } from './types';

export type ColorToken = keyof Colors;

/** Theme token names with autocomplete, while retaining arbitrary CSS colors. */
export type ColorValue = ColorToken | (string & {});

const colorTokens = new Set<string>(Object.keys(light));

/** Resolve theme tokens to live CSS variables; leave CSS values unchanged. */
export function resolveColor(value: ColorValue): string;
export function resolveColor<T extends string | number | null | undefined>(value: T): T | string;
export function resolveColor(value: string | number | null | undefined) {
	return typeof value === 'string' && colorTokens.has(value) ? `var(--${value})` : value;
}
