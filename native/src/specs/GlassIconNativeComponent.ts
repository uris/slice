import {
	type CodegenTypes,
	type ColorValue,
	type HostComponent,
	type ViewProps,
	codegenNativeComponent,
} from 'react-native';

export interface NativeProps extends ViewProps {
	iconName?: string;
	tintToken?: string;
	foregroundColor?: ColorValue;
	toggled?: CodegenTypes.WithDefault<boolean, false>;
	filled?: CodegenTypes.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>('SliceGlassIcon', {
	excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
