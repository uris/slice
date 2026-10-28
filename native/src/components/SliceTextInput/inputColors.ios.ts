import { type ColorValue, DynamicColorIOS } from 'react-native';
import { type Colors, darkTheme, lightTheme } from '../../theme';
import { type SliceColorToken, type SliceColorValue, resolveGlassColorToken } from '../../utils/colors';

const foregrounds = new Map<SliceColorToken, ColorValue>();

/**
 * Retain both palette variants in native dynamic colors; no asset-bundle lookup.
 */
export function getGlassInputColor(
	value: SliceColorValue | undefined,
	_palette: Colors,
	defaultToken: SliceColorToken,
	fallbackToken: SliceColorToken = defaultToken,
): ColorValue {
	const token = resolveGlassColorToken(value, defaultToken, fallbackToken);
	let color = foregrounds.get(token);
	if (!color) {
		color = DynamicColorIOS({ light: lightTheme.colors[token], dark: darkTheme.colors[token] });
		foregrounds.set(token, color);
	}
	return color;
}
