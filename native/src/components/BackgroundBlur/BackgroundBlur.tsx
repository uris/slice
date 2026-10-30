import { StyleSheet, View } from 'react-native';
import type { BackgroundBlurProps } from './_types';

/** Web/other-platform fallback. Metro selects the native implementation on iOS/Android. */
export function BackgroundBlur({ style, fallbackColor = 'rgba(128, 128, 128, 0.18)' }: Readonly<BackgroundBlurProps>) {
	return <View pointerEvents="none" style={[StyleSheet.absoluteFill, style, { backgroundColor: fallbackColor }]} />;
}
