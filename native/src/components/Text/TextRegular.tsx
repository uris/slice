import { Text as NativeText } from 'react-native';
import { useSliceTheme } from '../../providers';
import { resolveSliceColor } from '../../utils/colors';
import { GlassContentContext } from '../LiquidGlass/GlassContentContext';
import type { TextProps } from './_types';
import { textTypography } from './textTypography';

/**
 * Utility wrapper around text component for easier styling of text using slice theme
 */
export function TextRegular(props: Readonly<TextProps>) {
	const { type, colors } = useSliceTheme();
	const {
		textStyle: _textStyle,
		textColor,
		style,
		singleLine,
		children,
		fontWeight: _fontWeight,
		fontSize: _fontSize,
		fontFamily: _fontFamily,
		lineHeight: _lineHeight,
		letterSpacing: _letterSpacing,
		...rest
	} = props;
	const computedStyle = {
		...textTypography(props, type),
		color: resolveSliceColor(textColor, colors, 'core-text-primary'),
	};

	let numberOfLines = rest.numberOfLines;
	if (singleLine) numberOfLines = 1;

	return (
		<NativeText {...rest} numberOfLines={numberOfLines} style={[computedStyle, style]}>
			<GlassContentContext.Provider value={false}>{children}</GlassContentContext.Provider>
		</NativeText>
	);
}
