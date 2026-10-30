import type { TextStyle } from 'react-native';
import type { NativeTypography } from '../../theme';
import { numberFromFontWeight } from '../../utils/typography';
import type { TextProps } from './_types';

/**
 * Resolve public typography overrides while keeping theme line heights in points.
 */
export function textTypography(props: Readonly<TextProps>, type: NativeTypography): TextStyle {
	const token = type[props.textStyle ?? 'body-l-regular'];
	const fontSize = props.fontSize ?? token?.fontSize ?? 16;
	let fontWeight: TextStyle['fontWeight'] | number = token?.fontWeight ?? 400;
	if (props.fontWeight !== undefined) fontWeight = numberFromFontWeight(props.fontWeight);
	let lineHeight = token?.lineHeight;
	if (props.fontSize !== undefined && token?.fontSize && lineHeight !== undefined) {
		lineHeight = (fontSize * lineHeight) / token.fontSize;
	}
	if (props.lineHeight !== undefined) lineHeight = fontSize * props.lineHeight;
	if (props.singleLine) {
		let factor = 1.2;
		if (typeof props.singleLine === 'number') factor = props.singleLine;
		lineHeight = fontSize * factor;
	}
	return {
		...token,
		fontFamily: props.fontFamily ?? token?.fontFamily,
		fontSize,
		fontWeight: fontWeight as TextStyle['fontWeight'],
		lineHeight,
		letterSpacing: props.letterSpacing ?? token?.letterSpacing ?? 0,
	};
}
