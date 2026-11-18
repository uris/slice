import type React from 'react';
import type { HTMLAttributes } from 'react';
import type { ColorValue } from '../../theme';
import type { ButtonProps } from '../Button';

/** Card preserves authored child order, including fragments, repeated sections, and custom content. */
export type CardBaseProps = {
	maxWidth?: number | string;
	/** Shared section padding. Explicit section padding and styles take precedence. */
	padding?: number | string;
	backgroundColor?: ColorValue;
	borderColor?: ColorValue;
	borderRadius?: string | number;
	borderWidth?: string | number;
	children?: React.ReactNode;
};

export type CardProps = CardBaseProps & HTMLAttributes<HTMLDivElement>;

/** Custom children replace the generated caption, title, text, and action. */
export type CardTitleBaseProps = {
	caption?: string;
	title?: string;
	text?: string;
	padding?: number | string;
	children?: React.ReactNode;
	actionButton?: ButtonProps;
	onAction?: (button: ButtonProps) => void;
};

export type CardTitleProps = CardTitleBaseProps & HTMLAttributes<HTMLDivElement>;

export type CardImageBaseProps = {
	/** Describe meaningful images; omit or use an empty string for decorative images. */
	alt?: string;
	src?: string;
	padding?: number | string;
	height?: number | string;
	children?: React.ReactNode;
	borderWidth?: string | number;
	borderColor?: ColorValue;
};

export type CardImageProps = CardImageBaseProps & HTMLAttributes<HTMLDivElement>;

export type CardContentBaseProps = {
	children?: React.ReactNode;
	text?: string;
	padding?: number | string;
};

export type CardContentProps = CardContentBaseProps & HTMLAttributes<HTMLDivElement>;

/** Custom children replace the generated action buttons. */
export type CardFooterBaseProps = {
	children?: React.ReactNode;
	actionButtons?: ButtonProps[];
	stack?: 'vertical' | 'horizontal';
	layout?: 'fill' | 'fit';
	align?: 'start' | 'center' | 'end' | 'edges';
	padding?: number | string;
	backgroundColor?: ColorValue;
	borderColor?: ColorValue;
	borderWidth?: number | string;
	onAction?: (button: ButtonProps) => void;
};

export type CardFooterProps = CardFooterBaseProps & HTMLAttributes<HTMLDivElement>;
