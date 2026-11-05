import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { ToolTip } from '../sharedTypes';

export type ModalAction<T = string> = {
	id: string;
	label?: string;
	value?: T;
	primary?: boolean;
	iconLeft?: string;
	tooltip?: string;
	iconRight?: string;
	round?: boolean;
	position?: 'left' | 'right';
	promise?: 'resolve' | 'reject';
};

type ModalBaseProps<T = string> = {
	children?: React.ReactNode;
	minHeight?: number | string;
	minWidth?: number | string;
	maxWidth?: number | string;
	maxHeight?: number | string;
	borderRadius?: number | string;
	borderColor?: ColorValue;
	borderWidth?: number | string;
	backgroundColor?: ColorValue;
	padding?: number | string;
	title?: string;
	titleColor?: ColorValue;
	titleBorderColor?: ColorValue;
	titleBorderWidth?: number;
	titleIcon?: string;
	titleIconFill?: boolean;
	titleTextSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	contentTextSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	close?: boolean;
	actions?: ModalAction<T>[];
	actionsBorderColor?: ColorValue;
	actionsBorderWidth?: number;
	autoBorderBottom?: boolean;
	scrollHandleColor?: ColorValue;
	scrollHandleColorHover?: ColorValue;
	onAction?: (value?: T) => void;
	onResolve?: (value?: T) => void;
	onReject?: (value?: Error) => void;
	onClose?: () => void;
	onDragPointerDown?: (e: React.PointerEvent<any>) => void;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type ModalProps<T = string> = Omit<React.HTMLAttributes<HTMLElement>, keyof ModalBaseProps<T>> &
	ModalBaseProps<T>;
