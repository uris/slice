import type React from 'react';
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
	borderColor?: string;
	borderWidth?: number | string;
	backgroundColor?: string;
	padding?: number | string;
	title?: string;
	titleColor?: string;
	titleBorderColor?: string;
	titleBorderWidth?: number;
	titleIcon?: string;
	titleIconFill?: boolean;
	titleSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	contentSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	close?: boolean;
	actions?: ModalAction<T>[];
	actionsBorderColor?: string;
	actionsBorderWidth?: number;
	autoBorderBottom?: boolean;
	scrollHandleColor?: string;
	scrollHandleColorHover?: string;
	onAction?: (value?: T) => void;
	onResolve?: (value?: T) => void;
	onReject?: (value?: Error) => void;
	onClose?: () => void;
	onDragPointerDown?: (e: React.PointerEvent<any>) => void;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type ModalProps<T = string> = Omit<React.HTMLAttributes<HTMLElement>, keyof ModalBaseProps<T>> &
	ModalBaseProps<T>;
