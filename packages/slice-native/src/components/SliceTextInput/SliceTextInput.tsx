import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, type TextInputInstance, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useCreateThemedStyles, useDeviceCapabilities } from '../../hooks';
import { useSliceTheme } from '../../providers';
import type { SliceNativeTheme } from '../../theme';
import type { LiquidGlassBackground } from '../../types/sharedTypes';
import { borderRadiusToNumber, lineHeightTextStyle, sizeToNumber } from '../../utils';
import { resolveSliceColor } from '../../utils/colors';
import { SliceIcon } from '../SliceIcon';
import { SliceLiquidGlassView } from '../SliceLiquidGlassView';
import type { SliceTextInputProps } from './_types';
import { getGlassInputColor } from './inputColors';

export function SliceTextInput(props: Readonly<SliceTextInputProps>) {
	const themedStyles = useCreateThemedStyles(styles);
	const { colors } = useSliceTheme();
	const {
		didFocus,
		layout,
		icon,
		focused,
		blurClears = false,
		iconColor,
		iconSize = 24,
		placeholderTextColor,
		textColor,
		hideIconOnFocus = true,
		style,
		onFocus,
		onBlur,
		onChangeText,
		accessibilityState,
		borderRadius = 'pill',
		borderWidth = 1,
		liquidGlassBackground,
		borderColor = colors['core-outline-secondary'],
		backgroundColor,
		size = 'm',
		...rest
	} = props;
	// Recalculate after font-size overrides so a smaller font does not retain
	// the theme's taller line box. Explicit caller lineHeight still wins last.
	const inputLineHeight = lineHeightTextStyle(
		{
			fontSize: StyleSheet.flatten(style)?.fontSize ?? themedStyles.inputFieldView.fontSize,
		},
		1.2,
	);
	const inputRef = useRef<TextInputInstance>(null);
	let glassOptions: LiquidGlassBackground = {};
	if (liquidGlassBackground && typeof liquidGlassBackground === 'object') glassOptions = liquidGlassBackground;
	const { fallbackColor, glassTintColor, glassStyle } = glassOptions;
	const { platform, supportsLiquidGlass } = useDeviceCapabilities();
	const applyLiquidGlass = platform === 'ios' && Boolean(liquidGlassBackground) && supportsLiquidGlass;

	const flattenedStyle = StyleSheet.flatten(style);
	let editorStyle = style;
	if (applyLiquidGlass && flattenedStyle?.color !== undefined) {
		const { color: _color, ...layoutAndTypography } = flattenedStyle;
		editorStyle = layoutAndTypography;
	}
	const effectiveTextColor = flattenedStyle?.color ?? textColor;
	const resolvedTextColor = useMemo(() => {
		if (applyLiquidGlass) return getGlassInputColor(effectiveTextColor, colors, 'core-text-primary');
		return resolveSliceColor(textColor, colors, 'core-text-primary');
	}, [applyLiquidGlass, effectiveTextColor, textColor, colors]);
	const resolvedPlaceholderColor = useMemo(() => {
		if (applyLiquidGlass)
			return getGlassInputColor(placeholderTextColor, colors, 'core-text-secondary', 'core-text-primary');
		return resolveSliceColor(placeholderTextColor, colors, 'core-text-secondary');
	}, [applyLiquidGlass, placeholderTextColor, colors]);

	const [isFocused, setIsFocused] = useState(false);

	// Only drive native focus when the caller explicitly supplies a preference.
	useEffect(() => {
		if (focused === undefined || !inputRef.current) return;
		if (focused && !inputRef.current.isFocused()) inputRef.current.focus();
		else if (!focused && inputRef.current.isFocused()) inputRef.current.blur();
	}, [focused]);

	const iconColorComputed = useMemo(() => {
		// SliceIcon resolves glass values to its native asset token itself.
		if (applyLiquidGlass) return iconColor;
		return resolveSliceColor(iconColor ?? textColor, colors, 'core-text-primary');
	}, [textColor, iconColor, colors, applyLiquidGlass]);

	const showIcon = useMemo(() => {
		if (!icon) return false;
		return !(isFocused && hideIconOnFocus);
	}, [isFocused, hideIconOnFocus, icon]);

	const padding = useMemo(() => {
		return StyleSheet.create({
			padding: { paddingRight: 18, paddingLeft: showIcon ? 0 : 18 },
		});
	}, [showIcon]);

	const inputSize = useMemo(() => {
		return StyleSheet.create({
			size: {
				minHeight: sizeToNumber(size),
			},
		});
	}, [size]);

	// UIKit owns the glass outline; a React Native border would draw a second one.
	const borderStyles = useMemo(() => {
		if (applyLiquidGlass) return StyleSheet.create({ border: { borderWidth: 0 } });
		let width = 0;
		if (Number.isFinite(borderWidth)) width = Math.max(0, borderWidth);
		return StyleSheet.create({ border: { borderWidth: width, borderColor } });
	}, [borderColor, borderWidth, applyLiquidGlass]);

	const cornerRadius = useMemo(() => {
		return StyleSheet.create({
			borderRadius: {
				borderRadius: borderRadiusToNumber(borderRadius),
			},
		});
	}, [borderRadius]);

	const backgroundColorComputed = useMemo(() => {
		if (applyLiquidGlass) return 'transparent';
		return backgroundColor ?? fallbackColor ?? colors['core-surface-primary'];
	}, [applyLiquidGlass, backgroundColor, fallbackColor, colors]);

	const bgColor = useMemo(() => {
		return StyleSheet.create({
			backgroundColor: { backgroundColor: backgroundColorComputed },
		});
	}, [backgroundColorComputed]);

	const content = (
		<>
			{showIcon && (
				<View style={[themedStyles.icon, { height: iconSize, width: iconSize }]}>
					<SliceIcon
						name={icon}
						iconColor={iconColorComputed}
						size={iconSize}
						accessible={false}
						pointerEvents="none"
					/>
				</View>
			)}
			<TextInput
				{...rest}
				ref={inputRef}
				style={[
					themedStyles.inputFieldView,
					padding.padding,
					{ color: resolvedTextColor },
					inputLineHeight,
					editorStyle,
				]}
				accessibilityState={{
					...accessibilityState,
					disabled: rest.editable === false || accessibilityState?.disabled,
				}}
				onChangeText={onChangeText}
				placeholderTextColor={resolvedPlaceholderColor}
				onFocus={(event) => {
					setIsFocused(true);
					didFocus?.(true);
					onFocus?.(event);
				}}
				onBlur={(event) => {
					setIsFocused(false);
					if (blurClears) {
						inputRef.current?.clear();
						onChangeText?.('');
					}
					didFocus?.(false);
					onBlur?.(event);
				}}
			/>
		</>
	);

	let renderedContent = content;
	if (applyLiquidGlass) {
		renderedContent = (
			<SliceLiquidGlassView
				cornerRadius={borderRadiusToNumber(borderRadius)}
				fallbackColor={fallbackColor}
				glassTintColor={glassTintColor}
				glassStyle={glassStyle}
				style={themedStyles.glassContent}
			>
				{content}
			</SliceLiquidGlassView>
		);
	}

	return (
		<Reanimated.View
			style={[
				themedStyles.inputWrapper,
				inputSize.size,
				cornerRadius.borderRadius,
				borderStyles.border,
				bgColor.backgroundColor,
			]}
			layout={layout}
		>
			{renderedContent}
		</Reanimated.View>
	);
}

const styles = (theme: SliceNativeTheme) =>
	StyleSheet.create({
		icon: {
			marginLeft: 16,
			color: theme.name === 'lightMode' ? theme.colors['core-icon-primary'] : theme.colors['core-link-primary'],
		},
		inputWrapper: {
			position: 'relative',
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-start',
			gap: 8,
			zIndex: 2,
		},
		// The glass contentView owns the Yoga row, so the icon and editor are
		// descendants of the native effect rather than overlays beside it.
		glassContent: {
			flex: 1,
			alignSelf: 'stretch',
			flexDirection: 'row',
			alignItems: 'center',
			gap: 8,
		},
		inputFieldView: {
			...theme.type['body-xl-bold'],
			flex: 1,
			zIndex: 2,
		},
	});
