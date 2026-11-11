import { create } from 'zustand';
import type { Toast, ToastStore } from './_types';

let notificationSequence = 0;

export const useToastStore = create<ToastStore>((set) => ({
	toast: null,
	actions: {
		push: <T>(toast: Toast<T> | null) =>
			set({
				toast: toast
					? {
							...toast,
							notificationId: toast.notificationId ?? `slice-toast-${++notificationSequence}`,
							// Bind the typed payload before placing heterogeneous notifications in the shared store.
							onClick: toast.onClick ? (event) => toast.onClick?.(event, toast.data) : undefined,
						}
					: null,
			}),
		clear: (notification) =>
			set((state) => {
				if (notification && state.toast?.notificationId !== notification.notificationId) return state;
				return { toast: null };
			}),
	},
}));

// atomic hook exports for use in React components
export const useToast = () => useToastStore((state) => state.toast);
export const useToastActions = () => useToastStore((state) => state.actions);

// non-reactive imperative exports for use outside the React context
export const toastActions = useToastStore.getState().actions;
export const getToast = () => useToastStore.getState().toast;
