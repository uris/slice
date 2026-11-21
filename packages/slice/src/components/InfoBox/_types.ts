import type React from 'react';
import type { HTMLAttributes } from 'react';
import type { ColorValue } from '../../theme';
import type { RadiusValue, SizeValue } from '../../theme/resolveSize';
import type { BadgeProps } from '../Badge';
import type { ButtonProps } from '../Button';
import type { ChipProps } from '../Chip';
import type { SliceIcon } from '../Icon';

export type InfoBoxBaseProps = {
	name?: string;
	maxWidth?: number | string;
	minWidth?: number | string;
	/** Padding inside the InfoBox surface. Numbers are pixels; strings accept CSS shorthands. */
	padding?: SizeValue;
	backgroundColor?: ColorValue;
	backgroundColorHover?: ColorValue;
	borderColor?: ColorValue;
	borderRadius?: RadiusValue;
	borderWidth?: string | number;
	children?: React.ReactNode;
	/** Disables the main press target; independent action controls keep their own disabled state. */
	disabled?: boolean;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	onPress?: (event: React.MouseEvent<HTMLButtonElement>, name: string | undefined, id: string | undefined) => void;
};

export type InfoBoxProps = InfoBoxBaseProps & Omit<HTMLAttributes<HTMLDivElement>, 'onClick'>;

export type InfoBoxTitleBaseProps = {
	title?: string;
	children?: React.ReactNode;
};

export type InfoBoxTitleProps = InfoBoxTitleBaseProps & HTMLAttributes<HTMLDivElement>;

export type InfoBoxContentBaseProps = {
	text?: string;
	children?: React.ReactNode;
};

export type InfoBoxContentProps = InfoBoxContentBaseProps & HTMLAttributes<HTMLDivElement>;

export type InfoBoxImageBaseProps = {
	alt?: string;
	width?: number | string;
	height?: number | string;
	src?: string;
	iconName?: SliceIcon;
	iconSize?: number;
	iconStrokeColor?: ColorValue;
	iconStrokeWidth?: number;
	children?: React.ReactNode;
};

export type InfoBoxImageProps = InfoBoxImageBaseProps & HTMLAttributes<HTMLDivElement>;

export type InfoBoxActionBaseProps = {
	children?: React.ReactNode;
	chip?: ChipProps;
	button?: ButtonProps;
	badge?: BadgeProps;
	contentGap?: SizeValue;
};

export type InfoBoxActionProps = InfoBoxActionBaseProps & HTMLAttributes<HTMLDivElement>;

export type InfoBoxChild =
	| React.ReactElement<InfoBoxTitleProps>
	| React.ReactElement<InfoBoxContentProps>
	| React.ReactElement<InfoBoxImageProps>
	| React.ReactElement<InfoBoxActionProps>;
