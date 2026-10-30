import { StyleSheet } from 'react-native';
import NativeBackgroundBlur from '../../specs/BackgroundBlurNativeComponent';
import type { BackgroundBlurProps } from './_types';

export function BackgroundBlur({
	fadeStop = 0,
	blurIntensity = 12,
	direction = 'down',
	fallbackColor = 'rgba(128, 128, 128, 0.18)',
	style,
}: Readonly<BackgroundBlurProps>) {
	return (
		<NativeBackgroundBlur
			pointerEvents="none"
			fadeStop={Number.isFinite(fadeStop) ? Math.max(0, Math.min(1, fadeStop)) : 0}
			blurIntensity={Number.isFinite(blurIntensity) ? Math.max(0, Math.min(100, blurIntensity)) : 12}
			direction={direction}
			fallbackColor={fallbackColor}
			style={[StyleSheet.absoluteFill, style]}
		/>
	);
}
