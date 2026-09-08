'use client';

import { type RefObject, useEffect, useMemo, useState } from 'react';

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

export type ResolvedEntries = (Element | null)[];

export type IntersectResult = {
	target: Element;
	isIntersecting: boolean;
	entry: IntersectionObserverEntry | undefined;
};

export const defaultOptions: IntersectOptions = {
	container: null,
	entries: [],
	thresholds: 1,
	margin: 0,
};

// create the list of elements to observe
function resolveEntries(
	entries: IntersectEntry | IntersectEntry[],
): ResolvedEntries {
	const list = Array.isArray(entries) ? entries : [entries];
	const resolved: ResolvedEntries = [];

	for (const entry of list) {
		if (typeof entry === 'string') {
			if (typeof document === 'undefined') continue;
			const elements = document.querySelectorAll(entry);
			for (const element of Array.from(elements)) resolved.push(element);
		} else {
			resolved.push(entry.current);
		}
	}

	return resolved;
}

export function useIntersecting(
	options: IntersectOptions = defaultOptions,
): IntersectResult[] {
	const { container, entries, thresholds: rawThresholds, margin } = options;

	// will hold updated intersection results
	const [results, setResults] = useState<IntersectResult[]>([]);

	// Content-based keys so a fresh array/object literal from the caller
	// doesn't look like a "change" -- only the actual targets/thresholds do.
	const entryList = Array.isArray(entries) ? entries : [entries];
	const entryKey = entryList
		.map((entry) => (typeof entry === 'string' ? `s:${entry}` : 'r'))
		.join('|');
	const thresholdKey = Array.isArray(rawThresholds)
		? rawThresholds.join(',')
		: String(rawThresholds);

	// Resolved once per meaningful change, not once per render. This is the
	// only place that needs to key off entryKey instead of entries directly --
	// downstream, `elements` is a normal, honestly-stable dependency.
	const elements = useMemo(
		() =>
			resolveEntries(entries).filter(
				(element): element is Element => element !== null,
			),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- entryKey stands in for entries
		[entryKey],
	);

	// Same trick for thresholds: it can also arrive as a fresh array literal.
	const thresholds = useMemo(
		() => rawThresholds,
		// eslint-disable-next-line react-hooks/exhaustive-deps -- thresholdKey stands in for rawThresholds
		[thresholdKey],
	);

	useEffect(() => {
		// protect for ssr where no api is present for intersection observer
		if (typeof IntersectionObserver === 'undefined') return;

		// if there are no elements to observe, reset results
		if (elements.length === 0) {
			setResults([]);
			return;
		}

		// set initial result values for each element to observe
		setResults(
			elements.map((target) => ({
				target,
				isIntersecting: false,
				entry: undefined,
			})),
		);

		// create the intersection observer
		const observer = new IntersectionObserver(
			(observedEntries) => {
				setResults((previous) => {
					const next = [...previous];
					for (const entry of observedEntries) {
						const index = next.findIndex(
							(result) => result.target === entry.target,
						);
						const updated: IntersectResult = {
							target: entry.target,
							isIntersecting: entry.isIntersecting,
							entry,
						};
						if (index === -1) next.push(updated);
						else next[index] = updated;
					}
					return next;
				});
			},
			{
				// container is a ref (or null) -- its identity is already stable
				// across renders, so it's safe to depend on directly below.
				root: container?.current ?? null,
				rootMargin: typeof margin === 'number' ? `${margin}px` : margin,
				threshold: thresholds,
			},
		);

		// add each element to the observer
		for (const element of elements) observer.observe(element);

		// disconnect the observer when unmounting
		return () => observer.disconnect();
	}, [elements, thresholds, margin, container]);

	return results;
}
