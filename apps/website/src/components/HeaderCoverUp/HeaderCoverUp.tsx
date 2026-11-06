import { useTheme } from '@apple-pie/slice';
import { addOpacity } from '@apple-pie/slice/utils';
import type React from 'react';
import { useMemo } from 'react';
import styles from './HeaderCoverUp.module.css';

export function HeaderCoverUp() {
	const { colors } = useTheme();
	const cssVars = useMemo(() => {
		const endColor = addOpacity(colors['core-surface-primary'], 0.95);
		return {
			background: `linear-gradient(to bottom, ${endColor} 0%, ${endColor} 70%, transparent 100%)`,
		} as React.CSSProperties;
	}, [colors['core-surface-primary']]);
	return <div className={styles.cover} style={cssVars} />;
}
