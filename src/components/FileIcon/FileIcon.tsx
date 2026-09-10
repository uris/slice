'use client';

import React, { useCallback, useMemo } from 'react';
import { useTheme } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { accessibleKeyDown } from '../../utils/functions/misc';
import type { FileIconProps } from './_types';
import { STATIC_FILE_ICONS } from './fileIconRegistry';

export const FileIcon = React.memo((props: FileIconProps) => {
	const { isDark } = useTheme();

	const { name = 'pdf', size = 24, pointer = false, disabled = false, onClick, ...svgAttributes } = props;
	const { id: svgId, className, style, ...rest } = svgAttributes;
	const svgStyle = style ?? ({} as React.CSSProperties);

	// resolve pointer behavior for the file icon wrapper
	const cursor = useMemo(() => {
		if (disabled) return 'default';
		return pointer ? 'pointer' : 'inherit';
	}, [disabled, pointer]);

	// compose inline interaction styles for the file icon wrapper
	const iconStyle = useMemo(() => {
		return {
			cursor,
			userSelect: 'none' as const,
			WebkitUserSelect: 'none' as const,
			WebkitTapHighlightColor: 'transparent',
			outline: 'none',
			border: 0,
		} as React.CSSProperties;
	}, [cursor]);

	// forward click and keyboard activation while respecting the disabled state
	const handleClick = useCallback(
		(e: React.MouseEvent<SVGElement, MouseEvent> | React.KeyboardEvent<SVGSVGElement>) => {
			if (!disabled) onClick?.(e);
		},
		[onClick, disabled],
	);

	// resolve the themed SVG paths for the requested file type
	const definition = STATIC_FILE_ICONS.get(name);
	const paths = definition?.paths(isDark ? 'dark' : 'light');

	/* START.DEBUG */
	useTrackRenders(props, 'Icon');
	/* END.DEBUG */

	if (!paths) return null;

	return (
		<svg
			id={svgId}
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 20 20"
			style={{ ...svgStyle, ...iconStyle }}
			onClick={handleClick}
			role={pointer ? 'button' : 'img'}
			aria-label={`${name} icon`}
			aria-disabled={pointer ? disabled : undefined}
			tabIndex={pointer && !disabled ? 0 : -1}
			onKeyDown={(e) => {
				if (!pointer || disabled) return;
				accessibleKeyDown(e, () => handleClick(e));
			}}
			opacity={disabled ? 0.5 : 1}
			{...rest}
		>
			<title />
			{paths}
		</svg>
	);
});

FileIcon.displayName = 'FileIcon';
