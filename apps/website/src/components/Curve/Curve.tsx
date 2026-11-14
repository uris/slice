'use client';

import { classNames } from '@apple-pie/slice/utils';
import { type CSSProperties, useEffect, useRef } from 'react';
import css from './Curve.module.css';
import { getCurveBounds } from './getCurveBounds';
import { parseEasing } from './parseEasing';

export type CurvePoint = Readonly<{ x: number; y: number }>;

export type CurveProps = {
	/** Numbers are spaced evenly along X; points must have strictly increasing X. */
	values: string | readonly number[] | readonly CurvePoint[];
	/** Click or press Enter/Space to replay a marker along the curve. */
	animateOnClick?: boolean;
	/** Milliseconds, or a CSS duration token such as '0.35s'. */
	duration?: number | string;
	/** Pause at the endpoint before resetting. Defaults to 2000ms. */
	resetDelay?: number | string;
	/** Hide the shape at rest and after resetting. Defaults to true. */
	resetToTransparent?: boolean;
	/** Animated shape fill; defaults to the curve stroke color. */
	shapeColor?: string;
	/** Animated square side length in SVG units (scales with the SVG). Defaults to 10. */
	shapeSize?: number;
	/** Corner radius in SVG units. Defaults to 0 (square corners). */
	shapeRadius?: number;
	/** @deprecated Use shapeColor. */
	markerColor?: string;
	width?: number;
	height?: number;
	strokeColor?: string;
	strokeWidth?: number;
	/** Accessible description. Omit for a decorative curve. */
	label?: string;
	className?: string;
	style?: CSSProperties;
	curveName?: string;
	curveToken?: string;
};

/** Monotone cubic interpolation preserves the supplied peaks without adding overshoot. */
function createPath(points: readonly CurvePoint[]): string {
	if (points.length < 2) return '';
	const slopes = points.slice(1).map((point, index) => {
		const previous = points[index];
		return (point.y - previous.y) / (point.x - previous.x);
	});
	const tangents = points.map((_, index) => {
		if (index === 0) return slopes[0];
		if (index === points.length - 1) return slopes[index - 1];
		const left = slopes[index - 1];
		const right = slopes[index];
		if (left * right <= 0) return 0;
		return Math.sign(left) * Math.min(Math.abs(left), Math.abs(right));
	});
	const segments = points.slice(1).map((point, index) => {
		const previous = points[index];
		const step = (point.x - previous.x) / 3;
		return `C ${previous.x + step} ${previous.y + step * tangents[index]}, ${point.x - step} ${point.y - step * tangents[index + 1]}, ${point.x} ${point.y}`;
	});
	return `M ${points[0].x} ${points[0].y} ${segments.join(' ')}`;
}

function getPath(points: readonly CurvePoint[], kind?: 'bezier' | 'linear'): string {
	if (kind === 'bezier') {
		const [start, first, second, end] = points;
		return `M ${start.x} ${start.y} C ${first.x} ${first.y}, ${second.x} ${second.y}, ${end.x} ${end.y}`;
	}
	if (kind === 'linear') {
		return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
	}
	return createPath(points);
}

function parseTime(value: number | string, name: string): number {
	const match = typeof value === 'string' ? /^([+]?(?:\d*\.\d+|\d+))(ms|s)$/.exec(value.trim()) : null;
	const milliseconds = typeof value === 'number' ? value : Number(match?.[1]) * (match?.[2] === 's' ? 1000 : 1);
	if (!Number.isFinite(milliseconds) || milliseconds < 0) {
		throw new Error(`Curve ${name} must be non-negative milliseconds or a CSS seconds/milliseconds duration.`);
	}
	return milliseconds;
}

