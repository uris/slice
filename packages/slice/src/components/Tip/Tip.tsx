'use client';

import { motion, useAnimationControls } from 'motion/react';
import React, { useEffect, useId, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { corners } from '../../theme/corners/corners';
import { classNames, mergedPresenceMotionValues, setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import css from './Tip.module.css';
import type { ToolTipProps } from './_types';
import { useTipVisibility } from './useTipVisibility';

const staticState = { opacity: 1, x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, rotate: 0, rotateX: 0, rotateY: 0 };
const TipBase = React.forwardRef<HTMLDivElement, ToolTipProps>((rawProps, ref) => {
	const props = resolveColorProps(rawProps);
	const {
		tip,
		textSize = 's',
		backgroundColor,
		textColor,
		border = true,
		borderColor,
		padding,
		borderRadius = corners['corner-xs'],
		coords,
		showDelay = 500,
		hideDelay = 2500,
		motionValues,
		transition,
		id: suppliedId,
		className,
		style,
		...attributes
	} = props;
	const generatedId = useId();
	const id = suppliedId || generatedId;
	const enabled = Boolean(tip?.payload?.label && coords && Number.isFinite(coords.x) && Number.isFinite(coords.y));
	const { visible, dismiss } = useTipVisibility(tip, enabled, showDelay, hideDelay);
	const reduced = usePrefersReducedMotion();
	const theme = useTheme().current;
	const controls = useAnimationControls();
	const variants = useMemo(() => {
		if (reduced) return { initial: staticState, animate: staticState };
		return mergedPresenceMotionValues({ initial: { opacity: 0 }, animate: { opacity: 1 } }, motionValues);
	}, [reduced, motionValues]);
	const resolvedTransition = useMemo(
		() => getWaterTransition(theme.motion, { duration: 0.15, ...transition }),
		[theme.motion, transition],
	);

	// Reset every reveal; hiding cancels in-flight animation and never waits for a transition.
	useEffect(() => {
		controls.stop();
		if (reduced) controls.set(staticState);
		else {
			controls.set('initial');
			if (visible && variants.animate) void controls.start('animate');
		}
	}, [visible, reduced, variants, controls]);

	// Add only our description token and preserve any descriptions owned by the application.
	useEffect(() => {
		const target = tip?.ref?.current;
		if (!visible || !(target instanceof HTMLElement)) return;
		const existing = (target.getAttribute('aria-describedby') ?? '').split(/\s+/).filter(Boolean);
		if (existing.includes(id)) return;
		target.setAttribute('aria-describedby', [...existing, id].join(' '));
		return () => {
			const remaining = (target.getAttribute('aria-describedby') ?? '')
				.split(/\s+/)
				.filter((value) => value && value !== id);
			if (remaining.length) target.setAttribute('aria-describedby', remaining.join(' '));
			else target.removeAttribute('aria-describedby');
		};
	}, [tip, visible, id]);

	// Dismiss pending requests too, so clicking before the delay cannot reveal a stale tip.
	useEffect(() => {
		if (!enabled) return;
		const document = tip?.ref?.current?.ownerDocument ?? globalThis.document;
		const keyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') dismiss();
		};
		document.addEventListener('pointerdown', dismiss, true);
		document.addEventListener('click', dismiss, true);
		document.addEventListener('keydown', keyDown, true);
		return () => {
			document.removeEventListener('pointerdown', dismiss, true);
			document.removeEventListener('click', dismiss, true);
			document.removeEventListener('keydown', keyDown, true);
		};
	}, [enabled, tip, dismiss]);
	const cssVars = {
		'--tooltip-padding': setStyle(padding, 'var(--spacing-xs) var(--spacing-s)'),
		'--tooltip-background': backgroundColor ?? 'var(--core-surface-secondary)',
		'--tooltip-color': textColor ?? 'var(--core-text-primary)',
		'--tooltip-border': border ? `1px solid ${borderColor ?? 'var(--core-outline-primary)'}` : 'unset',
		'--tooltip-border-radius': setStyle(borderRadius),
	} as React.CSSProperties;
	/* START.DEBUG */
	useTrackRenders(props, 'Tip');
	/* END.DEBUG */
	return (
		<motion.div
			{...attributes}
			ref={ref}
			id={id}
			role="tooltip"
			aria-hidden={!visible}
			className={classNames(css.wrapper, css[textSize], className ?? '')}
			style={{
				...style,
				...cssVars,
				left: coords?.x ?? 0,
				top: coords?.y ?? 0,
				visibility: visible ? 'visible' : 'hidden',
			}}
			initial={false}
			animate={controls}
			variants={variants}
			transition={reduced ? { duration: 0, delay: 0 } : resolvedTransition}
		>
			{tip?.payload?.label}
		</motion.div>
	);
});
TipBase.displayName = 'Tip';
export const Tip = React.memo(TipBase);
