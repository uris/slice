import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useRowWindow } from './_useRowWindow';

// jsdom does not implement ResizeObserver, so stand in a minimal mock -
// useObserveResize reads offsetHeight/offsetWidth directly during its mount
// effect, so we never need to fire this callback for these tests.
class MockResizeObserver implements ResizeObserver {
	constructor(public callback: ResizeObserverCallback) {
		instances.push(this);
	}
	observe = vi.fn();
	unobserve = vi.fn();
	disconnect = vi.fn();
	takeRecords(): ResizeObserverEntry[] {
		return [];
	}
}

let instances: MockResizeObserver[] = [];

function makeWrapper(height: number, width = 800): React.RefObject<HTMLElement | null> {
	const el = document.createElement('div');
	Object.defineProperty(el, 'offsetHeight', { value: height, configurable: true });
	Object.defineProperty(el, 'offsetWidth', { value: width, configurable: true });
	return { current: el };
}

beforeEach(() => {
	instances = [];
	vi.stubGlobal('ResizeObserver', MockResizeObserver);
	vi.useFakeTimers();
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

describe('useRowWindow', () => {
	it('returns the full range untouched when disabled', () => {
		const wrapper = makeWrapper(400);
		const { result } = renderHook(() => useRowWindow(wrapper, 1000, { enabled: false, rowHeight: 40 }));

		expect(result.current.enabled).toBe(false);
		expect(result.current.startIndex).toBe(0);
		expect(result.current.endIndex).toBe(1000);
		expect(result.current.topSpacerHeight).toBe(0);
		expect(result.current.bottomSpacerHeight).toBe(0);
	});

	it('treats a non-positive rowHeight as disabled rather than dividing by zero', () => {
		const wrapper = makeWrapper(400);
		const { result } = renderHook(() => useRowWindow(wrapper, 1000, { enabled: true, rowHeight: 0 }));

		expect(result.current.enabled).toBe(false);
		expect(result.current.endIndex).toBe(1000);
	});

	it('windows to the viewport plus overscan at scrollTop 0', () => {
		const wrapper = makeWrapper(400); // 10 visible rows @ 40px
		const { result } = renderHook(() =>
			useRowWindow(wrapper, 1000, { enabled: true, rowHeight: 40, overscan: 2 }),
		);

		expect(result.current.enabled).toBe(true);
		expect(result.current.startIndex).toBe(0); // clamped, can't go negative
		expect(result.current.endIndex).toBe(12); // 10 visible + 2 overscan
		expect(result.current.topSpacerHeight).toBe(0);
		expect(result.current.bottomSpacerHeight).toBe((1000 - 12) * 40);
	});

	it('shifts the window as scrollTop advances, applying overscan on both edges', () => {
		const wrapper = makeWrapper(400);
		const { result } = renderHook(() =>
			useRowWindow(wrapper, 1000, { enabled: true, rowHeight: 40, overscan: 2 }),
		);

		act(() => {
			result.current.handleScroll(2000); // scrolled to row 50
			vi.advanceTimersToNextFrame();
		});

		expect(result.current.startIndex).toBe(48); // 50 - 2 overscan
		expect(result.current.endIndex).toBe(62); // 50 + 10 visible + 2 overscan
		expect(result.current.topSpacerHeight).toBe(48 * 40);
		expect(result.current.bottomSpacerHeight).toBe((1000 - 62) * 40);
	});

	it('coalesces rapid scroll events within a frame down to the latest position', () => {
		const wrapper = makeWrapper(400);
		const { result } = renderHook(() =>
			useRowWindow(wrapper, 1000, { enabled: true, rowHeight: 40, overscan: 0 }),
		);

		act(() => {
			result.current.handleScroll(400);
			result.current.handleScroll(800);
			result.current.handleScroll(2000); // only this one should stick
			vi.advanceTimersToNextFrame();
		});

		expect(result.current.startIndex).toBe(50);
	});

	it('snaps back to the top when rowCount shrinks under the current scroll position', () => {
		const wrapper = makeWrapper(400);
		const { result, rerender } = renderHook(
			({ rowCount }: { rowCount: number }) =>
				useRowWindow(wrapper, rowCount, { enabled: true, rowHeight: 40, overscan: 2 }),
			{ initialProps: { rowCount: 1000 } },
		);

		act(() => {
			result.current.handleScroll(2000);
			vi.advanceTimersToNextFrame();
		});
		expect(result.current.startIndex).toBe(48);

		// a filter just dropped the dataset to 5 rows - the old scroll position
		// (row 50) no longer exists
		act(() => {
			rerender({ rowCount: 5 });
		});

		expect(result.current.startIndex).toBe(0);
		expect(wrapper.current?.scrollTop).toBe(0);
	});
});
