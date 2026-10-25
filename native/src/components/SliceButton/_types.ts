import type { ComponentProps, ReactNode } from 'react';
import type { PressableProps } from 'react-native';
import type Reanimated from 'react-native-reanimated';

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
	 * Primary or secondary variant
	 */
	variant?: 'primary' | 'secondary';
	/**
	 * Button transitions and animations
	 */
	presence?: {
		entering?: AnimatedViewProps['entering'];
		exiting?: AnimatedViewProps['exiting'];
	};
	layout?: AnimatedViewProps['layout'];
}
