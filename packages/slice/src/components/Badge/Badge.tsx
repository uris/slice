'use client';

import React from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import css from './Badge.module.css';
import type { BadgeProps } from './_types';

export const Badge = React.memo((rawProps: BadgeProps) => {
	const props = resolveColorProps(rawProps);
	const {
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
		'--badge-color': textColor ?? (variant === 'light' ? 'var(--core-text-primary)' : 'var(--core-text-light)'),
		'--badge-bg':
			backgroundColor ?? (variant === 'light' ? 'var(--core-badge-secondary)' : 'var(--core-badge-primary)'),
	} as React.CSSProperties;

	return (
		<div
			className={`${css.badge}${className ? ` ${className}` : ''}`}
			style={{ ...style, ...cssVars }}
			role="status"
			aria-live="polite"
			aria-atomic="true"
			{...divAttributes}
		>
			{displayCount}
		</div>
	);
});
