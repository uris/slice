import { memo } from 'react';
import { useColorScheme } from 'react-native';
import Svg from 'react-native-svg';
import { useOptionalSliceTheme } from '../../providers/SliceThemeProvider';
import { darkTheme, lightTheme } from '../../theme';
import { resolveSliceColor } from '../../utils/colors';
import type { IconProps } from './_types';
import { STATIC_ICON_REGISTRY } from './iconRegistry';

export const SliceIcon = memo((props: IconProps) => {
	let dark = useColorScheme() === 'dark';
	const optionalTheme = useOptionalSliceTheme();
	if (optionalTheme) dark = optionalTheme.name === 'darkMode';
	const {
		name = 'home',
		size = 20,
		stroke = 1.5,
		iconColor,
		fillColor,
		fill = false,
		coverUp = dark ? '#000000' : '#ffffff',
		toggle = false,
		disabled = false,
		onPress,
		onPressIn,
		onPressOut,
		onLongPress,
		accessibilityState,
		opacity = 1,
		...svgProps
	} = props;
	let palette = lightTheme.colors;
	if (dark) palette = darkTheme.colors;
	if (optionalTheme) palette = optionalTheme.colors;
	let foreground = iconColor;
	if (foreground === undefined) {
		foreground = '#000000';
		if (dark) foreground = '#ffffff';
	}
	const resolvedStrokeColor = resolveSliceColor(foreground, palette, 'core-icon-primary');
	const variant = STATIC_ICON_REGISTRY.get(name);
	const shape = toggle ? (variant?.lineOn ?? variant?.line) : variant?.line;
	if (!shape) return null;

	return (
		<Svg
			width={size}
			height={size}
			viewBox="0 0 20 20"
			fill="none"
			accessibilityRole={onPress || onLongPress ? 'button' : 'image'}
			accessibilityLabel={`${name} icon`}
			{...svgProps}
			disabled={disabled}
			opacity={disabled ? Number(opacity) * 0.5 : opacity}
			accessibilityState={{ ...accessibilityState, disabled }}
			onPress={disabled ? undefined : onPress}
			onPressIn={disabled ? undefined : onPressIn}
			onPressOut={disabled ? undefined : onPressOut}
			onLongPress={disabled ? undefined : onLongPress}
		>
			{shape({
				stroke,
				strokeColor: resolvedStrokeColor,
				fillColor: fill ? (fillColor ?? (dark ? 0.2 : 0.125)) : 0,
				coverUp,
			})}
		</Svg>
	);
});

SliceIcon.displayName = 'SliceIcon';
