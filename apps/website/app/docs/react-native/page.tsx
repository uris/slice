import { DocsPage } from '@/docs/pages/DocsPage';
import { SiteSection } from '@/docs/registry/shared';
import { Package } from '@/src/consts/consts';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Documentation | Slice UIKit' };

export default function Docs() {
	return <DocsPage slug={null} packageType={Package.ReactNative} section={SiteSection.Docs} />;
}
