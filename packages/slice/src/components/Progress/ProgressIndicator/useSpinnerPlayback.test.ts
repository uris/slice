import { act, cleanup, renderHook } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { ProgressIndicatorProps } from './_types';
import { useSpinnerPlayback } from './useSpinnerPlayback';
beforeEach(() => vi.useFakeTimers());
afterEach(() => {
	cleanup();
	vi.useRealTimers();
});
const tick = (ms: number) => act(() => vi.advanceTimersByTime(ms));
function setup(props: ProgressIndicatorProps = {}) {
	const initialProps: ProgressIndicatorProps = { show: true, ...props };
	return renderHook((value) => useSpinnerPlayback(value), { initialProps });
}
it('stops once on expiry without default callback restarts', () => {
	const onStart = vi.fn(),
		onStop = vi.fn();
	const { result, rerender } = setup({ duration: 0.1, onStart, onStop });
	tick(100);
	expect(result.current).toBe(false);
	tick(5000);
	expect(result.current).toBe(false);
	rerender({ show: false, onStart, onStop });
	expect(onStart).toHaveBeenCalledOnce();
	expect(onStop).toHaveBeenCalledOnce();
});
it('does not notify stop on an initially hidden mount', () => {
	const onStart = vi.fn(),
		onStop = vi.fn();
	setup({ show: false, onStart, onStop });
	expect(onStart).not.toHaveBeenCalled();
	expect(onStop).not.toHaveBeenCalled();
});
it('uses latest callbacks without extending a timer', () => {
	const old = vi.fn(),
		next = vi.fn();
	const { rerender } = setup({ duration: 1, onStop: old });
	tick(600);
	rerender({ show: true, duration: 1, onStop: next });
	tick(400);
	expect(old).not.toHaveBeenCalled();
	expect(next).toHaveBeenCalledOnce();
});
it('replays only after a new show cycle, not a duration change after expiry', () => {
	const onStart = vi.fn();
	const { result, rerender } = setup({ duration: 0, onStart });
	tick(0);
	expect(result.current).toBe(false);
	rerender({ show: true, duration: 5, onStart });
	tick(1000);
	expect(result.current).toBe(false);
	rerender({ show: false, onStart });
	rerender({ show: true, onStart });
	expect(result.current).toBe(true);
	expect(onStart).toHaveBeenCalledTimes(2);
});
it('restarts an active deadline on live duration changes and cancels unlimited timers', () => {
	const { result, rerender } = setup({ duration: 1 });
	tick(600);
	rerender({ show: true, duration: 2 });
	tick(1500);
	expect(result.current).toBe(true);
	rerender({ show: true });
	tick(10000);
	expect(result.current).toBe(true);
});
it.each([-1, NaN, Infinity])('treats invalid duration %s as unlimited', (duration) => {
	const { result } = setup({ duration });
	tick(10000);
	expect(result.current).toBe(true);
});
it('survives StrictMode effect replay without duplicated lifecycle callbacks', () => {
	const onStart = vi.fn(),
		onStop = vi.fn();
	const { result } = renderHook(() => useSpinnerPlayback({ show: true, duration: 1, onStart, onStop }), {
		wrapper: StrictMode,
	});
	tick(1000);
	expect(result.current).toBe(false);
	expect(onStart).toHaveBeenCalledOnce();
	expect(onStop).toHaveBeenCalledOnce();
});
it('clears timers on unmount without announcing a stop', () => {
	const onStop = vi.fn();
	const { unmount } = setup({ duration: 1, onStop });
	unmount();
	tick(1000);
	expect(onStop).not.toHaveBeenCalled();
	expect(vi.getTimerCount()).toBe(0);
});

it('does not restart timed playback when callbacks are omitted', () => {
	const { result } = setup({ duration: 0.1 });
	tick(100);
	expect(result.current).toBe(false);
	tick(10000);
	expect(result.current).toBe(false);
	expect(vi.getTimerCount()).toBe(0);
});
