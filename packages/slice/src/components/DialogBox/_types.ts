import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { SliceIcon } from '../Icon/_types';
import type { ToolTip } from '../sharedTypes';

export type DialogBoxAction<T = string> = {
	id: string;
	label?: string;
	value?: T;
	primary?: boolean;
	iconLeft?: SliceIcon;
	tooltip?: string;
	iconRight?: SliceIcon;
	round?: boolean;
	position?: 'left' | 'right';
	promise?: 'resolve' | 'reject' | 'none';
	disabled?: boolean;
	working?: boolean;
};

type DialogBoxBaseProps<T = string> = {
	children?: React.ReactNode;
	minHeight?: number | string;
	/** Explicit values are hard minimums, even when wider than the parent or viewport. */
	minWidth?: number | string;
	maxWidth?: number | string;
	maxHeight?: number | string;
	borderRadius?: number | string;
	borderColor?: ColorValue;
	borderWidth?: number | string;
	backgroundColor?: ColorValue;
	padding?: number | string;
	title?: string;
	dialogName?: string;
	/** Header fill. Defaults to core-fill-primary while scrolling, otherwise backgroundColor. */
	titleBackgroundColor?: ColorValue;
	titleTextColor?: ColorValue;
	titleBorderColor?: ColorValue;
	titleBorderWidth?: number;
	titleIcon?: SliceIcon;
	titleIconFill?: boolean;
	titleTextSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	contentTextSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	close?: boolean;
	actions?: DialogBoxAction<T>[];
	/** Footer fill. Defaults to core-fill-primary while scrolling, otherwise backgroundColor. */
	actionsBackgroundColor?: ColorValue;
	actionsBorderColor?: ColorValue;
	actionsBorderWidth?: number;
	autoBorderBottom?: boolean;
	scrollHandleColor?: ColorValue;
	scrollHandleColorHover?: ColorValue;
	onAction?: (value?: T) => void;
	onResolve?: (value?: T) => void;
	onReject?: (value?: Error) => void;
	onClose?: () => void;
	onDragPointerDown?: React.PointerEventHandler<HTMLDivElement>;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type DialogBoxProps<T = string> = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof DialogBoxBaseProps<T> | keyof React.AriaAttributes | 'role' | 'dangerouslySetInnerHTML'
> &
	DialogBoxBaseProps<T>;

export type DialogBoxSectionProps = { children?: React.ReactNode };
export type DialogBoxControls<T = string> = {
	close: () => void;
	resolve: (value?: T) => void;
	reject: (error?: Error) => void;
};
