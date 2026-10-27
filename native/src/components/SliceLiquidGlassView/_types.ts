import type { ComponentRef, ForwardRefExoticComponent, PropsWithoutRef, RefAttributes } from 'react';
import type { ColorValue, View, ViewProps } from 'react-native';

export type SliceLiquidGlassViewComponent = ForwardRefExoticComponent<
	PropsWithoutRef<SliceLiquidGlassViewProps> & RefAttributes<ComponentRef<typeof View>>
>;

export interface SliceLiquidGlassViewProps extends ViewProps {
	/** Custom glass child mounting does not support React Native's subview culling. */
	removeClippedSubviews?: false;
	/** Native iOS 26+ material. Defaults to regular. */
	glassStyle?: 'regular' | 'clear';
	/** Tint for the native glass material; does not change content opacity. */
	glassTintColor?: ColorValue;
	/** Enables native glass interaction feedback; use Pressable for actions. */
	interactive?: boolean;
	/** Uniform radius in points. Defaults to 24. Use this instead of style.borderRadius. */
	cornerRadius?: number;
	/** Background used on Android/web. Older iOS uses system blur. */
	fallbackColor?: ColorValue;
}
