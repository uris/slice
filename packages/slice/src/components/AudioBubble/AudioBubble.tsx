'use client';

import React, { useMemo, useState } from 'react';
import { useTheme } from '../../hooks';
import { addOpacity } from '../../utils';
import { useAudioVisualizer } from '../../utils/audio/useAudioVisualizer';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import css from './AudioBubble.module.css';
import type { AudioBubbleProps } from './_types';

export const AudioBubble = React.memo((rawProps: AudioBubbleProps) => {
	const props = resolveColorProps(rawProps);
	const { current } = useTheme();
	const color = current.colors['core-text-primary'];
	const {
		'aria-hidden': ariaHidden = true,
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
		releasePerSeconds = 1.5,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const restingScale = Number.isFinite(minScale) && minScale > 0 ? minScale : 1;
	const reducedMotion = usePrefersReducedMotion();
	const [scale, setScale] = useState(restingScale);

	const visualizerSettings = useMemo(() => {
		return {
			minScale,
			maxScale,
			intensityMultiplier: intensity,
			peakIntensity,
			risePerSecond: risePerSeconds,
			releasePerSecond: releasePerSeconds,
		};
	}, [minScale, maxScale, intensity, peakIntensity, risePerSeconds, releasePerSeconds]);

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

	useAudioVisualizer(
		audioStream,
		playing && !reducedMotion,
		visualizerSettings,
		({ scale: nextScale }) => setScale(nextScale),
		() => setScale(restingScale),
	);

	return (
		<div id={divId} className={`${css.wrapper}${divClass}`} style={divStyle} {...rest} aria-hidden={ariaHidden}>
			<div
				className={css.bubble}
				style={{
					...cssVars,
					transform: `scale(${scale})`,
					transition: reducedMotion ? 'none' : undefined,
				}}
			/>
		</div>
	);
});
