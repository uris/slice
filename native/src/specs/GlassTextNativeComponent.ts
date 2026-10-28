import {
	type CodegenTypes,
	type ColorValue,
	type HostComponent,
	type ViewProps,
	codegenNativeComponent,
} from 'react-native';

type SizeEvent = Readonly<{ width: CodegenTypes.Double; height: CodegenTypes.Double }>;

export interface NativeProps extends ViewProps {
	text?: string;
	colorToken?: string;
	foregroundColor?: ColorValue;
	fontFamily?: string;
	fontSize?: CodegenTypes.WithDefault<CodegenTypes.Double, 16>;
	fontWeight?: string;
	letterSpacing?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
	lineHeight?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
	maximumLines?: CodegenTypes.WithDefault<CodegenTypes.Int32, 0>;
	allowFontScaling?: CodegenTypes.WithDefault<boolean, true>;
	maxFontSizeMultiplier?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
	alignment?: CodegenTypes.WithDefault<'auto' | 'left' | 'center' | 'right', 'auto'>;
	ellipsize?: CodegenTypes.WithDefault<'head' | 'middle' | 'tail' | 'clip', 'tail'>;
	onIntrinsicSizeChange?: CodegenTypes.DirectEventHandler<SizeEvent>;
}

export default codegenNativeComponent<NativeProps>('SliceGlassText', {
	excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
