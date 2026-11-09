import type { Transition, Variants } from 'motion/react';
import type React from 'react';

export enum ToastType {
	Success = 'success',
	Error = 'error',
	Warning = 'warning',
	Info = 'info',
}
export type ToastHideReason = 'timeout' | 'dismiss' | 'cleared' | 'replaced';
export interface ToastInfo {
	notificationId?: string;
	message: string;
}
export interface ToastHideInfo extends ToastInfo {
	reason: ToastHideReason;
}
export interface ToastBaseProps<T = unknown> {
	data?: T;
	onClick?: (event: React.MouseEvent<HTMLDivElement>, data: T | undefined) => void;
	notificationId?: string;
	message?: string | null;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	border?: boolean;
	padding?: number | string;
	borderRadius?: number | string;
	position?: 'top' | 'bottom';
	container?: 'window' | 'parent';
	offset?: number;
	showDelay?: number;
	duration?: number | 'infinite';
	close?: boolean;
	closeLabel?: string;
	type?: ToastType | `${ToastType}`;
	progress?: boolean;
	urgency?: 'polite' | 'assertive';
	motionValues?: Variants;
	transition?: Transition;
	onShow?: (notification: ToastInfo) => void;
	onHide?: (notification: ToastHideInfo) => void;
}
export type ToastProps<T = unknown> = ToastBaseProps<T> &
	Omit<
		React.HTMLAttributes<HTMLDivElement>,
		| keyof ToastBaseProps<T>
		| keyof React.AriaAttributes
		| 'role'
		| 'children'
		| 'dangerouslySetInnerHTML'
		| 'onDrag'
		| 'onDragStart'
		| 'onDragEnd'
		| 'onAnimationStart'
	>;
