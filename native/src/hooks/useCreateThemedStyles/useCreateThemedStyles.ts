import { useMemo } from 'react';
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import { useSliceTheme } from '../../providers/SliceThemeProvider';
import type { SliceNativeTheme } from '../../theme';

/** Resolve native styles using the current provider theme. Keep the factory stable
 * (outside the component, or with useCallback) to reuse styles across renders. */
export function useCreateThemedStyles<T extends { [K in keyof T]: ViewStyle | TextStyle | ImageStyle }>(
	styles: (theme: SliceNativeTheme) => T,
): T {
	const sliceTheme = useSliceTheme();
	return useMemo(() => styles(sliceTheme), [sliceTheme, styles]);
}
