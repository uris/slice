import type { ColorValue } from 'react-native';
import type { Colors } from '../../theme';
import { type SliceColorToken, type SliceColorValue, resolveSliceColor } from '../../utils/colors';

/**
 * Regular-platform fallback; Metro selects the dynamic implementation on iOS.
 */
export function getGlassInputColor(
	value: SliceColorValue | undefined,
	palette: Colors,
	defaultToken: SliceColorToken,
	_fallbackToken: SliceColorToken = defaultToken,
): ColorValue {
	return resolveSliceColor(value, palette, defaultToken);
}
