import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { usePopMenu } from './usePopMenu';

function setup({ x = 100, y = 100, width = 200, height = 300, offset, gap = 8 }: {
    x?: number; y?: number; width?: number; height?: number;
    offset?: 'top' | 'bottom' | 'right'; gap?: number;
} = {}) {
    vi.stubGlobal('innerWidth', 800);
    vi.stubGlobal('innerHeight', 600);
    const caller = document.createElement('button');
    const menu = document.createElement('div');
    vi.spyOn(caller, 'getBoundingClientRect').mockReturnValue(new DOMRect(x, y, 50, 40));
    vi.spyOn(menu, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, width, height));
    document.body.append(caller, menu);
    const menuRef = { current: menu };
    const hook = renderHook(() => usePopMenu({ caller, menuRef, offset, gap }));
    return { ...hook, menu };
}

afterEach(() => {
    cleanup();
    document.body.replaceChildren();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('usePopMenu', () => {
    it('places a right menu beside the caller and aligns its top', () => {
        const { result } = setup({ offset: 'right' });
        expect(result.current.coords).toEqual({ x: 158, y: 100 });
        expect(result.current.constraints).toEqual({ maxWidth: 800, maxHeight: 500 });
    });

    it('constrains a right menu to the space below the caller top', () => {
        const { result } = setup({ offset: 'right', y: 550 });
        expect(result.current.coords).toEqual({ x: 158, y: 550 });
        expect(result.current.constraints?.maxHeight).toBe(50);
    });

    it('keeps a right menu within the viewport at the right edge', () => {
        const { result } = setup({ offset: 'right', x: 750 });
        expect(result.current.coords).toEqual({ x: 600, y: 100 });
    });

    it('clamps a right menu when its caller is partly above the viewport', () => {
        const { result } = setup({ offset: 'right', y: -20 });
        expect(result.current.coords).toEqual({ x: 158, y: 0 });
        expect(result.current.constraints?.maxHeight).toBe(600);
    });

    it('defaults to bottom and flips when only the top fits', () => {
        const { result } = setup({ y: 500, height: 200 });
        expect(result.current.coords).toEqual({ x: 100, y: 292 });
        expect(result.current.resolved).toBe(true);
    });

    it('anchors a constrained top menu above the caller', () => {
        const { result } = setup({ y: 300, height: 500, offset: 'top' });
        expect(result.current.coords).toEqual({ x: 100, y: 0 });
        expect(result.current.constraints?.maxHeight).toBe(292);
    });

    it('keeps an oversized bottom menu below the caller', () => {
        const { result } = setup({ height: 900 });
        expect(result.current.coords).toEqual({ x: 100, y: 148 });
        expect(result.current.constraints?.maxHeight).toBe(452);
    });

    it.each([{ x: -20, width: 200, expected: 0 }, { x: 750, width: 200, expected: 600 },
        { x: 100, width: 1000, expected: 0 }])('clamps horizontal placement: $x / $width', ({ x, width, expected }) => {
        const { result } = setup({ x, width });
        expect(result.current.coords?.x).toBe(expected);
        expect(result.current.constraints?.maxWidth).toBe(800);
    });

    it('supports a partly visible caller without negative constraints', () => {
        const { result } = setup({ y: -20, offset: 'top' });
        expect(result.current.coords?.y).toBe(28);
        expect(result.current.constraints?.maxHeight).toBe(572);
    });

    it.each([-100, 600])('does not resolve a caller outside the viewport at %s', (y) => {
        const { result } = setup({ y });
        expect(result.current.resolved).toBe(false);
        expect(result.current.coords).toBeUndefined();
        expect(result.current.constraints).toBeUndefined();
    });

    it('dismisses on a non-bubbling container scroll', () => {
        const container = document.createElement('div');
        document.body.append(container);
        const { result } = setup();
        act(() => container.dispatchEvent(new Event('scroll')));
        expect(result.current.resolved).toBe(false);
        expect(result.current.visible).toBe(true);
        expect(result.current.coords).toEqual({ x: 100, y: 148 });
        act(() => result.current.resetMenu());
        expect(result.current.coords).toBeUndefined();
        expect(result.current.visible).toBe(false);
    });

    it('allows scrolling inside the menu', () => {
        const { result, menu } = setup();
        const content = document.createElement('div');
        menu.append(content);
        act(() => content.dispatchEvent(new Event('scroll')));
        expect(result.current.resolved).toBe(true);
    });

    it('dismisses when clicking non-item menu space', () => {
        const { result, menu } = setup();
        act(() => menu.dispatchEvent(new MouseEvent('click', { bubbles: true })));
        expect(result.current.resolved).toBe(false);
    });

    it('dismisses on window resize', () => {
        const { result } = setup();
        act(() => window.dispatchEvent(new Event('resize')));
        expect(result.current.resolved).toBe(false);
        expect(result.current.constraints).toEqual({ maxHeight: 452, maxWidth: 800 });
        act(() => result.current.resetMenu());
        expect(result.current.constraints).toBeUndefined();
    });
});
