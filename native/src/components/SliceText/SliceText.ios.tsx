import { useCallback, useState } from 'react';
import { StyleSheet, type TextStyle, type ViewStyle } from 'react-native';
import { useSliceTheme } from '../../providers/SliceThemeProvider';
import NativeGlassText, { type NativeProps } from '../../specs/GlassTextNativeComponent';
import { resolveGlassColorToken } from '../../utils/colors';
import { useGlassContent } from '../SliceLiquidGlassView/GlassContentContext';
import { StyledTextRegular } from './SliceTextRegular';
import type { StyledTextProps } from './_types';

// Only switch renderers for the subset implemented by UILabel. Unknown text
// options retain React Native behavior instead of disappearing at the bridge.
const nativeProps = new Set([
	'children',
	'textStyle',
	'textColor',
	'style',
	'singleLine',
	'numberOfLines',
	'allowFontScaling',
	'maxFontSizeMultiplier',
	'ellipsizeMode',
	'onLayout',
	'accessible',
	'accessibilityLabel',
	'accessibilityHint',
	'accessibilityRole',
	'accessibilityState',
	'accessibilityValue',
	'accessibilityLanguage',
	'testID',
	'nativeID',
	'pointerEvents',
]);
const unsupportedStyles = new Set([
	'fontStyle',
	'fontVariant',
	'fontFeatureSettings',
	'fontVariationSettings',
	'textTransform',
	'textShadowColor',
	'textShadowOffset',
	'textShadowRadius',
	'textDecorationColor',
	'textDecorationStyle',
	'writingDirection',
	'verticalAlign',
	'padding',
	'paddingTop',
	'paddingBottom',
	'paddingLeft',
	'paddingRight',
	'paddingHorizontal',
	'paddingVertical',
	'paddingStart',
	'paddingEnd',
]);

/**
 * Plain glass content uses UIKit text; rich/interactive text keeps RN semantics.
 */
export function StyledText(props: Readonly<StyledTextProps>) {
	const inGlass = useGlassContent();
	const style = StyleSheet.flatten(props.style) ?? {};
	let supported = typeof props.children === 'string' || typeof props.children === 'number';
	for (const [key, value] of Object.entries(props)) {
		if (value !== undefined && !nativeProps.has(key)) supported = false;
	}
	for (const key of Object.keys(style)) {
		if (unsupportedStyles.has(key)) supported = false;
	}
	if (style.textDecorationLine && style.textDecorationLine !== 'none') supported = false;
	if (style.textAlign === 'justify') supported = false;
	if (!inGlass || !supported) return <StyledTextRegular {...props} />;
	return <GlassText {...props} />;
}

function GlassText(props: Readonly<StyledTextProps>) {
	const { type } = useSliceTheme();
	const [size, setSize] = useState({ width: 0, height: 0 });
	const {
		children,
		textStyle,
		textColor = 'core-text-primary',
		singleLine,
		style,
		numberOfLines = 0,
		allowFontScaling = true,
		maxFontSizeMultiplier = 0,
		ellipsizeMode = 'tail',
		...viewProps
	} = props;
	const typography: TextStyle = {};
	if (textStyle) Object.assign(typography, type[textStyle]);
	Object.assign(typography, StyleSheet.flatten(style));
	const {
		fontFamily,
		fontSize = 16,
		fontWeight = '400',
		letterSpacing = 0,
		lineHeight = 0,
		textAlign = 'auto',
		color,
		textDecorationLine: _decoration,
		...layoutStyle
	} = typography;
	let resolvedLineHeight = lineHeight;
	let maximumLines = numberOfLines;
	if (singleLine) {
		let multiplier = 1.2;
		if (typeof singleLine === 'number') multiplier = singleLine;
		resolvedLineHeight = multiplier * fontSize;
		maximumLines = 1;
	}
	const onIntrinsicSizeChange = useCallback<NonNullable<NativeProps['onIntrinsicSizeChange']>>((event) => {
		const { width, height } = event.nativeEvent;
		if (!Number.isFinite(width) || !Number.isFinite(height) || width < 0 || height < 0) return;
		setSize((previous) => {
			if (previous.width === width && previous.height === height) return previous;
			return { width, height };
		});
	}, []);
	return (
		<NativeGlassText
			{...viewProps}
			text={String(children)}
			colorToken={resolveGlassColorToken(color ?? textColor, 'core-text-primary')}
			fontFamily={fontFamily}
			fontSize={fontSize}
			fontWeight={String(fontWeight)}
			letterSpacing={letterSpacing}
			lineHeight={resolvedLineHeight}
			maximumLines={maximumLines}
			allowFontScaling={allowFontScaling}
			maxFontSizeMultiplier={maxFontSizeMultiplier}
			alignment={textAlign as NativeProps['alignment']}
			ellipsize={ellipsizeMode}
			onIntrinsicSizeChange={onIntrinsicSizeChange}
			accessible={props.accessible ?? true}
			accessibilityLabel={props.accessibilityLabel ?? String(children)}
			style={[{ width: size.width, height: size.height, maxWidth: '100%', flexShrink: 1 }, layoutStyle as ViewStyle]}
		/>
	);
}
