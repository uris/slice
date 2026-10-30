'use client';

import React, { useMemo } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import css from './Badge.module.css';
import type { BadgeProps } from './_types';

export const Badge = React.memo((props: BadgeProps) => {
	const { count, variant = 'dark', hideNull = true, ...divAttributes } = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';

	// derive the display value shown inside the badge
	const displayCount = useMemo(() => {
		if (count === undefined) return '0';
		if (typeof count === 'string') return count;
		return count > 99 ? '99+' : count.toString();
	}, [count]);

	// compose CSS custom properties for the badge colors
	const cssVars = useMemo(() => {
		return {
			'--badge-color': variant === 'light' ? 'var(--core-text-primary)' : 'var(--core-text-light)',
			'--badge-bg': variant === 'light' ? 'var(--core-badge-secondary)' : 'var(--core-badge-primary)',
		} as React.CSSProperties;
	}, [variant]);

	/* START.DEBUG */
	useTrackRenders(props, 'Badge');
	/* END.DEBUG */

	if (count === undefined || count === '' || (hideNull && count === 0)) return null;

	return (
		<div
			id={divId}
			className={`${css.badge}${divClass}`}
			style={{ ...divStyle, ...cssVars }}
			role={'status'}
			aria-live={'polite'}
			{...rest}
		>
			{displayCount}
		</div>
	);
});
