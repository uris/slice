'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../../hooks';
import { useTrackRenders } from '../../../hooks/useTrackRenders/useTrackRenders';
import { Icon } from '../../Icon';
import css from './DoneCheck.module.css';
import type { DoneCheckProps } from './_types';

export const DoneCheck = React.memo((props: DoneCheckProps) => {
	const theme = useTheme();
	const {
		size = 88,
		stroke = 1.5,
		color = theme.current.colors['feedback-positive'],
		play = true,
		delay = 5,
		duration = 1,
		didStart,
		didEnd,
	} = props;
	const [playing, setPlaying] = useState<boolean>(!play);

	// stage the mount animation across paint frames so the scale transition can run
	useEffect(() => {
		let frameOne = 0;
		let frameTwo = 0;

		if (play) {
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
	}, [play]);

	// resolve the scale transition timing for the check animation
	const transition = useMemo(() => {
		return `scale ${duration}s var(--motion-spring) ${delay}s`;
	}, [delay, duration]);

	// compose CSS custom properties for the check size and animation state
	const cssVars = useMemo(() => {
		return {
			'--icon-size': `${size}px`,
			'--icon-scale': playing ? 1 : 0,
			'--icon-transition': play ? transition : 'unset',
		} as React.CSSProperties;
	}, [size, playing, play, transition]);

	/* START.DEBUG */
	useTrackRenders(props, 'DoneCheck');
	/* END.DEBUG */

	return (
		<div className={css.wrapper} role={'status'} aria-live={'polite'}>
			<div
				className={css.icon}
				style={cssVars}
				onTransitionEnd={() => didEnd?.()}
				onTransitionStart={() => didStart?.()}
			>
				<Icon name="check circle" size={size} color={color} stroke={stroke} strokeColor={color} />
			</div>
		</div>
	);
});
