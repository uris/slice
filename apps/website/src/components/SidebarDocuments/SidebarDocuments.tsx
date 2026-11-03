import type React from 'react';
import styles from './SidebarDocuments.module.css';

export interface SidebarDocumentsProps {
	children?: React.ReactNode;
}

export function SidebarDocuments(props: Readonly<SidebarDocumentsProps>) {
	const { children } = props;
	return <div className={styles.wrapper}>{children}</div>;
}
