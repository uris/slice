import { create } from 'zustand';
import type { Toast, ToastStore } from './_types';

export const useToastStore = create<ToastStore>((set) => ({
	toast: null,
	actions: {
		push: (toast: Toast | null) => set({ toast }),
		clear: () => set({ toast: null }),
	},
}));

// atomic hook exports for use in React components
export const useToast = () => useToastStore((state) => state.toast);
export const useToastActions = () => useToastStore((state) => state.actions);

// non-reactive imperative exports for use outside the React context
export const toastActions = useToastStore.getState().actions;
export const getToast = () => useToastStore.getState().toast;
