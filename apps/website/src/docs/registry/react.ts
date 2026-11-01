import { sharedDocSlugs, sharedDocsMetadata } from '@/docs/registry/shared';
import type { Metadata } from 'next';
import type { ComponentType } from 'react';

// all doc slugs (pages)
export const reactDocSlugs = ['placeholder', 'get-started', 'installation', 'resources', ...sharedDocSlugs] as const;

// doc slug type including shared
export type ReactDocSlug = (typeof reactDocSlugs)[number];

// meta for all slugs including shared
export const reactDocsMetadata: Record<ReactDocSlug, Metadata> = {
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

/// doc page module type
export type DocPageModule = { default: ComponentType };

// utility to check if string is a valid slug
export function isReactDocSlug(slug: string): slug is ReactDocSlug {
	return reactDocSlugs.includes(slug as ReactDocSlug);
}

// get all react doc slugs
export function getReactDocSlugs(): ReactDocSlug[] {
	return [...reactDocSlugs];
}
