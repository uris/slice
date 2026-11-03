'use client';

import { type Transition, motion } from 'motion/react';
import React, { useRef } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { corners } from '../../theme/corners/corners';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import { Icon } from '../Icon';
import { type ToolTip, ToolTipType } from '../sharedTypes';
import css from './Chip.module.css';
import type { ChipProps } from './_types';

export const Chip = React.memo((rawProps: ChipProps) => {
	const props = resolveColorProps(rawProps);
	const {
		onClick,
		onRemove,
		removeLabel,
		selected,
		textColorSelected = 'var(--core-text-special)',
		iconColorSelected = 'var(--core-text-special)',
		backgroundColorSelected = 'var(--core-surface-secondary)',
		borderColorSelected = 'var(--core-text-special)',
		layout = selected !== undefined,
		transition,
		children,
		label,
		icon,
		tooltip,
		iconSize = 20,
		disabled = false,
		iconPosition = 'left',
		textSize = 'm',
		textColor = 'var(--core-text-primary)',
		textColorHover = !onClick ? textColor : 'var(--core-text-special)',
		iconColor = 'var(--core-text-primary)',
		iconColorHover = !onClick ? iconColor : 'var(--core-text-special)',
		backgroundColor = 'transparent',
		backgroundColorHover = !onClick ? backgroundColor : 'var(--core-surface-secondary)',
		borderWidth = 1,
		borderColor = 'var(--core-text-primary)',
		borderColorHover = !onClick ? borderColor : 'var(--core-text-special)',
		borderColorDisabled = 'var(--core-text-disabled)',
		borderRadius = corners['corner-m'],
		padding,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		gap = 4,
		onToolTip,
		className,
		style,
		...nativeAttributes
	} = props;
	const rootRef = useRef<HTMLDivElement | null>(null);
	const reduceMotion = usePrefersReducedMotion();
	const theme = useTheme().current;
	const waterCurve = theme.motion['motion-water']
		.match(/cubic-bezier\(([^)]+)\)/)?.[1]
		.split(',')
		.map(Number);
	const waterEase: [number, number, number, number] =
		waterCurve?.length === 4 && waterCurve.every(Number.isFinite)
			? (waterCurve as [number, number, number, number])
			: [0.36, 0, 0.64, 1];
	const layoutTransition: Transition = reduceMotion
		? { duration: 0 }
		: (transition ?? {
				type: 'tween',
				duration: 0.15,
				ease: waterEase,
			});
	const animateLayout = layout && !reduceMotion;
	const hovered = useRef(false);
	const focused = useRef(false);
	const content = label ?? children;
	const hasContent = content !== undefined && content !== null && content !== false && content !== '';
	const compact = textSize === 'xs' || textSize === 's';
	const vertical = compact ? 'var(--spacing-xs)' : 'var(--spacing-s)';
	const horizontal = compact ? 'var(--spacing-s)' : 'var(--spacing-m)';
	const iconSide = `calc(${horizontal} - var(--spacing-${compact ? 'xxs' : 'xs'}))`;
	const iconOnly = Boolean(icon) && !hasContent;
	const hasLeadingIcon = Boolean(icon) && (iconPosition === 'left' || iconOnly);
	const hasTrailingIcon = Boolean(onRemove) || (Boolean(icon) && (iconPosition === 'right' || iconOnly));
	const side = (specific: number | undefined, fallback: string) => {
		const value = specific ?? padding;
		return value === undefined ? fallback : `${value}px`;
	};
	const cssVars = {
		'--ui-chip-padding-top': side(paddingTop, vertical),
		'--ui-chip-padding-right': side(paddingRight, hasTrailingIcon ? iconSide : horizontal),
		'--ui-chip-padding-bottom': side(paddingBottom, vertical),
		'--ui-chip-padding-left': side(paddingLeft, hasLeadingIcon ? iconSide : horizontal),
		'--ui-chip-gap': `${gap}px`,
		'--ui-chip-icon-size': `${iconSize}px`,
		'--ui-chip-border-radius': setStyle(borderRadius),
		'--ui-chip-border-width': `${borderWidth}px`,
		'--ui-chip-border-color': disabled ? borderColorDisabled : selected ? borderColorSelected : borderColor,
		'--ui-chip-border-color-hover': disabled ? borderColorDisabled : selected ? borderColorSelected : borderColorHover,
		'--ui-chip-bg-color': selected && !disabled ? backgroundColorSelected : backgroundColor,
		'--ui-chip-bg-color-hover': disabled ? backgroundColor : selected ? backgroundColorSelected : backgroundColorHover,
		'--ui-chip-text-color': disabled ? 'var(--core-text-disabled)' : selected ? textColorSelected : textColor,
		'--ui-chip-text-color-hover': disabled
			? 'var(--core-text-disabled)'
			: selected
				? textColorSelected
				: textColorHover,
		'--ui-chip-icon-color': disabled ? 'var(--core-text-disabled)' : selected ? iconColorSelected : iconColor,
		'--ui-chip-icon-color-hover': disabled
			? 'var(--core-text-disabled)'
			: selected
				? iconColorSelected
				: iconColorHover,
		'--ui-chip-cursor': disabled || !onClick ? 'default' : 'pointer',
	} as React.CSSProperties;
	const iconContent = icon ? (
		<span className={css.icon} aria-hidden="true">
			<Icon name={icon} size={iconSize} strokeColor="currentColor" pointer={false} tabIndex={-1} />
		</span>
	) : null;
	const contentNodes = (
		<motion.span
			className={css.content}
			layout={animateLayout ? 'position' : false}
			transition={{ layout: layoutTransition }}
		>
			{iconPosition === 'left' && iconContent}
			{hasContent && <span className={css[textSize]}>{content}</span>}
			{iconPosition === 'right' && iconContent}
		</motion.span>
	);
	const actionShared = { className: css.action, 'aria-disabled': disabled ? true : nativeAttributes['aria-disabled'] };

	function handlers<E extends HTMLElement>(attributes: React.DOMAttributes<E>) {
		const showTooltip = (event?: React.MouseEvent<E>) => {
			if (tooltip) onToolTip?.({ type: ToolTipType.button, payload: { label: tooltip }, ref: rootRef, event });
		};
		return {
			onClick: (event: React.MouseEvent<E>) => {
				if (disabled) {
					event.preventDefault();
					return;
				}
				attributes.onClick?.(event);
				onToolTip?.(null);
			},
			onMouseEnter: (event: React.MouseEvent<E>) => {
				attributes.onMouseEnter?.(event);
				if (event.defaultPrevented) return;
				hovered.current = true;
				showTooltip(event);
			},
			onMouseLeave: (event: React.MouseEvent<E>) => {
				attributes.onMouseLeave?.(event);
				hovered.current = false;
				if (!focused.current) onToolTip?.(null);
			},
			onFocus: (event: React.FocusEvent<E>) => {
				attributes.onFocus?.(event);
				if (event.defaultPrevented) return;
				focused.current = true;
				showTooltip();
			},
			onBlur: (event: React.FocusEvent<E>) => {
				attributes.onBlur?.(event);
				focused.current = false;
				if (!hovered.current) onToolTip?.(null);
			},
		};
	}

	/* START.DEBUG */
	useTrackRenders(props, 'Chip');
	/* END.DEBUG */

	const primary = onClick
		? (() => {
				const attributes = nativeAttributes as React.ButtonHTMLAttributes<HTMLButtonElement>;
				return (
					<button
						{...attributes}
						{...actionShared}
						{...handlers({ ...attributes, onClick })}
						type={attributes.type ?? 'button'}
						disabled={disabled}
						aria-pressed={selected}
					>
						{contentNodes}
					</button>
				);
			})()
		: (() => {
				const attributes = nativeAttributes as React.HTMLAttributes<HTMLDivElement>;
				return (
					<div {...attributes} {...actionShared} {...handlers(attributes)}>
						{contentNodes}
					</div>
				);
			})();
	const readableLabel =
		label ?? (typeof children === 'string' || typeof children === 'number' ? String(children) : undefined);
	const removalName = removeLabel ?? (readableLabel ? `Remove ${readableLabel}` : 'Remove chip');

	return (
		<motion.div
			ref={rootRef}
			className={`${css.chip}${className ? ` ${className}` : ''}`}
			style={{ ...cssVars, ...style }}
			layout={animateLayout}
			transition={{ layout: layoutTransition }}
			data-selected={selected === true ? 'true' : undefined}
			data-removable={onRemove ? 'true' : undefined}
		>
			{primary}
			{onRemove && (
				<button
					className={css.remove}
					type="button"
					aria-label={removalName}
					disabled={disabled}
					onClick={(event) => {
						event.stopPropagation();
						onRemove(event);
						onToolTip?.(null);
					}}
				>
					<motion.span
						layout={animateLayout ? 'position' : false}
						transition={{ layout: layoutTransition }}
						className={css.icon}
						aria-hidden="true"
					>
						<Icon name="x" size={iconSize} strokeColor="currentColor" pointer={false} tabIndex={-1} />
					</motion.span>
				</button>
			)}
		</motion.div>
	);
});
