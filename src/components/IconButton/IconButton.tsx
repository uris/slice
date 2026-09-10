'use client';

import { motion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { Badge } from '../Badge';
import { Dot } from '../Dot';
import { Icon } from '../Icon';
import { ToolTipType } from '../sharedTypes';
import type { ToolTip } from '../sharedTypes';
import css from './IconButton.module.css';
import { resolveVariants } from './_animation';
import type { IconButtonProps } from './_types';

export const IconButton = React.memo((props: IconButtonProps) => {
	const {
		frameSize = 36,
		iconSize = 20,
		round = true,
		icon = 'more',
		borderRadius = 4,
		border = false,
		tooltip = undefined,
		color = undefined,
		colorOn = undefined,
		iconFill = false,
		bgColor = 'var(--core-surface-secondary)',
		bgColorHover = 'var(--core-outline-primary)',
		bgColorOn = 'var(--core-outline-primary)',
		iconColor = 'var(--core-text-primary)',
		iconColorOn = 'var(--core-text-primary)',
		iconColorHover = 'var(--core-text-primary)',
		transition = undefined,
		variants = undefined,
		initial = undefined,
		animate = undefined,
		exit = undefined,
		fillColor = undefined,
		label = undefined,
		hover = true,
		count = 0,
		toggle = false,
		toggleIcon = false,
		isToggled = false,
		disabled = false,
		showDot = false,
		buttonSize = 'm',
		presetAnimations,
		customAnimations,
		onClick = () => null,
		onToolTip = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const ref = useRef<HTMLButtonElement>(null);
	const [on, setOn] = useState<boolean>(isToggled);
	const [hovered, setHovered] = useState<boolean>(false);

	// sync the local toggle state from the controlled prop
	useEffect(() => setOn(isToggled), [isToggled]);

	// handle button clicks and keep tooltip state in sync
	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => {
			if (disabled) return;
			if (tooltip) onToolTip(null);
			if (toggle) setOn(!on);
			onClick(e as any);
		},
		[disabled, tooltip, onToolTip, on, onClick, toggle],
	);

	// show the button tooltip using the current wrapper ref
	const handleMouseEnter = useCallback(
		(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
			setHovered(true);
			if (!ref?.current || !tooltip) return;
			const tip: ToolTip = {
				type: ToolTipType.button,
				payload: { label: tooltip },
				event: e,
				ref: ref,
			};
			onToolTip(tip);
		},
		[tooltip, onToolTip],
	);

	// clear the tooltip when leaving the button
	const handleMouseLeave = useCallback(() => {
		setHovered(false);
		if (tooltip) onToolTip(null);
	}, [tooltip, onToolTip]);

	// resolve the resting background color
	const bgColorNormal = useMemo(() => {
		if (on) return bgColorOn;
		return bgColor ?? 'var(--core-surface-secondary)';
	}, [bgColorOn, bgColor, on]);

	// resolve the hover background color
	const bgHoverColor = useMemo(() => {
		if (hover && on) return bgColorOn;
		if (hover) return bgColorHover;
		return bgColor ?? 'transparent';
	}, [hover, bgColor, bgColorOn, bgColorHover, on]);

	// resolve the label color for toggled and untoggled states
	const textColor = useMemo(() => {
		if (on) return colorOn;
		return color ?? 'var(--core-text-primary)';
	}, [on, colorOn, color]);

	// resolve the icon color based on states
	const setIconColor = useMemo(() => {
		if (on) return iconColorOn;
		if (hovered) return iconColorHover;
		return iconColor ?? 'var(--core-text-primary)';
	}, [on, iconColorOn, iconColor, iconColorHover, hovered]);

	const size = useMemo(() => {
		if (!buttonSize) return frameSize;
		if (buttonSize === 's') return 24;
		if (buttonSize === 'm') return 36;
		if (buttonSize === 'l') return 44;
		if (buttonSize === 'xl') return 56;
	}, [frameSize, buttonSize]);

	// compose CSS custom properties for button sizing and colors
	const cssVars = useMemo(() => {
		return {
			'--ib-bg-color': bgColorNormal,
			'--ib-bg-color-hover': disabled ? bgColorNormal : bgHoverColor,
			'--ib-icon-size': `${iconSize ?? 0}px`,
			'--ib-button-size': `${size ?? 0}px`,
			'--ib-border-radius': round ? '100%' : `${borderRadius ?? 0}px`,
			'--ib-border': border ? '1px' : 0,
			'--ib-color': textColor,
			'--ib-cursor': disabled ? 'default' : 'pointer',
		} as React.CSSProperties;
	}, [bgColorNormal, bgHoverColor, textColor, border, size, borderRadius, iconSize, round, disabled]);

	/* START.DEBUG */
	useTrackRenders(props, 'IconButton');
	/* END.DEBUG */

	return (
		<motion.button
			id={divId}
			type="button"
			className={`${css.button}${divClass}`}
			style={{ ...divStyle, ...cssVars }}
			onClick={(e) => handleClick(e)}
			onMouseOutCapture={handleMouseLeave}
			onMouseOverCapture={handleMouseEnter}
			transition={transition}
			variants={variants}
			initial={initial}
			animate={animate}
			exit={exit}
			disabled={disabled}
			aria-disabled={disabled}
			ref={ref}
			{...(rest as any)}
		>
			<motion.div
				className={css.icon}
				style={{ opacity: disabled ? 0.3 : 1 }}
				variants={resolveVariants(presetAnimations, customAnimations)}
				initial={isToggled ? 'animate' : 'initial'}
				animate={on ? 'animate' : 'exit'}
			>
				<Icon
					name={icon}
					strokeColor={setIconColor}
					fillColor={fillColor}
					disabled={disabled}
					size={iconSize}
					fill={iconFill}
					toggle={toggleIcon ? on : false}
					pointer={true}
				/>
			</motion.div>
			{label && <div className={css.label}>{label}</div>}
			<Dot show={showDot} />
			{count !== 0 && (
				<div className={css.count}>
					<Badge variant={'light'} count={count} hideNull />
				</div>
			)}
		</motion.button>
	);
});
