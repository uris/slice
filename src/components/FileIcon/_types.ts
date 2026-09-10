import type React from 'react';

type FileIconBaseProps = {
	name?: string;
	size?: number;
	pointer?: boolean;
	disabled?: boolean;
	onClick?: (e: React.MouseEvent<SVGElement, MouseEvent> | React.KeyboardEvent<SVGSVGElement>) => void;
};

export type FileIconProps = Omit<React.SVGAttributes<SVGSVGElement>, keyof FileIconBaseProps> & FileIconBaseProps;

export enum FileIconNames {
	pdf = 'pdf',
	text = 'text',
	sheet = 'sheet',
	preso = 'preso',
	md = 'md',
	code = 'code',
	image = 'image',
	audio = 'audio',
	video = 'video',
	other = 'other',
}

type Scheme = {
	dark: string;
	light: string;
};

export const iconColorSchemes: Record<string, Scheme> = {
	blue: { dark: '#4084ff', light: '#2d2fff' },
	red: { dark: '#ff474a', light: '#df0529' },
	green: { dark: '#2d8c00', light: '#2d8c00' },
	gray: { dark: '#657d91', light: '#4c6273' },
	pink: { dark: '#ff3ac2', light: '#df059b' },
};
