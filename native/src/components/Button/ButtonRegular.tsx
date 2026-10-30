import { useMemo } from 'react';
import { type ColorValue, I18nManager, Pressable, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useSliceTheme } from '../../providers';
import { resolveSliceColor } from '../../utils/colors';
import { controlCorners, resolveControlSurface, splitButtonStyle } from '../../utils/styles/controlStyles';
import { Icon } from '../Icon';
import { Text } from '../Text';
import type { ButtonProps } from './_types';
import { resolveButtonInsets, resolveGlassOptions } from './buttonOptions';

/**
 * Component logic & render
 */
export function ButtonRegular(props: Readonly<ButtonProps>) {
	const { colors, name, type } = useSliceTheme();
	const isLightTheme = name.includes('light');
	const {
		children,
		label,
		labelTextStyle = 'body-xl-bold',
		tintColor,
		iconColor: requestedIconColor,
		textColor: requestedTextColor,
		contentInsets,
		iconGap,
		onPress,
		disabled = false,
		icon,
		iconPosition = 'left',
		iconSize = 24,
		size,
		animatedStyle,
		variant = 'primary',
		layout,
		presence,
		accessibilityState,
		liquidGlassBackground,
		borderRadius,
		borderWidth,
		borderColor,
		backgroundColor,
		style,
		...pressableProps
	} = props;
	const { fallbackColor } = resolveGlassOptions(liquidGlassBackground);
	const content = label ?? children;

	const hasLabel = content !== undefined && content !== null && content !== false && content !== '';
	const defaults = resolveButtonInsets({ hasLabel, icon, iconPosition });
	const { surface, content: contentStyle, text: textStyle } = splitButtonStyle(StyleSheet.flatten(style) ?? {});
	let leadingPadding = contentStyle.paddingLeft;
	let trailingPadding = contentStyle.paddingRight;
	if (I18nManager.isRTL) {
		leadingPadding = contentStyle.paddingRight;
		trailingPadding = contentStyle.paddingLeft;
	}
	const insets = {
		top:
			contentInsets?.top ??
			contentStyle.paddingTop ??
			contentStyle.paddingVertical ??
			contentStyle.padding ??
			defaults.top,
		bottom:
			contentInsets?.bottom ??
			contentStyle.paddingBottom ??
			contentStyle.paddingVertical ??
			contentStyle.padding ??
			defaults.bottom,
		leading:
			contentInsets?.leading ??
			contentStyle.paddingStart ??
			leadingPadding ??
			contentStyle.paddingHorizontal ??
			contentStyle.padding ??
			defaults.leading,
		trailing:
			contentInsets?.trailing ??
			contentStyle.paddingEnd ??
			trailingPadding ??
			contentStyle.paddingHorizontal ??
			contentStyle.padding ??
			defaults.trailing,
	};
	let defaultBorderWidth = 1;
	let defaultBackgroundColor = colors['core-surface-primary'];
	if (variant === 'primary') defaultBackgroundColor = colors['core-button-primary'];
	if (variant === 'primary') defaultBorderWidth = 0;
	const regularSurface = resolveControlSurface(surface, props, {
		borderWidth: defaultBorderWidth,
		borderColor: colors['core-outline-secondary'],
		backgroundColor: fallbackColor ?? defaultBackgroundColor,
		iconOnly: !hasLabel,
	});
	const corners = controlCorners(regularSurface);
	if (iconGap !== undefined) {
		contentStyle.columnGap = iconGap;
		contentStyle.rowGap = iconGap;
	}

	const pressableStyle = useMemo((): StyleProp<ViewStyle> => {
		if (!hasLabel) return StyleSheet.compose(styles.pressable, styles.pressableNoLabel);
		if (icon && iconPosition === 'left') return StyleSheet.compose(styles.pressable, styles.pressableIconLeft);
		if (icon && iconPosition === 'right') return StyleSheet.compose(styles.pressable, styles.pressableIconRight);
		return styles.pressable;
	}, [icon, iconPosition, hasLabel]);

	const iconColor = useMemo(() => {
		if (disabled) return colors['core-text-disabled'];
		if (requestedIconColor !== undefined || tintColor !== undefined)
			return resolveSliceColor(requestedIconColor ?? tintColor, colors, 'core-icon-primary');
		if (variant === 'primary') return colors['core-text-light'];
		if (isLightTheme) return colors['core-icon-primary'];
		return colors['core-link-primary'];
	}, [disabled, colors, isLightTheme, tintColor, requestedIconColor, variant]);

	const colorStyles = useMemo(() => {
		let buttonBackgroundColor = regularSurface.backgroundColor;
		let textColor: ColorValue;
		let defaultTextColor: 'core-text-primary' | 'core-text-light' = 'core-text-primary';
		if (variant === 'primary') defaultTextColor = 'core-text-light';
		textColor = resolveSliceColor(requestedTextColor ?? tintColor ?? textStyle.color, colors, defaultTextColor);
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
	}, [
		disabled,
		colors,
		regularSurface.backgroundColor,
		iconColor,
		tintColor,
		requestedTextColor,
		textStyle.color,
		variant,
	]);

	// A single style object can contain both surface and label values. Explicit
	// typography props retain priority; single-line defaults follow the final size.
	const labelStyle = { ...textStyle };
	if (props.labelTextStyle !== undefined) Object.assign(labelStyle, type[labelTextStyle]);
	if (props.labelTextStyle !== undefined || textStyle.lineHeight === undefined) {
		const fontSize = labelStyle.fontSize ?? type[labelTextStyle].fontSize ?? 17;
		labelStyle.lineHeight = fontSize * 1.2;
	}
	labelStyle.color = colorStyles.textColor.color;

	// disable touch events when button is disabled
	const pointerEvents = useMemo(() => {
		let pointerEvents: ViewStyle['pointerEvents'] = props.pointerEvents ?? surface.pointerEvents ?? 'auto';
		if (disabled) pointerEvents = 'none';
		return StyleSheet.create({
			pointer: {
				pointerEvents,
			},
		});
	}, [disabled, props.pointerEvents, surface.pointerEvents]);

	let pressHandler = onPress;
	if (disabled) pressHandler = undefined;

	return (
		<Reanimated.View layout={layout}>
			<Reanimated.View entering={presence?.entering} exiting={presence?.exiting}>
				<Reanimated.View
					style={[
						styles.wrapper,
						regularSurface,
						colorStyles.backgroundColor,
						pointerEvents.pointer,
						{ overflow: 'hidden' },
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
							contentStyle,
							corners,
							{
								paddingTop: insets.top,
								paddingBottom: insets.bottom,
								paddingStart: insets.leading,
								paddingEnd: insets.trailing,
								gap: iconGap ?? contentStyle.gap ?? 6,
							},
						]}
						onPress={pressHandler}
						android_ripple={pressableProps.android_ripple ?? { ...colorStyles.ripple, borderless: false }}
					>
						{!!icon && iconPosition === 'left' && (
							<Icon
								name={icon}
								size={iconSize}
								iconColor={colorStyles.icon.color}
								pointerEvents="none"
								accessible={false}
							/>
						)}
						{hasLabel && (
							<Text textStyle={labelTextStyle} style={labelStyle} singleLine numberOfLines={1} ellipsizeMode={'tail'}>
								{content}
							</Text>
						)}
						{!!icon && iconPosition === 'right' && (
							<Icon
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
		// The wrapper centers content; explicitly stretch the native ripple host
		// across its full width and clip feedback to the button's rounded shape.
		alignSelf: 'stretch',
		overflow: 'hidden',
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
