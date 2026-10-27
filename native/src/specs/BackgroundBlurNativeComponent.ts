import {
	type CodegenTypes,
	type ColorValue,
	type HostComponent,
	type ViewProps,
	codegenNativeComponent,
} from 'react-native';

export interface NativeProps extends ViewProps {
	blurIntensity?: CodegenTypes.WithDefault<CodegenTypes.Double, 12>;
	fadeStop?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
	direction?: CodegenTypes.WithDefault<'down' | 'up' | 'left' | 'right', 'down'>;
	fallbackColor?: ColorValue;
}

export default codegenNativeComponent<NativeProps>('SliceBackgroundBlur') as HostComponent<NativeProps>;
