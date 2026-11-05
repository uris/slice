import { SiteSection } from '@/docs/registry/shared';
import { usePackageType, useSection } from '@/docs/stores/store';
import { useMemo } from 'react';
import styles from './Path.module.css';

export type PathItem = {
	label: string;
	id: string;
};

interface PathProps {
	pathItems?: PathItem[];
}

export function Path(props: Readonly<PathProps>) {
	const { pathItems } = props;
	const packageType = usePackageType();
	const section = useSection();

	const resolvedPathItems: PathItem[] = useMemo(() => {
		if (pathItems) return pathItems;
		switch (section) {
			case SiteSection.AIKit:
			case SiteSection.Figma:
				return [{ label: section ?? 'unknown', id: section ?? 'unknown' }];
			case SiteSection.Docs:
				return [
					{ label: section ?? 'unknown', id: section ?? 'unknown' },
					{ label: packageType ?? 'unknown', id: packageType ?? 'unknown' },
				];
			default:
				return [];
		}
	}, [pathItems, section, packageType]);

	return (
		<div className={styles.wrapper}>
			{resolvedPathItems.map((item, index) => {
				const { id, label } = item;
				return (
					<span className={styles.item} key={`path.${label}.${id}`}>
						{label}
					</span>
				);
			})}
		</div>
	);
}
