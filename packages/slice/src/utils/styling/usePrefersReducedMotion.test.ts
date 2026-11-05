import { act, cleanup, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, expect, it, vi } from 'vitest';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('tracks live preference changes and releases its subscription', () => {
    let matches = false;
    const listeners = new Set<() => void>();
    vi.stubGlobal('matchMedia', () => ({
        get matches() { return matches; },
        addEventListener: (_: string, listener: () => void) => listeners.add(listener),
        removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
    }));
    const { result, unmount } = renderHook(usePrefersReducedMotion);
    expect(result.current).toBe(false);
    act(() => { matches = true; for (const listener of listeners) listener(); });
    expect(result.current).toBe(true);
    act(() => { matches = false; for (const listener of listeners) listener(); });
    expect(result.current).toBe(false);
    unmount();
    expect(listeners.size).toBe(0);
});

it('works when matchMedia is unavailable', () => {
    vi.stubGlobal('matchMedia', undefined);
    const { result } = renderHook(usePrefersReducedMotion);
    expect(result.current).toBe(false);
});

it('provides a stable server snapshot', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    function ServerState() { return String(usePrefersReducedMotion()); }
    expect(renderToString(createElement(ServerState))).toBe('false');
});
