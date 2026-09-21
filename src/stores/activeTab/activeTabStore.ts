import { create } from 'zustand';
import type { ActiveTabStore } from './_types';

export const useActiveTabStore = create<ActiveTabStore>((set, get) => {
	let users = 0;
	const handleChange = () => {
		const visibilityState = document.visibilityState;
		const isActiveTab = visibilityState === 'visible';
		const isTabFocused = document.hasFocus();
		if (
			get().visibilityState !== visibilityState ||
			get().isTabFocused !== isTabFocused ||
			get().isActiveTab !== isActiveTab
		) {
			set({ isActiveTab, isTabFocused, visibilityState });
		}
	};

	return {
		isActiveTab: false,
		isTabFocused: false,
		visibilityState: 'hidden',
		actions: {
			initialize: () => {
				if (typeof document === 'undefined') return () => {};
				const target = document;
				const win = target.defaultView;
				if (users === 0) {
					target.addEventListener('visibilitychange', handleChange);
					win?.addEventListener('focus', handleChange);
					win?.addEventListener('blur', handleChange);
				}
				users += 1;
				handleChange();

				let disposed = false;
				return () => {
					if (disposed) return;
					disposed = true;
					users -= 1;
					if (users === 0) {
						target.removeEventListener('visibilitychange', handleChange);
						win?.removeEventListener('focus', handleChange);
						win?.removeEventListener('blur', handleChange);
					}
				};
			},
		},
	};
});

// atomic hook exports for use in React components
export const useIsActiveTab = () => useActiveTabStore((state) => state.isActiveTab);
export const useIsTabFocused = () => useActiveTabStore((state) => state.isTabFocused);
export const useTabVisibilityState = () => useActiveTabStore((state) => state.visibilityState);
export const useInitializeActiveTab = () => useActiveTabStore((state) => state.actions.initialize);

// non-reactive imperative exports for use outside the React context
export const isActiveTab = () => useActiveTabStore.getState().isActiveTab;
export const isTabFocused = () => useActiveTabStore.getState().isTabFocused;
export const tabVisibilityState = () => useActiveTabStore.getState().visibilityState;
export const activeTabActions = useActiveTabStore.getState().actions;
