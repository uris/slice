import { surfaceDark } from '@/src/consts/consts';
import { addOpacity } from '@apple-pie/slice/utils';
import type React from 'react';
import { useMemo } from 'react';
import styles from './HeaderCoverUp.module.css';

export function HeaderCoverUp() {
	const cssVars = useMemo(() => {
		const endColor = addOpacity(surfaceDark, 0.95);
		return {
			background: `linear-gradient(to bottom, ${endColor} 0%, ${endColor} 70%, transparent 100%)`,
		} as React.CSSProperties;
	}, []);
	return <div className={styles.cover} style={cssVars} />;
}
