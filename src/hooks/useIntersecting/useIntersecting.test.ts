import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIntersecting } from './useIntersecting';

// jsdom does not implement IntersectionObserver, so we stand in a minimal
// mock that records every instance created and lets tests fire its callback
// with hand-crafted entries.
class MockIntersectionObserver implements IntersectionObserver {
	root: Element | Document | null;
	rootMargin: string;
	thresholds: ReadonlyArray<number>;
	observed = new Set<Element>();
	disconnected = false;

	constructor(
		public callback: IntersectionObserverCallback,
		options?: IntersectionObserverInit,
	) {
		this.root = (options?.root as Element | null) ?? null;
		this.rootMargin =
			typeof options?.rootMargin === 'string' ? options.rootMargin : '';
		this.thresholds = Array.isArray(options?.threshold)
			? options.threshold
			: [options?.threshold ?? 0];
		instances.push(this);
	}

	observe(element: Element) {
		this.observed.add(element);
	}

	unobserve(element: Element) {
		this.observed.delete(element);
	}

	disconnect() {
		this.disconnected = true;
		this.observed.clear();
	}

	takeRecords(): IntersectionObserverEntry[] {
		return [];
	}
}

let instances: MockIntersectionObserver[] = [];

function latestObserver() {
	return instances[instances.length - 1];
}

function makeEntry(
	target: Element,
	isIntersecting: boolean,
): IntersectionObserverEntry {
	return { target, isIntersecting } as IntersectionObserverEntry;
}

beforeEach(() => {
	instances = [];
	vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
});

afterEach(() => {
	vi.unstubAllGlobals();
});

describe('useIntersecting', () => {
	it('returns empty result buckets when there is nothing to observe', () => {
		const { result } = renderHook(() => useIntersecting());

		expect(result.current.results).toEqual([]);
		expect(result.current.onScreen).toEqual([]);
		expect(result.current.offScreen).toEqual([]);
		expect(result.current.entered).toEqual([]);
		expect(result.current.exited).toEqual([]);
		expect(instances).toHaveLength(0);
	});

	it('observes a ref target and seeds results as not intersecting', () => {
		const target = document.createElement('div');
		const ref = { current: target };

		const { result } = renderHook(() =>
			useIntersecting({
				container: null,
				entries: ref,
				thresholds: 1,
				margin: 0,
			}),
		);

		expect(latestObserver().observed.has(target)).toBe(true);
		expect(result.current.results).toEqual([
			{ target, isIntersecting: false, entry: undefined },
		]);
	});

	it('moves a target into onScreen/entered when the observer reports it intersecting', () => {
		const target = document.createElement('div');
		const ref = { current: target };

		const { result } = renderHook(() =>
			useIntersecting({
				container: null,
				entries: ref,
				thresholds: 1,
				margin: 0,
			}),
		);

		act(() => {
			latestObserver().callback([makeEntry(target, true)], latestObserver());
		});

		expect(result.current.onScreen.map((r) => r.target)).toEqual([target]);
		expect(result.current.offScreen).toEqual([]);
		expect(result.current.entered.map((r) => r.target)).toEqual([target]);
		expect(result.current.exited).toEqual([]);
	});

	it('moves a target into offScreen/exited on the next callback once it leaves', () => {
		const target = document.createElement('div');
		const ref = { current: target };

		const { result } = renderHook(() =>
			useIntersecting({
				container: null,
				entries: ref,
				thresholds: 1,
				margin: 0,
			}),
		);

		act(() => {
			latestObserver().callback([makeEntry(target, true)], latestObserver());
		});
		act(() => {
			latestObserver().callback([makeEntry(target, false)], latestObserver());
		});

		expect(result.current.onScreen).toEqual([]);
		expect(result.current.offScreen.map((r) => r.target)).toEqual([target]);
		expect(result.current.exited.map((r) => r.target)).toEqual([target]);
		// `entered`/`exited` only reflect the most recent batch of transitions;
		// a callback with no new entries leaves the last batch in place.
		expect(result.current.entered.map((r) => r.target)).toEqual([target]);
	});

	it('resolves a CSS selector to every matching element', () => {
		const container = document.createElement('div');
		for (let i = 0; i < 3; i++) {
			const item = document.createElement('div');
			item.className = 'list-item';
			container.appendChild(item);
		}
		document.body.appendChild(container);

		const { result } = renderHook(() =>
			useIntersecting({
				container: null,
				entries: '.list-item',
				thresholds: 1,
				margin: 0,
			}),
		);

		expect(latestObserver().observed.size).toBe(3);
		expect(result.current.results).toHaveLength(3);

		document.body.removeChild(container);
	});

	it('disconnects the observer on unmount', () => {
		const target = document.createElement('div');
		const ref = { current: target };

		const { unmount } = renderHook(() =>
			useIntersecting({
				container: null,
				entries: ref,
				thresholds: 1,
				margin: 0,
			}),
		);

		const observer = latestObserver();
		unmount();

		expect(observer.disconnected).toBe(true);
	});
});
