import type { DocsSlug, SiteSection } from '@/docs/registry/shared';
import type { Package } from '@/src/consts/consts';
import type { RefObject } from 'react';

export type DocsStoreType = {
	packageType: Package | null;
	slug: DocsSlug | null;
	section: SiteSection | null;
	scrollBox: RefObject<HTMLDivElement | null>;
	scrollBoxSize: { height: number | undefined; width: number | undefined } | undefined;
	scrollAmount: number | undefined;
	visibleItems: Set<string>;
	actions: {
		setDocContext: (slug: DocsSlug | null, packageType: Package | null, section: SiteSection | null) => void;
		updateVisibleItems: (itemId: string | null | undefined, visible: boolean) => void;
		setScrollBoxSize: (size: { height: number | undefined; width: number | undefined }) => void;
		setScrollAmount: (amount: number | undefined) => void;
	};
};
