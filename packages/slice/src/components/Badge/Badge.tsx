'use client';
import { getElevationStyle } from '../../utils/styling/getElevationStyle';

import React from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import css from './Badge.module.css';
import type { BadgeProps } from './_types';

export const Badge = React.memo((rawProps: BadgeProps) => {
	const props = resolveColorProps(rawProps);
	const { isDark } = useTheme();
	const primaryForeground = isDark ? 'var(--core-text-dark)' : 'var(--core-text-light)';
	const {
		elevation = 0,
		count,
		variant = 'dark',
		hideZero = true,
		backgroundColor,
		textColor,
		className,
		style,
		...divAttributes
	} = props;

	/* START.DEBUG */
	useTrackRenders(props, 'Badge');
	/* END.DEBUG */

	if (count == null) return null;
	if (typeof count === 'number' && (!Number.isFinite(count) || (hideZero && count === 0))) return null;
	if (typeof count === 'string' && !count.trim()) return null;

	const displayCount = typeof count === 'number' && count > 99 ? '99+' : String(count);
	const cssVars = {
		'--badge-color': textColor ?? (variant === 'light' ? 'var(--core-text-primary)' : primaryForeground),
		'--badge-bg':
			backgroundColor ?? (variant === 'light' ? 'var(--core-badge-secondary)' : 'var(--core-badge-primary)'),
	} as React.CSSProperties;

	return (
		<div
			className={`${css.badge}${className ? ` ${className}` : ''}`}
			style={{ ...getElevationStyle(elevation), ...style, ...cssVars }}
			role="status"
			aria-live="polite"
			aria-atomic="true"
			{...divAttributes}
		>
			<span className={css.label}>{displayCount}</span>
		</div>
	);
});
