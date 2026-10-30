import type { TextProps as NativeTextProps } from 'react-native';
import type { SliceNativeTheme } from '../../theme';
import type { FontWeight } from '../../types';
import type { SliceColorValue } from '../../utils/colors';

export type TextProps = NativeTextProps & {
	/**
	 * Keyed name of the slice type style to use
	 */
	textStyle?: keyof SliceNativeTheme['type'];
	/**
	 * Font family to use. Defaults to the text style when omitted
	 */
	fontFamily?: string;
	/**
	 * Font size to use. Defaults to text style if no font size is provided
	 */
	fontSize?: number;
	/**
	 * Line height as a factor of font size e.g. 1.2 = fontSize * 1.2. Defaults to text style
	 * if no value is provided
	 */
	lineHeight?: number;
	/**
	 * Font Weight as a number accepting light, normal, medium, semi, bold and a raw number. Default
	 * to text style if no value is provided
	 */
	fontWeight?: FontWeight;
	/**
	 * Character spacing in points. Defaults to the text style when omitted
	 */
	letterSpacing?: number;
	/**
	 * Slice color token or React Native color value. Glass resolves palette values
	 * to native tokens and falls back to core-text-primary when unmatched.
	 */
	textColor?: SliceColorValue;
	/**
	 * If the text should be one line only, optionally the value of the line height to use
	 * Typically pass a value for headings to avoid large line heights
	 */
	singleLine?: number | true;
};
