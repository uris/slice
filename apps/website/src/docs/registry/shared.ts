import type { ReactDocSlug } from '@/docs/registry/react';
import type { ReactNativeDocSlug } from '@/docs/registry/react-native';
import type { Package } from '@/src/consts/consts';
import type { Metadata } from 'next';

// all doc slugs (pages)
export const sharedDocSlugs = ['colors', 'motion', 'typography', 'corners', 'elevations', 'icons', 'spacing'] as const;

// doc slug type
export type SharedDocSlug = (typeof sharedDocSlugs)[number];

export const sharedDocsMetadata: Record<SharedDocSlug, Metadata> = {
	colors: {
		title: 'Colors | Slice UIKit',
		description: 'Get started with Slice UIKit.',
	},
	motion: {
		title: 'Motion | Slice UIKit',
		description: 'Install Slice UIKit in your project.',
	},
	typography: {
		title: 'Typography | Slice UIKit',
		description: 'Explore Slice UIKit resources.',
	},
	elevations: {
		title: 'Elevations | Slice UIKit',
		description: 'Explore Slice UIKit resources.',
	},
	corners: {
		title: 'Icons | Slice UIKit',
		description: 'Explore Slice UIKit resources.',
	},
	icons: {
		title: 'Icons | Slice UIKit',
		description: 'Explore Slice UIKit resources.',
	},
	spacing: {
		title: 'Spacing | Slice UIKit',
		description: 'Explore Slice UIKit resources.',
	},
};

export type DocsSlug = ReactDocSlug | ReactNativeDocSlug;

export type DocsContext = { slug?: DocsSlug | null; packageType?: Package | null };

export enum SiteSection {
	Docs = 'docs',
	Figma = 'figma',
	AIKit = 'ai-kit',
}
