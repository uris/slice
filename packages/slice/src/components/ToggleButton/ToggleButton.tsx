'use client';

import React from 'react';
import { ActionButton } from '../IconButton/ActionButton';
import { buttonStyleDefaults } from '../sharedTypes';
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
		gap = buttonStyleDefaults.gap,
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
	const hasChildrenContent = label == null && hasContent;
	const name =
		actionName?.trim() ||
		(typeof content === 'string' || typeof content === 'number' ? String(content).trim() : '') ||
		'Action';
	const outside = labelOutside && Boolean(icon);
	const { padding: defaultPadding } = buttonStyleDefaults;
	const normal = defaultPadding.horizontal;
	const optical = defaultPadding.icon;
	const getDefaultPadding = () => {
		if (hasChildrenContent) {
			const horizontal = outside ? defaultPadding.outside : normal;
			return `${defaultPadding.childrenTop}px ${horizontal} ${defaultPadding.childrenBottom}px`;
		}
		if (outside) return `0 ${defaultPadding.outside}`;
		return `0 ${normal}`;
	};
	const adjustIconPadding = padding === undefined && !outside && Boolean(icon);
	const defaultPaddingLeft = adjustIconPadding ? optical : undefined;
	const defaultPaddingRight = adjustIconPadding && !hasContent ? optical : undefined;
	const cssVars = {
		'--tb-gap': `${Number.isFinite(gap) ? Math.max(0, gap) : buttonStyleDefaults.gap}px`,
		'--tb-padding': dimension(padding, getDefaultPadding()),
		paddingTop: paddingTop === undefined ? undefined : dimension(paddingTop, normal),
		paddingBottom: paddingBottom === undefined ? undefined : dimension(paddingBottom, normal),
		paddingLeft: paddingLeft === undefined ? defaultPaddingLeft : dimension(paddingLeft, normal),
		paddingRight: paddingRight === undefined ? defaultPaddingRight : dimension(paddingRight, normal),
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
			contentClassName={`${css.label} ${css[textSize]}${label == null ? ` ${css.children}` : ''}`}
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
