import { create } from 'zustand';
import type { TipStore } from './_types';

export const useTipStore = create<TipStore>((set) => ({
	tip: null,
	actions: {
		push: (tip) => set({ tip }),
		clear: () => set({ tip: null }),
	},
}));

// atomic hook exports for use in React components
export const useTip = () => useTipStore((state) => state.tip);
export const useTipActions = () => useTipStore((state) => state.actions);

// non-reactive imperative exports for use outside the React context
export const tipActions = useTipStore.getState().actions;
export const getTip = () => useTipStore.getState().tip;