export function Curve({
	values,
	animateOnClick = true,
	duration = 1000,
	resetDelay = 2000,
	resetToTransparent = true,
	width = 400,
	height = 160,
	strokeColor = 'currentColor',
	markerColor,
	shapeColor = markerColor ?? strokeColor,
	shapeSize = 10,
	shapeRadius = 0,
	strokeWidth = 2,
	label,
	className,
	curveName,
	curveToken,
	style,
}: CurveProps) {
	const pathRef = useRef<SVGPathElement>(null);
	const markerRef = useRef<SVGRectElement>(null);
	const frameRef = useRef<number | null>(null);
	const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const durationMs = parseTime(duration, 'duration');
	const resetDelayMs = parseTime(resetDelay, 'resetDelay');
	if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
		throw new Error('Curve width and height must be finite positive numbers.');
	}
	if (!Number.isFinite(strokeWidth) || strokeWidth < 0 || strokeWidth >= Math.min(width, height)) {
		throw new Error('Curve strokeWidth must be finite, non-negative, and smaller than width and height.');
	}
	const easing = typeof values === 'string' ? parseEasing(values) : undefined;
	const samples = typeof values === 'string' ? [] : values;
	const points =
		easing?.points ??
		samples.map((value, index) => {
			if (typeof value === 'number') return { x: index, y: value };
			return value;
		});
	for (let index = 0; index < points.length; index++) {
		const point = points[index];
		if (!Number.isFinite(point.x) || !Number.isFinite(point.y)) {
			throw new Error('Curve values must contain only finite coordinates.');
		}
		if (!easing && index > 0 && point.x <= points[index - 1].x) {
			throw new Error('Curve point X coordinates must be strictly increasing.');
		}
	}
	const { minX, maxX, minY, maxY } = getCurveBounds(points, easing?.kind);
	if (!Number.isFinite(shapeSize) || shapeSize < 0) {
		throw new Error('Curve shapeSize must be a finite, non-negative number.');
	}
	if (!Number.isFinite(shapeRadius) || shapeRadius < 0) {
		throw new Error('Curve shapeRadius must be a finite, non-negative number.');
	}
	const markerRadius = Math.min(shapeSize / 2, width / 4, height / 4);
	const inset = animateOnClick ? Math.max(markerRadius, strokeWidth / 2) : strokeWidth / 2;
	const mapped = points.map((point) => {
		const x = maxX === minX ? width / 2 : inset + ((point.x - minX) / (maxX - minX)) * (width - 2 * inset);
		const y = maxY === minY ? height / 2 : inset + ((maxY - point.y) / (maxY - minY)) * (height - 2 * inset);
		return { x, y };
	});

	const path = getPath(mapped, easing?.kind);
	const startX = mapped[0]?.x ?? 0;
	const startY = mapped[0]?.y ?? 0;
	// biome-ignore lint/correctness/useExhaustiveDependencies: Cancel playback whenever its geometry or configuration changes.
	useEffect(() => {
		markerRef.current?.setAttribute('transform', `translate(${startX} ${startY})`);
		markerRef.current?.setAttribute('opacity', resetToTransparent ? '0' : '1');
		return () => {
			if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
			if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current);
		};
	}, [path, startX, startY, animateOnClick, durationMs, resetDelayMs, resetToTransparent]);

	const play = () => {
		const geometry = pathRef.current;
		const marker = markerRef.current;
		if (!geometry || !marker || mapped.length < 2) return;
		if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
		if (resetTimerRef.current !== null) clearTimeout(resetTimerRef.current);
		const length = geometry.getTotalLength();
		const start = geometry.getPointAtLength(0);
		const end = geometry.getPointAtLength(length);
		const move = (progress: number) => {
			const targetX = start.x + (end.x - start.x) * progress;
			let low = 0;
			let high = length;
			for (let iteration = 0; iteration < 24; iteration++) {
				const middle = (low + high) / 2;
				if (geometry.getPointAtLength(middle).x <= targetX) low = middle;
				else high = middle;
			}
			const point = geometry.getPointAtLength(progress === 1 ? length : low);
			marker.setAttribute('transform', `translate(${point.x} ${point.y})`);
		};
		const reset = () => {
			marker.setAttribute('transform', `translate(${start.x} ${start.y})`);
			marker.setAttribute('opacity', resetToTransparent ? '0' : '1');
			frameRef.current = null;
			resetTimerRef.current = null;
		};
		const complete = () => {
			frameRef.current = null;
			if (resetDelayMs === 0) reset();
			else resetTimerRef.current = setTimeout(reset, resetDelayMs);
		};
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			reset();
			return;
		}
		marker.setAttribute('opacity', '1');
		if (durationMs === 0) {
			move(1);
			complete();
			return;
		}
		move(0);
		let started: number | undefined;
		const tick = (now: number) => {
			started ??= now;
			const progress = Math.min((now - started) / durationMs, 1);
			move(progress);
			if (progress < 1) frameRef.current = requestAnimationFrame(tick);
			else complete();
		};
		frameRef.current = requestAnimationFrame(tick);
	};

	const svg = (
		<svg
			viewBox={`0 0 ${width} ${height}`}
			width={width}
			height={height}
			role={label ? 'img' : undefined}
			aria-label={label}
			aria-hidden={label ? undefined : true}
			className={className}
			style={{ maxWidth: '100%', height: 'auto', ...style }}
		>
			{mapped.length === 1 ? (
				<circle cx={mapped[0].x} cy={mapped[0].y} r={strokeWidth / 2} fill={strokeColor} />
			) : (
				<path
					ref={pathRef}
					d={path}
					fill="none"
					stroke={strokeColor}
					strokeWidth={strokeWidth}
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			)}
			{animateOnClick && mapped.length > 1 && (
				<rect
					ref={markerRef}
					x={-markerRadius}
					y={-markerRadius}
					width={markerRadius * 2}
					height={markerRadius * 2}
					rx={Math.min(shapeRadius, markerRadius)}
					transform={`translate(${startX} ${startY})`}
					fill={shapeColor}
					opacity={resetToTransparent ? 0 : 1}
				/>
			)}
		</svg>
	);
	if (!animateOnClick)
		return (
			<div className={css.wrapper}>
				<div className={css.curve}>{svg}</div>
				<div className={css.caption}>
					<span className={'body-m-regular'}>{curveName}</span>
					<span className={classNames(css.token, 'body-xs-regular')}>{curveToken}</span>
				</div>
			</div>
		);
	return (
		<div className={css.wrapper} style={{ '--border-color': shapeColor } as CSSProperties}>
			<div className={css.curve}>
				<button
					type="button"
					onClick={play}
					disabled={mapped.length < 2}
					aria-label={`Play ${label ?? 'curve'} animation`}
					style={{
						display: 'inline-flex',
						padding: 0,
						border: 0,
						background: 'transparent',
						color: 'inherit',
						cursor: 'pointer',
						maxWidth: '100%',
					}}
				>
					{svg}
				</button>
			</div>
			<div className={css.caption}>
				<span className={'body-m-regular'}>{curveName}</span>
				<span className={classNames(css.token, 'body-xs-regular')}>{curveToken}</span>
			</div>
		</div>
	);
}
