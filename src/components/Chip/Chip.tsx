'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { accessibleKeyDown, setStyle } from '../../utils/functions/misc';
import { Icon } from '../Icon';
import { type ToolTip, ToolTipType } from '../sharedTypes';
import css from './Chip.module.css';
import type { ChipProps } from './_types';

export const Chip = React.memo((props: ChipProps) => {
	const {
		variant = 'normal',
		children,
		label,
		icon,
		tooltip,
		iconSize = 20,
		disabled = false,
		focused = false,
		iconPosition = 'left',
		labelSize = 'm',
		labelColor = 'var(--core-text-primary)',
		labelColorHover = variant === 'normal' ? labelColor : 'var(--core-text-special)',
		iconColor = 'var(--core-text-primary)',
		iconColorHover = variant === 'normal' ? iconColor : 'var(--core-text-special)',
		backgroundColor,
		backgroundColorHover,
		borderWidth,
		borderSize = 1,
		borderColor = 'var(--core-text-primary)',
		borderColorHover = variant === 'normal' ? borderColor : 'var(--core-text-special)',
		borderColorDisabled = 'var(--core-text-disabled)',
		bgColor = 'transparent',
		bgColorHover = variant === 'normal' ? bgColor : 'var(--core-surface-secondary)',
		borderRadius = 8,
		paddingTop,
		paddingTops = 8,
		paddingSides = 16,
		gap = 4,
		onToolTip = () => null,
		onClick = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const resolvedBackgroundColor = backgroundColor ?? bgColor;
	const resolvedBackgroundColorHover = backgroundColorHover ?? bgColorHover;
	const resolvedBorderWidth = borderWidth ?? borderSize;
	const resolvedPaddingTop = paddingTop ?? paddingTops;

	// forward click events while respecting the disabled state
	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			if (!disabled) onClick(e);
		},
		[disabled, onClick],
	);

	// manage tooltip visibility and hover state together
	const handleMouseEnter = useCallback(
		(enter: boolean, event: React.MouseEvent<HTMLDivElement>) => {
			if (enter) {
				if (tooltip) {
					const tip: ToolTip = {
						type: ToolTipType.button,
						payload: { label: tooltip },
						ref: null,
						event,
					};
					onToolTip(tip);
				}
				if (variant === 'button') setIsHovered(true);
			} else {
				onToolTip(null);
				setIsHovered(false);
			}
		},
		[tooltip, variant, onToolTip],
	);

	// resolve chip padding adjusting for side icon is on
	const padding = useMemo(() => {
		if (!label || !icon) return `${resolvedPaddingTop}px ${paddingSides}px`;
		const paddingLeft = iconPosition === 'right' ? paddingSides - 4 : paddingSides;
		const paddingRight = iconPosition === 'right' ? paddingSides : paddingSides - 4;
		return `${resolvedPaddingTop}px ${paddingLeft}px ${resolvedPaddingTop}px ${paddingRight}px`;
	}, [icon, iconPosition, resolvedPaddingTop, paddingSides, label]);

	// resolve the current icon color from theme and interaction state
	const computedIconColor = useMemo(() => {
		if (disabled) return 'var(--core-text-disabled)';
		if (isHovered) return iconColorHover ?? 'var(--core-text-special)';
		return iconColor ?? 'var(--core-text-primary)';
	}, [iconColor, disabled, isHovered, iconColorHover]);

	// compose CSS custom properties for chip spacing and colors
	const cssVars = useMemo(() => {
		return {
			'--ui-chip-padding': padding,
			'--ui-chip-gap': setStyle(gap),
			'--ui-chip-border-radius': setStyle(borderRadius),
			'--ui-chip-border-size': setStyle(resolvedBorderWidth),
			'--ui-chip-border-color': disabled ? borderColorDisabled : borderColor,
			'--ui-chip-border-color-hover': disabled ? borderColorDisabled : borderColorHover,
			'--ui-chip-bg-color': resolvedBackgroundColor,
			'--ui-chip-bg-color-hover': disabled ? resolvedBackgroundColor : resolvedBackgroundColorHover,
			'--ui-chip-label-color': disabled ? 'var(--core-text-disabled)' : labelColor,
			'--ui-chip-label-color-hover': disabled ? 'var(--core-text-disabled)' : labelColorHover,
			'--ui-chip-cursor': disabled || variant === 'normal' ? 'default' : 'pointer',
		} as React.CSSProperties;
	}, [
		padding,
		resolvedBackgroundColor,
		borderColor,
		borderColorDisabled,
		borderColorHover,
		resolvedBorderWidth,
		resolvedBackgroundColorHover,
		labelColorHover,
		labelColor,
		gap,
		borderRadius,
		disabled,
		variant,
	]);

	/* START.DEBUG */
	useTrackRenders(props, 'Chip');
	/* END.DEBUG */

	return (
		<div
			id={divId}
			className={`${css.chip}${divClass}`}
			style={{ ...divStyle, ...cssVars }}
			onKeyDown={(e) => accessibleKeyDown(e, () => handleClick(e as any))}
			onClick={handleClick}
			onMouseEnter={(e) => handleMouseEnter(true, e)}
			onMouseLeave={(e) => handleMouseEnter(false, e)}
			{...rest}
		>
			{icon && iconPosition !== 'right' && (
				<div className={css.icon}>
					<Icon name={icon} size={iconSize} strokeColor={computedIconColor} />
				</div>
			)}
			{(children || label) && <div className={css[labelSize]}>{children ?? label}</div>}
			{icon && iconPosition === 'right' && (
				<div className={css.icon}>
					<Icon name={icon} size={iconSize} strokeColor={computedIconColor} />
				</div>
			)}
		</div>
	);
});
