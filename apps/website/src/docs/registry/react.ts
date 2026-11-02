import { sharedDocSlugs, sharedDocsMetadata } from '@/docs/registry/shared';
import type { Metadata } from 'next';

// all doc slugs (pages)
export const reactDocSlugs = [
	'audio-bubble',
	'avatar',
	'avatar-group',
	'badge',
	'button',
	'placeholder',
	'get-started',
	'installation',
	'resources',
	...sharedDocSlugs,
] as const;

// doc slug type including shared
export type ReactDocSlug = (typeof reactDocSlugs)[number];

// meta for all slugs including shared
export const reactDocsMetadata: Record<ReactDocSlug, Metadata> = {
	'audio-bubble': {
		title: 'AudioBubble | Slice UIKit',
		description:
			'Bring live audio to life with the Slice AudioBubble component for React. Explore usage, behavior, accessibility, props, and events.',
	},
	avatar: {
		title: 'Avatar | Slice UIKit',
		description: 'Display profile photos and initials with the Slice Avatar component for React.',
	},
	'avatar-group': {
		title: 'AvatarGroup | Slice UIKit',
		description: 'Show collaborators, assignees, and participants with the Slice AvatarGroup component for React.',
	},
	badge: {
		title: 'Badge | Slice UIKit',
		description:
			'Add compact counts and labels with the Slice Badge component for React. Explore usage, accessibility, props, and events.',
	},
	button: {
		title: 'Button | Slice UIKit',
		description:
			'Build clear actions with the Slice Button component for React. Explore variants, icons, loading states, accessibility, props, and refs.',
	},
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
export function isReactDocSlug(slug: string): slug is ReactDocSlug {
	return reactDocSlugs.includes(slug as ReactDocSlug);
}

// get all react doc slugs
export function getReactDocSlugs(): ReactDocSlug[] {
	return [...reactDocSlugs];
}
