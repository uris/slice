import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

export enum LabelBackground {
	red = 'red',
	yellow = 'yellow',
	green = 'green',
	blue = 'blue',
	grey = 'grey',
	lightGrey = 'lightGrey',
	white = 'white',
}

type LabelBaseProps = {
	children?: React.ReactNode;
	label?: string;
	backgroundColor?: LabelBackground | ColorValue;
	borderWidth?: number;
	borderSize?: number;
	borderColor?: ColorValue;
	borderRadius?: number | string;
	padding?: number | string;
	textColor?: ColorValue;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	onClick?: (e: React.MouseEvent<any>) => void;
};

export type LabelProps = Omit<React.HTMLAttributes<HTMLElement>, keyof LabelBaseProps> & LabelBaseProps;
