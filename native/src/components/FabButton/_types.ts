import type { StyleProp, ViewStyle } from 'react-native';
import type { ButtonProps } from '../Button';

/**
 * Button props with optional styles for the outer floating shadow wrapper.
 */
export type FabButtonProps = Omit<ButtonProps, 'liquidGlassBackground'> & {
	/**
	 * Floating action buttons always use regular rendering.
	 */
	liquidGlassBackground?: never;
	/**
	 * Shadow and positioning styles for the outer wrapper, including style arrays.
	 * Button corner geometry stays synchronized and shadows remain unclipped.
	 */
	viewStyle?: StyleProp<ViewStyle>;
};
