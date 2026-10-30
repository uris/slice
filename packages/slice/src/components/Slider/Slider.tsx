'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useObserveResize } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { debounce } from '../../utils';
import { pointerPosition } from '../../utils/functions/misc';
import css from './Slider.module.css';
import type { SliderProps } from './_types';

export const Slider = React.memo((props: SliderProps) => {
	const {
		value = 25,
		scaleMin = 0,
		scaleMax = 100,
		width,
		height = 2,
		touchHeight = 24,
		trackHeadSize = 7,
		step,
		disabled = false,
		disabledOpacity = 0.5,
		cursor = 'default',
		headColor = 'var(--core-text-light)',
		trackColor = 'var(--core-surface-secondary)',
		progressColor = 'var(--core-text-tertiary)',
		trackHeadBorderSize = 1,
		trackHeadBorderColor = 'var(--core-outline-secondary)',
		onChange = () => null,
		onDragChange = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';

	const ref = useRef<HTMLDivElement>(null);
	const track = useRef<HTMLDivElement>(null);
	const head = useRef<HTMLDivElement>(null);
	const [currentValue, setCurrentValue] = useState<number>(value);

	// track slider progress in refs so drag listeners do not depend on React state
	const absProgressRef = useRef<number>(value);
	const relativeProgressRef = useRef<number>(0);
	const didMount = useRef<boolean>(false);

	// observe width changes so the slider can reposition responsively
	const size = useObserveResize(ref, { ignore: 'height' });

	// debounce onChange while dragging to reduce update frequency
	const debouncedOnChange = debounce((value: number, percent: number) => {
		onChange(value, percent);
	}, 0);

	// offset the slider head so it remains visually within the track bounds
	const padding = useMemo(() => {
		if (!trackHeadSize) return 0;
		return Math.ceil(trackHeadSize / 2);
	}, [trackHeadSize]);

	// clamp values to the configured slider range
	const clampValue = useCallback(
		(nextValue: number) => {
			return Math.min(scaleMax, Math.max(scaleMin, nextValue));
		},
		[scaleMax, scaleMin],
	);

	// set step value for keyboard strokes
	const stepIncrement = useMemo(() => {
		if (step) return step;
		const range = scaleMax - scaleMin;
		if (range <= 0) return 0;
		return Math.max(range / 100, 0.01);
	}, [step, scaleMin, scaleMax]);

	// normalize an absolute value into a 0-1 progress percentage
	const valueToPercent = useCallback(
		(nextValue: number) => {
			const range = scaleMax - scaleMin;
			if (range <= 0) return 0;
			return (nextValue - scaleMin) / range;
		},
		[scaleMax, scaleMin],
	);

	// position the filled track and slider head from a pixel position
	const setTrackAndHead = useCallback((pixelPos: number) => {
		const hd = head.current;
		const tr = track.current;
		if (hd) hd.style.left = `${pixelPos}px`;
		if (tr) tr.style.width = `${pixelPos}px`;
		didMount.current = true;
	}, []);

	// place the slider head from the current absolute value within the scale
	const initialProgress = useCallback(
		(current: number): void => {
			if (!ref?.current) return;
			const sliderWidth = ref.current.getBoundingClientRect().width;
			const adjustedCurrent = clampValue(current);
			const normalized = valueToPercent(adjustedCurrent);
			const pixelPos = normalized * sliderWidth;
			absProgressRef.current = adjustedCurrent; // updated the progress value
			relativeProgressRef.current = normalized; // updated the relative value
			setCurrentValue(adjustedCurrent);
			setTrackAndHead(pixelPos);
			didMount.current = true;
		},
		[clampValue, valueToPercent, setTrackAndHead],
	);

	// update relative and absolute progress from a raw x-position
	const progress = useCallback(
		(posX: number) => {
			const el = ref?.current;
			if (!el) return { value: 0, percent: 0 };
			const rect = el.getBoundingClientRect();
			const sliderWidth = rect.width;
			relativeProgressRef.current = sliderWidth > 0 ? posX / sliderWidth : 0;
			absProgressRef.current = scaleMin + relativeProgressRef.current * (scaleMax - scaleMin);
			setCurrentValue(absProgressRef.current);
		},
		[scaleMax, scaleMin],
	);

	// update the slider to an absolute value and optionally notify listeners
	const commitValue = useCallback(
		(nextValue: number, notify: 'silent' | 'change' | 'drag' | 'both' = 'change') => {
			const el = ref.current;
			if (!el) return;
			const sliderWidth = el.getBoundingClientRect().width;
			const clampedValue = clampValue(nextValue);
			const percent = valueToPercent(clampedValue);
			absProgressRef.current = clampedValue;
			relativeProgressRef.current = percent;
			setCurrentValue(clampedValue);
			setTrackAndHead(percent * sliderWidth);
			if (notify === 'change' || notify === 'both') onChange(clampedValue, percent);
			if (notify === 'drag' || notify === 'both') onDragChange(clampedValue, percent);
		},
		[clampValue, valueToPercent, setTrackAndHead, onChange, onDragChange],
	);

	// clamp a pointer position to the slider bounds and update the head position
	const updateSlider = useCallback(
		(e: any) => {
			const newPos = pointerPosition(e);
			const el = ref?.current;
			if (!el) return 0;
			const rect = el.getBoundingClientRect();
			const sliderWidth = rect.width;
			let pos: number = newPos - rect.x;
			if (pos > sliderWidth) {
				pos = sliderWidth;
			} else if (pos < 0) {
				pos = 0;
			}
			setTrackAndHead(pos);
			return pos;
		},
		[setTrackAndHead],
	);

	// update slider progress continuously while dragging
	const handleMouseMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			e.preventDefault();
			if (disabled) return;
			const el = ref?.current;
			if (el) {
				const pos = updateSlider(e); // return new pixel pos and updates head/track
				progress(pos); // update the slider progress
				debouncedOnChange(absProgressRef.current, relativeProgressRef.current); // debounce updates
			}
		},
		[progress, updateSlider, debouncedOnChange, disabled],
	);

	// finalize the drag interaction and emit the final slider value
	const handleMouseUp = useCallback(
		(e: MouseEvent | TouchEvent) => {
			e.preventDefault();
			const el = ref?.current;
			if (el) {
				const pos = updateSlider(e); // return new pixel pos and updates head/track
				progress(pos);
				debouncedOnChange.cancel(); // cancel current debounce if any
				onDragChange(absProgressRef.current, relativeProgressRef.current); // immediate update
				onChange(absProgressRef.current, relativeProgressRef.current);
			}
			globalThis.removeEventListener('mousemove', handleMouseMove, false);
			globalThis.removeEventListener('touchmove', handleMouseMove, false);
			globalThis.removeEventListener('mouseup', handleMouseUp, false);
			globalThis.removeEventListener('touchend', handleMouseUp, false);
		},
		[handleMouseMove, progress, updateSlider, debouncedOnChange, onDragChange, onChange],
	);

	// support standard slider keyboard controls
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			if (disabled) return;
			let nextValue: number | null = null;
			switch (event.key) {
				case 'ArrowRight':
				case 'ArrowUp':
					nextValue = absProgressRef.current + stepIncrement;
					break;
				case 'ArrowLeft':
				case 'ArrowDown':
					nextValue = absProgressRef.current - stepIncrement;
					break;
				case 'PageUp':
					nextValue = absProgressRef.current + stepIncrement;
					break;
				case 'PageDown':
					nextValue = absProgressRef.current - stepIncrement;
					break;
				case 'Home':
					nextValue = scaleMin;
					break;
				case 'End':
					nextValue = scaleMax;
					break;
				default:
					break;
			}

			if (nextValue === null) return;
			event.preventDefault();
			debouncedOnChange.cancel();
			commitValue(nextValue, 'change');
		},
		[scaleMin, scaleMax, debouncedOnChange, commitValue, stepIncrement, disabled],
	);

	// start dragging from the current pointer position and emit the initial value
	const handleMouseDown = useCallback(
		(e: MouseEvent | TouchEvent) => {
			e.preventDefault();
			e.stopPropagation();
			if (disabled) return;
			globalThis.addEventListener('mousemove', handleMouseMove, false);
			globalThis.addEventListener('touchmove', handleMouseMove, false);
			globalThis.addEventListener('mouseup', handleMouseUp, false);
			globalThis.addEventListener('touchend', handleMouseUp, false);
			const el = ref?.current;
			if (el) {
				const pos = updateSlider(e); // return new pixel pos and updates head/track
				progress(pos);
				debouncedOnChange.cancel(); // cancel current debounce if any
				onChange(absProgressRef.current, relativeProgressRef.current); // immediate update
			}
		},
		[handleMouseMove, handleMouseUp, onChange, progress, updateSlider, debouncedOnChange, disabled],
	);

	// sync the slider head position from the controlled value prop
	useEffect(() => {
		if (didMount.current && value === absProgressRef.current) return;
		initialProgress(value);
	}, [value, initialProgress]);

	// attach low-level pointer listeners to the slider track and head
	useEffect(() => {
		const el = ref?.current;
		const hl = head?.current;
		el?.addEventListener('mousedown', handleMouseDown, false);
		el?.addEventListener('touchstart', handleMouseDown, false);
		hl?.addEventListener('mousedown', handleMouseDown, false);
		hl?.addEventListener('touchstart', handleMouseDown, false);
		return () => {
			el?.removeEventListener('mousedown', handleMouseDown, false);
			el?.removeEventListener('touchstart', handleMouseDown, false);
			hl?.removeEventListener('mousedown', handleMouseDown, false);
			hl?.removeEventListener('touchstart', handleMouseDown, false);
		};
	}, [handleMouseDown]);

	// reposition the slider head when the observed width changes
	useEffect(() => {
		const sliderWidth = ref?.current?.offsetWidth;
		if (!sliderWidth || size.width === 0) return;
		setTrackAndHead(relativeProgressRef.current * sliderWidth);
	}, [size.width, setTrackAndHead]);

	// resolve the track head color, hiding it when the head size is zero
	const trackHeadColor = useMemo(() => {
		if (!trackHeadSize || trackHeadSize === 0) return 'transparent';
		return headColor ?? 'var(--core-text-primary)';
	}, [headColor, trackHeadSize]);

	// normalize the wrapper width from numeric and string input
	const setWidth = useMemo(() => {
		if (width && typeof width === 'string') {
			if (width === 'auto') return '100%';
			return width;
		}
		return `${width ?? 100}px`;
	}, [width]);

	// const memo track head border
	const setHeadBorder = useMemo(() => {
		if (!trackHeadBorderSize || trackHeadBorderSize === 0) return 'unset';
		return `${trackHeadBorderSize}px solid ${trackHeadBorderColor}`;
	}, [trackHeadBorderColor, trackHeadBorderSize]);

	// compose CSS custom properties for slider layout and colors
	const cssVars = useMemo(() => {
		return {
			'--slider-padding': `${padding}px`,
			'--slider-width': setWidth,
			'--slider-height': `${height}px`,
			'--slider-touch-height': `${touchHeight}px`,
			'--slider-cursor': cursor,
			'--slider-head-display': height ? 'block' : 'none',
			'--slider-head-radius': '100%',
			'--slider-head-size': `${trackHeadSize ?? 0}px`,
			'--slider-head-width': `${trackHeadSize ?? 0}px`,
			'--slider-head-color': trackHeadColor,
			'--slider-progress-color': progressColor ?? 'var(--core-text-primary)',
			'--slider-track-color': trackColor ?? 'var(--core-surface-secondary)',
			'--slider-track-head-border': setHeadBorder,
			'--slider-opacity': disabled ? disabledOpacity : '1',
		} as React.CSSProperties;
	}, [
		padding,
		height,
		touchHeight,
		cursor,
		progressColor,
		trackColor,
		trackHeadSize,
		trackHeadColor,
		setWidth,
		setHeadBorder,
		disabled,
		disabledOpacity,
	]);

	/* START.DEBUG */
	useTrackRenders({ ...props, sizeObserver: size }, 'Slider');
	/* END.DEBUG */

	return (
		<div id={divId} className={`${css.wrapper}${divClass}`} style={{ ...divStyle, ...cssVars }} {...rest}>
			<div
				ref={ref}
				className={css.trackWrapper}
				role="slider"
				tabIndex={0}
				aria-label="Slider"
				aria-valuemin={scaleMin}
				aria-valuemax={scaleMax}
				aria-valuenow={currentValue}
				aria-orientation="horizontal"
				onKeyDown={handleKeyDown}
			>
				<div className={css.trackBg}>
					<div className={css.track} ref={track} />
				</div>
				<div className={css.trackHead} ref={head} />
			</div>
		</div>
	);
});
