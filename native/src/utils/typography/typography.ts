import type { TextStyle } from 'react-native';
import type { FontWeight } from '../../types/sharedTypes';

/**
 * Simple utility to take text style and returns a defined line height factor
 * Since there is no relative/percent in native, looks for the fontsize and
 * derives an absolute line height from the font size
 */
export function lineHeightTextStyle(styles: TextStyle, lineHeightFactor = 1.2): TextStyle {
	if (!Number.isFinite(lineHeightFactor) || lineHeightFactor < 0 || lineHeightFactor > 2) {
		throw new Error('lineHeightFactor must be a number between 0 and 2');
	}
	const fontSize = styles.fontSize ?? 16;
	const lineHeight = lineHeightFactor * fontSize;
	return { ...styles, lineHeight };
}

/**
 * Convert a named font weight to its numeric value, preserving numeric weights.
 */
export function numberFromFontWeight(weight?: FontWeight) {
	if (weight === undefined) return 400;
	if (typeof weight === 'number') return weight;
	switch (weight) {
		case 'thin':
			return 100;
		case 'extra light':
			return 200;
		case 'light':
			return 300;
		case 'normal':
			return 400;
		case 'medium':
			return 500;
		case 'semi':
			return 600;
		case 'bold':
			return 700;
		case 'extra':
			return 800;
		case 'heavy':
			return 900;
		default:
			return 400;
	}
}
