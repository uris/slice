'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';

export type IntersectContainer = RefObject<HTMLElement | null> | null;
export type IntersectEntry = RefObject<HTMLElement | null> | string;
export type IntersectMargin = number | string;

export type IntersectOptions = {
	/** Ancestor used as the intersection viewport. `null` (default) means the browser viewport. */
	container: IntersectContainer;
	/** Element(s) to observe: a ref, a CSS selector, or a mix of both. */
	entries: IntersectEntry | IntersectEntry[];
	/** Ratio(s) of visibility at which to fire updates. Mirrors `IntersectionObserverInit.threshold`. */
	thresholds: number | number[];
	/** CSS-margin-like value grown/shrunk around the container. Mirrors `IntersectionObserverInit.rootMargin`. */
	margin: IntersectMargin;
};

export type ResolvedEntries = Element[];

export type IntersectResult = {
	target: Element;
	isIntersecting: boolean;
	entry: IntersectionObserverEntry | undefined;
};

export type IntersectResultList = {
	results: IntersectResult[];
	exited: IntersectResult[];
	entered: IntersectResult[];
};

export const defaultOptions: IntersectOptions = {
	container: null,
	entries: [],
	thresholds: 1,
	margin: 0,
};

// create the list of elements to observe
function resolveEntries(entries: IntersectEntry[]): ResolvedEntries {
	const list = Array.isArray(entries) ? entries : [entries];
	const resolved: ResolvedEntries = [];

	for (const entry of list) {
		if (typeof entry === 'string') {
			if (typeof document === 'undefined') continue;
			const elements = document.querySelectorAll(entry);
			for (const element of Array.from(elements)) resolved.push(element);
		} else if (entry.current) {
			resolved.push(entry.current);
		}
	}

	return resolved;
}

// resolve entries to entry key
export function resolvedElementsKey(entries: IntersectEntry[]): string {
	return entries
		.map((entry) => (typeof entry === 'string' ? `s:${entry}` : 'r'))
		.join('|');
}

// resolve thresholds key
export function resolvedThresholdsKey(thresholds: number[]): string {
	return thresholds.map((threshold) => threshold.toString()).join(',');
}

export function useIntersecting(
	options: IntersectOptions = defaultOptions,
): IntersectResultList {
	const { container, entries, thresholds: rawThresholds, margin } = options;

	// will hold updated intersection results
	const [results, setResults] = useState<IntersectResult[]>([]);

	// will hold items that enter
	const [entered, setEntered] = useState<IntersectResult[]>([]);

	// hold items that leave
	const [exited, setExited] = useState<IntersectResult[]>([]);

	// Imperative mirror of `results`, mutated directly inside the observer
	// callback below. This exists so that callback never needs a setState
	// *updater function* to read the previous value -- reading/writing a ref
	// has no purity requirement, whereas a setResults(prev => ...) updater
	// does (React may invoke it more than once, e.g. in Strict Mode), and
	// mutating outer variables from inside one is a real correctness bug,
	// not just a style nit.
	const resultsRef = useRef<IntersectResult[]>([]);

	// Content-based keys purely to stabilize the effect below -- NOT to cache
	// resolveEntries' result. Refs aren't attached to their DOM node until
	// after commit, so reading ref.current has to happen inside the effect;
	// doing it in a useMemo (which runs during render) would see a stale/null
	// ref on first mount and, for a plain ref target, never re-run again
	// since its key never changes.
	const entryArray = Array.isArray(entries) ? entries : [entries];
	const entryKey = resolvedElementsKey(entryArray);

	const thresholdArray = Array.isArray(rawThresholds)
		? rawThresholds
		: [rawThresholds];
	const thresholdKey = resolvedThresholdsKey(thresholdArray);

	// biome-ignore lint/correctness/useExhaustiveDependencies: entryKey/thresholdKey stand in for entryArray/thresholdArray
	useEffect(() => {
		// protect for ssr where no api is present for intersection observer
		if (typeof IntersectionObserver === 'undefined') return;

		// resolve elements here, post-commit, so ref.current is populated
		const elements = resolveEntries(entryArray);

		// if there are no elements to observe, reset results
		if (elements.length === 0) {
			resultsRef.current = [];
			setResults([]);
			setEntered([]);
			setExited([]);
			return;
		}

		// set initial result values for each element to observe
		const initResults = elements.map((target) => {
			return { target, isIntersecting: false, entry: undefined };
		});
		resultsRef.current = initResults;
		setResults(initResults);

		// create the intersection observer updating results by keeping the same items in order
		const observer = new IntersectionObserver(
			(observedEntries) => {
				const next = [...resultsRef.current];
				const nextEntered: IntersectResult[] = [];
				const nextExited: IntersectResult[] = [];

				for (const entry of observedEntries) {
					const index = next.findIndex(
						(result) => result.target === entry.target,
					);
					const wasIntersecting = index !== -1 && next[index].isIntersecting;
					const updated: IntersectResult = {
						target: entry.target,
						isIntersecting: entry.isIntersecting,
						entry,
					};

					if (index === -1) next.push(updated);
					else next[index] = updated;

					if (wasIntersecting && !entry.isIntersecting) nextExited.push(updated);
					if (!wasIntersecting && entry.isIntersecting) nextEntered.push(updated);
				}

				resultsRef.current = next;
				setResults(next);
				if (nextEntered.length > 0) setEntered(nextEntered);
				if (nextExited.length > 0) setExited(nextExited);
			},
			{
				root: container?.current ?? null,
				rootMargin: typeof margin === 'number' ? `${margin}px` : margin,
				threshold: thresholdArray,
			},
		);

		// add each element to the observer
		for (const element of elements) observer.observe(element);

		// disconnect the observer when unmounting
		return () => observer.disconnect();
	}, [entryKey, thresholdKey, margin, container]);

	return { results, entered, exited };
}
