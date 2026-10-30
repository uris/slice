import type { BorderRadius, Size } from '../../types/sharedTypes';

/**
 * Internal utility converting size props to an absolute number
 */
export function sizeToNumber(size?: Size): number {
	if (!size) return 48;
	if (typeof size === 'number') return size;
	switch (size) {
		case 's': {
			return 40;
		}
		case 'm': {
			return 48;
		}
		case 'l': {
			return 56;
		}
		default:
			return 48;
	}
}

/** Resolve radius presets; invalid or negative values produce square corners. */
export function borderRadiusToNumber(borderRadius?: BorderRadius): number {
	if (typeof borderRadius === 'number') return Number.isFinite(borderRadius) ? Math.max(0, borderRadius) : 0;
	switch (borderRadius) {
		case 'pill':
			return 1000;
		case 'rectangular':
			return 4;
		default:
			return 0;
	}
}
