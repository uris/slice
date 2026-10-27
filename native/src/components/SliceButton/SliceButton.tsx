import { useMemo } from 'react';
import { Pressable, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useDeviceCapabilities } from '../../hooks';
import { useSliceTheme } from '../../providers';
import { borderRadiusToNumber, sizeToNumber } from '../../utils';
import { SliceIcon } from '../SliceIcon';
import { SliceLiquidGlassView } from '../SliceLiquidGlassView';
import { StyledText } from '../SliceText';
import type { SliceButtonProps } from './_types';

/**
 * Component logic & render
 */
export function SliceButton(props: Readonly<SliceButtonProps>) {
	const { colors, name } = useSliceTheme();
	const { supportsLiquidGlass } = useDeviceCapabilities();
	const isLightTheme = name.includes('light');
	const {
		children,
		onPress,
		disabled = false,
		icon,
		iconPosition = 'left',
		iconSize = 24,
		size = 'm',
		animatedStyle,
		variant = 'primary',
		layout,
		presence,
		accessibilityState,
		liquidGlassBackground,
		borderRadius = 'pill',
		borderWidth,
		borderColor = colors['core-outline-secondary'],
		backgroundColor,
		...pressableProps
	} = props;
	const { fallbackColor, glassTintColor, glassStyle } = liquidGlassBackground ?? {};
	const applyLiquidGlass = Boolean(liquidGlassBackground) && supportsLiquidGlass;

	const hasLabel = children !== undefined && children !== null && children !== false && children !== '';

	const pressableStyle = useMemo((): StyleProp<ViewStyle> => {
		if (!hasLabel) return StyleSheet.compose(styles.pressable, styles.pressableNoLabel);
		if (icon && iconPosition === 'left') return StyleSheet.compose(styles.pressable, styles.pressableIconLeft);
		if (icon && iconPosition === 'right') return StyleSheet.compose(styles.pressable, styles.pressableIconRight);
		return styles.pressable;
	}, [icon, iconPosition, hasLabel]);

	const bgColor = useMemo(() => {
		if (applyLiquidGlass) return 'transparent';
		const baseBGColor = variant === 'primary' ? colors['core-button-primary'] : colors['core-surface-primary'];
		return backgroundColor ?? fallbackColor ?? baseBGColor;
	}, [applyLiquidGlass, backgroundColor, fallbackColor, colors, variant]);

	const colorStyles = useMemo(() => {
		const disabledBGColor = disabled ? colors['core-surface-secondary'] : undefined;
		const color = colors['core-text-primary'];
		const disabledColor = disabled ? colors['core-text-disabled'] : undefined;
		const iconColor = disabled
			? disabledColor
			: isLightTheme
				? colors['core-icon-primary']
				: colors['core-link-primary'];
		return StyleSheet.create({
			backgroundColor: {
				backgroundColor: applyLiquidGlass ? 'transparent' : (disabledBGColor ?? bgColor),
			},
			textColor: {
				color: disabledColor ?? color,
			},
			ripple: {
				color: 'rgba(255,255,255,0.5)',
			},
			icon: {
				color: iconColor,
			},
		});
	}, [applyLiquidGlass, disabled, colors, isLightTheme, bgColor]);

	// Preserve variant defaults while allowing an explicit zero-width border.
	const borderStyles = useMemo(() => {
		const width = borderWidth ?? (variant === 'primary' ? 0 : 1);
		return StyleSheet.create({
			border: {
				borderWidth: Number.isFinite(width) ? Math.max(0, width) : 0,
				borderColor,
			},
		});
	}, [variant, borderColor, borderWidth]);

	// disable touch events when button is disabled
	const pointerEvents = useMemo(() => {
		return StyleSheet.create({
			pointer: {
				pointerEvents: disabled ? 'none' : 'auto',
			},
		});
	}, [disabled]);

	// set the button size
	const buttonSize = useMemo(() => {
		return StyleSheet.create({
			size: {
				minHeight: sizeToNumber(size),
				width: hasLabel ? 'auto' : sizeToNumber(size),
			},
		});
	}, [size, hasLabel]);

	// set the button border radius
	const cornerRadius = useMemo(() => {
		return StyleSheet.create({
			borderRadius: {
				borderRadius: borderRadiusToNumber(borderRadius),
			},
		});
	}, [borderRadius]);

	return (
		<Reanimated.View layout={layout}>
			<Reanimated.View entering={presence?.entering} exiting={presence?.exiting}>
				<Reanimated.View
					style={[
						styles.wrapper,
						pointerEvents.pointer,
						colorStyles.backgroundColor,
						buttonSize.size,
						borderStyles.border,
						cornerRadius.borderRadius,
						animatedStyle,
					]}
				>
					{applyLiquidGlass && (
						<SliceLiquidGlassView
							cornerRadius={borderRadiusToNumber(borderRadius)}
							fallbackColor={fallbackColor}
							glassTintColor={glassTintColor}
							glassStyle={glassStyle}
							style={styles.background}
						/>
					)}
					<Pressable
						{...pressableProps}
						accessibilityRole={pressableProps.accessibilityRole ?? 'button'}
						accessibilityState={{ ...accessibilityState, disabled }}
						disabled={disabled}
						style={pressableStyle}
						onPress={disabled ? undefined : onPress}
						android_ripple={pressableProps.android_ripple ?? colorStyles.ripple}
					>
						{icon && iconPosition === 'left' && (
							<SliceIcon
								name={icon}
								size={iconSize}
								strokeColor={colorStyles.icon.color}
								pointerEvents="none"
								accessible={false}
							/>
						)}
						{hasLabel && (
							<StyledText
								textStyle={'body-xl-bold'}
								style={colorStyles.textColor}
								singleLine
								numberOfLines={1}
								ellipsizeMode={'tail'}
							>
								{children}
							</StyledText>
						)}
						{icon && iconPosition === 'right' && (
							<SliceIcon
								name={icon}
								size={iconSize}
								strokeColor={colorStyles.icon.color}
								pointerEvents="none"
								accessible={false}
							/>
						)}
					</Pressable>
				</Reanimated.View>
			</Reanimated.View>
		</Reanimated.View>
	);
}

/**
 * Base Styles
 */
const styles = StyleSheet.create({
	wrapper: {
		position: 'relative',
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
		width: 'auto',
	},
	background: {
		position: 'absolute',
		inset: 0,
	},
	pressable: {
		flex: 1,
		flexDirection: 'row',
		gap: 6,
		paddingHorizontal: 16,
		justifyContent: 'center',
		alignItems: 'center',
	},
	pressableIconLeft: {
		paddingLeft: 16,
		paddingRight: 22,
	},
	pressableIconRight: {
		paddingLeft: 22,
		paddingRight: 16,
	},
	pressableNoLabel: {
		paddingLeft: 0,
		paddingRight: 0,
	},
});
