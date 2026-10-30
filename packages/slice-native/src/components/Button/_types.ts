import type { ComponentProps, ReactNode } from 'react';
import type { ColorValue, PressableProps, StyleProp, TextStyle } from 'react-native';
import type Reanimated from 'react-native-reanimated';
import type { SliceNativeTheme } from '../../theme';
import type { BorderRadius, LiquidGlassBackground, Size } from '../../types';
import type { SliceColorValue } from '../../utils/colors';

type AnimatedViewProps = ComponentProps<typeof Reanimated.View>;

export interface ButtonBaseProps extends Omit<PressableProps, 'children' | 'style'> {
	/**
	 * One style for regular box and label typography. Explicit equivalent props win; native glass ignores this.
	 * Box and text properties are routed to their respective elements; padding applies to the Pressable.
	 */
	style?: StyleProp<TextStyle>;
	/**
	 * Plain string title. On regular buttons, takes precedence over children.
	 */
	label?: string;
	/**
	 * Slice typography token used for the title on both rendering paths.
	 */
	labelTextStyle?: keyof SliceNativeTheme['type'];
	/**
	 * Shared icon/label foreground fallback. iconColor and textColor take precedence.
	 * Glass resolves Slice tokens or color values to native tokens,
	 * falling back to core-text-primary for unmatched values.
	 */
	tintColor?: SliceColorValue;
	/**
	 * Icon foreground token or color value. Takes precedence over tintColor.
	 * Regular primary buttons default to core-text-light.
	 */
	iconColor?: SliceColorValue;
	/**
	 * Label foreground token or color value. Takes precedence over tintColor.
	 * Regular primary buttons default to core-text-light.
	 */
	textColor?: SliceColorValue;
	/**
	 * Logical content padding in points. Omitted edges retain the Slice defaults.
	 */
	contentInsets?: { top?: number; leading?: number; bottom?: number; trailing?: number };
	/**
	 * Gap between the icon and label in points. Defaults to 6.
	 */
	iconGap?: number;
	/**
	 * Button disabled state
	 */
	disabled?: boolean;
	/**
	 * Pass through GestureResponderEvent when pressed
	 */
	onPress?: PressableProps['onPress'];
	/**
	 * Name of the button icon if any
	 */
	icon?: string;
	/**
	 * Icon position can be left / right or undefined
	 */
	iconPosition?: 'left' | 'right';
	/**
	 * Icon size
	 */
	iconSize?: number;
	/**
	 * Add an emphasis animation to the button
	 */
	animatedStyle?: AnimatedViewProps['style'];
	/**
	 * Primary or secondary type button
	 */
	variant?: 'primary' | 'secondary';
	/**
	 * Predefined sizes  that can be overriden with a numeric value
	 */
	size?: Size;
	/**
	 * Button transitions and animations
	 */
	presence?: {
		entering?: AnimatedViewProps['entering'];
		exiting?: AnimatedViewProps['exiting'];
	};
	/**
	 * Enable layout animation definition for button layout changes
	 */
	layout?: AnimatedViewProps['layout'];
	/**
	 * Define a default border radius name or amount
	 */
	borderRadius?: BorderRadius;
	/**
	 * Border width in points. Negative/non-finite values become 0.
	 * Defaults to 0 for primary buttons and 1 for secondary buttons. Ignored by native glass.
	 */
	borderWidth?: number;
	/**
	 * Border color. Defaults to the theme’s core-outline-secondary color. Ignored by native glass.
	 */
	borderColor?: ColorValue;
	/**
	 * Solid background override, ignored while supported Liquid Glass is active.
	 * Disabled solid buttons use the disabled theme background.
	 */
	backgroundColor?: ColorValue;
}

/**
 * Glass titles are strings; arbitrary React children remain available for regular buttons.
 */
export type ButtonProps = ButtonBaseProps &
	(
		| {
				/**
				 * Use true for default glass or an options object. Uses a native iOS 26+ button, with a regular fallback elsewhere.
				 */
				liquidGlassBackground: true | Pick<LiquidGlassBackground, 'glassStyle' | 'glassTintColor' | 'fallbackColor'>;
				children?: never;
		  }
		| { liquidGlassBackground?: false | undefined; children?: ReactNode }
	);
