import { type ColorValue, processColor } from 'react-native';
import { type Colors, darkTheme, lightTheme } from '../../theme';

/**
 * A semantic Slice foreground token or a React Native color value.
 */
export type SliceColorValue = keyof Colors | ColorValue;
/**
 * Name of a semantic Slice color, shared by JS palettes and native assets.
 */
export type SliceColorToken = keyof Colors;

/**
 * Tests names before touching native color conversion.
 */
export function isSliceColorToken(value: unknown): value is SliceColorToken {
	return typeof value === 'string' && Object.hasOwn(lightTheme.colors, value);
}

/**
 * Regular rendering preserves literal/native values and resolves named tokens.
 */
export function resolveSliceColor(
	value: SliceColorValue | undefined,
	palette: Colors,
	defaultToken: SliceColorToken,
): ColorValue {
	if (value === undefined) return palette[defaultToken];
	if (isSliceColorToken(value)) return palette[value];
	return value;
}

/**
 * Glass keeps native token identity. Recover palette literals when possible;
 * ambiguous values favor the default token, then the component's text/icon role.
 * Unmatched values use fallbackToken instead of sending an invalid asset name.
 */
export function resolveGlassColorToken(
	value: SliceColorValue | undefined,
	defaultToken: SliceColorToken,
	fallbackToken: SliceColorToken = defaultToken,
): SliceColorToken {
	if (value === undefined) return defaultToken;
	if (isSliceColorToken(value)) return value;
	const candidate = processColor(value);
	if (typeof candidate !== 'number') return fallbackToken;
	const matches = (token: SliceColorToken) =>
		processColor(lightTheme.colors[token]) === candidate || processColor(darkTheme.colors[token]) === candidate;
	if (matches(defaultToken)) return defaultToken;
	let role = 'core-text-';
	if (defaultToken.startsWith('core-icon-')) role = 'core-icon-';
	const tokens = Object.keys(lightTheme.colors) as SliceColorToken[];
	for (const token of tokens) if (token.startsWith(role) && matches(token)) return token;
	for (const token of tokens) if (matches(token)) return token;
	return fallbackToken;
}
