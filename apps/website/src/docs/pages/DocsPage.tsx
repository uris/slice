'use client';

import type { ReactDocSlug } from '@/docs/registry/react';
import type { ReactNativeDocSlug } from '@/docs/registry/react-native';
import type { SiteSection } from '@/docs/registry/shared';
import { useDocsActions } from '@/docs/stores/store';
import type { Package } from '@/src/consts/consts';
import { Layout } from '@/src/layout/Layout';

export interface DocPageProps {
	slug: ReactDocSlug | ReactNativeDocSlug | null;
	packageType: Package;
	section: SiteSection;
}

export function DocsPage(props: Readonly<DocPageProps>) {
	const { slug, packageType, section } = props;
	useDocsActions().setDocContext(slug, packageType, section);

	return <Layout />;
}
