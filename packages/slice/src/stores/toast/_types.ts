import type { ToastHideInfo, ToastProps } from '../../components/Toast';

/** Store values can be spread directly into Toast, including motion and lifecycle options. */
export type Toast<T = unknown> = ToastProps<T> & { message: string | null };
export interface ToastStore {
	toast: Toast | null;
	actions: {
		push: <T = unknown>(toast: Toast<T> | null) => void;
		/** With onHide metadata, clear only the matching notification; with no argument, clear unconditionally. */
		clear: (notification?: ToastHideInfo) => void;
	};
}
