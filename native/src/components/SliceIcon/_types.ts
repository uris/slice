import type { SvgProps } from 'react-native-svg';
import type { SliceColorValue } from '../../utils/colors';

type IconBaseProps = {
	name?: string;
	size?: number;
	/** Stroke width, matching the web Icon API. */
	stroke?: number;
	/**
	 * Slice token or color value. Glass resolves to native tokens, falling back
	 * to core-icon-primary for unmatched values.
	 */
	iconColor?: SliceColorValue;
	/** Fill opacity (0–1), matching the web Icon API. */
	fillColor?: number;
	fill?: boolean;
	coverUp?: string;
	toggle?: boolean;
	disabled?: boolean;
};

export type IconProps = Omit<SvgProps, keyof IconBaseProps | 'children'> & IconBaseProps;
