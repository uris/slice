import type {DocsStoreType} from '@/docs/stores/types';
import {create} from 'zustand';

export const useDocsStore = create<DocsStoreType>((set, _get) => ({
    packageType: null,
    slug: null,
    section: null,
    actions: {
        setDocContext: (slug, packageType, section) => {
            set({slug, packageType, section});
        },
    },
}));

export const useDocsActions = () => useDocsStore((state) => state.actions);

export const usePackageType = () => useDocsStore((state) => state.packageType);

export const useSlug = () => useDocsStore((state) => state.slug);

export const useSection = () => useDocsStore((state) => state.section);
