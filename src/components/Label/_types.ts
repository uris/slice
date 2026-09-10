import type React from 'react';

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
	backgroundColor?: LabelBackground | string;
	bgColor?: LabelBackground | string;
	borderWidth?: number;
	borderSize?: number;
	borderColor?: string;
	borderRadius?: number;
	padding?: number | string;
	textColor?: string;
	textSize?: 'xs' | 's' | 'm' | 'l';
	onClick?: (e: React.MouseEvent<any>) => void;
};

export type LabelProps = Omit<React.HTMLAttributes<HTMLElement>, keyof LabelBaseProps> & LabelBaseProps;
