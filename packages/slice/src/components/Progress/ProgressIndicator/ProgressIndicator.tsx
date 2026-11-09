'use client';

import {
	AnimatePresence,
	type Transition,
	type Variants,
	motion,
	useAnimationControls,
	usePresence,
} from 'motion/react';
import React, { useEffect, useId, useMemo } from 'react';
import { useTheme } from '../../../hooks/useTheme/useTheme';
import { useTrackRenders } from '../../../hooks/useTrackRenders/useTrackRenders';
import { classNames, mergedPresenceMotionValues } from '../../../utils/functions/misc';
import { resolveColorProps } from '../../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../../utils/styling/usePrefersReducedMotion';
import css from './ProgressIndicator.module.css';
import type { ProgressIndicatorProps } from './_types';
import { useSpinnerPlayback } from './useSpinnerPlayback';

const staticState = {
	opacity: 1,
	x: 0,
	y: 0,
	z: 0,
	scale: 1,
	scaleX: 1,
	scaleY: 1,
	rotate: 0,
	rotateX: 0,
	rotateY: 0,
	skewX: 0,
	skewY: 0,
};
type SurfaceProps = Omit<
	ProgressIndicatorProps,
	'onStart' | 'onStop' | 'show' | 'duration' | 'decorative' | 'motionValues' | 'transition'
> & {
	playing: boolean;
	gradientId: string;
	variants: Variants;
	timing: Transition;
	forwardedRef: React.ForwardedRef<HTMLDivElement>;
};
function IndicatorSurface({
	playing,
	gradientId,
	variants,
	timing,
	forwardedRef,
	size = 20,
	stroke = 1.5,
	secondsPerSpin = 1,
	color = 'var(--core-text-primary)',
	inset = true,
	inline = false,
	label = 'Loading',
	displayLabel = false,
	labelPosition = 'right',
	textSize = 'm',
	textColor = 'var(--core-text-primary)',
	className,
	style,
	...attributes
}: SurfaceProps) {
	const [present, safeToRemove] = usePresence();
	const reduced = usePrefersReducedMotion();
	const controls = useAnimationControls();
	useEffect(() => {
		controls.stop();
		if (reduced) {
			controls.set(staticState);
			if (!present) safeToRemove?.();
			return;
		}
		let active = true;
		const state = present ? 'animate' : 'exit';
		const target = variants[state];
		const definition = typeof target === 'function' ? state : { ...target, transition: target?.transition ?? timing };
		if (present) controls.set('initial');
		void controls.start(definition).then(() => {
			if (active && !present) safeToRemove?.();
		});
		return () => {
			active = false;
			controls.stop();
		};
	}, [present, reduced, controls, variants, timing, safeToRemove]);
	const resolveSize = () => {
		if (typeof size === 'string') return size.trim() || 20;
		if (Number.isFinite(size) && size > 0) return size;
		return 20;
	};
	const resolvedSize = resolveSize();
	const resolvedStroke = Number.isFinite(stroke) && stroke >= 0 ? Math.min(stroke, 10) : 1.5;
	const spinTime = Number.isFinite(secondsPerSpin) && secondsPerSpin > 0 ? secondsPerSpin : 1;
	const radius = Math.min(inset ? 8 : 10, 10 - resolvedStroke / 2);
	const x = 10 + radius * Math.cos(-0.4);
	const y = 10 + radius * Math.sin(-0.4);
	const path = `M ${x} ${y} A ${radius} ${radius} 0 1 1 10 ${10 - radius}`;
	const variables = {
		'--pi-position': inline ? 'relative' : 'absolute',
		'--pi-inset': inline ? 'auto' : '0',
		'--pi-display': inline ? 'inline-flex' : 'flex',
		'--pi-spin-duration': `${spinTime}s`,
		'--pi-text-color': textColor,
	} as React.CSSProperties;
	return (
		<motion.div
			{...attributes}
			ref={forwardedRef}
			className={classNames(css.container, className ?? '')}
			aria-hidden="true"
			data-label-position={displayLabel ? labelPosition : undefined}
			inert={!present}
			style={{ ...style, ...variables }}
			initial={reduced ? false : 'initial'}
			animate={controls}
			variants={reduced ? undefined : variants}
			transition={reduced ? { duration: 0, delay: 0 } : timing}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width={resolvedSize}
				height={resolvedSize}
				viewBox="0 0 20 20"
				aria-hidden="true"
				focusable="false"
				className={playing && present && !reduced ? css.spinning : undefined}
				style={{ width: resolvedSize, height: resolvedSize }}
			>
				<defs>
					<linearGradient id={gradientId} x1="0" y1="0" x2="20" y2="0" gradientUnits="userSpaceOnUse">
						<stop offset="0%" stopColor={color} stopOpacity={1} />
						<stop offset="50%" stopColor={color} stopOpacity={1} />
						<stop offset="100%" stopColor={color} stopOpacity={0} />
					</linearGradient>
				</defs>
				<path d={path} fill="transparent" strokeWidth={resolvedStroke} stroke={`url(#${gradientId})`} />
			</svg>
			{displayLabel && <span className={classNames(css.label, css[textSize])}>{label}</span>}
		</motion.div>
	);
}
const ProgressIndicatorBase = React.forwardRef<HTMLDivElement, ProgressIndicatorProps>((rawProps, ref) => {
	const props = resolveColorProps(rawProps);
	const {
		show = false,
		duration,
		onStart,
		onStop,
		label = 'Loading',
		decorative = false,
		motionValues,
		transition,
		...attributes
	} = props;
	const resolvedLabel = label.trim() || 'Loading';
	const playing = useSpinnerPlayback({ show, duration, onStart, onStop });
	const id = useId().replace(/:/g, '');
	const theme = useTheme().current;
	const variants = useMemo(
		() =>
			mergedPresenceMotionValues(
				{ initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
				motionValues,
			),
		[motionValues],
	);
	const timing = useMemo(() => getWaterTransition(theme.motion, transition), [theme.motion, transition]);
	/* START.DEBUG */
	useTrackRenders(props, 'Progress Indicator');
	/* END.DEBUG */
	return (
		<>
			{!decorative && (
				<span role="status" aria-live="polite" aria-atomic="true" className={css.announcement}>
					{show ? resolvedLabel : ''}
				</span>
			)}
			<AnimatePresence>
				{show && (
					<IndicatorSurface
						{...attributes}
						forwardedRef={ref}
						label={resolvedLabel}
						playing={playing}
						gradientId={id}
						variants={variants}
						timing={timing}
					/>
				)}
			</AnimatePresence>
		</>
	);
});
ProgressIndicatorBase.displayName = 'ProgressIndicator';
export const ProgressIndicator = React.memo(ProgressIndicatorBase);
