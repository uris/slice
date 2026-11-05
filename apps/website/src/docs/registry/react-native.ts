import { sharedDocSlugs, sharedDocsMetadata } from '@/docs/registry/shared';
import type { Metadata } from 'next';

// all doc slugs (pages) including shared docs
export const reactNativeDocSlugs = [
	'placeholder',
	'get-started',
	'installation',
	'resources',
	...sharedDocSlugs,
] as const;

// doc slug type including shared
export type ReactNativeDocSlug = (typeof reactNativeDocSlugs)[number];

// meta for all slugs including shared
export const reactNativeDocsMetadata: Record<ReactNativeDocSlug, Metadata> = {
	placeholder: {
		title: 'Placeholder | Slice UIKit',
		description: 'Placeholder description.',
	},
	'get-started': {
		title: 'Get Started | Slice UIKit',
		description: 'Get started with Slice UIKit.',
	},
	installation: {
		title: 'Installation | Slice UIKit',
		description: 'Install Slice UIKit in your project.',
	},
	resources: {
		title: 'Resources | Slice UIKit',
		description: 'Explore Slice UIKit resources.',
	},
	...sharedDocsMetadata,
};

// utility to check if string is a valid slug
export function isReactNativeDocSlug(slug: string): slug is ReactNativeDocSlug {
	return reactNativeDocSlugs.includes(slug as ReactNativeDocSlug);
}

// get all react doc slugs
export function getReactNativeDocSlugs(): ReactNativeDocSlug[] {
	return [...reactNativeDocSlugs];
}
