import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Package } from '@/src/consts/consts';
import type { ComponentType } from 'react';

/** Each document owns its content and optional table of contents. */
export interface DocumentModule {
	default: ComponentType;
	trackedItems?: TrackedItem[];
}

export type DocumentLoader = () => Promise<DocumentModule>;

// Use explicit imports so Next can split documents into chunks and unknown slugs cannot resolve arbitrary files.
const documents: Record<Package, ReadonlyMap<string, DocumentLoader>> = {
	[Package.React]: new Map<string, DocumentLoader>([
		['audio-bubble', () => import('@/documents/react/components/AudioBubble/AudioBubble')],
		['avatar', () => import('@/documents/react/components/Avatar/Avatar')],
		['avatar-group', () => import('@/documents/react/components/AvatarGroup/AvatarGroup')],
		['badge', () => import('@/documents/react/components/Badge/Badge')],
		['button', () => import('@/documents/react/components/Button/Button')],
	]),
	[Package.ReactNative]: new Map<string, DocumentLoader>(),
};

export function getDocumentLoader(packageType: Package | null, slug: string | null): DocumentLoader | undefined {
	if (!packageType || !slug) return undefined;
	return documents[packageType].get(slug);
}
