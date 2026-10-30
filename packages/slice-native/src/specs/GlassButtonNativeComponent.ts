import {
	type CodegenTypes,
	type ColorValue,
	type HostComponent,
	type ViewProps,
	codegenNativeComponent,
} from 'react-native';

type ButtonEvent = Readonly<{
	kind: string;
	locationX: CodegenTypes.Double;
	locationY: CodegenTypes.Double;
	pageX: CodegenTypes.Double;
	pageY: CodegenTypes.Double;
	timestamp: CodegenTypes.Double;
}>;
type SizeEvent = Readonly<{ width: CodegenTypes.Double; height: CodegenTypes.Double }>;
export interface NativeProps extends ViewProps {
	label?: string;
	iconName?: string;
	iconPosition?: CodegenTypes.WithDefault<'left' | 'right', 'left'>;
	iconSize?: CodegenTypes.WithDefault<CodegenTypes.Double, 24>;
	glassStyle?: CodegenTypes.WithDefault<'regular' | 'clear', 'regular'>;
	glassTintColor?: ColorValue;
	tintToken?: string;
	textTintToken?: string;
	iconTintToken?: string;
	themePreference?: CodegenTypes.WithDefault<'system' | 'light' | 'dark', 'system'>;
	disabled?: CodegenTypes.WithDefault<boolean, false>;
	cornerRadius?: CodegenTypes.WithDefault<CodegenTypes.Double, 1000>;
	minimumSize?: CodegenTypes.WithDefault<CodegenTypes.Double, 48>;
	paddingTop?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
	paddingBottom?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
	paddingLeading?: CodegenTypes.WithDefault<CodegenTypes.Double, 16>;
	paddingTrailing?: CodegenTypes.WithDefault<CodegenTypes.Double, 16>;
	iconGap?: CodegenTypes.WithDefault<CodegenTypes.Double, 6>;
	fontFamily?: string;
	fontSize?: CodegenTypes.WithDefault<CodegenTypes.Double, 20>;
	fontWeight?: string;
	letterSpacing?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
	allowFontScaling?: CodegenTypes.WithDefault<boolean, true>;
	hasLongPress?: CodegenTypes.WithDefault<boolean, false>;
	delayLongPress?: CodegenTypes.WithDefault<CodegenTypes.Double, 500>;
	onButtonEvent?: CodegenTypes.DirectEventHandler<ButtonEvent>;
	onIntrinsicSizeChange?: CodegenTypes.DirectEventHandler<SizeEvent>;
}
export default codegenNativeComponent<NativeProps>('SliceGlassButton', {
	excludedPlatforms: ['android'],
}) as HostComponent<NativeProps>;
