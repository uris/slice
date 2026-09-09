import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useLastUpdated } from './useLastUpdated';

beforeEach(() => {
	vi.useFakeTimers();
	vi.setSystemTime(new Date('2026-01-15T12:00:00.000Z'));
});

afterEach(() => {
	vi.useRealTimers();
});

describe('useLastUpdated', () => {
	it('returns an empty string when there is no timestamp', () => {
		const { result } = renderHook(() => useLastUpdated(undefined));
		expect(result.current.lastUpdated).toBe('');
	});

	it('reports "Just now" for a very recent timestamp', () => {
		const { result } = renderHook(() =>
			useLastUpdated(new Date().toISOString()),
		);
		expect(result.current.lastUpdated).toBe('Just now');
	});

	it('reports singular and plural minute/hour/day phrasing', () => {
		const minuteAgo = new Date(Date.now() - 60_000).toISOString();
		expect(
			renderHook(() => useLastUpdated(minuteAgo)).result.current.lastUpdated,
		).toBe('1 min. ago');

		const fiveMinutesAgo = new Date(Date.now() - 5 * 60_000).toISOString();
		expect(
			renderHook(() => useLastUpdated(fiveMinutesAgo)).result.current
				.lastUpdated,
		).toBe('5 mins. ago');

		const hourAgo = new Date(Date.now() - 60 * 60_000).toISOString();
		expect(
			renderHook(() => useLastUpdated(hourAgo)).result.current.lastUpdated,
		).toBe('1 hour ago');

		const fiveHoursAgo = new Date(Date.now() - 5 * 60 * 60_000).toISOString();
		expect(
			renderHook(() => useLastUpdated(fiveHoursAgo)).result.current.lastUpdated,
		).toBe('5 hours ago');

		const dayAgo = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
		expect(
			renderHook(() => useLastUpdated(dayAgo)).result.current.lastUpdated,
		).toBe('1 day ago');

		const fiveDaysAgo = new Date(
			Date.now() - 5 * 24 * 60 * 60_000,
		).toISOString();
		expect(
			renderHook(() => useLastUpdated(fiveDaysAgo)).result.current.lastUpdated,
		).toBe('5 days ago');
	});

	it('falls back to a formatted date after 15 days', () => {
		const longAgo = new Date(Date.now() - 20 * 24 * 60 * 60_000);
		const { result } = renderHook(() => useLastUpdated(longAgo.toISOString()));
		expect(result.current.lastUpdated).toBe(
			longAgo.toLocaleDateString('en-US', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
			}),
		);
	});

	it('prepends the label prefix', () => {
		const { result } = renderHook(() =>
			useLastUpdated(new Date().toISOString(), 'Updated: '),
		);
		expect(result.current.lastUpdated).toBe('Updated: Just now');
	});

	it('reports an invalid timestamp', () => {
		const { result } = renderHook(() => useLastUpdated('not-a-date'));
		expect(result.current.lastUpdated).toBe('Invalid date');
	});

	it('refreshes on the configured interval and clears the timer on unmount', () => {
		const start = new Date(Date.now() - 60_000).toISOString();
		const { result, unmount } = renderHook(() => useLastUpdated(start, '', 1));
		expect(result.current.lastUpdated).toBe('1 min. ago');
		expect(result.current.timer).toBe(1);

		act(() => {
			vi.advanceTimersByTime(60_000);
		});
		expect(result.current.lastUpdated).toBe('2 mins. ago');

		const clearSpy = vi.spyOn(globalThis, 'clearInterval');
		unmount();
		expect(clearSpy).toHaveBeenCalled();
	});
});
