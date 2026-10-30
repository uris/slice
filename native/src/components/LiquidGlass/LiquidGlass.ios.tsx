import { type ComponentRef, forwardRef } from 'react';
import type { View } from 'react-native';
import { useDeviceCapabilities } from '../../hooks';
import { useSliceThemePreference } from '../../providers/SliceThemeProvider';
import NativeLiquidGlassView from '../../specs/LiquidGlassNativeComponent';
import { GlassContentContext } from './GlassContentContext';
import type { LiquidGlassComponent, LiquidGlassProps } from './_types';

export const LiquidGlass: LiquidGlassComponent = forwardRef<ComponentRef<typeof View>, LiquidGlassProps>(
	function LiquidGlass(
		{
			glassStyle = 'regular',
			interactive = false,
			cornerRadius = 24,
			fallbackColor: _fallbackColor,
			style,
			children,
			...props
		},
		ref,
	) {
		const { supportsLiquidGlass } = useDeviceCapabilities();
		const preference = useSliceThemePreference();
		return (
			<NativeLiquidGlassView
				{...props}
				ref={ref}
				themePreference={preference}
				glassStyle={glassStyle}
				interactive={interactive}
				cornerRadius={cornerRadius}
				style={[style, { borderRadius: cornerRadius }]}
			>
				<GlassContentContext.Provider value={supportsLiquidGlass}>{children}</GlassContentContext.Provider>
			</NativeLiquidGlassView>
		);
	},
);
