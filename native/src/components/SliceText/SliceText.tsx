import { Text } from 'react-native';
import { useSliceTheme } from '../../providers/SliceThemeProvider';
import type { StyledTextProps } from './_types';

/**
 * Utility wrapper around text component for easier styling of text using slice theme
 */
export function StyledText(props: Readonly<StyledTextProps>) {
	const { textStyle, textColor, style, singleLine, children, ...rest } = props;
	const { type, colors } = useSliceTheme();
	const textStyles = textStyle ? type[textStyle] : undefined;
	const color = { color: textColor ? colors[textColor] : colors['core-text-primary'] };
	const fontSize = textStyles?.fontSize ?? 16;
	const height = typeof singleLine === 'number' ? singleLine : 1.2;
	const lineHeight = { lineHeight: singleLine ? height * fontSize : textStyles?.lineHeight };

	return (
		<Text {...rest} numberOfLines={singleLine ? 1 : rest.numberOfLines} style={[textStyles, color, lineHeight, style]}>
			{children}
		</Text>
	);
}
