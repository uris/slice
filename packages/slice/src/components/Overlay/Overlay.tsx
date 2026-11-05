'use client';

import {
	AnimatePresence,
	type Transition,
	type Variants,
	motion,
	useAnimationControls,
	usePresence,
} from 'motion/react';
import React, { useEffect, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import css from './Overlay.module.css';
import type { OverlayProps } from './_types';

const withoutAria = (attributes: object) =>
	Object.fromEntries(Object.entries(attributes).filter(([key]) => !key.startsWith('aria-') && key !== 'role'));

type LayerProps = Omit<OverlayProps, 'show' | 'opacity' | 'transition'> & { opacity: number; transition: Transition };
function OverlayLayer({
	children,
	opacity,
	backgroundColor,
	transition,
	motionValues,
	className,
	style,
	position = 'fixed',
	pointerEvents = 'auto',
	...attributes
}: LayerProps) {
	const [isPresent, safeToRemove] = usePresence();
	const reducedMotion = usePrefersReducedMotion();
	const controls = useAnimationControls();
	const variants = useMemo(() => {
		const defaults = { initial: { opacity: 0 }, animate: { opacity }, exit: { opacity: 0 } };
		const merged: Variants = { ...defaults, ...motionValues };
		for (const state of ['initial', 'animate', 'exit'] as const) {
			const override = motionValues?.[state];
			if (override && typeof override !== 'function') merged[state] = { ...defaults[state], ...override };
		}
		return merged;
	}, [opacity, motionValues]);
	useEffect(() => {
		if (reducedMotion) {
			if (!isPresent) safeToRemove?.();
			return;
		}
		let active = true;
		const state = isPresent ? 'animate' : 'exit';
		const target = variants[state];
		const definition = typeof target === 'function' ? state : target;
		void controls.start(definition, transition).then(() => {
			if (active && !isPresent) safeToRemove?.();
		});
		return () => {
			active = false;
			controls.stop();
		};
	}, [controls, isPresent, reducedMotion, safeToRemove, transition, variants]);
	if (reducedMotion && !isPresent) return null;
	const rootStyle = {
		...style,
		'--overlay-background': backgroundColor,
		position,
		pointerEvents,
	} as React.CSSProperties;
	return (
		<div
			{...withoutAria(attributes)}
			data-overlay=""
			data-pointer-events={pointerEvents}
			className={`${css.overlay}${className ? ` ${className}` : ''}`}
			style={rootStyle}
		>
			{reducedMotion ? (
				<div data-overlay-backdrop="" aria-hidden="true" className={css.backdrop} style={{ opacity }} />
			) : (
				<motion.div
					data-overlay-backdrop=""
					aria-hidden="true"
					className={css.backdrop}
					initial="initial"
					animate={controls}
					variants={variants}
					transition={transition}
				/>
			)}
			{children}
		</div>
	);
}

export const Overlay = React.memo((rawProps: OverlayProps) => {
	const props = resolveColorProps(rawProps);
	const { show = false, backgroundColor = 'rgb(0,0,0)', opacity = 0, transition, ...attributes } = props;
	const { current } = useTheme();
	const timing = useMemo(() => getWaterTransition(current.motion, transition), [current.motion, transition]);
	const effectiveOpacity = Number.isFinite(opacity) ? Math.min(1, Math.max(0, opacity)) : 0;
	/* START.DEBUG */
	useTrackRenders(props, 'Overlay');
	/* END.DEBUG */
	return (
		<AnimatePresence>
			{show && (
				<OverlayLayer
					key="overlay"
					{...attributes}
					backgroundColor={backgroundColor}
					opacity={effectiveOpacity}
					transition={timing}
				/>
			)}
		</AnimatePresence>
	);
});
Overlay.displayName = 'Overlay';
