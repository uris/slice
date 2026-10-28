import type { TextProps } from 'react-native';
import type { SliceNativeTheme } from '../../theme';
import type { SliceColorValue } from '../../utils/colors';

export type StyledTextProps = TextProps & {
	/**
	 * Keyed name of the slice type style to use
	 */
	textStyle?: keyof SliceNativeTheme['type'];
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
