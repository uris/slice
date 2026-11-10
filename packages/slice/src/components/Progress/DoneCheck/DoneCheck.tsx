'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../hooks';
import { useTrackRenders } from '../../../hooks/useTrackRenders/useTrackRenders';
import { resolveColorProps } from '../../../utils/functions/resolveColorProps';
import { usePrefersReducedMotion } from '../../../utils/styling/usePrefersReducedMotion';
import { Icon } from '../../Icon';
import css from './DoneCheck.module.css';
import type { DoneCheckProps } from './_types';

export const DoneCheck = React.memo((rawProps: DoneCheckProps) => {
	const props = resolveColorProps(rawProps);
	const theme = useTheme();
	const {
		size = 88,
		stroke = 1.5,
		color = theme.current.colors['feedback-positive'],
		play = true,
		delay = 0,
		duration = 1,
		didStart,
		didEnd,
		statusLabel = 'Completed',
		decorative = false,
		className,
		style,
		...divAttributes
	} = props;
	const reducedMotion = usePrefersReducedMotion();
	const shouldAnimate = play && !reducedMotion && duration > 0;
	const [playing, setPlaying] = useState<boolean>(!play);

	// stage the mount animation across paint frames so the scale transition can run
	useEffect(() => {
		let frameOne = 0;
		let frameTwo = 0;

		if (shouldAnimate) {
			setPlaying(false);
			frameOne = requestAnimationFrame(() => {
				frameTwo = requestAnimationFrame(() => {
					setPlaying(true);
				});
			});
		} else {
			setPlaying(true);
		}

		return () => {
			if (frameOne) cancelAnimationFrame(frameOne);
			if (frameTwo) cancelAnimationFrame(frameTwo);
		};
	}, [shouldAnimate]);

	const cssVars = {
		width: size,
		height: size,
		flexShrink: 0,
		'--icon-size': `${size}px`,
		'--icon-scale': !shouldAnimate || playing ? 1 : 0,
		'--icon-transition': shouldAnimate ? `scale ${duration}s var(--motion-spring) ${delay}s` : 'none',
	} as React.CSSProperties;

	const isScaleTransition = (event: React.TransitionEvent<HTMLDivElement>) =>
		shouldAnimate &&
		event.target === event.currentTarget &&
		(event.nativeEvent as TransitionEvent).propertyName === 'scale';

	/* START.DEBUG */
	useTrackRenders(props, 'DoneCheck');
	/* END.DEBUG */

	return (
		<div
			{...divAttributes}
			className={[css.wrapper, className].filter(Boolean).join(' ')}
			style={{ ...style, ...cssVars }}
			role={decorative ? undefined : 'status'}
			aria-label={decorative ? undefined : statusLabel.trim() || 'Completed'}
			aria-hidden={decorative || undefined}
		>
			<div
				className={css.icon}
				aria-hidden="true"
				onTransitionEnd={(event) => {
					if (isScaleTransition(event)) didEnd?.();
				}}
				onTransitionStart={(event) => {
					if (isScaleTransition(event)) didStart?.();
				}}
			>
				<Icon name="system.check-circle" size={size} decorative stroke={stroke} strokeColor={color} />
			</div>
		</div>
	);
});
