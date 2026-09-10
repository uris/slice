'use client';

import React, { useMemo } from 'react';
import { useTheme } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { accessibleKeyDown } from '../../utils/functions/misc';
import css from './Icon.module.css';
import type { IconProps } from './_types';
import { STATIC_ICON_REGISTRY } from './iconRegistry';

export const Icon = React.memo((props: IconProps) => {
	const theme = useTheme();

	const {
		name = 'home',
		size = 20,
		stroke = 1.5,
		strokeColor = theme.current.colors['core-icon-primary'],
		fillColor = undefined,
		fill = false,
		coverUp = theme.current.colors['core-surface-primary'],
		toggle = false,
		pointer = false,
		disabled = false,
		onClick,
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
		if (!fill) return 0;
		if (fillColor) return fillColor;
		if (theme.current.name.includes('dark')) return 0.2;
		return 0.125;
	}, [fillColor, fill, theme.current.name]);

	// compose CSS custom properties for the icon wrapper
	const iconStyle = useMemo(() => {
		return {
			'--cursor': cursor,
			'--pointer-events': onClick ? 'auto' : 'none',
		} as React.CSSProperties;
	}, [cursor, onClick]);

	// route keyboard activation through the same click callback
	const handleKeyActivate = useMemo(
		() => () => onClick?.(undefined as unknown as React.MouseEvent<SVGElement, MouseEvent>),
		[onClick],
	);

	/* START.DEBUG */
	useTrackRenders(props, 'Icon');
	/* END.DEBUG */

	if (!shape) return null;

	return (
		<svg
			id={svgId}
			className={`${css.icon} ${className}`}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 20 20"
			style={{ ...svgStyle, ...iconStyle }}
			onClick={(e) => onClick?.(e)}
			fill={'transparent'}
			role="img"
			aria-label={`${name} icon`}
			tabIndex={pointer && !disabled ? 0 : -1}
			onKeyDown={(e) => accessibleKeyDown(e, handleKeyActivate)}
			opacity={disabled ? 0.5 : 1}
			{...rest}
		>
			<title />
			{shape({ stroke, strokeColor, fillColor: setFillColor, coverUp })}
		</svg>
	);
});

Icon.displayName = 'Icon';
