import type { TextProps } from 'react-native';
import type { SliceNativeTheme } from '../../theme';

export type StyledTextProps = TextProps & {
	/**
	 * Keyed name of the slice type style to use
	 */
	textStyle?: keyof SliceNativeTheme['type'];
	/**
	 * Keyed name of the slice theme color to use
	 */
	textColor?: keyof SliceNativeTheme['colors'];
	/**
	 * If the text should be one line only, optionally the value of the line height to use
	 * Typically pass a value for headings to avoid large line heights
	 */
	singleLine?: number | true;
};
