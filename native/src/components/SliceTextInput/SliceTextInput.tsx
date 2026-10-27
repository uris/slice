import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, TextInput, type TextInputInstance, View } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useCreateThemedStyles } from '../../hooks';
import { useSliceTheme } from '../../providers';
import type { SliceNativeTheme } from '../../theme';
import { borderRadiusToNumber, lineHeightTextStyle, sizeToNumber } from '../../utils';
import { SliceIcon } from '../SliceIcon';
import type { SliceTextInputProps } from './_types';

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
		placeholderTextColor = themedStyles.placeHolder.color,
		hideIconOnFocus = true,
		style,
		onFocus,
		onBlur,
		onChangeText,
		accessibilityState,
		borderRadius = 'pill',
		borderWidth = 1,
		borderColor = colors['core-outline-secondary'],
		backgroundColor,
		size = 'm',
		...rest
	} = props;
	const inputRef = useRef<TextInputInstance>(null);

	const [isFocused, setIsFocused] = useState(false);

	// Only drive native focus when the caller explicitly supplies a preference.
	useEffect(() => {
		if (focused === undefined || !inputRef.current) return;
		if (focused && !inputRef.current.isFocused()) inputRef.current.focus();
		else if (!focused && inputRef.current.isFocused()) inputRef.current.blur();
	}, [focused]);

	const iconColorComputed = useMemo(() => {
		if (iconColor) return iconColor;
		return isFocused ? themedStyles.icon.color : (placeholderTextColor as string);
	}, [themedStyles, isFocused, iconColor, placeholderTextColor]);

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

	const borderStyles = useMemo(() => {
		return StyleSheet.create({
			border: {
				borderWidth: Number.isFinite(borderWidth) ? Math.max(0, borderWidth) : 0,
				borderColor,
			},
		});
	}, [borderColor, borderWidth]);

	const cornerRadius = useMemo(() => {
		return StyleSheet.create({
			borderRadius: {
				borderRadius: borderRadiusToNumber(borderRadius),
			},
		});
	}, [borderRadius]);

	const bgColor = useMemo(() => {
		return StyleSheet.create({
			backgroundColor: { backgroundColor: backgroundColor ?? colors['core-surface-primary'] },
		});
	}, [backgroundColor, colors]);

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
			{showIcon && (
				<View style={[themedStyles.icon, { height: iconSize, width: iconSize }]}>
					<SliceIcon
						name={icon}
						strokeColor={iconColorComputed}
						size={iconSize}
						accessible={false}
						pointerEvents="none"
					/>
				</View>
			)}
			<TextInput
				{...rest}
				ref={inputRef}
				style={[themedStyles.inputFieldView, padding.padding, style]}
				accessibilityState={{
					...accessibilityState,
					disabled: rest.editable === false || accessibilityState?.disabled,
				}}
				onChangeText={onChangeText}
				placeholderTextColor={placeholderTextColor}
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
			flex: 1,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'flex-start',
			gap: 8,
			zIndex: 2,
		},
		inputFieldView: {
			...lineHeightTextStyle(theme.type['body-xl-bold']),
			color: theme.colors['core-text-primary'],
			flex: 1,
			zIndex: 2,
		},
		placeHolder: {
			color: theme.colors['core-text-tertiary'],
		},
	});
