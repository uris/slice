import { StyleSheet, View } from 'react-native';
import type { SliceBackgroundBlurProps } from './_types';

/** Web/other-platform fallback. Metro selects the native implementation on iOS/Android. */
export function SliceBackgroundBlur({
	style,
	fallbackColor = 'rgba(128, 128, 128, 0.18)',
}: Readonly<SliceBackgroundBlurProps>) {
	return <View pointerEvents="none" style={[StyleSheet.absoluteFill, style, { backgroundColor: fallbackColor }]} />;
}
