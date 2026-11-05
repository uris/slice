'use client';

import type { DocsSlug, SiteSection } from '@/docs/registry/shared';
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
		setDocContext(slug, packageType, section);
	}, [slug, packageType, section, setDocContext]);

	return <Layout />;
}
