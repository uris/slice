import { act, cleanup, renderHook } from '@testing-library/react';
import { createElement, StrictMode, useEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useActiveTab } from './useActiveTab';

afterEach(() => {
	cleanup();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('useActiveTab', () => {
	it('reads visibility on mount and follows visibility changes', () => {
		const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
		const { result } = renderHook(() => useActiveTab());
		expect(result.current.isActiveTab).toBe(false);
		visibility.mockReturnValue('visible');
		act(() => document.dispatchEvent(new Event('visibilitychange')));
		expect(result.current.isActiveTab).toBe(true);
		visibility.mockReturnValue('hidden');
		act(() => document.dispatchEvent(new Event('visibilitychange')));
		expect(result.current.isActiveTab).toBe(false);
	});

	it('cleans up listeners, including Strict Mode effect replay', () => {
		vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
		const add = vi.spyOn(document, 'addEventListener');
		const remove = vi.spyOn(document, 'removeEventListener');
		const { result, unmount } = renderHook(() => useActiveTab(), { wrapper: StrictMode });
		expect(result.current.isActiveTab).toBe(true);
		unmount();
		for (const [, listener] of add.mock.calls.filter(([type]) => type === 'visibilitychange')) {
			expect(remove).toHaveBeenCalledWith('visibilitychange', listener);
		}
	});

	it('renders a stable inactive server snapshot without a document', () => {
		vi.stubGlobal('document', undefined);
		function ServerDemo() {
			return JSON.stringify(useActiveTab());
		}
		expect(renderToString(createElement(ServerDemo))).toBe(
			'{&quot;isActiveTab&quot;:false,&quot;isTabFocused&quot;:false,&quot;visibilityState&quot;:&quot;hidden&quot;}',
		);
	});

	it('tracks focus independently from visibility and removes window listeners', () => {
		const focus = vi.spyOn(document, 'hasFocus').mockReturnValue(true);
		const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
		const add = vi.spyOn(window, 'addEventListener');
		const remove = vi.spyOn(window, 'removeEventListener');
		const { result, unmount } = renderHook(() => useActiveTab());

		expect(result.current).toEqual({ isActiveTab: true, isTabFocused: true, visibilityState: 'visible' });
		focus.mockReturnValue(false);
		act(() => window.dispatchEvent(new Event('blur')));
		expect(result.current).toEqual({ isActiveTab: true, isTabFocused: false, visibilityState: 'visible' });
		focus.mockReturnValue(true);
		act(() => window.dispatchEvent(new Event('focus')));
		expect(result.current.isTabFocused).toBe(true);
		visibility.mockReturnValue('hidden');
		focus.mockReturnValue(false);
		act(() => document.dispatchEvent(new Event('visibilitychange')));
		expect(result.current).toEqual({ isActiveTab: false, isTabFocused: false, visibilityState: 'hidden' });

		unmount();
		for (const [type, listener] of add.mock.calls.filter(([type]) => type === 'focus' || type === 'blur')) {
			expect(remove).toHaveBeenCalledWith(type, listener);
		}
	});

	it('keeps the default state when no document is available during effect setup', () => {
		const add = vi.spyOn(document, 'addEventListener');
		const { result, unmount } = renderHook(() => {
			// Simulate a missing document only during effect setup, leaving React's DOM renderer intact.
			useEffect(() => {
				vi.stubGlobal('document', undefined);
			}, []);
			const state = useActiveTab();
			useEffect(() => {
				vi.unstubAllGlobals();
			}, []);
			return state;
		});

		expect(result.current).toEqual({
			isActiveTab: false,
			isTabFocused: false,
			visibilityState: 'hidden',
		});
		expect(add.mock.calls.filter(([type]) => type === 'visibilitychange')).toHaveLength(0);
		expect(() => unmount()).not.toThrow();
	});

	it('preserves the state object when visibility and focus have not changed', () => {
		vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
		vi.spyOn(document, 'hasFocus').mockReturnValue(true);
		const { result } = renderHook(() => useActiveTab());
		const previous = result.current;

		act(() => document.dispatchEvent(new Event('visibilitychange')));
		expect(result.current).toBe(previous);
		act(() => window.dispatchEvent(new Event('focus')));
		expect(result.current).toBe(previous);
	});
});
