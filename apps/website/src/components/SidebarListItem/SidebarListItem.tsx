import type { DocsContext, DocsSlug } from '@/docs/registry/shared';
import { type Package, surfaceYellow } from '@/src/consts/consts';
import { classNames } from '@/src/utils/misc';
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
}

export function SidebarListItem(props: SidebarListItemProps) {
	const {
		type = SidebarListItemType.DocTitle,
		title = 'Missing Item Title',
		code = false,
		selected = false,
		display = true,
		slug,
		packageType,
		onClick,
	} = props;

	const className = useMemo(() => {
		if (type === SidebarListItemType.SectionTitle) return classNames(styles.button, styles.section);
		return classNames(styles.button, code ? styles.code : styles.doc, styles.clickable);
	}, [type, code]);

	const cssVars = useMemo(() => {
		return { '--text-color': selected ? surfaceYellow : 'var(--core-text-tertiary)' } as React.CSSProperties;
	}, [selected]);

	const value = useMemo(() => {
		if (!code) return title;
		return `<${title}/>`;
	}, [code, title]);

	const handleClick = useCallback(() => {
		if (type !== SidebarListItemType.SectionTitle) onClick?.({ slug, packageType });
	}, [slug, packageType, onClick, type]);

	if (!display) return null;
	return (
		<div className={styles.wrapper}>
			<input type={'button'} className={className} style={cssVars} onClick={handleClick} value={value} />
		</div>
	);
}
