import type { ComponentProps, ReactNode } from 'react';
import type { ColorValue, PressableProps } from 'react-native';
import type Reanimated from 'react-native-reanimated';
import type { BorderRadius, LiquidGlassBackground, Size } from '../../types/sharedTypes';

type AnimatedViewProps = ComponentProps<typeof Reanimated.View>;

export interface SliceButtonProps extends Omit<PressableProps, 'children' | 'style'> {
	/**
	 * Element(s) to display on the button, typically just text
	 */
	children?: ReactNode;
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
	 * Enable liquid glass background. Will only work on ios26+ with a fallback for
	 * non-supported devices
	 */
	liquidGlassBackground?: LiquidGlassBackground;
	/**
	 * Define a default border radius name or amount
	 */
	borderRadius?: BorderRadius;
	/**
	 * Border width in points. Negative/non-finite values become 0.
	 * Defaults to 0 for primary buttons and 1 for secondary buttons.
	 */
	borderWidth?: number;
	/**
	 * Border color. Defaults to the theme’s core-outline-secondary color.
	 */
	borderColor?: ColorValue;
	/**
	 * Solid background override, ignored while supported Liquid Glass is active.
	 * Disabled solid buttons use the disabled theme background.
	 */
	backgroundColor?: ColorValue;
}
