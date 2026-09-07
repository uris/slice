import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe('debounce', () => {
	it('calls the function once after the delay', () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced('a');
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('a');
	});

	it('collapses rapid calls into a single call with the latest args', () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced('a');
		vi.advanceTimersByTime(50);
		debounced('b');
		vi.advanceTimersByTime(50);
		expect(fn).not.toHaveBeenCalled();

		vi.advanceTimersByTime(50);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('b');
	});

	it('cancel() prevents the pending call from firing', () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced('a');
		debounced.cancel();
		vi.advanceTimersByTime(100);

		expect(fn).not.toHaveBeenCalled();
	});

	it('flush() invokes immediately with the pending args and clears the timer', () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced('a');
		debounced.flush();
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith('a');

		// the pending call was consumed by flush, so it should not fire again
		vi.advanceTimersByTime(100);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	it('flush() is a no-op when nothing is pending', () => {
		const fn = vi.fn();
		const debounced = debounce(fn, 100);

		debounced.flush();
		expect(fn).not.toHaveBeenCalled();
	});
});
