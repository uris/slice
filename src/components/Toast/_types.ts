import type { HTMLMotionProps } from 'motion/react';

export enum ToastType {
	Success = 'success',
	Error = 'error',
	Warning = 'warning',
	Info = 'info',
}

type ToastBaseProps = {
	notifId?: string;
	message?: string | null;
	size?: 's' | 'm' | 'l';
	border?: boolean;
	padding?: number | string;
	radius?: number | string;
	position?: 'top' | 'bottom';
	container?: 'window' | 'parent';
	offset?: number;
	showDelay?: number;
	duration?: number | 'Infinite';
	close?: boolean;
	type?: ToastType;
	progress?: boolean;
	onShow?: () => void;
	didHide?: () => void;
};

// reserved for internal working - not overridable
type ReservedToastEvents = 'onMouseEnter' | 'onMouseLeave' | 'onFocus' | 'onBlur';

export type ToastProps = Omit<HTMLMotionProps<'div'>, keyof ToastBaseProps | ReservedToastEvents> & ToastBaseProps;
