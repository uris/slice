'use client';

import { type RefObject, useEffect, useState } from 'react';

export type IntersectContainer = RefObject<HTMLElement | null> | null;
export type IntersectEntry = RefObject<HTMLElement | null> | string;
export type IntersectThreshold = number;
export type IntersectMargin = number | string;

export type IntersectOptions = {
	/** Ancestor used as the intersection viewport. `null` (default) means the browser viewport. */
	container: IntersectContainer;
	/** Element(s) to observe: a ref, a CSS selector, or a mix of both. */
	entries: IntersectEntry | IntersectEntry[];
	/** Ratio(s) of visibility at which to fire updates. Mirrors `IntersectionObserverInit.threshold`. */
	thresholds: IntersectThreshold | IntersectThreshold[];
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

function resolveEntries(entries: IntersectEntry | IntersectEntry[]): ResolvedEntries {
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

/**
 * Track intersection of one or more elements (by ref or CSS selector)
 * against a container, returning the latest intersection state for each
 * resolved target.
 *
 * ```tsx
 * const sentinelRef = useRef<HTMLDivElement>(null);
 * const [result] = useIntersecting({
 *   ...defaultOptions,
 *   entries: sentinelRef,
 *   thresholds: 0.5,
 *   margin: 200,
 * });
 * const isVisible = result?.isIntersecting ?? false;
 * ```
 */
export function useIntersecting(
	options: IntersectOptions = defaultOptions,
): IntersectResult[] {
	const { container, entries, thresholds, margin } = options;

	// Stable dependency keys so the effect doesn't tear down/rebuild the
	// observer just because a new array/ref/object literal was passed in.
	const entryList = Array.isArray(entries) ? entries : [entries];
	const entryKey = entryList
		.map((entry) => (typeof entry === 'string' ? `s:${entry}` : 'r'))
		.join('|');
	const thresholdKey = Array.isArray(thresholds)
		? thresholds.join(',')
		: String(thresholds);
	const containerKey = container ? 'r' : 'none';

	const [results, setResults] = useState<IntersectResult[]>([]);

	useEffect(() => {
		if (typeof IntersectionObserver === 'undefined') return;

		const elements = resolveEntries(entries).filter(
			(element): element is Element => element !== null,
		);

		if (elements.length === 0) {
			setResults([]);
			return;
		}

		setResults(
			elements.map((target) => ({
				target,
				isIntersecting: false,
				entry: undefined,
			})),
		);

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
				root: container?.current ?? null,
				rootMargin: typeof margin === 'number' ? `${margin}px` : margin,
				threshold: thresholds,
			},
		);

		for (const element of elements) observer.observe(element);

		return () => observer.disconnect();
		// entryKey/thresholdKey/containerKey stand in for entries/thresholds/container
		// so the observer only rebuilds when what it's watching actually changes.
	}, [entryKey, thresholdKey, margin, containerKey]);

	return results;
}
