'use client';

import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../../hooks';
import { useTrackRenders } from '../../../hooks/useTrackRenders/useTrackRenders';
import css from './ProgressIndicator.module.css';
import type { ProgressIndicatorProps } from './_types';

export function ProgressIndicator(props: Readonly<ProgressIndicatorProps>) {
	const theme = useTheme();
	const {
		size = 20,
		inset = true,
		secondsPerSpin = 1,
		show = false,
		color = theme.current.colors['core-icon-primary'],
		stroke = 1.5,
		inline = false,
		duration = undefined,
		didStart = () => null,
		didStop = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const [playing, setPlaying] = useState<boolean>(show);
	const gradientId = useId().replace(/:/g, '');
	const timer = useRef<any>(null);

	// start and stop the spinner from the controlled show and duration props
	useEffect(() => {
		if (show) {
			setPlaying(true);
			didStart();
			if (duration) {
				timer.current = setTimeout(() => {
					setPlaying(false);
					didStop();
				}, duration * 1000);
			}
		} else {
			setPlaying(false);
			didStop();
		}
		return () => {
			if (timer?.current) clearTimeout(timer.current);
		};
	}, [show, didStart, didStop, duration]);

	// compose CSS custom properties for spinner positioning and sizing
	const cssVars = useMemo(() => {
		return {
			'--pi-position': inline ? 'relative' : 'absolute',
			'--pi-inset': inline ? 'unset' : '0',
			'--pi-icon-size': `${size ?? 0}px`,
			'--pi-display': inline ? 'inline-flex' : 'flex',
		} as React.CSSProperties;
	}, [inline, size]);

	// derive the spinner SVG from the active visual configuration
	const openCircle = useMemo(() => {
		return OpenCircle(size, secondsPerSpin, color, stroke, playing, inset, gradientId);
	}, [size, secondsPerSpin, color, stroke, playing, inset, gradientId]);

	/* START.DEBUG */
	useTrackRenders(props, 'Progress Indicator');
	/* END.DEBUG */

	return (
		<AnimatePresence initial={true}>
			{show && (
				<motion.div
					id={divId}
					className={`${css.container}${divClass}`}
					style={{ ...divStyle, ...cssVars }}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					{...(rest as any)}
				>
					{openCircle}
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export const OpenCircle = (
	size: number | string,
	secondsPerSpin: number,
	color: string,
	stroke = 1.5,
	playing = false,
	inset = true,
	gradientId = 'strokeFill',
) => {
	// keep the stroke fully inside the 20x20 viewBox while visually touching the edge
	const edgeRadius = 10 - stroke / 2;
	const edgeStartX = 10 + edgeRadius * Math.cos(-0.4);
	const edgeStartY = 10 + edgeRadius * Math.sin(-0.4);
	const path = inset
		? 'M 17.371 6.886 C 17.776 7.843 18 8.895 18 10 C 18 14.418 14.418 18 10 18 C 5.582 18 2 14.418 2 10 C 2 5.582 5.582 2 10 2'
		: `M ${edgeStartX.toFixed(3)} ${edgeStartY.toFixed(3)} A ${edgeRadius.toFixed(3)} ${edgeRadius.toFixed(3)} 0 1 1 10 ${(
				10 - edgeRadius
			).toFixed(3)}`;

	// render the animated open-circle spinner path
	return (
		<motion.svg
			xmlns="http://www.w3.org/2000/svg"
			width={size}
			height={size}
			viewBox="0 0 20 20"
			role="img"
			aria-label="Loading spinner"
			transition={{
				ease: 'linear',
				repeatType: 'loop',
				repeat: playing ? Number.POSITIVE_INFINITY : 0,
				duration: secondsPerSpin,
			}}
			animate={playing ? { rotate: 360 } : { rotate: 0 }}
		>
			<title>Loading</title>
			<defs>
				<linearGradient id={gradientId} x1="0" y1="0" x2="20" y2="0" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor={color} stopOpacity={1} />
					<stop offset="50%" stopColor={color} stopOpacity={1} />
					<stop offset="100%" stopColor={color} stopOpacity={0} />
				</linearGradient>
			</defs>
			<motion.path d={path} fill="transparent" strokeWidth={stroke} stroke={`url(#${gradientId})`} />
		</motion.svg>
	);
};
