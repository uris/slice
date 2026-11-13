import type {Package} from '@/src/consts/consts';
import type {Metadata} from 'next';

// all doc slugs (pages)
export const sharedDocSlugs = [
    'colors',
    'motion',
    'type-face',
    'type-styles',
    'corners',
    'elevations',
    'icons',
    'spacing',
] as const;

// doc slug type
export type SharedDocSlug = (typeof sharedDocSlugs)[number];

export const sharedDocsMetadata: Record<SharedDocSlug, Metadata> = {
    colors: {
        title: 'Colors | Slice UIKit',
        description: 'Explore Slice color ramps and compare light and dark theme tokens, base hex values, and opacity.',
    },
    motion: {
        title: 'Motion | Slice UIKit',
        description: 'Install Slice UIKit in your project.',
    },
    'type-face': {
        title: 'Typography | Typeface | Slice UIKit',
        description: 'Explore Funnel Sans, preview its weights and styles, and use your own font with Slice.',
    },
    'type-styles': {
        title: 'Typography | Type Styles | Slice UIKit',
        description: 'Explore Slice heading and body text styles, compare sizes and weights, and apply typography presets.',
    },
    elevations: {
        title: 'Elevations | Slice UIKit',
        description: 'Explore Slice UIKit resources.',
    },
    corners: {
        title: 'Corners & Shapes | Slice UIKit',
        description: 'Explore Slice corner tokens, rounded corners, pill shapes, and square corners.',
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

// Keep unknown route slugs so missing documents can render inside the docs shell.
export type DocsSlug = string;

export type DocsContext = { slug?: DocsSlug | null; packageType?: Package | null };

export enum SiteSection {
    Docs = 'docs',
    Figma = 'figma',
    AIKit = 'ai-kit',
}
