'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AudioVisualizer, type AudioVisualizerOptions } from '../../utils';
import { setStyle } from '../../utils/functions/misc';
import css from './Level.module.css';
import type { LevelProps } from './_types';

function BaseLevel(props: Readonly<LevelProps>) {
	const {
		width = 100,
		height = 4,
		gap = 0,
		audioStream,
		playing = false,
		minIntensity = 0,
		maxIntensity = 5,
		intensity = 3.5,
		peakIntensity = 0.5,
		risePerSeconds = 4,
		releasePerSeconds,
		ReleasePerSeconds = 1.5,
		borderRadius = 4,
		borderColor = 'transparent',
		borderWidth = 0,
		colorActive = 'var(--feedback-positive)',
		backgroundColor = 'var(--core-surface-primary-tint)',
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const visualizerRef = useRef<AudioVisualizer | null>(null);
	const [normalizedIntensity, setNormalizedIntensity] = useState(0);

	// calculate level bar count and active bar count
	const totalBars = Math.max(1, Math.floor(maxIntensity));
	const minBars = Math.max(0, Math.min(Math.floor(minIntensity), totalBars));
	const releaseRate = releasePerSeconds ?? ReleasePerSeconds;

	// calc number of bars to render
	const intensityIntervals = useMemo(() => {
		return new Array(totalBars).fill(0).map((_, index) => index);
	}, [totalBars]);

	// determine the number of active bars to display based on normalized intensity
	const activeBars = useMemo(() => {
		const scaledBars = Math.round(minBars + normalizedIntensity * (totalBars - minBars));
		return Math.max(minBars, Math.min(scaledBars, totalBars));
	}, [minBars, normalizedIntensity, totalBars]);

	const visualizerSettings = useMemo(() => {
		return {
			intensityMultiplier: intensity,
			peakIntensity,
			risePerSecond: risePerSeconds,
			releasePerSecond: releaseRate,
			onUpdate: ({
				intensity: nextIntensity,
			}: {
				intensity: number;
				scale: number;
			}) => setNormalizedIntensity(nextIntensity),
		} as AudioVisualizerOptions;
	}, [intensity, peakIntensity, releaseRate, risePerSeconds]);

	// start / stop the level based on playing prop
	useEffect(() => {
		visualizerRef.current?.dispose();
		visualizerRef.current = null;

		if (!audioStream) {
			setNormalizedIntensity(0);
			return;
		}

		const visualizer = new AudioVisualizer(audioStream, visualizerSettings);
		visualizerRef.current = visualizer;

		if (playing) visualizer.start();

		return () => {
			visualizer.dispose();
			if (visualizerRef.current === visualizer) {
				visualizerRef.current = null;
			}
		};
	}, [audioStream, playing, visualizerSettings]);

	// start / stop the level based on playing prop
	useEffect(() => {
		if (!visualizerRef.current) return;
		if (playing) {
			visualizerRef.current.start();
			return;
		}
		visualizerRef.current.stop();
		setNormalizedIntensity(0);
	}, [playing]);

	const cssVars = useMemo(() => {
		return {
			'--level-width': setStyle(width),
			'--level-height': setStyle(height),
			'--level-gap': setStyle(gap),
			'--level-bar-border-radius': setStyle(borderRadius),
			'--level-border-color': borderColor,
			'--level-border-width': setStyle(borderWidth),
			'--level-color': colorActive,
			'--level-bg-color': backgroundColor,
		} as React.CSSProperties;
	}, [width, height, gap, borderRadius, borderColor, borderWidth, colorActive, backgroundColor]);

	return (
		<div
			id={divId}
			className={`${css.wrapper}${divClass}`}
			style={{
				...cssVars,
				...divStyle,
			}}
			{...rest}
		>
			{intensityIntervals.map((barIndex) => {
				const isActive = barIndex < activeBars;
				return (
					<div key={barIndex} className={css.barContainer}>
						<div className={css.bar} style={{ opacity: isActive ? 1 : 0 }} />
					</div>
				);
			})}
		</div>
	);
}

export const Level = React.memo(BaseLevel);
