import { useMemo } from 'react';
import { Pressable, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useSliceTheme } from '../../providers/SliceThemeProvider';
import { SliceIcon } from '../SliceIcon';
import { StyledText } from '../SliceText/SliceText';
import type { SliceButtonProps } from './_types';

/**
 * Component logic & render
 */
export function SliceButton(props: Readonly<SliceButtonProps>) {
	const { colors, name } = useSliceTheme();
	const isLightTheme = name.includes('light');
	const {
		children,
		onPress,
		disabled = false,
		icon,
		iconPosition = 'left',
		iconSize = 24,
		animatedStyle,
		variant = 'primary',
		layout,
		presence,
		accessibilityState,
		...pressableProps
	} = props;

	const hasLabel = children !== undefined && children !== null && children !== false && children !== '';

	// adjust padding for the visual discrepancy because of the intrinsic padding of each icon
	const pressableStyle = useMemo((): StyleProp<ViewStyle> => {
		if (!hasLabel) return StyleSheet.compose(styles.pressable, styles.pressableNoLabel);
		if (icon && iconPosition === 'left') return StyleSheet.compose(styles.pressable, styles.pressableIconLeft);
		if (icon && iconPosition === 'right') return StyleSheet.compose(styles.pressable, styles.pressableIconRight);
		return styles.pressable;
	}, [icon, iconPosition, hasLabel]);

	// create a round button when the button has no label
	const wrapperStyle = useMemo((): StyleProp<ViewStyle> => {
		if (!hasLabel) return StyleSheet.compose(styles.wrapper, styles.roundWrapper);
		return styles.wrapper;
	}, [hasLabel]);

	// memoize the color styles to apply to the button/label based on variant and disabled state
	const colorStyles = useMemo(() => {
		const bgColor = variant === 'primary' ? colors['core-button-primary'] : colors['core-surface-primary'];
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
				backgroundColor: disabledBGColor ?? bgColor,
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
	}, [variant, disabled, colors, isLightTheme]);

	// primary buttons are full color and have no border
	const borderStyles = useMemo(() => {
		return StyleSheet.create({
			border: {
				borderWidth: variant === 'primary' ? 0 : 1,
				borderColor: colors['core-outline-secondary'],
			},
		});
	}, [variant, colors]);

	// disable touch events when button is disabled
	const pointerEvents = useMemo(() => {
		return StyleSheet.create({
			pointer: {
				pointerEvents: disabled ? 'none' : 'auto',
			},
		});
	}, [disabled]);

	return (
		<Reanimated.View layout={layout}>
			<Reanimated.View entering={presence?.entering} exiting={presence?.exiting}>
				<Reanimated.View
					style={[wrapperStyle, pointerEvents.pointer, colorStyles.backgroundColor, borderStyles.border, animatedStyle]}
				>
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
		borderRadius: 100,
		overflow: 'hidden',
		justifyContent: 'center',
		alignItems: 'center',
		height: 48,
		width: 'auto',
	},
	roundWrapper: {
		borderRadius: 24,
		width: 48,
		height: 48,
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
