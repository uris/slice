'use client';

import { type RefCallback, useCallback, useEffect, useRef, useState } from 'react';

export type InfiniteScrollLoader<T> = () => Promise<T[]>;

export type UseInfiniteScrollOptions = {
	/** Controlled by the caller; false prevents further requests. */
	hasMore: boolean;
	enabled?: boolean;
	/** Change this value when filters or the underlying dataset change. */
	resetKey?: unknown;
	/** Scroll container for the intersection observer; null uses the browser viewport. */
	root?: Element | Document | null;
	/** Observer margin. Defaults to '0px'; use a positive bottom margin to prefetch. */
	rootMargin?: string;
};

export type UseInfiniteScrollReturn<T> = {
	items: T[];
	isLoading: boolean;
	error: Error | null;
	hasMore: boolean;
	sentinelRef: RefCallback<HTMLElement>;
	loadMore: () => Promise<void>;
	retry: () => Promise<void>;
	reset: () => void;
};

type State<T> = {
	items: T[];
	isLoading: boolean;
	error: Error | null;
	started: boolean;
};

function initialState<T>(): State<T> {
	return { items: [], isLoading: false, error: null, started: false };
}

/** Loads immediately, then appends pages as the sentinel approaches the viewport. */
export function useInfiniteScroll<T>(
	loader: InfiniteScrollLoader<T>,
	options: UseInfiniteScrollOptions,
): UseInfiniteScrollReturn<T> {
	const { enabled = true, hasMore, resetKey, root = null, rootMargin = '0px' } = options;
	const [state, setState] = useState(() => initialState<T>());
	const stateRef = useRef(state);
	const loaderRef = useRef(loader);
	const requestRef = useRef<object | null>(null);
	const mountedRef = useRef(false);
	const [sentinel, setSentinel] = useState<HTMLElement | null>(null);
	const sentinelRef: RefCallback<HTMLElement> = useCallback((node) => setSentinel(node), []);

	useEffect(() => {
		loaderRef.current = loader;
	}, [loader]);

	const update = useCallback((next: State<T>) => {
		stateRef.current = next;
		setState(next);
	}, []);

	const reset = useCallback(() => {
		requestRef.current = null;
		update(initialState<T>());
	}, [update]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: resetKey intentionally identifies a new dataset.
	useEffect(() => {
		mountedRef.current = true;
		reset();
		return () => {
			mountedRef.current = false;
			requestRef.current = null;
		};
	}, [reset, resetKey]);

	const load = useCallback(
		async (retry = false) => {
			const current = stateRef.current;
			if (!mountedRef.current || !enabled || requestRef.current || !hasMore || (current.error && !retry)) return;
			const request = {};
			requestRef.current = request;
			update({ ...current, started: true, isLoading: true, error: null });
			try {
				const items = await loaderRef.current();
				// Reset and unmount invalidate results; cancellation belongs to the caller.
				if (requestRef.current !== request || !mountedRef.current) return;
				update({
					items: [...current.items, ...items],
					isLoading: false,
					error: null,
					started: true,
				});
			} catch (cause) {
				if (requestRef.current !== request || !mountedRef.current) return;
				update({
					...current,
					started: true,
					isLoading: false,
					error: cause instanceof Error ? cause : new Error(String(cause)),
				});
			} finally {
				if (requestRef.current === request) requestRef.current = null;
			}
		},
		[enabled, hasMore, update],
	);

	const loadMore = useCallback(() => load(), [load]);
	const retry = useCallback(() => load(true), [load]);

	useEffect(() => {
		if (!state.started) void loadMore();
	}, [state.started, loadMore]);

	useEffect(() => {
		if (
			!enabled ||
			!sentinel ||
			state.isLoading ||
			state.error ||
			!hasMore ||
			typeof IntersectionObserver === 'undefined'
		)
			return;
		let active = true;
		const observer = new IntersectionObserver(
			(entries) => {
				if (active && entries.some((entry) => entry.isIntersecting)) void loadMore();
			},
			{ root, rootMargin, threshold: 0 },
		);
		observer.observe(sentinel);
		// re-observe after each page to get a fresh geometry check, even if the
		// sentinel never left the viewport while the request was in flight.
		return () => {
			active = false;
			observer.disconnect();
		};
	}, [enabled, hasMore, sentinel, state, root, rootMargin, loadMore]);

	return {
		items: state.items,
		isLoading: state.isLoading,
		error: state.error,
		hasMore,
		sentinelRef,
		loadMore,
		retry,
		reset,
	};
}
