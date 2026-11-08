import { create } from 'zustand';
import type { PopMenuStore } from './_types';

export const usePopMenuStore = create<PopMenuStore>((set) => ({
	popMenu: null,
	version: 0,
	actions: {
		push: (popMenu) => set((state) => ({ popMenu, version: state.version + 1 })),
		clear: () => set((state) => ({ popMenu: null, version: state.version + 1 })),
	},
}));

export const usePopMenu = () => usePopMenuStore((state) => state.popMenu);
export const usePopMenuActions = () => usePopMenuStore((state) => state.actions);

export const popMenuActions = usePopMenuStore.getState().actions;
export const getPopMenu = () => usePopMenuStore.getState().popMenu;
