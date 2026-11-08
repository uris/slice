import type { HTMLMotionProps, Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme';
import type { SliceIcon } from '../Icon';
import type { FixedSize } from '../sharedTypes';

export type PopCoords = {
	x: number;
	y: number;
};
export type PopSizeConstraints = {
	maxHeight: number;
	maxWidth: number;
};
export type PopOffset = 'top' | 'bottom' | 'right';
export type PopCaller = HTMLElement;

export type PopMenuSubMenuProps = {
	caller: PopCaller;
	level: number;
	dismissAll: () => void;
};

/** Click details. For toggle items, toggled is the requested next state. */
export type PopMenuItemClickInfo = Pick<
	PopMenuItemBase,
	'id' | 'label' | 'toggle' | 'toggled' | 'subMenu' | 'autoDismiss'
> & {
	dismissAll: () => void;
};

export interface PopMenuBase {
	/** Nesting level used to stack submenus above their parent. */
	level?: number;
	name?: string;
	id?: string;
	options?: PropMenuEntry[];
	children?: React.ReactNode;
	padding?: number | string;
	backgroundColor?: ColorValue;
	borderRadius?: number | string;
	borderWidth?: number;
	borderColor?: ColorValue;
	motionValues?: Variants;
	transition?: Transition;
	caller?: PopCaller;
	offset?: PopOffset;
	gap?: number;
	minWidth?: number;
	onClickItem?: (e: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo) => void;
	onHoverItem?: (e: React.MouseEvent<HTMLButtonElement>, item: Pick<PopMenuItemBase, 'id' | 'label'>) => void;
	onDismiss?: () => void;
	dismissAll?: () => void;
}

export interface PopMenuItemBase {
	/** Defaults to true for actions, false for toggles and submenu openers. */
	autoDismiss?: boolean;
	dismissAll?: () => void;
	/** Level of the containing menu; its submenu receives level + 1. */
	level?: number;
	id?: string;
	name?: string;
	children?: React.ReactNode;
	icon?: SliceIcon;
	toggleIcon?: SliceIcon;
	subMenuIcon?: SliceIcon;
	iconSize?: number;
	iconColor?: ColorValue;
	iconColorHover?: ColorValue;
	iconGap?: number;
	backgroundColor?: ColorValue;
	backgroundColorHover?: ColorValue;
	label?: string;
	textColor?: ColorValue;
	textColorHover?: ColorValue;
	textSize?: FixedSize;
	subMenu?: (props: PopMenuSubMenuProps) => React.ReactNode;
	padding?: number | string;
	gap?: number | string;
	shortcut?: string;
	toggle?: boolean;
	toggled?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo) => void;
	onHover?: (e: React.MouseEvent<HTMLButtonElement>, item: Pick<PopMenuItemBase, 'id' | 'label'>) => void;
}

export interface PopMenuItemGroupBase {
	name?: string;
	id?: string;
	title?: string;
	textColor?: ColorValue;
	textColorHover?: ColorValue;
	textSize?: FixedSize;
	padding?: number | string;
	items?: PopMenuItemBase[];
	children?: React.ReactNode;
	borderWidth?: number | string;
	borderColor?: ColorValue;
	onClickItem?: (e: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo) => void;
	onHoverItem?: (e: React.MouseEvent<HTMLButtonElement>, item: Pick<PopMenuItemBase, 'id' | 'label'>) => void;
	dismissAll?: () => void;
	gap?: number | string;
}

export type PropMenuEntry =
	| Omit<PopMenuItemBase, 'children' | 'onClick' | 'onHover'>
	| Omit<PopMenuItemGroupBase, 'children'>;

export type PopMenuProps = PopMenuBase &
	Omit<React.HTMLProps<HTMLDivElement>, keyof PopMenuBase> &
	Omit<HTMLMotionProps<'div'>, keyof PopMenuBase>;
export type PopMenuItemProps = PopMenuItemBase & Omit<React.HTMLProps<HTMLButtonElement>, keyof PopMenuItemBase>;
export type PopMenuItemGroupProps = PopMenuItemGroupBase &
	Omit<React.HTMLProps<HTMLDivElement>, keyof PopMenuItemGroupBase>;
