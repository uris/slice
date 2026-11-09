'use client';

import React, { useRef } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { resolveFileIconType } from '../../utils/functions/files';
import { classNames } from '../../utils/functions/misc';
import css from './FileIcon.module.css';
import type { FileIconProps, FileIconType } from './_types';
import { STATIC_FILE_ICONS } from './fileIconRegistry';

const labels: Record<FileIconType, string> = {
	pdf: 'PDF file',
	text: 'Text document',
	sheet: 'Spreadsheet',
	preso: 'Presentation',
	md: 'Markdown file',
	code: 'Code file',
	image: 'Image file',
	audio: 'Audio file',
	video: 'Video file',
	other: 'File',
};
const FileIconBase = React.forwardRef<SVGSVGElement, FileIconProps>((props, ref) => {
	const { isDark } = useTheme();
	const {
		type,
		filename,
		size = 24,
		pointer,
		disabled = false,
		label,
		decorative = false,
		onClick,
		onKeyDown,
		onKeyUp,
		onBlur,
		'aria-label': ariaLabel,
		className,
		style,
		...attributes
	} = props;
	const inferred = type ?? resolveFileIconType(filename);
	const category = STATIC_FILE_ICONS.has(inferred) ? inferred : 'other';
	const definition = STATIC_FILE_ICONS.get(category);
	const interactive = Boolean(onClick);
	const hidden = decorative && !interactive;
	const spacePressed = useRef(false);
	const resolvedSize = Number.isFinite(size) && size > 0 ? size : 24;
	const accessibleName = label?.trim() || ariaLabel?.trim() || labels[category];
	const cursor = () => {
		if (disabled) return 'default';
		if (pointer === false) return 'inherit';
		if (pointer || interactive) return 'pointer';
		return 'inherit';
	};
	// Keyboard activation dispatches a real click-shaped event, preserving one callback contract.
	const activate = (event: React.KeyboardEvent<SVGSVGElement>) => {
		const view = event.currentTarget.ownerDocument.defaultView;
		if (!view) return;
		event.currentTarget.dispatchEvent(
			new view.MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view,
				detail: 0,
				ctrlKey: event.ctrlKey,
				altKey: event.altKey,
				metaKey: event.metaKey,
				shiftKey: event.shiftKey,
			}),
		);
	};
	/* START.DEBUG */
	useTrackRenders(props, 'FileIcon');
	/* END.DEBUG */
	return (
		<svg
			{...attributes}
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			width={resolvedSize}
			height={resolvedSize}
			viewBox="0 0 20 20"
			className={classNames(css.icon, className ?? '')}
			style={{ ...style, cursor: cursor(), opacity: disabled ? 0.5 : style?.opacity }}
			role={interactive ? 'button' : 'img'}
			aria-label={hidden ? undefined : accessibleName}
			aria-hidden={hidden || undefined}
			aria-disabled={interactive ? disabled : undefined}
			tabIndex={interactive && !disabled ? 0 : undefined}
			focusable={interactive && !disabled ? 'true' : 'false'}
			onClick={(event) => {
				if (disabled) {
					event.preventDefault();
					event.stopPropagation();
					return;
				}
				if (!event.defaultPrevented) onClick?.(event);
			}}
			onKeyDown={(event) => {
				if (disabled) return;
				onKeyDown?.(event);
				if (!interactive || event.defaultPrevented) return;
				if (event.key === 'Enter') {
					event.preventDefault();
					if (!event.repeat) activate(event);
				}
				if (event.key === ' ') {
					event.preventDefault();
					spacePressed.current = true;
				}
			}}
			onKeyUp={(event) => {
				const pressed = spacePressed.current;
				spacePressed.current = false;
				if (disabled) return;
				onKeyUp?.(event);
				if (interactive && !event.defaultPrevented && event.key === ' ' && pressed) {
					event.preventDefault();
					activate(event);
				}
			}}
			onBlur={(event) => {
				spacePressed.current = false;
				onBlur?.(event);
			}}
		>
			{definition?.paths(isDark ? 'dark' : 'light')}
		</svg>
	);
});
FileIconBase.displayName = 'FileIcon';
export const FileIcon = React.memo(FileIconBase);
