'use client';

import React, { useEffect, useId, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { accessibleKeyDown } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { Icon } from '../Icon';
import css from './CheckBox.module.css';
import type { CheckBoxProps } from './_types';

export const CheckBox = React.memo((rawProps: CheckBoxProps) => {
	const props = resolveColorProps(rawProps);
	const {
		align = 'middle',
		children,
		label,
		checked = false,
		disabled = false,
		iconChecked = 'checkbox checked',
		iconUnChecked = 'checkbox',
		iconPartial = 'checkbox partial',
		iconColor,
		iconColorSelected,
		iconSize = 20,
		gap = 6,
		textColor,
		textSize = 'm',
		textTopOffset = 0,
		onChange,
		onClick,
		onKeyDown,
		tabIndex = 0,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		className,
		style,
		...rest
	} = props;
	const [state, setState] = useState<'mixed' | boolean>(checked);
	const contentId = useId();
	const content = label ?? children;
	const hasContent = content !== undefined && content !== null && content !== false;

	useEffect(() => setState(checked), [checked]);

	const iconName = state === true ? iconChecked : state === 'mixed' ? iconPartial : iconUnChecked;
	const selectedIconColor = state !== false ? iconColorSelected : undefined;
	const resolvedIconColor =
		selectedIconColor ??
		iconColor ??
		(disabled
			? 'var(--core-icon-disabled)'
			: state === 'mixed'
				? 'var(--core-icon-primary)'
				: state
					? 'var(--core-text-special)'
					: 'var(--core-icon-secondary)');
	const resolvedTextColor = textColor ?? (disabled ? 'var(--core-text-disabled)' : 'var(--core-text-primary)');
	const offset = Number.isFinite(textTopOffset) ? textTopOffset : 0;
	// Padding reserves space; compensate for flex alignment so the visible text moves by the full signed offset.
	const textShift = align === 'top' ? Math.min(offset, 0) : align === 'bottom' ? Math.max(offset, 0) : offset / 2;
	const cssVars = {
		'--cb-align': align === 'top' ? 'flex-start' : align === 'bottom' ? 'flex-end' : 'center',
		'--cb-icon-size': `${iconSize}px`,
		'--cb-gap': `${gap}px`,
		'--cb-text-color': resolvedTextColor,
		'--cb-text-padding-top': `${Math.max(offset, 0)}px`,
		'--cb-text-padding-bottom': `${Math.max(-offset, 0)}px`,
		'--cb-text-shift': `${textShift}px`,
		'--cb-cursor': disabled ? 'default' : 'pointer',
	} as React.CSSProperties;

	const handleToggle = () => {
		if (disabled) return;
		const next = state !== true;
		setState(next);
		onChange?.(next);
	};

	/* START.DEBUG */
	useTrackRenders(props, 'CheckBox');
	/* END.DEBUG */

	return (
		<div
			{...rest}
			className={`${css.wrapper}${className ? ` ${className}` : ''}`}
			style={{ ...style, ...cssVars }}
			role="checkbox"
			aria-checked={state}
			aria-disabled={disabled}
			aria-label={ariaLabel ?? (ariaLabelledBy ? undefined : label)}
			aria-labelledby={
				ariaLabelledBy ?? (ariaLabel === undefined && label === undefined && hasContent ? contentId : undefined)
			}
			tabIndex={disabled ? -1 : tabIndex}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) handleToggle();
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (!event.defaultPrevented) accessibleKeyDown(event, handleToggle);
			}}
		>
			<span className={css.icon} aria-hidden="true">
				<Icon name={iconName} strokeColor={resolvedIconColor} size={iconSize} pointer={false} tabIndex={-1} />
			</span>
			{hasContent && (
				<span id={contentId} className={`${css.label} ${css[textSize]}`}>
					{content}
				</span>
			)}
		</div>
	);
});
