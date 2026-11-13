'use client';

import React, { useMemo, useRef } from 'react';
import { useTheme } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import css from './Icon.module.css';
import type { IconProps } from './_types';
import { STATIC_ICON_REGISTRY } from './iconRegistry';

export const Icon = React.memo((rawProps: IconProps) => {
	const props = resolveColorProps(rawProps);
	const theme = useTheme();

	const {
		name = 'basic.home',
		size = 20,
		stroke = 1.25,
		strokeColor = theme.current.colors['core-icon-primary'],
		fillOpacity = undefined,
		dualTone = false,
		coverUp = theme.current.colors['core-surface-primary'],
		toggle = false,
		pointer = false,
		disabled = false,
		onClick,
		onKeyDown,
		onKeyUp,
		onBlur,
		iconName,
		actionName,
		decorative = false,
		...svgAttributes
	} = props;
	const { id: svgId, className, style, ...rest } = svgAttributes;
	const svgStyle = style ?? ({} as React.CSSProperties);

	// derive the displayed icon shape from the requested variant
	const variantKey = toggle ? 'lineOn' : 'line';
	const iconVariant = STATIC_ICON_REGISTRY.get(name);
	const shape = iconVariant?.[variantKey] ?? iconVariant?.line;

	// resolve pointer behavior for the icon wrapper
	const cursor = useMemo(() => {
		if (disabled) return 'default';
		return pointer ? 'pointer' : 'inherit';
	}, [disabled, pointer]);

	// memo fill opacity value
	const setFillColor = useMemo(() => {
		if (!dualTone) return 0;
		if (fillOpacity !== undefined && Number.isFinite(fillOpacity)) return Math.min(1, Math.max(0, fillOpacity));
		if (theme.current.name.includes('dark')) return 0.2;
		return 0.125;
	}, [fillOpacity, dualTone, theme.current.name]);

	// compose CSS custom properties for the icon wrapper
	const iconStyle = useMemo(() => {
		return {
			'--cursor': cursor,
			'--pointer-events': onClick ? 'auto' : 'none',
		} as React.CSSProperties;
	}, [cursor, onClick]);

	const spacePressed = useRef(false);
	const interactive = Boolean(onClick);
	const hidden = decorative && !interactive;
	const accessibleName = (interactive ? actionName : iconName)?.trim() || `${name} icon`;
	const activate = (element: SVGSVGElement) => {
		element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
	};

	/* START.DEBUG */
	useTrackRenders(props, 'Icon');
	/* END.DEBUG */

	if (!shape) return null;

	return (
		<svg
			{...rest}
			id={svgId}
			className={`${css.icon} ${className ?? ''}`}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 20 20"
			style={{ ...svgStyle, ...iconStyle }}
			onClick={(e) => {
				if (disabled) {
					e.preventDefault();
					e.stopPropagation();
					return;
				}
				onClick?.(e);
			}}
			fill={'transparent'}
			role={interactive ? 'button' : 'img'}
			aria-label={hidden ? undefined : accessibleName}
			aria-hidden={hidden || undefined}
			aria-disabled={interactive ? disabled : undefined}
			tabIndex={interactive && !disabled ? 0 : -1}
			onBlur={(e) => {
				onBlur?.(e);
				spacePressed.current = false;
			}}
			onKeyDown={(e) => {
				onKeyDown?.(e);
				if (e.defaultPrevented || disabled || !interactive) return;
				if (e.key === 'Enter') {
					e.preventDefault();
					if (!e.repeat) activate(e.currentTarget);
				}
				if (e.key === ' ') {
					e.preventDefault();
					spacePressed.current = true;
				}
			}}
			onKeyUp={(e) => {
				onKeyUp?.(e);
				const shouldActivate = e.key === ' ' && spacePressed.current;
				spacePressed.current = false;
				if (!e.defaultPrevented && !disabled && interactive && shouldActivate) {
					e.preventDefault();
					activate(e.currentTarget);
				}
			}}
			opacity={disabled ? 0.5 : 1}
		>
			{shape({ stroke, strokeColor, fillColor: setFillColor, coverUp })}
		</svg>
	);
});

Icon.displayName = 'Icon';
