import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDoubleClick } from './useDoubleClick';

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe('useDoubleClick', () => {
	it('fires onClick after the delay when clicked once', () => {
		const onClick = vi.fn();
		const onDblClick = vi.fn();
		const { result } = renderHook(() => useDoubleClick(onClick, onDblClick));
		const [didClick] = result.current;

		didClick('payload');
		expect(onClick).not.toHaveBeenCalled();

		vi.advanceTimersByTime(200);
		expect(onClick).toHaveBeenCalledWith('payload');
		expect(onDblClick).not.toHaveBeenCalled();
	});

	it('fires onDblClick immediately and cancels the pending onClick', () => {
		const onClick = vi.fn();
		const onDblClick = vi.fn();
		const { result } = renderHook(() => useDoubleClick(onClick, onDblClick));
		const [didClick, didDblClick] = result.current;

		didClick('single');
		didDblClick('double');

		expect(onDblClick).toHaveBeenCalledWith('double');

		vi.advanceTimersByTime(200);
		expect(onClick).not.toHaveBeenCalled();
	});

	it('debounces rapid clicks so onClick only fires once', () => {
		const onClick = vi.fn();
		const onDblClick = vi.fn();
		const { result } = renderHook(() => useDoubleClick(onClick, onDblClick));
		const [didClick] = result.current;

		didClick('a');
		vi.advanceTimersByTime(100);
		didClick('b');
		vi.advanceTimersByTime(100);
		expect(onClick).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(onClick).toHaveBeenCalledWith('b');
	});

	it('respects a custom delay', () => {
		const onClick = vi.fn();
		const onDblClick = vi.fn();
		const { result } = renderHook(() =>
			useDoubleClick(onClick, onDblClick, 500),
		);
		const [didClick] = result.current;

		didClick('payload');
		vi.advanceTimersByTime(200);
		expect(onClick).not.toHaveBeenCalled();

		vi.advanceTimersByTime(300);
		expect(onClick).toHaveBeenCalledWith('payload');
	});

	it('the returned cleanup function cancels a pending click', () => {
		const onClick = vi.fn();
		const onDblClick = vi.fn();
		const { result } = renderHook(() => useDoubleClick(onClick, onDblClick));
		const [didClick] = result.current;

		const cleanup = didClick('payload');
		cleanup();

		vi.advanceTimersByTime(200);
		expect(onClick).not.toHaveBeenCalled();
	});

	it('calling the cleanup function when there is no pending timer is a no-op', () => {
		const onClick = vi.fn();
		const onDblClick = vi.fn();
		const { result } = renderHook(() => useDoubleClick(onClick, onDblClick));
		const [didClick] = result.current;

		const cleanup = didClick('payload');
		cleanup();
		// timer.current is already null at this point (cleared above) - calling
		// cleanup a second time exercises the `if (timer.current)` false branch
		expect(() => cleanup()).not.toThrow();

		vi.advanceTimersByTime(200);
		expect(onClick).not.toHaveBeenCalled();
	});

	it('didDblClick with no pending click still fires onDblClick (no timer to clear)', () => {
		const onClick = vi.fn();
		const onDblClick = vi.fn();
		const { result } = renderHook(() => useDoubleClick(onClick, onDblClick));
		const [, didDblClick] = result.current;

		// no prior didClick() call, so timer.current is null - exercises
		// didDblClick's `if (timer.current)` false branch
		didDblClick('double');

		expect(onDblClick).toHaveBeenCalledWith('double');
		expect(onClick).not.toHaveBeenCalled();
	});
});
