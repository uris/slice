import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { ToolTip } from '../../components/sharedTypes';
import { useToolTip } from './useToolTip';
let anchor: HTMLButtonElement, element: HTMLDivElement, frame: FrameRequestCallback;
let anchorRect: DOMRect, tipRect: DOMRect;
const rect = (left: number, top: number, width: number, height: number) =>
	({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON() {} }) as DOMRect;
beforeEach(() => {
	anchor = document.createElement('button');
	element = document.createElement('div');
	document.body.append(anchor, element);
	anchorRect = rect(200, 100, 80, 30);
	tipRect = rect(0, 0, 100, 40);
	vi.spyOn(anchor, 'getBoundingClientRect').mockImplementation(() => anchorRect);
	vi.spyOn(element, 'getBoundingClientRect').mockImplementation(() => tipRect);
	vi.stubGlobal('innerWidth', 1000);
	vi.stubGlobal('innerHeight', 800);
	vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
		frame = callback;
		return 1;
	});
	vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => {});
});
afterEach(() => {
	cleanup();
	document.body.replaceChildren();
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});
function setup(tip: ToolTip | null = { ref: { current: anchor } }) {
	const ref = { current: element };
	return renderHook(() => useToolTip(tip, ref));
}
it('uses undefined for missing requests and missing targets', () => {
	expect(setup(null).result.current).toBeUndefined();
	expect(setup({ ref: { current: null } }).result.current).toBeUndefined();
});
it('centers below the anchor', () => {
	expect(setup().result.current).toEqual({ x: 190, y: 140 });
});
it('clamps both viewport edges and flips above', () => {
	anchorRect = rect(950, 760, 20, 30);
	expect(setup().result.current).toEqual({ x: 890, y: 710 });
});
it('clamps oversized content and offscreen anchor positions', () => {
	anchorRect = rect(-100, -50, 20, 10);
	tipRect = rect(0, 0, 1200, 900);
	expect(setup().result.current).toEqual({ x: 10, y: 10 });
});
it('tracks layout movement without a new request and keeps equal coordinate identity', () => {
	const { result } = setup();
	const original = result.current;
	act(() => frame(0));
	expect(result.current).toBe(original);
	anchorRect = rect(300, 200, 80, 30);
	act(() => frame(1));
	expect(result.current).toEqual({ x: 290, y: 240 });
});
it('updates scrolling and resizing and stops after unmount', () => {
	const { result, unmount } = setup();
	anchorRect = rect(50, 60, 80, 30);
	act(() => window.dispatchEvent(new Event('scroll')));
	expect(result.current).toEqual({ x: 40, y: 100 });
	tipRect = rect(0, 0, 200, 40);
	act(() => window.dispatchEvent(new Event('resize')));
	expect(result.current?.x).toBe(10);
	unmount();
	expect(window.cancelAnimationFrame).toHaveBeenCalled();
});
it('hides when the anchor is removed', () => {
	const { result } = setup();
	anchor.remove();
	act(() => frame(0));
	expect(result.current).toBeUndefined();
});
