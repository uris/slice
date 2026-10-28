import { type ComponentRef, forwardRef } from 'react';
import { View } from 'react-native';
import { GlassContentContext } from './GlassContentContext';
import type { SliceLiquidGlassViewComponent, SliceLiquidGlassViewProps } from './_types';

/** Android/web fallback. Metro selects SliceLiquidGlassView.ios on iOS. */
export const SliceLiquidGlassView: SliceLiquidGlassViewComponent = forwardRef<
	ComponentRef<typeof View>,
	SliceLiquidGlassViewProps
>(function SliceLiquidGlassView(
	{
		glassStyle: _glassStyle,
		glassTintColor: _glassTintColor,
		interactive: _interactive,
		cornerRadius = 24,
		fallbackColor = 'rgba(128, 128, 128, 0.18)',
		style,
		children,
		...props
	},
	ref,
) {
	return (
		<View
			{...props}
			ref={ref}
			style={[{ backgroundColor: fallbackColor }, style, { borderRadius: cornerRadius, overflow: 'hidden' }]}
		>
			<GlassContentContext.Provider value={false}>{children}</GlassContentContext.Provider>
		</View>
	);
});
