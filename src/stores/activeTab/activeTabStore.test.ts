import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useIsTabFocused, useTabVisibilityState, isTabFocused, tabVisibilityState, activeTabActions, isActiveTab, useActiveTabStore, useInitializeActiveTab, useIsActiveTab } from './activeTabStore';

const disposers: (() => void)[] = [];
function initialize() {
	const dispose = activeTabActions.initialize();
	disposers.push(dispose);
	return dispose;
}

beforeEach(() => {
	useActiveTabStore.setState({ isActiveTab: false, isTabFocused: false, visibilityState: 'hidden' });
});

afterEach(() => {
	cleanup();
	for (const dispose of disposers.splice(0)) dispose();
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe('activeTabStore', () => {
	it('synchronizes visibility for React and imperative subscribers', () => {
		const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
		const subscriber = vi.fn();
		disposers.push(useActiveTabStore.subscribe(subscriber));
		const { result } = renderHook(() => ({ active: useIsActiveTab(), initialize: useInitializeActiveTab() }));
		expect(result.current.initialize).toBe(activeTabActions.initialize);
		act(() => { initialize(); });
		expect(result.current.active).toBe(true);
		expect(isActiveTab()).toBe(true);
		expect(subscriber).toHaveBeenCalledTimes(1);
		act(() => document.dispatchEvent(new Event('visibilitychange')));
		expect(subscriber).toHaveBeenCalledTimes(1);
		visibility.mockReturnValue('hidden');
		act(() => document.dispatchEvent(new Event('visibilitychange')));
		expect(result.current.active).toBe(false);
		expect(isActiveTab()).toBe(false);
		expect(subscriber).toHaveBeenCalledTimes(2);
	});

	it('shares a listener and only stops after the final idempotent cleanup', () => {
		const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
		const add = vi.spyOn(document, 'addEventListener');
		const remove = vi.spyOn(document, 'removeEventListener');
		const first = initialize();
		const second = initialize();
		expect(add.mock.calls.filter(([type]) => type === 'visibilitychange')).toHaveLength(1);
		first();
		first();
		visibility.mockReturnValue('visible');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(isActiveTab()).toBe(true);
		second();
		expect(remove).toHaveBeenCalledWith('visibilitychange', expect.any(Function));
		visibility.mockReturnValue('hidden');
		document.dispatchEvent(new Event('visibilitychange'));
		expect(isActiveTab()).toBe(true);
		initialize();
		expect(isActiveTab()).toBe(false);
	});

	it('can initialize without a document and initialize again in the browser', () => {
		vi.stubGlobal('document', undefined);
		expect(() => initialize()()).not.toThrow();
		expect(isActiveTab()).toBe(false);
		vi.unstubAllGlobals();
		vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
		initialize();
		expect(isActiveTab()).toBe(true);
	});
});

 it('tracks focus independently from visibility and removes window listeners', () => {
    const focus = vi.spyOn(document, 'hasFocus').mockReturnValue(true);
    const visibility = vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('visible');
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const dispose = initialize();
    const { result, unmount } = renderHook(() => ({ isTabFocused: useIsTabFocused(), visibilityState: useTabVisibilityState(), isActiveTab: useIsActiveTab() }));

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
    expect(isTabFocused()).toBe(false);
    expect(tabVisibilityState()).toBe('hidden');
    dispose();

    unmount();
    for (const [type, listener] of add.mock.calls.filter(([type]) => type === 'focus' || type === 'blur')) {
        expect(remove).toHaveBeenCalledWith(type, listener);
    }
 });
