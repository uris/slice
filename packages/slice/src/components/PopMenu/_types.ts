import type { HTMLMotionProps, Transition, Variants } from 'motion/react';
import type React from 'react';
import type { KeyboardShortcut } from '../../hooks/useKeyboardShortcuts/useKeyboardShortcuts';
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
export type PopOffset = 'top' | 'bottom' | 'right' | 'left';
export type PopCaller = HTMLElement;

export type PopMenuSubMenuProps = {
	caller: PopCaller;
	level: number;
	dismissAll: () => void;
};

/** Click details. For toggle items, toggled is the requested next state. */
export type PopMenuItemClickInfo<T = unknown> = Pick<
	PopMenuItemBase<T>,
	'id' | 'label' | 'data' | 'toggle' | 'toggled' | 'subMenu' | 'autoDismiss'
> & {
	dismissAll: () => void;
};

export interface PopMenuBase<T = unknown> {
	/** Defaults to auto; submenus inherit their parent's resolved host. */
	portalContainer?: 'auto' | HTMLElement | false;
	/** Nesting level used to stack submenus above their parent. */
	level?: number;
	name?: string;
	id?: string;
	options?: PropMenuEntry<T>[];
	children?: React.ReactNode;
	padding?: number | string;
	backgroundColor?: ColorValue;
	borderRadius?: number | string;
	borderWidth?: number;
	borderColor?: ColorValue;
	/** Enter/exit overrides; bypassed when the user prefers reduced motion. */
	motionValues?: Variants;
	/** Merged with Water; timing and delays are bypassed for reduced motion. */
	transition?: Transition;
	caller?: PopCaller;
	offset?: PopOffset;
	gap?: number;
	minWidth?: number;
	onClickItem?: (e: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo<T>) => void;
	onHoverItem?: (e: React.MouseEvent<HTMLButtonElement>, item: Pick<PopMenuItemBase<T>, 'id' | 'label'>) => void;
	onDismiss?: () => void;
	dismissAll?: () => void;
}

export interface PopMenuItemBase<T = unknown> {
	/** Application payload included in click details at item, group, and menu levels. */
	data?: T;
	disabled?: boolean;
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
	iconColorDisabled?: ColorValue;
	iconGap?: number;
	backgroundColor?: ColorValue;
	backgroundColorHover?: ColorValue;
	label?: string;
	textColor?: ColorValue;
	textColorHover?: ColorValue;
	textColorDisabled?: ColorValue;
	textSize?: FixedSize;
	subMenu?: (props: PopMenuSubMenuProps) => React.ReactNode;
	padding?: number | string;
	gap?: number | string;
	/** Display a custom string or automatically format a shared shortcut definition. Does not register a binding. */
	shortcut?: string | KeyboardShortcut;
	toggle?: boolean;
	toggled?: boolean;
	onClick?: (e: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo<T>) => void;
	onHover?: (e: React.MouseEvent<HTMLButtonElement>, item: Pick<PopMenuItemBase<T>, 'id' | 'label'>) => void;
}

export interface PopMenuItemGroupBase<T = unknown> {
	name?: string;
	id?: string;
	title?: string;
	textColor?: ColorValue;
	textColorHover?: ColorValue;
	textSize?: FixedSize;
	padding?: number | string;
	items?: PopMenuItemBase<T>[];
	children?: React.ReactNode;
	borderWidth?: number | string;
	borderColor?: ColorValue;
	onClickItem?: (e: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo<T>) => void;
	onHoverItem?: (e: React.MouseEvent<HTMLButtonElement>, item: Pick<PopMenuItemBase<T>, 'id' | 'label'>) => void;
	dismissAll?: () => void;
	gap?: number | string;
}

export type PropMenuEntry<T = unknown> =
	| Omit<PopMenuItemBase<T>, 'children'>
	| Omit<PopMenuItemGroupBase<T>, 'children'>;

export type PopMenuProps<T = unknown> = PopMenuBase<T> &
	Omit<React.HTMLProps<HTMLDivElement>, keyof PopMenuBase<T>> &
	Omit<HTMLMotionProps<'div'>, keyof PopMenuBase<T>>;
export type PopMenuItemProps<T = unknown> = PopMenuItemBase<T> &
	Omit<React.HTMLProps<HTMLButtonElement>, keyof PopMenuItemBase<T>>;
export type PopMenuItemGroupProps<T = unknown> = PopMenuItemGroupBase<T> &
	Omit<React.HTMLProps<HTMLDivElement>, keyof PopMenuItemGroupBase<T>>;
