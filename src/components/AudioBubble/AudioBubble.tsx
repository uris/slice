'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../hooks';
import { AudioVisualizer, type AudioVisualizerOptions, addOpacity } from '../../utils';
import css from './AudioBubble.module.css';
import type { AudioBubbleProps } from './_types';

export const AudioBubble = React.memo((props: AudioBubbleProps) => {
	const { current } = useTheme();
	const color = current.colors['core-text-primary'];
	const {
		audioStream,
		playing = false,
		size = 64,
		backgroundColor = 'var(--core-text-primary)',
		glow = true,
		glowColor = addOpacity(color, 0.1),
		glowSize = 48,
		glowOffset = 18,
		minScale = 1,
		maxScale = 3,
		intensity = 2.2,
		peakIntensity = 0.5,
		risePerSeconds = 4,
		ReleasePerSeconds = 1.5,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const visualizerRef = useRef<AudioVisualizer | null>(null);
	const [scale, setScale] = useState(minScale);

	const visualizerSettings = useMemo(() => {
		return {
			minScale,
			maxScale,
			intensityMultiplier: intensity,
			peakIntensity,
			risePerSecond: risePerSeconds,
			releasePerSecond: ReleasePerSeconds,
			onUpdate: ({ scale: nextScale }: { intensity: number; scale: number }) => setScale(nextScale),
		} as AudioVisualizerOptions;
	}, [minScale, maxScale, intensity, peakIntensity, risePerSeconds, ReleasePerSeconds]);

	const setGlow = useMemo(() => {
		if (!glow) return 'unset';
		return `0 ${glowOffset}px ${glowSize}px ${glowColor}`;
	}, [glow, glowColor, glowSize, glowOffset]);

	const cssVars = useMemo(() => {
		return {
			'--ab-size': `${size}px`,
			'--ab-bg-color': backgroundColor,
			'--ab-box-shadow': setGlow,
		} as React.CSSProperties;
	}, [size, backgroundColor, setGlow]);

	useEffect(() => {
		visualizerRef.current?.dispose();
		visualizerRef.current = null;

		if (!audioStream) {
			setScale(minScale);
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
	}, [audioStream, minScale, playing, visualizerSettings]);

	useEffect(() => {
		if (!visualizerRef.current) return;
		if (playing) {
			visualizerRef.current.start();
			return;
		}
		visualizerRef.current.stop();
		setScale(minScale);
	}, [minScale, playing]);

	return (
		<div id={divId} className={`${css.wrapper}${divClass}`} style={divStyle} {...rest}>
			<div
				className={css.bubble}
				style={{
					...cssVars,
					transform: `scale(${scale})`,
				}}
			/>
		</div>
	);
});
