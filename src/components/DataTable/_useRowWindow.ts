import type React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useObserveResize } from '../../hooks';
import { rafThrottle } from '../../utils';

export type RowWindow = {
	/* false when virtualization is off (or misconfigured) - startIndex/endIndex then cover every row */
	enabled: boolean;
	/* first row index that should be mounted (inclusive) */
	startIndex: number;
	/* row index to stop mounting at (exclusive) */
	endIndex: number;
	/* px height of the leading spacer row standing in for every row above startIndex */
	topSpacerHeight: number;
	/* px height of the trailing spacer row standing in for every row below endIndex */
	bottomSpacerHeight: number;
	/* feed the scrollable wrapper's live scrollTop in on every scroll event */
	handleScroll: (scrollTop: number) => void;
};

const DEFAULT_OVERSCAN = 25;

export type UseRowWindowOptions = {
	/* master switch - when false this hook is a complete no-op (no ResizeObserver, full range returned) */
	enabled: boolean;
	/* fixed px height every rendered row is expected to have. Must be > 0 for windowing to activate. */
	rowHeight: number;
	/* extra rows kept mounted past each edge of the viewport. Defaults to 6. */
	overscan?: number;
};

/*
 * Computes which slice of `rowCount` rows should actually be mounted, given
 * a fixed `rowHeight` and the live height of the scrolling wrapper. Only the
 * rows within the viewport (plus `overscan` on each side) fall inside
 * [startIndex, endIndex) - the caller renders that slice plus two spacer
 * rows sized to topSpacerHeight/bottomSpacerHeight, so the table's total
 * scrollable height (and the native scrollbar) stay correct even though
 * most rows never mount.
 *
 * scrollTop is tracked internally and only ever committed to state once per
 * animation frame (via rafThrottle), so a fast scroll or trackpad fling
 * doesn't force a re-render per native scroll event.
 *
 * If a filter/sort shrinks `rowCount` while scrolled past the new end, the
 * previous scroll position no longer points anywhere sensible - this hook
 * snaps both its own state and the real DOM scrollTop back to a valid
 * position rather than rendering an empty slice.
 */
export function useRowWindow(
	wrapperRef: React.RefObject<HTMLElement | null>,
	rowCount: number,
	options: UseRowWindowOptions,
): RowWindow {
	const { enabled, rowHeight, overscan = DEFAULT_OVERSCAN } = options;

	// only observes while enabled - useObserveResize no-ops on an undefined ref
	const viewport = useObserveResize(enabled ? wrapperRef : undefined, { ignore: 'width' });
	const [scrollTop, setScrollTop] = useState(0);

	const throttledSetScrollTop = useMemo(() => rafThrottle((value: number) => setScrollTop(value)), []);

	useEffect(() => {
		return () => throttledSetScrollTop.cancel();
	}, [throttledSetScrollTop]);

	const handleScroll = useCallback(
		(nextScrollTop: number) => {
			if (!enabled) return;
			throttledSetScrollTop(nextScrollTop);
		},
		[enabled, throttledSetScrollTop],
	);

	// snap back to a valid scroll position when the underlying data shrinks
	// (a filter/sort change) out from under the current scrollTop
	useEffect(() => {
		if (!enabled) return;
		const maxScrollTop = Math.max(0, rowCount * rowHeight - (viewport.height || 0));
		setScrollTop((prev) => {
			if (prev <= maxScrollTop) return prev;
			if (wrapperRef.current) wrapperRef.current.scrollTop = 0;
			return 0;
		});
	}, [enabled, rowCount, rowHeight, viewport.height, wrapperRef]);

	return useMemo<RowWindow>(() => {
		if (!enabled || rowHeight <= 0) {
			return {
				enabled: false,
				startIndex: 0,
				endIndex: rowCount,
				topSpacerHeight: 0,
				bottomSpacerHeight: 0,
				handleScroll,
			};
		}

		const viewportHeight = viewport.height || 0;
		const visibleCount = Math.ceil(viewportHeight / rowHeight);
		const firstVisible = Math.floor(scrollTop / rowHeight);

		const startIndex = Math.max(0, firstVisible - overscan);
		const endIndex = Math.min(rowCount, firstVisible + visibleCount + overscan);

		return {
			enabled: true,
			startIndex,
			endIndex,
			topSpacerHeight: startIndex * rowHeight,
			bottomSpacerHeight: Math.max(0, rowCount - endIndex) * rowHeight,
			handleScroll,
		};
	}, [enabled, rowHeight, overscan, rowCount, viewport.height, scrollTop, handleScroll]);
}
