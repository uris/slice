'use client';

import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useObserveResize } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { corners } from '../../theme/corners/corners';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import css from './DraggablePanel.module.css';
import type { DragHandleProps, DraggablePanelProps, DraggablePanelResizeInfo } from './_types';
import { resolvePanelConstraints } from './panelConstraints';
export type { DragHandleProps, DraggablePanelProps } from './_types';

const defaultConstraints = { initial: 250, min: 250, max: 500 };
type Gesture = {
	pointerId: number;
	startX: number;
	startWidth: number;
	width: number;
	height: number;
	release: () => void;
};

export const DraggablePanel = React.memo(function DraggablePanel(rawProps: DraggablePanelProps) {
	const props = resolveColorProps(rawProps);
	const {
		children,
		sizeConstraints = defaultConstraints,
		isClosed = true,
		resizeHandle,
		resizeHandleLabel = 'Resize panel',
		borderRight = '1px solid var(--core-outline-secondary)',
		borderLeft = '1px solid var(--core-outline-secondary)',
		backgroundColor = 'transparent',
		drags = 'right',
		isTouchDevice = false,
		disableOnContext = false,
		dragHandle = true,
		dragHandleStyle = { height: 24, width: 9 },
		transitionDurationOnInit,
		containerRef,
		onResize,
		onResizeStart,
		onResizeEnd,
		onContextMenu,
		id,
		className,
		style,
		...attributes
	} = props;
	const div = useRef<HTMLDivElement>(null);
	const handle = useRef<HTMLDivElement>(null);
	const generatedId = useId();
	const panelId = id ?? generatedId;
	const containerSize = useObserveResize(containerRef);
	const [windowWidth, setWindowWidth] = useState<number>();
	const containerWidth = containerRef ? containerSize.width || undefined : windowWidth;
	const { initial, min, max } = resolvePanelConstraints(sizeConstraints, containerWidth);
	const [lastWidth, setLastWidth] = useState<number>();
	const [dragWidth, setDragWidth] = useState<number>();
	const [highlight, setHighlight] = useState(false);
	const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
	const gesture = useRef<Gesture | undefined>(undefined);
	const latest = useRef({ onResize, onResizeStart, onResizeEnd, min, max });
	useLayoutEffect(() => {
		latest.current = { onResize, onResizeStart, onResizeEnd, min, max };
	});
	const reducedMotion = usePrefersReducedMotion();
	const width = Math.min(max, Math.max(min, dragWidth ?? lastWidth ?? initial));
	const unresolvedInitial =
		lastWidth === undefined &&
		containerWidth === undefined &&
		sizeConstraints.initial >= 0 &&
		sizeConstraints.initial <= 1;
	const closed = isClosed || (Boolean(drags) && (width <= 1 || unresolvedInitial));
	const [settled, setSettled] = useState(false);
	useEffect(() => {
		if (containerWidth !== undefined) setSettled(true);
	}, [containerWidth]);
	useEffect(() => {
		if (containerRef) return;
		const view = div.current?.ownerDocument.defaultView;
		if (!view) return;
		const update = () => setWindowWidth(view.innerWidth);
		update();
		view.addEventListener('resize', update);
		return () => view.removeEventListener('resize', update);
	}, [containerRef]);
	const clearHighlightTimer = useCallback(() => {
		if (timer.current !== undefined) clearTimeout(timer.current);
		timer.current = undefined;
	}, []);
	const showHighlight = () => {
		clearHighlightTimer();
		timer.current = setTimeout(() => setHighlight(true), isTouchDevice ? 0 : 350);
	};
	const hideHighlight = () => {
		clearHighlightTimer();
		if (!gesture.current) setHighlight(false);
	};
	const info = (nextWidth: number, height: number, deltaWidth = 0): DraggablePanelResizeInfo => ({
		div,
		divWidth: nextWidth,
		divHeight: height,
		deltaWidth,
	});
	// Cancellation and unmount release capture/listeners and restore the exact selection styles we borrowed.
	const finish = useCallback(
		(notify: boolean) => {
			const active = gesture.current;
			if (!active) return;
			gesture.current = undefined;
			active.release();
			if (!notify) {
				clearHighlightTimer();
				return;
			}
			const finalWidth = Math.min(latest.current.max, Math.max(latest.current.min, active.width));
			setLastWidth(finalWidth);
			setDragWidth(undefined);
			clearHighlightTimer();
			setHighlight(false);
			const update = {
				div,
				divWidth: finalWidth,
				divHeight: div.current?.offsetHeight ?? active.height,
				deltaWidth: 0,
			};
			latest.current.onResize?.(update);
			latest.current.onResizeEnd?.(update);
		},
		[clearHighlightTimer],
	);
	// biome-ignore lint/correctness/useExhaustiveDependencies: finish a gesture when availability, direction, or bounds change.
	useLayoutEffect(() => {
		if (gesture.current) finish(true);
	}, [isClosed, drags, min, max, finish]);
	useEffect(
		() => () => {
			finish(false);
			clearHighlightTimer();
		},
		[finish, clearHighlightTimer],
	);
	const start = (event: React.PointerEvent<HTMLDivElement>) => {
		if (closed || !drags || event.button !== 0 || !event.isPrimary || gesture.current) return;
		event.preventDefault();
		const panel = div.current;
		const rail = event.currentTarget;
		const document = rail.ownerDocument;
		const view = document.defaultView;
		if (!panel || !view) return;
		// Programmatic focus after a prevented pointer-down can retain the browser's keyboard focus ring.
		rail.setAttribute('data-pointer-focus', '');
		rail.focus({ preventScroll: true });
		clearHighlightTimer();
		const root = document.documentElement;
		const previous = { userSelect: root.style.userSelect, webkitUserSelect: root.style.webkitUserSelect };
		const startWidth = panel.offsetWidth;
		const active: Gesture = {
			pointerId: event.pointerId,
			startX: event.clientX,
			startWidth,
			width: startWidth,
			height: panel.offsetHeight,
			release: () => {},
		};
		gesture.current = active;
		const move = (next: PointerEvent) => {
			if (next.pointerId !== active.pointerId) return;
			next.preventDefault();
			const delta = next.clientX - active.startX;
			const nextWidth = active.startWidth + (drags === 'right' ? delta : -delta);
			// Retain the existing stop-at-bounds feel, consistently for either panel edge.
			if (nextWidth < min || nextWidth > max) return;
			active.width = nextWidth;
			panel.style.width = `${nextWidth}px`;
			rail.setAttribute('aria-valuenow', String(nextWidth));
			rail.setAttribute('aria-valuetext', `${Math.round(nextWidth)} pixels`);
			latest.current.onResize?.(info(nextWidth, active.height, delta));
		};
		const end = (next: PointerEvent) => {
			if (next.pointerId === active.pointerId) finish(true);
		};
		const cancel = () => finish(true);
		const handleEscape = (next: KeyboardEvent) => {
			if (next.key === 'Escape') finish(true);
		};
		active.release = () => {
			document.removeEventListener('pointermove', move);
			document.removeEventListener('pointerup', end);
			document.removeEventListener('pointercancel', end);
			rail.removeEventListener('lostpointercapture', cancel);
			view.removeEventListener('blur', cancel);
			view.removeEventListener('keydown', handleEscape);
			if (rail.hasPointerCapture(active.pointerId)) rail.releasePointerCapture(active.pointerId);
			root.style.userSelect = previous.userSelect;
			root.style.webkitUserSelect = previous.webkitUserSelect;
		};
		document.addEventListener('pointermove', move, { passive: false });
		document.addEventListener('pointerup', end);
		document.addEventListener('pointercancel', end);
		rail.addEventListener('lostpointercapture', cancel);
		view.addEventListener('blur', cancel);
		view.addEventListener('keydown', handleEscape);
		root.style.userSelect = 'none';
		root.style.webkitUserSelect = 'none';
		// Synthetic events have no active native pointer to capture; document listeners still make tests/embedders work.
		try {
			rail.setPointerCapture(active.pointerId);
		} catch {
			/* No native active pointer. */
		}
		setDragWidth(startWidth);
		setHighlight(true);
		const update = info(startWidth, active.height);
		latest.current.onResize?.(update);
		latest.current.onResizeStart?.(update);
	};
	const keyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		event.currentTarget.removeAttribute('data-pointer-focus');
		if (!drags || closed || gesture.current || event.altKey || event.ctrlKey || event.metaKey) return;
		const current = width;
		let next: number;
		if (event.key === 'Home') next = min;
		else if (event.key === 'End') next = max;
		else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
			const direction = event.key === 'ArrowRight' ? 1 : -1;
			const step = event.shiftKey ? 50 : 10;
			next = current + direction * step * (drags === 'right' ? 1 : -1);
		} else return;
		event.preventDefault();
		next = Math.min(max, Math.max(min, next));
		if (next === current) return;
		const height = div.current?.offsetHeight ?? 0;
		latest.current.onResize?.(info(current, height));
		latest.current.onResizeStart?.(info(current, height));
		setLastWidth(next);
		latest.current.onResize?.(info(next, height, (next - current) * (drags === 'right' ? 1 : -1)));
		latest.current.onResize?.(info(next, height));
		latest.current.onResizeEnd?.(info(next, height));
	};
	// Width is kept during close/reopen; only relative initial sizing needs a client measurement.
	const getWidth = () => {
		if (isClosed) return 0;
		if (!drags) return '100%';
		if (unresolvedInitial) return '0px';
		return width;
	};
	const getTransition = () => {
		if (dragWidth !== undefined || reducedMotion) return 'none';
		if (!settled && transitionDurationOnInit !== undefined) {
			const duration =
				typeof transitionDurationOnInit === 'number'
					? `${Math.max(0, transitionDurationOnInit)}ms`
					: transitionDurationOnInit;
			return `width ${duration} var(--motion-water)`;
		}
		return 'width var(--motion-water-duration) var(--motion-water)';
	};
	const railWidth = isTouchDevice ? 44 : (resizeHandle?.width ?? 10);
	const offset = isTouchDevice ? -22 : -railWidth / 2;
	const variables = { '--panel-bg': backgroundColor ?? 'transparent' } as React.CSSProperties;
	/* START.DEBUG */
	useTrackRenders(props, 'DraggablePanel');
	/* END.DEBUG */
	return (
		<div
			{...attributes}
			id={panelId}
			ref={div}
			className={`${css.panel}${className ? ` ${className}` : ''}`}
			onContextMenu={(event) => {
				onContextMenu?.(event);
				if (disableOnContext) event.preventDefault();
			}}
			style={{
				...style,
				...variables,
				overflow: 'visible',
				flexShrink: 0,
				width: getWidth(),
				height: '100%',
				maxWidth: drags ? max : 'unset',
				transition: getTransition(),
				borderRight: closed || drags !== 'right' ? 'none' : (borderRight ?? undefined),
				borderLeft: closed || drags !== 'left' ? 'none' : (borderLeft ?? undefined),
			}}
		>
			<div className={css.content} inert={closed || undefined} aria-hidden={closed || undefined}>
				{children}
			</div>
			<div
				ref={handle}
				className={css.rail}
				role="separator"
				aria-orientation="vertical"
				aria-label={resizeHandleLabel.trim() || 'Resize panel'}
				aria-controls={panelId}
				aria-valuemin={min}
				aria-valuemax={max}
				aria-valuenow={width}
				aria-valuetext={`${Math.round(width)} pixels`}
				tabIndex={closed || !drags ? -1 : 0}
				onKeyDown={keyDown}
				onPointerDown={start}
				onPointerEnter={showHighlight}
				onPointerLeave={hideHighlight}
				onFocus={() => {
					clearHighlightTimer();
					setHighlight(true);
				}}
				onBlur={(event) => {
					event.currentTarget.removeAttribute('data-pointer-focus');
					hideHighlight();
				}}
				onPointerCancel={() => finish(true)}
				style={{
					display: closed || !drags ? 'none' : 'flex',
					width: railWidth,
					backgroundColor: resizeHandle?.color ?? 'transparent',
					right: drags === 'right' ? offset : undefined,
					left: drags === 'left' ? offset : undefined,
				}}
			>
				{dragHandle && !closed && <DragHandle {...dragHandleStyle} />}
				<span className={css.highlight} data-active={highlight || undefined} />
			</div>
		</div>
	);
});
export const DragHandle = React.memo((rawProps: Readonly<DragHandleProps>) => {
	const props = resolveColorProps(rawProps);
	const {
		width = 6,
		height = 6,
		radius = corners['corner-round'],
		stroke = 1,
		color = 'var(--core-surface-primary-tint)',
		strokeColor = 'var(--core-outline-secondary)',
	} = props;
	// compose CSS custom properties for the drag handle dimensions and colors
	const cssVars = useMemo(() => {
		return {
			'--drag-handle-width': `${width}px`,
			'--drag-handle-height': `${height}px`,
			'--drag-handle-radius': setStyle(radius),
			'--drag-handle-border': `${stroke}px`,
			'--drag-handle-border-color': `${strokeColor}`,
			'--drag-handle-bg': `${color}`,
		} as React.CSSProperties;
	}, [width, height, radius, stroke, color, strokeColor]);
	return <div className={css.handle} style={cssVars} />;
});
