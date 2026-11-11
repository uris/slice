'use client';

import React, { useMemo, useState } from 'react';
import { corners } from '../../theme/corners/corners';
import { useAudioVisualizer } from '../../utils/audio/useAudioVisualizer';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import css from './AudioLevel.module.css';
import type { AudioLevelProps } from './_types';

function BaseAudioLevel(rawProps: Readonly<AudioLevelProps>) {
	const props = resolveColorProps(rawProps);
	const {
		width = 100,
		height = 4,
		gap = 0,
		audioStream,
		playing = false,
		levelName,
		minActiveBars = 0,
		barCount = 5,
		intensity = 3.5,
		peakIntensity = 0.5,
		risePerSeconds = 4,
		releasePerSeconds = 1.5,
		borderRadius = corners['corner-xs'],
		borderColor = 'transparent',
		borderWidth = 0,
		backgroundColorActive = 'var(--feedback-positive)',
		backgroundColor = 'var(--core-surface-primary-tint)',
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	// Bound DOM work, including non-finite and excessively large values.
	const totalBars = Math.min(1000, Math.max(1, Math.floor(Number.isFinite(barCount) ? barCount : 5)));
	const minBars = Math.max(0, Math.min(Math.floor(Number.isFinite(minActiveBars) ? minActiveBars : 0), totalBars));
	const [measuredBars, setMeasuredBars] = useState<number | null>(null);
	const activeBars = Math.max(minBars, Math.min(measuredBars ?? minBars, totalBars));
	const accessibleName = levelName?.trim();
	const intensityIntervals = useMemo(() => Array.from({ length: totalBars }, (_, index) => index), [totalBars]);
	const visualizerSettings = useMemo(
		() => ({
			intensityMultiplier: intensity,
			peakIntensity,
			risePerSecond: risePerSeconds,
			releasePerSecond: releasePerSeconds,
		}),
		[intensity, peakIntensity, risePerSeconds, releasePerSeconds],
	);

	useAudioVisualizer(
		audioStream,
		playing,
		visualizerSettings,
		({ intensity: nextIntensity }) => {
			// React bails out when the discrete bar count has not changed.
			setMeasuredBars(Math.round(minBars + nextIntensity * (totalBars - minBars)));
		},
		() => setMeasuredBars(null),
	);

	const cssVars = useMemo(() => {
		return {
			'--level-width': setStyle(width),
			'--level-height': setStyle(height),
			'--level-gap': setStyle(gap),
			'--level-bar-border-radius': setStyle(borderRadius),
			'--level-border-color': borderColor,
			'--level-border-width': setStyle(borderWidth),
			'--level-color': backgroundColorActive,
			'--level-bg-color': backgroundColor,
		} as React.CSSProperties;
	}, [width, height, gap, borderRadius, borderColor, borderWidth, backgroundColorActive, backgroundColor]);

	return (
		<div
			id={divId}
			className={`${css.wrapper}${divClass}`}
			style={{
				...cssVars,
				...divStyle,
			}}
			{...rest}
			role={accessibleName ? 'meter' : undefined}
			aria-hidden={accessibleName ? undefined : true}
			aria-label={accessibleName || undefined}
			aria-valuemin={accessibleName ? 0 : undefined}
			aria-valuemax={accessibleName ? totalBars : undefined}
			aria-valuenow={accessibleName ? activeBars : undefined}
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

export const AudioLevel = React.memo(BaseAudioLevel);
