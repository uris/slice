import {
	type CodegenTypes,
	type ColorValue,
	type HostComponent,
	type ViewProps,
	codegenNativeComponent,
} from 'react-native';

export interface NativeProps extends ViewProps {
	themePreference?: CodegenTypes.WithDefault<'system' | 'light' | 'dark', 'system'>;
	glassStyle?: CodegenTypes.WithDefault<'regular' | 'clear', 'regular'>;
	glassTintColor?: ColorValue;
	interactive?: CodegenTypes.WithDefault<boolean, false>;
	cornerRadius?: CodegenTypes.WithDefault<CodegenTypes.Double, 24>;
}

export default codegenNativeComponent<NativeProps>('SliceLiquidGlassView', {
	excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
