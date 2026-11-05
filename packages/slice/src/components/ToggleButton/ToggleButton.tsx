'use client';

import React from 'react';
import { ActionButton } from '../IconButton/ActionButton';
import css from './ToggleButton.module.css';
import type { ToggleButtonProps } from './_types';

const dimension = (value: number | string | undefined, fallback: string) =>
	typeof value === 'number' ? (Number.isFinite(value) ? `${Math.max(0, value)}px` : fallback) : (value ?? fallback);

export const ToggleButton = React.memo(function ToggleButton(props: ToggleButtonProps) {
	const {
		actionName,
		label,
		labelOutside = false,
		children,
		textSize = 's',
		textColor = 'core-text-primary',
		textColorHover = 'core-text-primary',
		textColorSelected,
		icon,
		iconSelected,
		gap = 4,
		padding,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		deselect = true,
		borderRadius = 4,
		backgroundColor = 'core-surface-secondary',
		backgroundColorHover = 'core-surface-secondary',
		backgroundColorSelected = 'core-text-special',
		iconColorSelected = 'core-surface-primary',
		className,
		style,
		...buttonAttributes
	} = props;
	const content = label ?? children;
	const hasContent = content !== undefined && content !== null && content !== '' && typeof content !== 'boolean';
	const name =
		actionName?.trim() ||
		(typeof content === 'string' || typeof content === 'number' ? String(content).trim() : '') ||
		'Action';
	const outside = labelOutside && Boolean(icon);
	const normal = 'calc(var(--spacing-s) + var(--spacing-xs))';
	const optical = 'var(--spacing-s)';
	const cssVars = {
		'--tb-gap': `${Number.isFinite(gap) ? Math.max(0, gap) : 4}px`,
		'--tb-padding': dimension(padding, outside ? '0 var(--spacing-xs)' : `0 ${normal}`),
		paddingTop: paddingTop === undefined ? undefined : dimension(paddingTop, normal),
		paddingBottom: paddingBottom === undefined ? undefined : dimension(paddingBottom, normal),
		paddingLeft:
			paddingLeft === undefined
				? padding === undefined && !outside && icon
					? optical
					: undefined
				: dimension(paddingLeft, normal),
		paddingRight:
			paddingRight === undefined
				? padding === undefined && !outside && icon && !hasContent
					? optical
					: undefined
				: dimension(paddingRight, normal),
	} as React.CSSProperties;
	return (
		<ActionButton
			{...buttonAttributes}
			actionName={name}
			toggle
			deselect={deselect}
			iconFrame={outside}
			icon={icon ?? null}
			iconSelected={iconSelected}
			labelContent={hasContent ? content : undefined}
			contentClassName={`${css.label} ${css[textSize]}`}
			textColor={textColor}
			textColorHover={textColorHover}
			textColorSelected={textColorSelected ?? (outside ? textColor : 'core-surface-primary')}
			backgroundColor={backgroundColor}
			backgroundColorHover={backgroundColorHover}
			backgroundColorSelected={backgroundColorSelected}
			iconColorSelected={iconColorSelected}
			borderRadius={borderRadius}
			className={`${css.toggleButton}${className ? ` ${className}` : ''}`}
			style={{ ...style, ...cssVars }}
		/>
	);
});
