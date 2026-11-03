import { expect, it } from 'vitest';
import { clampPageIndex, getDotOpacity, getDotScale, getPageWindowStart, getVisiblePageCount, normalizePageCount } from './pagerLogic';

it('normalizes counts and clamps selection to available pages', () => {
	expect(normalizePageCount(4.9)).toBe(4);
	for (const count of [0, -3, Number.NaN, Number.POSITIVE_INFINITY]) expect(normalizePageCount(count)).toBe(0);
	expect(clampPageIndex(12, 5)).toBe(4);
	expect(clampPageIndex(-2, 5)).toBe(0);
	expect(clampPageIndex(2.8, 5)).toBe(2);
	expect(clampPageIndex(Number.NaN, 5)).toBe(0);
	expect(clampPageIndex(3, 0)).toBe(0);
});

it('scales by distance in both directions and stops at the minimum', () => {
	expect(getDotScale(3, 3, 1.5, 0.5, 0.4)).toBe(1.5);
	expect(getDotScale(2, 3, 1.5, 0.5, 0.4)).toBe(0.75);
	expect(getDotScale(4, 3, 1.5, 0.5, 0.4)).toBe(0.75);
	expect(getDotScale(5, 3, 1.5, 0.5, 0.4)).toBe(0.4);
	expect(getDotScale(30, 3, 1.5, 0.5, 0.4)).toBe(0.4);
});

it('uses the second-to-last/second-to-first trigger by default and keeps directional lookahead and clamps windows at both ends', () => {
    expect(getVisiblePageCount(20, 5)).toBe(5);
    expect(getVisiblePageCount(3, 5)).toBe(3);
    expect(getVisiblePageCount(20, 0)).toBe(20);
    expect(getPageWindowStart(0, 0, 2, 20, 5)).toBe(0);
    expect(getPageWindowStart(0, 2, 3, 20, 5)).toBe(1);
    expect(getPageWindowStart(1, 3, 4, 20, 5)).toBe(2);
    expect(getPageWindowStart(2, 4, 3, 20, 5)).toBe(1);
    expect(getPageWindowStart(1, 3, 2, 20, 5)).toBe(0);
    expect(getPageWindowStart(0, 0, 19, 20, 5)).toBe(15);
    expect(getPageWindowStart(15, 19, 0, 20, 5)).toBe(0);
    expect(getPageWindowStart(15, 19, 2, 3, 3)).toBe(0);
    expect(getPageWindowStart(0, 0, 6, 20, 1)).toBe(6);
});

it('supports a one-based custom trigger and falls back when it is outside the visible window', () => {
    expect(getPageWindowStart(0, 0, 1, 20, 5, 3)).toBe(0);
    expect(getPageWindowStart(0, 1, 2, 20, 5, 3)).toBe(0);
    expect(getPageWindowStart(5, 9, 7, 20, 5, 3)).toBe(5);
    for (const trigger of [0, -1, 5, 99, 2.5, Number.NaN]) {
        expect(getPageWindowStart(0, 2, 3, 20, 5, trigger)).toBe(1);
    }
    expect(getPageWindowStart(1, 2, 3, 4, 2, 1)).toBe(0);
});

it('reveals enough pages to center selection, rather than always shifting one position', () => {
    // Seven visible pages: selecting page 6 brings in two pages to put it in slot 4.
    expect(getPageWindowStart(0, 4, 5, 20, 7)).toBe(2);
    // Going backward mirrors the trigger and reveals two earlier pages.
    expect(getPageWindowStart(5, 7, 6, 20, 7)).toBe(3);
    // Custom triggers and external jumps also center the selected page.
    expect(getPageWindowStart(0, 0, 4, 20, 7, 5)).toBe(1);
    expect(getPageWindowStart(0, 0, 12, 20, 7)).toBe(9);
    // Near the endpoints, reveal only what remains without leaving empty slots.
    expect(getPageWindowStart(10, 14, 18, 20, 7)).toBe(13);
    expect(getPageWindowStart(5, 7, 1, 20, 7)).toBe(0);
    // An even-sized window uses the same right-middle slot as initial positioning.
    expect(getPageWindowStart(0, 3, 4, 20, 6)).toBe(1);
});

it('fades opacity by the distance factor without inheriting the minimum size floor', () => {
    expect(getDotOpacity(3, 3, 0.5)).toBe(1);
    expect(getDotOpacity(2, 3, 0.5)).toBe(0.5);
    expect(getDotOpacity(4, 3, 0.5)).toBe(0.5);
    expect(getDotOpacity(6, 3, 0.5)).toBe(0.125);
    expect(getDotOpacity(10, 3, 1)).toBe(1);
    expect(getDotOpacity(3, 3, 0)).toBe(1);
    expect(getDotOpacity(4, 3, 0)).toBe(0);
});
