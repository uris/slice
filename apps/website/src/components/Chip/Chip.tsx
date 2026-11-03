import { outlineTertiary, surfaceDark, surfaceYellow } from '@/src/consts/consts';
import { classNames } from '@/src/utils/misc';
import { setStyle } from '@apple-pie/slice/utils';
import type React from 'react';
import { useMemo } from 'react';
import styles from './Chip.module.css';

export enum ChipType {
	Primary = 'primary',
	Secondary = 'secondary',
}

interface ChipProps {
	label?: string;
	variant?: ChipType;
	padding?: string | number;
}

export function Chip(props: Readonly<ChipProps>) {
	const { label = 'Label', variant = ChipType.Secondary, padding = 4 } = props;
	const isPrimary = variant === ChipType.Primary;

	const className = useMemo(() => {
		if (isPrimary) return classNames(styles.chip, styles.primary);
		return classNames(styles.chip, styles.secondary);
	}, [isPrimary]);

	const buttonStyles = useMemo(() => {
		return {
			'--label-color': isPrimary ? surfaceDark : 'var(--core-text-primary)',
			'--bg-color': isPrimary ? surfaceYellow : surfaceDark,
			'--border-color': isPrimary ? 'transparent' : outlineTertiary,
			'--chip-padding': setStyle(padding),
		} as React.CSSProperties;
	}, [isPrimary, padding]);

	return (
		<div className={className} style={buttonStyles}>
			{label}
		</div>
	);
}
