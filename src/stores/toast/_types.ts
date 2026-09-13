import type { ToastType } from '../../components/Toast';

export type Toast = {
	notifId?: string;
	message: string | null;
	duration?: number | 'Infinite';
	type?: ToastType;
	close?: boolean;
	position?: 'top' | 'bottom';
	progress?: boolean;
	container?: 'parent' | 'window';
};
export interface ToastStore {
	toast: Toast | null;
	actions: {
		push: (toast: Toast | null) => void;
		clear: () => void;
	};
}
