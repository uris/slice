import type { SideBarDoc } from '@/components/SidebarDocList/SidebarDocList';
import type { DocsContext, DocsSlug } from '@/docs/registry/shared';
import { type Package, surfaceYellow } from '@/src/consts/consts';
import { classNames } from '@/src/utils/misc';
import { Icon, type SliceIcon } from '@apple-pie/slice';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import styles from './SidebarListItem.module.css';

export enum SidebarListItemType {
	SectionTitle = 'section-title',
	DocTitle = 'doc-title',
}

export interface SidebarListItemProps {
	type?: SidebarListItemType;
	title?: string;
	slug?: DocsSlug | null;
	packageType?: Package | null;
	code?: boolean;
	selected?: boolean;
	display?: boolean;
	onClick?: (itemInfo: DocsContext) => void;
	childDocs?: SideBarDoc[];
	selectedChild?: SideBarDoc;
}

export function SidebarListItem(props: Readonly<SidebarListItemProps>) {
	const {
		type = SidebarListItemType.DocTitle,
		title = 'Missing Item Title',
		code = false,
		selected = false,
		display = true,
		slug,
		packageType,
		onClick,
		childDocs,
		selectedChild,
	} = props;

	const className = useMemo(() => {
		if (type === SidebarListItemType.SectionTitle) return classNames(styles.button, styles.section);
		return classNames(styles.button, code ? styles.code : styles.doc, styles.clickable);
	}, [type, code]);

	const cssVars = useMemo(() => {
		const parentSelected = !selectedChild && selected;
		return { '--text-color': parentSelected ? surfaceYellow : 'var(--core-text-secondary)' } as React.CSSProperties;
	}, [selected, selectedChild]);

	const handleClick = useCallback(() => {
		if (type !== SidebarListItemType.SectionTitle) onClick?.({ slug, packageType });
	}, [slug, packageType, onClick, type]);

	const handleClickChild = useCallback(
		(slug?: DocsSlug | null) => {
			if (slug) onClick?.({ slug, packageType });
		},
		[packageType, onClick],
	);

	const iconColor = useMemo((): string => {
		const parentSelected = !selectedChild && selected;
		return parentSelected ? surfaceYellow : 'core-text-secondary';
	}, [selected, selectedChild]);

	const iconName = useMemo((): SliceIcon => {
		return selectedChild ? 'arrows.chevron-down' : 'arrows.chevron-right';
	}, [selectedChild]);

	if (!display) return null;

	return (
		<div className={styles.container}>
			<div className={styles.wrapper} id={`sidebar.${slug}`}>
				<input type={'button'} className={className} style={cssVars} onClick={handleClick} value={title} />
				{childDocs && childDocs.length > 0 && <span className={styles.counter}>{childDocs.length}</span>}
				{childDocs && childDocs.length > 0 && <Icon name={iconName} size={16} strokeColor={iconColor} stroke={2} />}
			</div>
			{selected &&
				childDocs?.map((doc) => {
					const { slug: cSlug, title: cTitle } = doc;
					const isSelected = cSlug === selectedChild?.slug;
					return (
						<div
							className={styles.wrapper}
							style={{ paddingLeft: 16 }}
							key={`sidebar.${cSlug}`}
							id={`sidebar.${cSlug}`}
						>
							<input
								type={'button'}
								className={className}
								style={{ color: isSelected ? surfaceYellow : 'var(--core-text-secondary)' }}
								onClick={() => handleClickChild(cSlug)}
								value={cTitle}
							/>
						</div>
					);
				})}
		</div>
	);
}
