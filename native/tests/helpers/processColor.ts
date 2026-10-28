import normalizeColor from '@react-native/normalize-colors';

/**
 * Use RN's real pure color parser without importing its native runtime into jsdom.
 * The opaque object branch matches processColor's preservation of native colors.
 */
export function processColor(value: unknown) {
	if (typeof value === 'object' && value !== null) return value;
	const rgba = normalizeColor(value);
	if (rgba == null) return undefined;
	return ((rgba << 24) | (rgba >>> 8)) >>> 0;
}
