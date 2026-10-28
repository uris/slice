import { useMemo } from 'react';
import { type ColorValue, Pressable, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useSliceTheme } from '../../providers';
import { borderRadiusToNumber, sizeToNumber } from '../../utils';
import { resolveSliceColor } from '../../utils/colors';
import { SliceIcon } from '../SliceIcon';
import { StyledText } from '../SliceText';
import type { SliceButtonProps } from './_types';
import { resolveButtonInsets, resolveGlassOptions } from './buttonOptions';

/**
 * Component logic & render
 */
export function SliceButtonRegular(props: Readonly<SliceButtonProps>) {
	const { colors, name } = useSliceTheme();
	const isLightTheme = name.includes('light');
	const {
		children,
		label,
		labelTextStyle = 'body-xl-bold',
		tintColor,
		iconColor: requestedIconColor,
		textColor: requestedTextColor,
		contentInsets,
		iconGap = 6,
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
	const { fallbackColor } = resolveGlassOptions(liquidGlassBackground);
	const content = label ?? children;

	const hasLabel = content !== undefined && content !== null && content !== false && content !== '';
	const insets = resolveButtonInsets({ hasLabel, icon, iconPosition, contentInsets });

	const pressableStyle = useMemo((): StyleProp<ViewStyle> => {
		if (!hasLabel) return StyleSheet.compose(styles.pressable, styles.pressableNoLabel);
		if (icon && iconPosition === 'left') return StyleSheet.compose(styles.pressable, styles.pressableIconLeft);
		if (icon && iconPosition === 'right') return StyleSheet.compose(styles.pressable, styles.pressableIconRight);
		return styles.pressable;
	}, [icon, iconPosition, hasLabel]);

	const bgColor = useMemo(() => {
		let baseBGColor = colors['core-surface-primary'];
		if (variant === 'primary') baseBGColor = colors['core-button-primary'];
		return backgroundColor ?? fallbackColor ?? baseBGColor;
	}, [backgroundColor, fallbackColor, colors, variant]);

	const iconColor = useMemo(() => {
		if (disabled) return colors['core-text-disabled'];
		if (requestedIconColor !== undefined || tintColor !== undefined)
			return resolveSliceColor(requestedIconColor ?? tintColor, colors, 'core-icon-primary');
		if (isLightTheme) return colors['core-icon-primary'];
		return colors['core-link-primary'];
	}, [disabled, colors, isLightTheme, tintColor, requestedIconColor]);

	const colorStyles = useMemo(() => {
		let buttonBackgroundColor = bgColor;
		let textColor: ColorValue = colors['core-text-primary'];
		textColor = resolveSliceColor(requestedTextColor ?? tintColor, colors, 'core-text-primary');
		if (disabled) {
			buttonBackgroundColor = colors['core-surface-secondary'];
			textColor = colors['core-text-disabled'];
		}
		return StyleSheet.create({
			backgroundColor: {
				backgroundColor: buttonBackgroundColor,
			},
			textColor: {
				color: textColor,
			},
			ripple: {
				color: 'rgba(255,255,255,0.5)',
			},
			icon: {
				color: iconColor,
			},
		});
	}, [disabled, colors, bgColor, iconColor, tintColor, requestedTextColor]);

	// Solid fallback surfaces retain the regular variant border.
	const borderStyles = useMemo(() => {
		let defaultBorderWidth = 1;
		if (variant === 'primary') defaultBorderWidth = 0;
		let finalWidth = borderWidth ?? defaultBorderWidth;
		if (!Number.isFinite(finalWidth) || finalWidth < 0) finalWidth = 0;
		return StyleSheet.create({
			border: {
				borderWidth: finalWidth,
				borderColor,
			},
		});
	}, [variant, borderColor, borderWidth]);

	// disable touch events when button is disabled
	const pointerEvents = useMemo(() => {
		let pointerEvents: ViewStyle['pointerEvents'] = 'auto';
		if (disabled) pointerEvents = 'none';
		return StyleSheet.create({
			pointer: {
				pointerEvents,
			},
		});
	}, [disabled]);

	// set the button size
	const buttonSize = useMemo(() => {
		let width: ViewStyle['width'] = 'auto';
		if (!hasLabel) width = sizeToNumber(size);
		return StyleSheet.create({
			size: {
				minHeight: sizeToNumber(size),
				width,
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

	let pressHandler = onPress;
	if (disabled) pressHandler = undefined;

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
					<Pressable
						{...pressableProps}
						accessibilityRole={pressableProps.accessibilityRole ?? 'button'}
						accessibilityState={{ ...accessibilityState, disabled }}
						disabled={disabled}
						style={[
							pressableStyle,
							{
								paddingTop: insets.top,
								paddingBottom: insets.bottom,
								paddingStart: insets.leading,
								paddingEnd: insets.trailing,
								gap: iconGap,
							},
						]}
						onPress={pressHandler}
						android_ripple={pressableProps.android_ripple ?? colorStyles.ripple}
					>
						{!!icon && iconPosition === 'left' && (
							<SliceIcon
								name={icon}
								size={iconSize}
								iconColor={colorStyles.icon.color}
								pointerEvents="none"
								accessible={false}
							/>
						)}
						{hasLabel && (
							<StyledText
								textStyle={labelTextStyle}
								style={colorStyles.textColor}
								singleLine
								numberOfLines={1}
								ellipsizeMode={'tail'}
							>
								{content}
							</StyledText>
						)}
						{!!icon && iconPosition === 'right' && (
							<SliceIcon
								name={icon}
								size={iconSize}
								iconColor={colorStyles.icon.color}
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
		justifyContent: 'center',
		alignItems: 'center',
		width: 'auto',
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
