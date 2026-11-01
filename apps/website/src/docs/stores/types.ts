import type {DocsSlug, SiteSection} from '@/docs/registry/shared';
import type {Package} from '@/src/consts/consts';

export type DocsStoreType = {
    packageType: Package | null;
    slug: DocsSlug | null;
    section: SiteSection | null;
    actions: {
        setDocContext: (slug: DocsSlug | null, packageType: Package | null, section: SiteSection | null) => void;
    };
};
