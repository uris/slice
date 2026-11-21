import type { HTMLAttributes, ReactNode } from 'react';
import type { ColorValue } from '../../theme';
import type { RadiusValue, SizeValue } from '../../theme/resolveSize';
import type { ButtonProps } from '../Button';

/** Card preserves authored child order, including fragments, repeated sections, and custom content. */
export type CardBaseProps = {
	maxWidth?: number | string;
	/** Shared section padding. Explicit section padding and styles take precedence. */
	padding?: SizeValue;
	backgroundColor?: ColorValue;
	borderColor?: ColorValue;
	borderRadius?: RadiusValue;
	borderWidth?: string | number;
	children?: ReactNode;
};

export type CardProps = CardBaseProps & HTMLAttributes<HTMLDivElement>;

/** Custom children replace the generated caption, title, text, and action. */
export type CardTitleBaseProps = {
	caption?: string;
	title?: string;
	text?: string;
	padding?: SizeValue;
	children?: ReactNode;
	/** Button descriptors or custom content rendered beside the title. */
	action?: ButtonProps[] | ReactNode;
	onAction?: (button: ButtonProps) => void;
};

export type CardTitleProps = CardTitleBaseProps & HTMLAttributes<HTMLDivElement>;

export type CardImageBaseProps = {
	/** Describe meaningful images; omit or use an empty string for decorative images. */
	alt?: string;
	src?: string;
	padding?: SizeValue;
	height?: number | string;
	children?: ReactNode;
	borderWidth?: string | number;
	borderColor?: ColorValue;
};

export type CardImageProps = CardImageBaseProps & HTMLAttributes<HTMLDivElement>;

export type CardContentBaseProps = {
	children?: ReactNode;
	text?: string;
	padding?: SizeValue;
};

export type CardContentProps = CardContentBaseProps & HTMLAttributes<HTMLDivElement>;

/** Custom children replace the generated action buttons. */
export type CardFooterBaseProps = {
	children?: ReactNode;
	actionButtons?: ButtonProps[];
	stack?: 'vertical' | 'horizontal';
	layout?: 'fill' | 'fit';
	align?: 'start' | 'center' | 'end' | 'edges';
	padding?: SizeValue;
	backgroundColor?: ColorValue;
	borderColor?: ColorValue;
	borderWidth?: number | string;
	onAction?: (button: ButtonProps) => void;
};

export type CardFooterProps = CardFooterBaseProps & HTMLAttributes<HTMLDivElement>;
