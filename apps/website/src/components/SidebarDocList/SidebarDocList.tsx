import { SidebarListItem, type SidebarListItemProps } from '@/components/SidebarListItem/SidebarListItem';
import type { DocsContext } from '@/docs/registry/shared';
import { usePackageType, useSlug } from '@/docs/stores/store';
import type { Package } from '@/src/consts/consts';
import { useCallback } from 'react';
import styles from './SidebarDocList.module.css';

export type SideBarDoc = Omit<SidebarListItemProps, 'selected' | 'packageType' | 'onClick'>;
export type ListSection = SideBarDoc[];

export interface SideBarListProps {
	items: ListSection[];
}

export interface SideBarListSectionProps {
	items: ListSection;
	packageType?: Package | null;
}

export function SidebarDocList(props: Readonly<SideBarListProps>) {
	const { items } = props;
	const packageType = usePackageType();
	return (
		<div className={styles.wrapper}>
			{items.map((section, index) => {
				return (
					<SideBarListSection
						key={`${packageType}.${section[0]?.title ?? 'section'}.${index}`}
						packageType={packageType}
						items={section}
					/>
				);
			})}
		</div>
	);
}

export function SideBarListSection(props: Readonly<SideBarListSectionProps>) {
	const { items, packageType } = props;
	const selectedSlug = useSlug();
	const selectedPackageType = usePackageType();

	const handleClickDoc = useCallback((info: DocsContext) => {
		const { slug, packageType } = info;
		if (!slug || !packageType) return;
		window.open(`/docs/${packageType}/${slug}/`, '_top');
	}, []);

	return (
		<div className={styles.section}>
			{items.map((item, index) => {
				const { slug, childDocs, ...rest } = item;
				const selectedChild = childDocs?.find((doc) => doc.slug === selectedSlug);
				const selected = slug === selectedSlug && packageType === selectedPackageType;
				console.log({ childDocs, slug, selectedChild });
				return (
					<SidebarListItem
						key={`${packageType ?? 'section'}.${slug ?? item.title ?? 'doc'}.${index}`}
						slug={slug}
						packageType={packageType}
						onClick={handleClickDoc}
						selected={selected || !!selectedChild}
						selectedChild={selectedChild}
						childDocs={childDocs}
						{...rest}
					/>
				);
			})}
		</div>
	);
}
