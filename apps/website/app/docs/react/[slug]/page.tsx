import { DocsPage } from '@/docs/pages/DocsPage';
import { getReactDocSlugs, isReactDocSlug, reactDocsMetadata } from '@/docs/registry/react';
import { SiteSection } from '@/docs/registry/shared';
import { Package } from '@/src/consts/consts';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const dynamicParams = true;

// generate static pages for all slugs at build time
export function generateStaticParams() {
	return getReactDocSlugs().map((slug) => ({ slug }));
}

// generate static page meta for all slugs at build time
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
	const { slug } = await params;
	return isReactDocSlug(slug) ? reactDocsMetadata[slug] : { title: 'Page Not Found' };
}

export default async function Docs({ params }: Readonly<{ params: Promise<{ slug: string }> }>) {
	const { slug } = await params;

	// 404 invalid slugs
	if (!isReactDocSlug(slug)) notFound();

	// render the doc page for slug
	return <DocsPage slug={slug} packageType={Package.React} section={SiteSection.Docs} />;
}
