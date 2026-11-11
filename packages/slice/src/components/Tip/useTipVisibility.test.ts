import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { ToolTip } from '../sharedTypes';
import { useTipVisibility } from './useTipVisibility';
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
	cleanup();
	vi.useRealTimers();
});
const tick = (time: number) => act(() => vi.advanceTimersByTime(time));
const first: ToolTip = { payload: { label: 'First' } };
function setup() {
	return renderHook(
		({
			tip,
			enabled,
			showDelay,
			hideDelay,
		}: { tip: ToolTip | null; enabled: boolean; showDelay: number; hideDelay: number }) =>
			useTipVisibility(tip, enabled, showDelay, hideDelay),
		{ initialProps: { tip: first as ToolTip | null, enabled: true, showDelay: 100, hideDelay: 500 } },
	);
}
it('waits before showing and expires from the reveal time', () => {
	const { result } = setup();
	tick(99);
	expect(result.current.visible).toBe(false);
	tick(1);
	expect(result.current.visible).toBe(true);
	tick(499);
	expect(result.current.visible).toBe(true);
	tick(1);
	expect(result.current.visible).toBe(false);
});
it('cancels pending and visible requests immediately without reviving', () => {
	const { result } = setup();
	act(() => result.current.dismiss());
	tick(1000);
	expect(result.current.visible).toBe(false);
});
it('replaces pending requests and honors payload lifetime', () => {
	const { result, rerender } = setup();
	tick(50);
	const tip = { payload: { label: 'Next', duration: 200 } };
	rerender({ tip, enabled: true, showDelay: 100, hideDelay: 500 });
	tick(99);
	expect(result.current.visible).toBe(false);
	tick(1);
	expect(result.current.visible).toBe(true);
	tick(200);
	expect(result.current.visible).toBe(false);
});
it('hides invalid requests and clears their timers', () => {
	const { result, rerender } = setup();
	tick(100);
	rerender({ tip: null, enabled: false, showDelay: 100, hideDelay: 500 });
	expect(result.current.visible).toBe(false);
	tick(1000);
	expect(result.current.visible).toBe(false);
});
it('does not restart the lifetime when rerendered with the same request', () => {
	const { result, rerender } = setup();
	tick(100);
	tick(250);
	rerender({ tip: first, enabled: true, showDelay: 100, hideDelay: 500 });
	tick(250);
	expect(result.current.visible).toBe(false);
});
it('clears all timers when unmounted', () => {
	const { unmount } = setup();
	unmount();
	expect(vi.getTimerCount()).toBe(0);
});
