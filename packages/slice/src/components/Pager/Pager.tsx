'use client';

import {
	AnimatePresence,
	type Transition,
	motion,
	useAnimationControls,
	useMotionValue,
	usePresence,
	usePresenceData,
} from 'motion/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import css from './Pager.module.css';
import type { PagerProps } from './_types';
import {
	clampPageIndex,
	getDotOpacity,
	getDotScale,
	getPageWindowStart,
	getVisiblePageCount,
	normalizePageCount,
} from './pagerLogic';

type WindowSettings = { start: number; previousStart: number; stride: number; transition: Transition };

type PageButtonProps = {
	index: number;
	pages: number;
	selected: boolean;
	scale: number;
	opacity: number;
	color: string;
	colorHover: string;
	colorOn: string;
	window: WindowSettings;
	onSelect: (index: number) => void;
};

function PageButton({
	index,
	pages,
	selected,
	scale,
	opacity,
	color,
	colorHover,
	colorOn,
	window,
	onSelect,
}: PageButtonProps) {
	const [present, safeToRemove] = usePresence();
	const presenceWindow = usePresenceData() as WindowSettings | undefined;
	const liveWindow = present ? window : (presenceWindow ?? window);
	const reduced = usePrefersReducedMotion();
	const controls = useAnimationControls();
	const dotControls = useAnimationControls();
	const [hovered, setHovered] = useState(false);
	const dotColor = selected ? colorOn : hovered ? colorHover : color;
	const dotScale = useMotionValue(scale);
	const dotOpacity = useMotionValue(opacity);
	const dotBackground = useMotionValue(dotColor);
	useEffect(() => {
		if (reduced) dotControls.set({ scale, opacity, backgroundColor: dotColor });
		else void dotControls.start({ scale, opacity, backgroundColor: dotColor, transition: liveWindow.transition });
		return () => dotControls.stop();
	}, [dotControls, scale, opacity, dotColor, reduced, liveWindow.transition]);
	const position = useMotionValue((index - window.previousStart) * window.stride);
	const x = (index - liveWindow.start) * liveWindow.stride;
	useEffect(() => {
		if (reduced) {
			controls.set({ x });
			if (!present) safeToRemove?.();
			return;
		}
		let active = true;
		void controls.start({ x, transition: liveWindow.transition }).then(() => {
			if (active && !present) safeToRemove?.();
		});
		return () => {
			active = false;
			controls.stop();
		};
	}, [controls, x, reduced, present, safeToRemove, liveWindow.transition]);
	return (
		<motion.button
			type="button"
			className={css.bullet}
			style={{ x: position }}
			initial={{ x: (index - window.previousStart) * window.stride }}
			animate={controls}
			aria-label={`Page ${index + 1} of ${pages}`}
			aria-current={present && selected ? 'page' : undefined}
			aria-hidden={!present || undefined}
			inert={!present || undefined}
			disabled={!present}
			onPointerEnter={() => setHovered(true)}
			onPointerLeave={() => setHovered(false)}
			onClick={() => onSelect(index)}
		>
			<motion.span
				className={css.dot}
				initial={false}
				animate={dotControls}
				style={{ scale: dotScale, opacity: dotOpacity, backgroundColor: dotBackground }}
			/>
		</motion.button>
	);
}

export const Pager = React.memo((rawProps: PagerProps) => {
	const props = resolveColorProps(rawProps);
	const {
		size = 10,
		selectedIndex,
		defaultSelectedIndex = 0,
		color = 'var(--core-text-disabled)',
		colorHover = 'var(--core-text-disabled)',
		colorOn = 'var(--core-text-primary)',
		pages = 2,
		gap = 8,
		scale = 1,
		scaleFactor = 0.8,
		minScale = 0.5,
		opacityScales = false,
		maxVisiblePages,
		showMoreOn,
		transition: transitionOverrides,
		onChange,
		className,
		style,
		...divAttributes
	} = props;
	const themeMotion = useTheme().current.motion;
	const transition = useMemo(
		() => getWaterTransition(themeMotion, transitionOverrides),
		[themeMotion, transitionOverrides],
	);
	const [localIndex, setLocalIndex] = useState(defaultSelectedIndex);
	const pageCount = normalizePageCount(pages);
	const activeIndex = clampPageIndex(selectedIndex ?? localIndex, pageCount);
	const visibleCount = pageCount < 5 ? pageCount : getVisiblePageCount(pageCount, maxVisiblePages);
	const [windowState, setWindowState] = useState(() => ({
		start: Math.max(0, Math.min(pageCount - visibleCount, activeIndex - Math.floor(visibleCount / 2))),
		selected: activeIndex,
	}));
	const windowStart = getPageWindowStart(
		windowState.start,
		windowState.selected,
		activeIndex,
		pageCount,
		visibleCount,
		showMoreOn,
	);
	useEffect(() => {
		setWindowState((previous) =>
			previous.start === windowStart && previous.selected === activeIndex
				? previous
				: { start: windowStart, selected: activeIndex },
		);
	}, [windowStart, activeIndex]);
	const dotSize = Number.isFinite(size) && size > 0 ? size : 10;
	const selectedScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
	const distanceFactor = Number.isFinite(scaleFactor) ? Math.min(1, Math.max(0, scaleFactor)) : 0.8;
	const minimumScale =
		Number.isFinite(minScale) && minScale > 0 ? Math.min(selectedScale, minScale) : Math.min(selectedScale, 0.5);
	const spacing = Number.isFinite(gap) ? Math.max(0, gap) : 8;
	const slotSize = dotSize * selectedScale;
	const window = { start: windowStart, previousStart: windowState.start, stride: slotSize + spacing, transition };
	const cssVars = {
		'--pager-gap': `${spacing}px`,
		'--pager-size': `${dotSize}px`,
		'--pager-slot-size': `${slotSize}px`,
		'--pager-window-width': `${Math.max(0, visibleCount * slotSize + (visibleCount - 1) * spacing)}px`,
		'--pager-window-height': `${pageCount > 0 ? slotSize : 0}px`,
		'--pager-color': color,
		'--pager-colorOn': colorOn,
		'--pager-colorHover': colorHover,
	} as React.CSSProperties;

	/* START.DEBUG */
	useTrackRenders(props, 'Pager');
	/* END.DEBUG */

	return (
		<div
			role="group"
			aria-label="Pages"
			{...divAttributes}
			style={{ ...style, ...cssVars }}
			className={`${css.wrapper}${className ? ` ${className}` : ''}`}
		>
			<div className={css.viewport}>
				<AnimatePresence initial={false} custom={window}>
					{Array.from({ length: visibleCount }, (_, offset) => windowStart + offset).map((pageIndex) => (
						<PageButton
							key={`page-${pageIndex}`}
							index={pageIndex}
							pages={pageCount}
							selected={activeIndex === pageIndex}
							scale={getDotScale(pageIndex, activeIndex, selectedScale, distanceFactor, minimumScale)}
							opacity={opacityScales ? getDotOpacity(pageIndex, activeIndex, distanceFactor) : 1}
							color={color}
							colorHover={colorHover}
							colorOn={colorOn}
							window={window}
							onSelect={(index) => {
								if (activeIndex === index) return;
								if (selectedIndex === undefined) setLocalIndex(index);
								onChange?.(index);
							}}
						/>
					))}
				</AnimatePresence>
			</div>
		</div>
	);
});
