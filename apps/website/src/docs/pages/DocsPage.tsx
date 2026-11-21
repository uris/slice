'use client';

import type { DocsSlug, SiteSection } from '@/docs/registry/shared';
import { getSidebarDocSections } from '@/docs/registry/sidebar';
import { useDocsActions } from '@/docs/stores/store';
import type { Package } from '@/src/consts/consts';
import { Layout } from '@/src/layout/Layout';
import { useEffect } from 'react';

export interface DocPageProps {
	slug: DocsSlug | null;
	packageType: Package;
	section: SiteSection;
}

export function DocsPage(props: Readonly<DocPageProps>) {
	const { slug, packageType, section } = props;
	const { setDocContext } = useDocsActions();
	useEffect(() => {
		const item = getSidebarDocSections(packageType)
			.flat()
			.flatMap((item) => [...(item.childDocs ?? []), item])
			.find((item) => item.slug === slug);
		const query = new URLSearchParams(window.location.search).get('docSidebar');
		let docSidebar = item?.docSidebar ?? true;
		if (query === 'false') docSidebar = false;
		if (query === 'true') docSidebar = true;
		setDocContext(slug, packageType, section, docSidebar);
	}, [slug, packageType, section, setDocContext]);

	return <Layout />;
}
