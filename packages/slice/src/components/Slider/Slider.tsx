'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import css from './Slider.module.css';
import type { SliderProps } from './_types';
import {
	clampSliderValue,
	keyboardSliderValue,
	normalizeSliderRange,
	sliderLength,
	sliderPercent,
} from './sliderLogic';

type Interaction = { kind: 'pointer' | 'keyboard'; latest: number; changed: boolean };

export const Slider = React.memo((rawProps: SliderProps) => {
	const props = resolveColorProps(rawProps);
	const {
		value,
		defaultValue = 50,
		min = 0,
		max = 100,
		width = 100,
		height = 2,
		touchHeight = 24,
		trackHeadSize = 12,
		trackHeadOnHover,
		step,
		disabled = false,
		disabledOpacity = 0.5,
		trackHeadBorderRadius = '100%',
		cursor = 'grabbing',
		trackHeadColor = 'var(--core-text-light)',
		trackColor = 'var(--core-surface-secondary)',
		progressColor = 'var(--core-text-tertiary)',
		trackHeadBorderWidth = 1,
		trackHeadBorderColor = 'var(--core-outline-secondary)',
		onChange,
		onChangeEnd,
		onKeyDown,
		onKeyUp,
		onPointerDown,
		onPointerUp,
		onPointerCancel,
		onLostPointerCapture,
		onBlur,
		className,
		style,
		tabIndex,
		'aria-label': ariaLabel,
		'aria-labelledby': labelledBy,
		...inputAttributes
	} = props;
	const [minimum, maximum] = normalizeSliderRange(min, max);
	const [localValue, setLocalValue] = useState(defaultValue);
	const currentValue = clampSliderValue(value ?? localValue, minimum, maximum);
	const percent = sliderPercent(currentValue, minimum, maximum);
	const interaction = useRef<Interaction | null>(null);
	const [dragging, setDragging] = useState(false);

	const previousBounds = useRef({ minimum, maximum });
	useEffect(() => {
		if (disabled || previousBounds.current.minimum !== minimum || previousBounds.current.maximum !== maximum) {
			interaction.current = null;
			setDragging(false);
		}
		previousBounds.current = { minimum, maximum };
	}, [disabled, minimum, maximum]);
	useEffect(
		() => () => {
			interaction.current = null;
		},
		[],
	);

	const cancelInteraction = () => {
		interaction.current = null;
		setDragging(false);
	};
	const finishInteraction = () => {
		const pending = interaction.current;
		interaction.current = null;
		setDragging(false);
		if (!disabled && pending?.changed) onChangeEnd?.(pending.latest, sliderPercent(pending.latest, minimum, maximum));
	};
	const updateValue = (requested: number) => {
		const next = clampSliderValue(requested, minimum, maximum);
		const previous = interaction.current?.latest ?? currentValue;
		if (next === previous) return;
		if (interaction.current) {
			interaction.current.latest = next;
			interaction.current.changed = true;
		}
		const hadInteraction = interaction.current !== null;
		if (value === undefined) setLocalValue(next);
		onChange?.(next, sliderPercent(next, minimum, maximum));
		// Assistive technology may send an atomic input change without a pointer/key sequence.
		if (!hadInteraction) onChangeEnd?.(next, sliderPercent(next, minimum, maximum));
	};

	const headSize = trackHeadSize === null ? 0 : Number.isFinite(trackHeadSize) ? Math.max(0, trackHeadSize) : 12;
	const padding = Math.ceil(headSize / 2);
	const borderWidth = Number.isFinite(trackHeadBorderWidth) ? Math.max(0, trackHeadBorderWidth) : 1;
	const radius =
		typeof trackHeadBorderRadius === 'number'
			? Number.isFinite(trackHeadBorderRadius)
				? `${Math.max(0, trackHeadBorderRadius)}px`
				: '100%'
			: (trackHeadBorderRadius ?? '100%');
	const cssVars = {
		'--slider-padding': `${padding}px`,
		'--slider-native-thumb-size': `${padding * 2}px`,
		'--slider-width': width === 'auto' ? '100%' : sliderLength(width, 100),
		'--slider-height': sliderLength(height, 2),
		'--slider-touch-height': sliderLength(touchHeight, 24),
		'--slider-hit-height': 'max(var(--slider-touch-height), var(--slider-height), var(--slider-head-size))',
		'--slider-cursor': disabled ? 'default' : cursor,
		'--slider-head-display': headSize > 0 ? 'block' : 'none',
		'--slider-head-radius': radius,
		'--slider-head-size': `${headSize}px`,
		'--slider-head-color': trackHeadColor ?? 'var(--core-text-primary)',
		'--slider-progress-color': progressColor ?? 'var(--core-text-primary)',
		'--slider-track-color': trackColor ?? 'var(--core-surface-secondary)',
		'--slider-track-head-border': `${borderWidth}px solid ${trackHeadBorderColor}`,
		'--slider-opacity': disabled
			? Number.isFinite(disabledOpacity)
				? Math.min(1, Math.max(0, disabledOpacity))
				: 0.5
			: 1,
		'--slider-progress': `${percent * 100}%`,
	} as React.CSSProperties;

	/* START.DEBUG */
	useTrackRenders(props, 'Slider');
	/* END.DEBUG */

	return (
		<div
			className={`${css.wrapper}${className ? ` ${className}` : ''}`}
			style={{ ...style, ...cssVars }}
			data-head-on-hover={trackHeadOnHover || undefined}
			data-dragging={dragging || undefined}
		>
			<input
				{...inputAttributes}
				className={css.control}
				type="range"
				min={minimum}
				max={maximum}
				step="any"
				value={currentValue}
				disabled={disabled}
				tabIndex={disabled ? -1 : (tabIndex ?? 0)}
				aria-label={ariaLabel}
				aria-labelledby={labelledBy}
				aria-disabled={disabled || undefined}
				aria-valuemin={minimum}
				aria-valuemax={maximum}
				aria-valuenow={currentValue}
				aria-orientation="horizontal"
				onChange={(event) => {
					if (!disabled) updateValue(event.currentTarget.valueAsNumber);
				}}
				onPointerDown={(event) => {
					if (disabled) return;
					onPointerDown?.(event);
					if (event.defaultPrevented || event.button !== 0 || !event.isPrimary) return;
					interaction.current = { kind: 'pointer', latest: currentValue, changed: false };
					setDragging(true);
				}}
				onPointerUp={(event) => {
					onPointerUp?.(event);
					if (interaction.current?.kind === 'pointer') finishInteraction();
				}}
				onPointerCancel={(event) => {
					onPointerCancel?.(event);
					cancelInteraction();
				}}
				onLostPointerCapture={(event) => {
					onLostPointerCapture?.(event);
					if (interaction.current?.kind === 'pointer') cancelInteraction();
				}}
				onKeyDown={(event) => {
					if (disabled) return;
					onKeyDown?.(event);
					if (event.defaultPrevented) return;
					const next = keyboardSliderValue(
						interaction.current?.latest ?? currentValue,
						event.key,
						minimum,
						maximum,
						step,
					);
					if (next === null) return;
					event.preventDefault();
					if (interaction.current?.kind !== 'keyboard')
						interaction.current = { kind: 'keyboard', latest: currentValue, changed: false };
					updateValue(next);
				}}
				onKeyUp={(event) => {
					onKeyUp?.(event);
					if (
						interaction.current?.kind === 'keyboard' &&
						keyboardSliderValue(currentValue, event.key, minimum, maximum, step) !== null
					)
						finishInteraction();
				}}
				onBlur={(event) => {
					onBlur?.(event);
					if (interaction.current?.kind === 'keyboard') finishInteraction();
					else cancelInteraction();
				}}
			/>
			<div className={css.trackWrapper} aria-hidden="true">
				<div className={css.trackBg}>
					<div className={css.track} />
				</div>
				<div className={css.trackHead} />
			</div>
		</div>
	);
});
