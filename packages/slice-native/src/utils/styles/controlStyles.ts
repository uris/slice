import type { ColorValue, TextStyle, ViewStyle } from 'react-native';
import type { BorderRadius, Size } from '../../types';
import { borderRadiusToNumber, sizeToNumber } from '../sizes';

type MutableStyle<T> = { -readonly [K in keyof T]: T[K] };

type SurfaceProps = {
	borderRadius?: BorderRadius;
	borderWidth?: number;
	borderColor?: ColorValue;
	backgroundColor?: ColorValue;
	size?: Size;
};

type SurfaceDefaults = {
	borderWidth: number;
	borderColor: ColorValue;
	backgroundColor: ColorValue;
	iconOnly?: boolean;
};

/**
 * Resolve regular control geometry and paint: explicit props, style, then defaults.
 * Remove conflicting edge overrides when a uniform border prop is explicit.
 */
export function resolveControlSurface(style: ViewStyle, props: SurfaceProps, defaults: SurfaceDefaults): ViewStyle {
	const result: MutableStyle<ViewStyle> = Object.fromEntries(
		Object.entries(style).filter(([key]) => {
			if (props.borderRadius !== undefined && key.startsWith('border') && key.endsWith('Radius')) return false;
			if (props.borderWidth !== undefined && key.startsWith('border') && key.endsWith('Width')) return false;
			if (props.borderColor !== undefined && key.startsWith('border') && key.endsWith('Color')) return false;
			return true;
		}),
	);
	if (props.borderRadius !== undefined) result.borderRadius = borderRadiusToNumber(props.borderRadius);
	else result.borderRadius = style.borderRadius ?? borderRadiusToNumber('pill');
	let width = props.borderWidth ?? style.borderWidth ?? defaults.borderWidth;
	if (!Number.isFinite(width) || width < 0) width = 0;
	result.borderWidth = width;
	result.borderColor = props.borderColor ?? style.borderColor ?? defaults.borderColor;
	result.backgroundColor = props.backgroundColor ?? style.backgroundColor ?? defaults.backgroundColor;
	let minimumHeight = style.minHeight;
	if (minimumHeight === undefined && typeof style.height === 'number') minimumHeight = style.height;
	if (minimumHeight === undefined) minimumHeight = sizeToNumber();
	if (props.size !== undefined) {
		minimumHeight = sizeToNumber(props.size);
		if (props.size === 0) minimumHeight = 0;
	}
	result.minHeight = minimumHeight;
	if (defaults.iconOnly && (props.size !== undefined || style.width === undefined)) result.width = minimumHeight;
	return result;
}

const buttonContentKeys = new Set([
	'padding',
	'paddingHorizontal',
	'paddingVertical',
	'paddingLeft',
	'paddingRight',
	'paddingTop',
	'paddingBottom',
	'paddingStart',
	'paddingEnd',
	'gap',
	'rowGap',
	'columnGap',
	'alignItems',
	'justifyContent',
	'flexDirection',
]);
const textKeys = new Set([
	'color',
	'fontFamily',
	'fontSize',
	'fontStyle',
	'fontWeight',
	'fontVariant',
	'fontFeatureSettings',
	'fontVariationSettings',
	'includeFontPadding',
	'letterSpacing',
	'lineHeight',
	'textAlign',
	'textAlignVertical',
	'textDecorationColor',
	'textDecorationLine',
	'textDecorationStyle',
	'textShadowColor',
	'textShadowOffset',
	'textShadowRadius',
	'textTransform',
	'writingDirection',
	'verticalAlign',
	'userSelect',
]);

function splitStyle(style: TextStyle, contentKeys: Set<string>) {
	const surface: Record<string, unknown> = {};
	const content: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(style)) {
		if (contentKeys.has(key)) content[key] = value;
		else surface[key] = value;
	}
	return { surface: surface as MutableStyle<ViewStyle>, content: content as MutableStyle<TextStyle> };
}

/**
 * Separate button surface, ripple content, and label typography styles.
 */
export function splitButtonStyle(style: TextStyle) {
	const { surface: boxStyle, content: text } = splitStyle(style, textKeys);
	const { surface, content } = splitStyle(boxStyle, buttonContentKeys);
	return { surface, content, text };
}

/**
 * Keep input typography on the editor and box styling on the containing surface.
 */
export function splitInputStyle(style: TextStyle) {
	return splitStyle(style, textKeys);
}

/**
 * Mirror every resolved corner onto the ripple clip without copying borders.
 */
export function controlCorners(style: ViewStyle): ViewStyle {
	return Object.fromEntries(
		Object.entries(style).filter(([key]) => key.startsWith('border') && key.endsWith('Radius')),
	);
}
