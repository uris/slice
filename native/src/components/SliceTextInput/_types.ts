import type { ColorValue, TextInputProps } from 'react-native';
import type { BaseAnimationBuilder, LayoutAnimationFunction } from 'react-native-reanimated';
import type { BorderRadius, LiquidGlassBackground, Size } from '../../types/sharedTypes';
import type { SliceColorValue } from '../../utils/colors';

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
	 * Override the icon foreground. Native glass defaults to the Slice icon asset
	 * tint; regular inputs default to textColor.
	 */
	iconColor?: SliceColorValue;
	/**
	 * Optionally define the icon size
	 */
	iconSize?: number;
	/**
	 * Optionally hide icon when input is focused - default = true : 010101 - 030303
	 */
	hideIconOnFocus?: boolean;
	/**
	 * Expose a way to set focus on input from external events
	 */
	focused?: boolean;
	/**
	 * Element size in terms of height
	 */
	size?: Size;
	/**
	 * Use true for default regular glass, or an options object to customize it.
	 * Place the icon and editor inside native glass on supported iOS devices.
	 * Otherwise render a regular input with the configured background fallback.
	 * Changing this opt-in while editing can remount the editor.
	 */
	liquidGlassBackground?: boolean | LiquidGlassBackground;
	/**
	 * Define a default border radius name or amount
	 */
	borderRadius?: BorderRadius;
	/**
	 * Border width in points. Negative/non-finite values become 0.
	 * Defaults to 1 for regular inputs. Ignored while native Liquid Glass is active.
	 */
	borderWidth?: number;
	/**
	 * Border color. Defaults to the theme’s core-outline-secondary color.
	 * Ignored while native Liquid Glass is active.
	 */
	borderColor?: ColorValue;
	/**
	 * Optional background color override
	 */
	backgroundColor?: ColorValue;
	/**
	 * Entered text foreground override. Defaults to core-text-primary; supported
	 * iOS glass uses a native dynamic color carrying both Slice palette variants.
	 */
	textColor?: SliceColorValue;
	/**
	 * Placeholder token or color value. Glass resolves tokens dynamically and
	 * uses core-text-primary when an explicit color cannot be matched.
	 */
	placeholderTextColor?: SliceColorValue;
}
