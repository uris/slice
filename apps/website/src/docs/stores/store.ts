import type { DocsStoreType } from '@/docs/stores/types';
import { createRef } from 'react';
import { create } from 'zustand';

export const useDocsStore = create<DocsStoreType>((set, get) => ({
	packageType: null,
	slug: null,
	section: null,
	trackedItems: [],
	scrollBox: createRef<HTMLDivElement>(),
	scrollBoxSize: undefined,
	visibleItems: new Set<string>(),
	scrollAmount: 0,
	scrollDirection: null,
	actions: {
		setDocContext: (slug, packageType, section) => {
			set((state) => {
				if (state.slug === slug && state.packageType === packageType && state.section === section) return state;
				return { slug, packageType, section, visibleItems: new Set<string>(), scrollAmount: 0 };
			});
		},
		setTrackedItems: (trackedItems) => {
			set({ trackedItems: trackedItems ?? [] });
		},
		updateVisibleItems: (item, visible) => {
			if (!item) return;
			set((state) => {
				if (state.visibleItems.has(item) === visible) return state;
				const visibleItems = new Set(state.visibleItems);
				if (visible) visibleItems.add(item);
				else visibleItems.delete(item);
				return { visibleItems };
			});
		},
		setScrollBoxSize: (scrollBoxSize: { height: number | undefined; width: number | undefined }) => {
			set({ scrollBoxSize });
		},
		setScrollAmount: (scrollAmount: number | undefined) => {
			if (scrollAmount === undefined) return;
			const prevScrollAmount = get().scrollAmount;
			const scrollDiff = scrollAmount - (prevScrollAmount ?? 0);
			const scrollDirection = scrollDiff > 0 ? 'down' : scrollDiff < 0 ? 'up' : null;
			set({ scrollAmount, scrollDirection });
		},
	},
}));

export const useDocsActions = () => useDocsStore((state) => state.actions);
export const usePackageType = () => useDocsStore((state) => state.packageType);
export const useSlug = () => useDocsStore((state) => state.slug);
export const useSection = () => useDocsStore((state) => state.section);
export const useTrackedItems = () => useDocsStore((state) => state.trackedItems);
export const useVisibleItems = () => useDocsStore((state) => state.visibleItems);
export const useOldestVisibleItem = () => useDocsStore((state) => state.visibleItems.values().next().value ?? null);
export const useNewestVisibleItem = () => useDocsStore((state) => [...state.visibleItems].at(-1) ?? null);
export const useScrollboxHeight = () => useDocsStore((state) => state.scrollBoxSize?.height ?? null);
export const useScrollboxWidth = () => useDocsStore((state) => state.scrollBoxSize?.width ?? null);
export const useScrollboxSize = () => useDocsStore((state) => state.scrollBoxSize);
export const useScrollBox = () => useDocsStore((state) => state.scrollBox);
export const useScrollAmount = () => useDocsStore((state) => state.scrollAmount);
export const useScrollDirection = () => useDocsStore((state) => state.scrollDirection);
