import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rafThrottle } from './rafThrottle';

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe('rafThrottle', () => {
	it('calls the function on the next animation frame', () => {
		const fn = vi.fn();
		const throttled = rafThrottle(fn);

		throttled('a');
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersToNextFrame();
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('a');
	});

	it('collapses calls within the same frame into one call with the latest args', () => {
		const fn = vi.fn();
		const throttled = rafThrottle(fn);

		throttled('a');
		throttled('b');
		throttled('c');
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersToNextFrame();
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('c');
	});

	it('schedules a fresh frame for calls made after one already fired', () => {
		const fn = vi.fn();
		const throttled = rafThrottle(fn);

		throttled('a');
		vi.advanceTimersToNextFrame();
		expect(fn).toHaveBeenCalledTimes(1);

		throttled('b');
		vi.advanceTimersToNextFrame();
		expect(fn).toHaveBeenCalledTimes(2);
		expect(fn).toHaveBeenLastCalledWith('b');
	});

	it('cancel() prevents the pending call from firing', () => {
		const fn = vi.fn();
		const throttled = rafThrottle(fn);

		throttled('a');
		throttled.cancel();
		vi.advanceTimersToNextFrame();

		expect(fn).not.toHaveBeenCalled();
	});

	it('cancel() is a no-op when nothing is pending', () => {
		const fn = vi.fn();
		const throttled = rafThrottle(fn);

		expect(() => throttled.cancel()).not.toThrow();
		expect(fn).not.toHaveBeenCalled();
	});
});
