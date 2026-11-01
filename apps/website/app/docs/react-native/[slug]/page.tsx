import {DocsPage} from '@/docs/pages/DocsPage';
import {getReactNativeDocSlugs, isReactNativeDocSlug, reactNativeDocsMetadata} from '@/docs/registry/react-native';
import {SiteSection} from '@/docs/registry/shared';
import {Package} from '@/src/consts/consts';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';

export const dynamicParams = true;

// generate static pages for all slugs at build time
export function generateStaticParams() {
    return getReactNativeDocSlugs().map((slug) => ({slug}));
}

// generate static page meta for all slugs at build time
export async function generateMetadata({params}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const {slug} = await params;
    return isReactNativeDocSlug(slug) ? reactNativeDocsMetadata[slug] : {title: 'Page Not Found'};
}

export default async function Docs({params}: Readonly<{ params: Promise<{ slug: string }> }>) {
    const {slug} = await params;

    // 404 invalid slugs
    if (!isReactNativeDocSlug(slug)) notFound();

    // render the doc page for slug
    return <DocsPage slug={slug} packageType={Package.ReactNative} section={SiteSection.Docs}/>;
}
