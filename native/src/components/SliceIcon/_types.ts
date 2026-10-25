import type { SvgProps } from 'react-native-svg';

type IconBaseProps = {
	name?: string;
	size?: number;
	/** Stroke width, matching the web Icon API. */
	stroke?: number;
	strokeColor?: string;
	/** Fill opacity (0–1), matching the web Icon API. */
	fillColor?: number;
	fill?: boolean;
	coverUp?: string;
	toggle?: boolean;
	disabled?: boolean;
};

export type IconProps = Omit<SvgProps, keyof IconBaseProps | 'children'> & IconBaseProps;
