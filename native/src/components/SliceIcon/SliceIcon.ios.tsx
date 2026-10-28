import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import NativeGlassIcon from '../../specs/GlassIconNativeComponent';
import { resolveGlassColorToken } from '../../utils/colors';
import { useGlassContent } from '../SliceLiquidGlassView/GlassContentContext';
import { SliceIcon as SvgSliceIcon } from './SliceIconSvg';
import type { IconProps } from './_types';
import { STATIC_ICON_REGISTRY } from './iconRegistry';

// Template masks have fixed strokes and baked fills. Preserve SVG's full API
// whenever a requested appearance cannot be represented by those masks.
const templateProps = new Set([
	'name',
	'size',
	'stroke',
	'iconColor',
	'fill',
	'fillColor',
	'toggle',
	'disabled',
	'opacity',
	'style',
	'onPress',
	'onPressIn',
	'onPressOut',
	'onLongPress',
	'accessibilityRole',
	'accessibilityLabel',
	'accessibilityHint',
	'accessibilityState',
	'accessibilityValue',
	'accessibilityLanguage',
	'accessible',
	'testID',
	'nativeID',
	'onLayout',
	'hitSlop',
	'pointerEvents',
]);

/**
 * Supported glass content uses native templates; other content keeps SVG.
 */
export const SliceIcon = memo(function SliceIcon(props: IconProps) {
	const inGlass = useGlassContent();
	let supported = true;
	for (const [key, value] of Object.entries(props)) {
		if (value !== undefined && !templateProps.has(key)) supported = false;
	}
	if (props.stroke !== undefined && props.stroke !== 1.5) supported = false;
	if (props.fill && props.fillColor !== 1) supported = false;
	if (!Number.isFinite(Number(props.opacity ?? 1))) supported = false;
	if (!inGlass || !supported) return <SvgSliceIcon {...props} />;
	return <TemplateIcon {...props} />;
});

function TemplateIcon(props: IconProps) {
	const {
		name = 'home',
		size = 20,
		stroke: _stroke,
		iconColor,
		fill = false,
		fillColor: _fillColor,
		toggle = false,
		disabled = false,
		opacity = 1,
		style,
		onPress,
		onPressIn,
		onPressOut,
		onLongPress,
		accessibilityState,
		...viewProps
	} = props;
	if (!STATIC_ICON_REGISTRY.has(name)) return null;
	let renderedOpacity = Number(opacity);
	if (disabled) renderedOpacity *= 0.5;
	let role: IconProps['accessibilityRole'] = 'image';
	if (onPress || onLongPress) role = 'button';
	const commonProps = {
		accessibilityRole: role,
		accessibilityLabel: `${name} icon`,
		...viewProps,
		accessibilityState: { ...accessibilityState, disabled },
		style: [{ width: size, height: size, opacity: renderedOpacity }, style],
	};
	const image = (
		<NativeGlassIcon
			iconName={name}
			tintToken={resolveGlassColorToken(iconColor, 'core-icon-primary')}
			toggled={toggle}
			filled={fill}
			accessible={false}
			pointerEvents="none"
			style={StyleSheet.absoluteFill}
		/>
	);
	if (onPress || onPressIn || onPressOut || onLongPress) {
		return (
			<Pressable
				{...commonProps}
				disabled={disabled}
				onPress={onPress}
				onPressIn={onPressIn}
				onPressOut={onPressOut}
				onLongPress={onLongPress}
			>
				{image}
			</Pressable>
		);
	}
	return <View {...commonProps}>{image}</View>;
}

SliceIcon.displayName = 'SliceIcon';
