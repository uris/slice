import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

export interface SliceBackgroundBlurProps {
	/**
	 * iOS only: direction from transparent to fully blurred. Defaults to 'down'.
	 * down: top to bottom; up: bottom to top;
	 * left: right to left; right: left to right.
	 */
	direction?: 'down' | 'up' | 'left' | 'right';
	/**
	 * iOS only: fraction of the view over which blur fades in (0–1).
	 * Defaults to 0, which renders uniform blur without a mask.
	 */
	fadeStop?: number;
	/**
	 * The intensity of the background blur effect. Defaults to 12
	 */
	blurIntensity?: number;
	/**
	 * Attach styles to the background view as View Style
	 */
	style?: StyleProp<ViewStyle>;
	/** Color used when native blur is unavailable or Reduce Transparency is enabled. */
	fallbackColor?: ColorValue;
}
