'use client';

import { AnimatePresence, motion } from 'motion/react';
import React, { useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import css from './Dot.module.css';
import { DEFAULT_TRANSITION, DEFAULT_VARIANTS, type DotProps } from './_types';

export const Dot = React.memo((rawProps: DotProps) => {
	const props = resolveColorProps(rawProps);
	const reduceMotion = usePrefersReducedMotion();
	const themeMotion = useTheme().current.motion;
	const {
		size = 8,
		topOffset = 2,
		rightOffset = 2,
		border = 3,
		position = 'corner',
		color = undefined,
		transition = undefined,
		motionValues = undefined,
		show = false,
		state,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';

	// merge caller motion values into the default dot animation variants
	const variants = useMemo(() => {
		if (motionValues) {
			return { ...DEFAULT_VARIANTS, ...motionValues };
		}
		return DEFAULT_VARIANTS;
	}, [motionValues]);

	// merge caller transition overrides into the default transition
	const trans = useMemo(() => {
		const curve = themeMotion['motion-water']
			.match(/cubic-bezier\(([^)]+)\)/)?.[1]
			.split(',')
			.map(Number);
		const durationText = themeMotion['motion-water-duration'];
		const duration = Number.parseFloat(durationText) / (durationText.endsWith('ms') ? 1000 : 1);
		return {
			...DEFAULT_TRANSITION,
			...(curve?.length === 4 && curve.every(Number.isFinite)
				? { ease: curve as [number, number, number, number] }
				: {}),
			...(Number.isFinite(duration) && duration >= 0 ? { duration } : {}),
			...transition,
		};
	}, [themeMotion, transition]);

	// resolve the dot color from explicit color or named state
	const bgColor = useMemo(() => {
		if (color) {
			return color;
		}
		if (state) {
			switch (state) {
				case 'red':
					return 'var(--feedback-warning)';
				case 'yellow':
					return 'var(--feedback-attention)';
				case 'green':
					return 'var(--feedback-positive)';
				case 'blue':
					return 'var(--core-gp-logo-primary)';
				case 'grey':
					return 'var(--core-text-secondary)';
				default:
					break;
			}
		}
		return 'var(--core-gp-logo-primary)';
	}, [state, color]);

	// compose CSS custom properties for dot layout and color
	const cssVars = useMemo(() => {
		return {
			'--dot-size': `${size}px`,
			'--dot-display': position === 'inline' ? 'inline-flex' : 'flex',
			'--dot-position': position === 'inline' ? 'relative' : 'absolute',
			'--dot-top': position === 'inline' ? 'unset' : `${topOffset}px`,
			'--dot-right': position === 'inline' ? 'unset' : `${rightOffset}px`,
			'--dot-vertical-align': position === 'inline' ? 'middle' : 'unset',
			'--dot-border': `${border}px solid`,
			'--dot-border-color': 'var(--core-surface-primary)',
			'--dot-bg': `${bgColor}`,
		} as React.CSSProperties;
	}, [size, position, topOffset, rightOffset, border, bgColor]);

	/* START.DEBUG */
	useTrackRenders(props, 'Dot');
	/* END.DEBUG */

	// A static branch bypasses all variant delays, repeats, transforms, and exit animations.
	if (reduceMotion) {
		return show ? (
			<div
				id={divId}
				className={`${css.dot}${divClass}`}
				style={{ ...divStyle, ...cssVars }}
				role="status"
				aria-live="polite"
				aria-label="Blue dot indicating active or new"
				{...rest}
			>
				<div className="dot" />
			</div>
		) : null;
	}

	return (
		<AnimatePresence initial={false}>
			{show && (
				<motion.div
					id={divId}
					className={`${css.dot}${divClass}`}
					style={{ ...divStyle, ...cssVars }}
					initial={'initial'}
					animate={'animate'}
					exit={'exit'}
					transition={trans}
					variants={variants}
					role={'status'}
					aria-live={'polite'}
					aria-label={'Blue dot indicating active or new'}
					{...(rest as any)}
				>
					<div className="dot" />
				</motion.div>
			)}
		</AnimatePresence>
	);
});
