import { DocsPage } from '@/docs/pages/DocsPage';
import { SiteSection } from '@/docs/registry/shared';
import { Package } from '@/src/consts/consts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'AI Kit | Slice UIKit',
	description: 'AI Kit resources for Slice UIKit.',
};

export default function Page() {
	return <DocsPage slug={null} packageType={Package.React} section={SiteSection.AIKit} />;
}
