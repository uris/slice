import { type ComponentRef, forwardRef } from 'react';
import type { View } from 'react-native';
import NativeLiquidGlassView from '../../specs/LiquidGlassNativeComponent';
import type { SliceLiquidGlassViewComponent, SliceLiquidGlassViewProps } from './_types';

export const SliceLiquidGlassView: SliceLiquidGlassViewComponent = forwardRef<
	ComponentRef<typeof View>,
	SliceLiquidGlassViewProps
>(function SliceLiquidGlassView(
	{ glassStyle = 'regular', interactive = false, cornerRadius = 24, fallbackColor: _fallbackColor, style, ...props },
	ref,
) {
	return (
		<NativeLiquidGlassView
			{...props}
			ref={ref}
			glassStyle={glassStyle}
			interactive={interactive}
			cornerRadius={cornerRadius}
			style={[style, { borderRadius: cornerRadius }]}
		/>
	);
});
