import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useMDStreamBuffer } from './useMdStreamBuffer';

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

describe('useMDStreamBuffer', () => {
	it('append() without pacing schedules a flush that populates raw', () => {
		const { result } = renderHook(() => useMDStreamBuffer());

		act(() => {
			result.current.append('hello world');
			// MdBuffer schedules its snapshot flush on a requestAnimationFrame
			vi.advanceTimersByTime(50);
		});

		expect(result.current.raw).toBe('hello world');
	});

	it('append() with pacing queues the value and releases it over time', () => {
		const { result } = renderHook(() =>
			useMDStreamBuffer({ paceDelayMs: 100, paceChunkSize: 4 }),
		);

		act(() => {
			result.current.append('abcdefgh');
		});

		// nothing released yet - still queued/pacing
		expect(result.current.pendingCharacters).toBe(8);

		act(() => {
			vi.advanceTimersByTime(150);
		});
		expect(result.current.raw).toBe('abcd');

		act(() => {
			vi.advanceTimersByTime(150);
		});
		expect(result.current.raw).toBe('abcdefgh');
	});

	it('flush() drains any queued pacing value immediately', () => {
		const { result } = renderHook(() =>
			useMDStreamBuffer({ paceDelayMs: 1000, paceChunkSize: 2 }),
		);

		act(() => {
			result.current.append('abcdef');
			result.current.flush();
		});

		expect(result.current.raw).toBe('abcdef');
		expect(result.current.pendingCharacters).toBe(0);
	});

	it('complete() drains queued content and marks the stream complete', () => {
		const { result } = renderHook(() =>
			useMDStreamBuffer({ paceDelayMs: 1000, paceChunkSize: 2 }),
		);

		act(() => {
			result.current.append('abcdef');
			result.current.complete();
		});

		expect(result.current.isComplete).toBe(true);
		expect(result.current.raw).toBe('abcdef');
	});

	it('reset() clears raw, healthy, completion, and pending state', () => {
		const { result } = renderHook(() => useMDStreamBuffer());

		act(() => {
			result.current.append('hello');
			result.current.complete();
		});
		expect(result.current.raw).toBe('hello');

		act(() => {
			result.current.reset();
		});

		expect(result.current.raw).toBe('');
		expect(result.current.healthy).toBe('');
		expect(result.current.isComplete).toBe(false);
		expect(result.current.pendingCharacters).toBe(0);
	});

	it('append() with an empty string is a no-op', () => {
		const { result } = renderHook(() => useMDStreamBuffer());

		act(() => {
			result.current.append('');
		});

		expect(result.current.raw).toBe('');
	});

	it('unmounting disposes the buffer without throwing', () => {
		const { result, unmount } = renderHook(() =>
			useMDStreamBuffer({ paceDelayMs: 100, paceChunkSize: 2 }),
		);

		act(() => {
			result.current.append('abcdef');
		});

		expect(() => unmount()).not.toThrow();
	});
});
