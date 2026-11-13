import type {SideBarDoc} from '@/components/SidebarDocList/SidebarDocList';
import type {DocsContext, DocsSlug} from '@/docs/registry/shared';
import {type Package, surfaceYellow} from '@/src/consts/consts';
import {classNames} from '@/src/utils/misc';
import type React from 'react';
import {useCallback, useMemo} from 'react';
import styles from './SidebarListItem.module.css';

export enum SidebarListItemType {
    SectionTitle = 'section-title',
    DocTitle = 'doc-title',
}

export interface SidebarListItemProps {
    /** Full DOM ID override. Otherwise document entries use sidebar.<slug>; section headings have no ID. */
    id?: string;
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
    isNew?: boolean;
    deprecated?: boolean;
    beta?: boolean;
}

export function SidebarListItem(props: Readonly<SidebarListItemProps>) {
    const {
        id,
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
        deprecated,
        isNew,
        beta,
    } = props;

    const className = useMemo(() => {
        if (type === SidebarListItemType.SectionTitle) return classNames(styles.button, styles.section);
        return classNames(styles.button, code ? styles.code : styles.doc, styles.clickable);
    }, [type, code]);

    const cssVars = useMemo(() => {
        const parentSelected = !selectedChild && selected;
        return {'--text-color': parentSelected ? surfaceYellow : 'var(--core-text-secondary)'} as React.CSSProperties;
    }, [selected, selectedChild]);

    const handleClick = useCallback(() => {
        if (type !== SidebarListItemType.SectionTitle) onClick?.({slug, packageType});
    }, [slug, packageType, onClick, type]);

    const handleClickChild = useCallback(
        (slug?: DocsSlug | null) => {
            if (slug) onClick?.({slug, packageType});
        },
        [packageType, onClick],
    );

    if (!display) return null;

    return (
        <div className={styles.container}>
            <div className={styles.wrapper} id={id ?? (slug ? `sidebar.${slug}` : undefined)}>
                <input type={'button'} className={className} style={cssVars} onClick={handleClick} value={title}/>
                {deprecated && <span className={classNames(styles.tag, styles.deprecated)}>deprecated</span>}
                {isNew && <span className={classNames(styles.tag, styles.new)}>new</span>}
                {beta && <span className={classNames(styles.tag, styles.deprecated)}>beta</span>}
                {childDocs && childDocs.length > 0 &&
                    <span className={classNames(styles.tag, styles.counter)}>{childDocs.length}</span>}
            </div>
            {selected &&
                childDocs?.map((doc) => {
                    const {
                        id: cId,
                        slug: cSlug,
                        title: cTitle,
                        deprecated: cDeprecated,
                        isNew: cIsNew,
                        beta: cBeta
                    } = doc;
                    const isSelected = cSlug === selectedChild?.slug;
                    return (
                        <div
                            className={styles.wrapper}
                            style={{paddingLeft: 16}}
                            key={cId ?? cSlug ?? cTitle}
                            id={cId ?? (cSlug ? `sidebar.${cSlug}` : undefined)}
                        >
                            <input
                                type={'button'}
                                className={className}
                                style={{color: isSelected ? surfaceYellow : 'var(--core-text-secondary)'}}
                                onClick={() => handleClickChild(cSlug)}
                                value={cTitle}
                            />
                            {cDeprecated &&
                                <span className={classNames(styles.tag, styles.deprecated)}>deprecated</span>}
                            {cIsNew && <span className={classNames(styles.tag, styles.new)}>new</span>}
                            {cBeta && <span className={classNames(styles.tag, styles.deprecated)}>beta</span>}
                        </div>
                    );
                })}
        </div>
    );
}

/*
{childDocs && childDocs.length > 0 && <Icon name={iconName} size={16} strokeColor={iconColor} stroke={2} />}

const iconColor = useMemo((): string => {
	const parentSelected = !selectedChild && selected;
	return parentSelected ? surfaceYellow : 'core-text-secondary';
}, [selected, selectedChild]);

const iconName = useMemo((): SliceIcon => {
	return selectedChild ? 'arrows.chevron-down' : 'arrows.chevron-right';
}, [selectedChild]);
 */
