import { useCallback, useState } from 'react';
import { type GestureResponderEvent, StyleSheet } from 'react-native';
import Reanimated from 'react-native-reanimated';
import { useDeviceCapabilities } from '../../hooks';
import { useSliceContext } from '../../providers';
import NativeGlassButton, { type NativeProps } from '../../specs/GlassButtonNativeComponent';
import { borderRadiusToNumber, sizeToNumber } from '../../utils';
import { resolveGlassColorToken } from '../../utils/colors';
import { SliceButtonRegular } from './SliceButtonRegular';
import type { SliceButtonProps } from './_types';
import { resolveButtonInsets, resolveGlassOptions } from './buttonOptions';

export function SliceButton(props: Readonly<SliceButtonProps>) {
	const { platform, supportsLiquidGlass } = useDeviceCapabilities();
	if (platform !== 'ios' || !supportsLiquidGlass || !props.liquidGlassBackground) {
		return <SliceButtonRegular {...props} />;
	}
	return <GlassButton {...props} />;
}

function GlassButton(props: Readonly<SliceButtonProps>) {
	const { theme, preference } = useSliceContext();
	const [intrinsicSize, setIntrinsicSize] = useState({ width: 0, height: 0 });
	const {
		label = '',
		icon,
		iconPosition = 'left',
		iconSize = 24,
		size = 'm',
		disabled = false,
		labelTextStyle = 'body-xl-bold',
		tintColor,
		iconColor,
		textColor,
		contentInsets,
		iconGap = 6,
		liquidGlassBackground = {},
		borderRadius = 'pill',
		animatedStyle,
		layout,
		presence,
		onPress,
		onPressIn,
		onPressOut,
		onLongPress,
		delayLongPress = 500,
		accessibilityState,
	} = props;
	if (props.children != null) throw new Error('Liquid Glass SliceButton accepts label and icon, not children.');
	const onIntrinsicSizeChange = useCallback<NonNullable<NativeProps['onIntrinsicSizeChange']>>((event) => {
		const { width, height } = event.nativeEvent;
		if (!Number.isFinite(width) || !Number.isFinite(height) || width < 0 || height < 0) return;
		setIntrinsicSize((previous) => {
			if (previous.width === width && previous.height === height) return previous;
			return { width, height };
		});
	}, []);
	const typography = theme.type[labelTextStyle];
	const requestedSize = sizeToNumber(size);
	let minimumSize = 48;
	if (Number.isFinite(requestedSize)) minimumSize = Math.max(0, requestedSize);
	const glassOptions = resolveGlassOptions(liquidGlassBackground);
	const insets = resolveButtonInsets({ hasLabel: Boolean(label), icon, iconPosition, contentInsets });
	const onButtonEvent: NativeProps['onButtonEvent'] = (event) => {
		if (disabled) return;
		const touch = { ...event.nativeEvent, identifier: 0, target: event.currentTarget, force: 0 };
		const nativeTouchEvent = { ...touch, touches: [], changedTouches: [touch] };
		// Newer React Native events expose getter-only properties. Wrap rather than clone or mutate them.
		const pressEvent = new Proxy(event, {
			get(originalEvent, property) {
				if (property === 'nativeEvent') return nativeTouchEvent;
				// Getters and event methods must use the original instance, including its private state.
				const value = Reflect.get(originalEvent, property, originalEvent);
				if (typeof value === 'function') return value.bind(originalEvent);
				return value;
			},
		}) as unknown as GestureResponderEvent;
		const handlers = { press: onPress, pressIn: onPressIn, pressOut: onPressOut, longPress: onLongPress };
		handlers[event.nativeEvent.kind as keyof typeof handlers]?.(pressEvent);
	};
	return (
		<Reanimated.View layout={layout}>
			<Reanimated.View entering={presence?.entering} exiting={presence?.exiting}>
				<Reanimated.View
					style={[
						{
							minHeight: Math.max(minimumSize, intrinsicSize.height),
							width: Math.max(minimumSize, intrinsicSize.width),
							maxWidth: '100%',
							position: 'relative',
						},
						animatedStyle,
					]}
				>
					<NativeGlassButton
						label={label}
						iconName={icon}
						iconPosition={iconPosition}
						iconSize={iconSize}
						glassStyle={glassOptions.glassStyle ?? 'regular'}
						glassTintColor={glassOptions.glassTintColor}
						tintToken={resolveGlassColorToken(tintColor, 'core-text-primary')}
						textTintToken={resolveGlassColorToken(textColor ?? tintColor, 'core-text-primary')}
						iconTintToken={resolveGlassColorToken(iconColor ?? tintColor, 'core-icon-primary')}
						themePreference={preference}
						disabled={disabled}
						cornerRadius={borderRadiusToNumber(borderRadius)}
						minimumSize={minimumSize}
						paddingTop={insets.top}
						paddingBottom={insets.bottom}
						paddingLeading={insets.leading}
						paddingTrailing={insets.trailing}
						iconGap={iconGap}
						fontFamily={typography.fontFamily}
						fontSize={typography.fontSize}
						fontWeight={String(typography.fontWeight ?? '400')}
						letterSpacing={typography.letterSpacing ?? 0}
						hasLongPress={Boolean(onLongPress)}
						delayLongPress={delayLongPress}
						onButtonEvent={onButtonEvent}
						onIntrinsicSizeChange={onIntrinsicSizeChange}
						accessible={props.accessible ?? true}
						accessibilityRole={props.accessibilityRole ?? 'button'}
						accessibilityLabel={props.accessibilityLabel ?? label}
						accessibilityHint={props.accessibilityHint}
						accessibilityState={{ ...accessibilityState, disabled }}
						accessibilityValue={props.accessibilityValue}
						testID={props.testID}
						nativeID={props.nativeID}
						onLayout={props.onLayout}
						onFocus={props.onFocus}
						onBlur={props.onBlur}
						pointerEvents={props.pointerEvents}
						hitSlop={props.hitSlop}
						style={StyleSheet.absoluteFill}
					/>
				</Reanimated.View>
			</Reanimated.View>
		</Reanimated.View>
	);
}
