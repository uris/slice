import type { TextInputProps } from 'react-native';
import type { BaseAnimationBuilder, LayoutAnimationFunction } from 'react-native-reanimated';

export interface SliceTextInputProps extends TextInputProps {
	/**
	 * emits directive focus event
	 */
	didFocus?: (focused: boolean) => void;
	/**
	 * enables applying animations when the input layout changes using reanimated layout functions
	 */
	layout?: typeof BaseAnimationBuilder | BaseAnimationBuilder | LayoutAnimationFunction;
	/**
	 * When true, blur clears the input and calls onChangeText with an empty string. Default: false.
	 */
	blurClears?: boolean;
	/**
	 * Adds a slice icon to the start of the input field
	 */
	icon?: string;
	/**
	 * Optionally define the icon color
	 */
	iconColor?: string;
	/**
	 * Optionally define the icon size
	 */
	iconSize?: number;
	/**
	 * Optionally hide icon when input is focused - default = true
	 */
	hideIconOnFocus?: boolean;
	/**
	 * Expose a way to set focus on input from external events
	 */
	focused?: boolean;
}
