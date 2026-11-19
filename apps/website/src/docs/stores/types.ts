import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import type { DocsSlug, SiteSection } from '@/docs/registry/shared';
import type { Package } from '@/src/consts/consts';
import type { RefObject } from 'react';

export type DocsStoreType = {
	initialized: boolean;
	loadState: LoadState | null;
	packageType: Package | null;
	slug: DocsSlug | null;
	section: SiteSection | null;
	trackedItems: TrackedItem[];
	onThisPageItem: TrackedItemInfo | null;
	rightPanelClosed: boolean;
	minTop: number | null;
	scrollBox: RefObject<HTMLDivElement | null>;
	scrollBoxSize: { height: number | undefined; width: number | undefined } | undefined;
	scrollAmount: number | undefined;
	scrollDirection: 'up' | 'down' | null | undefined;
	visibleItems: Set<string>;
	actions: {
		setDocContext: (slug: DocsSlug | null, packageType: Package | null, section: SiteSection | null) => void;
		setTrackedItems: (trackedItems: TrackedItem[] | null) => void;
		updateVisibleItems: (itemId: string | null | undefined, visible: boolean) => void;
		setScrollBoxSize: (size: { height: number | undefined; width: number | undefined }) => void;
		setScrollAmount: (amount: number | undefined) => void;
		setLoadState: (loadState: LoadState) => void;
		setOnThisPageId: (id: string | null, rect: DOMRect | undefined) => void;
		setMinTop: (minTop: number | undefined) => void;
		setRightPanelClosed: (rightPanelClosed: boolean) => void;
		toggleRightPanel: () => void;
	};
};

export enum LoadState {
	Loading = 'loading',
	Error = 'error',
	NotFound = 'not-found',
	Loaded = 'loaded',
}

export type TrackedItemInfo = {
	id: string | null | undefined;
	rect: DOMRect | undefined | null;
};
