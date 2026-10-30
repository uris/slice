import { act, renderHook, waitFor } from '@testing-library/react';
import { StrictMode, useState, type PropsWithChildren } from 'react';
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { useInfiniteScroll } from './useInfiniteScroll';

const observers: { emit: () => void; disconnect: ReturnType<typeof vi.fn> }[] = [];
beforeEach(() => {
	observers.length = 0;
	vi.stubGlobal('IntersectionObserver', class {
		disconnect = vi.fn();
		observe = vi.fn();
		constructor(callback: IntersectionObserverCallback) {
			observers.push({ emit: () => callback([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver), disconnect: this.disconnect });
		}
	});
});
afterEach(() => vi.unstubAllGlobals());

function deferred<T>() {
	let resolve!: (value: T) => void;
	const promise = new Promise<T>((done) => { resolve = done; });
	return { promise, resolve };
}

describe('useInfiniteScroll', () => {
	it('infers items and uses caller-owned pagination through a zero-argument loader', async () => {
		const fetchProducts = vi.fn(async (page: number) => [{ id: page }]);
		const { result } = renderHook(() => {
			const [page, setPage] = useState(1);
			const [hasMore, setHasMore] = useState(true);
			const loadProducts = async () => {
				const products = await fetchProducts(page);
				setPage(current => current + 1);
				setHasMore(page < 2);
				return products;
			};
			return useInfiniteScroll(loadProducts, { hasMore });
		});
		expectTypeOf(result.current.items).toEqualTypeOf<{ id: number }[]>();
		await waitFor(() => expect(result.current.items).toEqual([{ id: 1 }]));
		act(() => result.current.sentinelRef(document.createElement('div')));
		await act(async () => observers.at(-1)?.emit());
		expect(result.current.items).toEqual([{ id: 1 }, { id: 2 }]);
		expect(result.current.hasMore).toBe(false);
		await act(() => result.current.loadMore());
		expect(fetchProducts.mock.calls).toEqual([[1], [2]]);
	});

	it('locks concurrent requests and re-observes short lists after each page', async () => {
		const pending = deferred<number[]>();
		const loader = vi.fn().mockResolvedValueOnce([1]).mockReturnValueOnce(pending.promise).mockResolvedValue([3]);
		const { result } = renderHook(() => useInfiniteScroll<number>(loader, { hasMore: true }));
		await waitFor(() => expect(result.current.items).toEqual([1]));
		act(() => result.current.sentinelRef(document.createElement('div')));
		const first = observers.at(-1)!;
		act(() => { first.emit(); first.emit(); void result.current.loadMore(); });
		expect(loader).toHaveBeenCalledTimes(2);
		await act(async () => pending.resolve([2]));
		expect(first.disconnect).toHaveBeenCalled();
		expect(observers.at(-1)).not.toBe(first);
		await act(async () => observers.at(-1)?.emit());
		expect(result.current.items).toEqual([1, 2, 3]);
	});

	it('preserves items after failure and calls the loader again on explicit retry', async () => {
		const loader = vi.fn().mockResolvedValueOnce([1]).mockRejectedValueOnce('offline').mockResolvedValueOnce([2]);
		const { result } = renderHook(() => useInfiniteScroll<number>(loader, { hasMore: true }));
		await waitFor(() => expect(result.current.items).toEqual([1]));
		await act(() => result.current.loadMore());
		expect(result.current.error?.message).toBe('offline');
		expect(result.current.items).toEqual([1]);
		await act(() => result.current.loadMore());
		expect(loader).toHaveBeenCalledTimes(2);
		await act(() => result.current.retry());
		expect(loader.mock.calls).toEqual([[], [], []]);
		expect(result.current.items).toEqual([1, 2]);
		expect(result.current.error).toBeNull();
	});

	it('ignores stale responses after dataset changes', async () => {
		const old = deferred<number[]>();
		const loader = vi.fn().mockReturnValueOnce(old.promise).mockResolvedValue([2]);
		const { result, rerender } = renderHook(({ key }) => useInfiniteScroll<number>(loader, { resetKey: key, hasMore: true }), { initialProps: { key: 'a' } });
		rerender({ key: 'b' });
		await waitFor(() => expect(result.current.items).toEqual([2]));
		await act(async () => old.resolve([1]));
		expect(result.current.items).toEqual([2]);
	});

	it('can reset a finished list and use the latest inline loader without resetting on rerenders', async () => {
		const { result, rerender } = renderHook(({ value }) => useInfiniteScroll(async () => [value], { hasMore: true }), { initialProps: { value: 1 } });
		await waitFor(() => expect(result.current.items).toEqual([1]));
		rerender({ value: 2 });
		expect(result.current.items).toEqual([1]);
		act(() => result.current.reset());
		await waitFor(() => expect(result.current.items).toEqual([2]));
	});

	it('supports disabling and works without IntersectionObserver through manual loading', async () => {
		vi.stubGlobal('IntersectionObserver', undefined);
		const loader = vi.fn(async () => ([1]));
		const { result, rerender } = renderHook(({ enabled }) => useInfiniteScroll(loader, { enabled, hasMore: true }), { initialProps: { enabled: false } });
		await act(() => result.current.loadMore());
		expect(loader).not.toHaveBeenCalled();
		rerender({ enabled: true });
		await waitFor(() => expect(result.current.items).toEqual([1]));
		await act(() => result.current.loadMore());
		expect(result.current.items).toEqual([1, 1]);
	});

	it('survives StrictMode without duplicate items', async () => {
		const loader = vi.fn(async () => ([1]));
		const { result, unmount } = renderHook(() => useInfiniteScroll(loader, { hasMore: true }), { wrapper: ({ children }: PropsWithChildren) => <StrictMode>{children}</StrictMode> });
		await waitFor(() => expect(result.current.items).toEqual([1]));
		expect(result.current.hasMore).toBe(true);
		unmount();
	});

	it('ignores completion after unmount without passing cancellation arguments', async () => {
		const pending = deferred<number[]>();
		const loader = vi.fn(() => pending.promise);
		const { result, unmount } = renderHook(() => useInfiniteScroll(loader, { hasMore: true }));
		unmount();
		await act(async () => pending.resolve([1]));
		expect(result.current.items).toEqual([]);
		expect(loader.mock.calls).toEqual([[]]);
	});

	it('waits for hasMore and restarts with caller state when reset', async () => {
		const { result, rerender } = renderHook(({ hasMore }) => {
			const [page, setPage] = useState(1);
			const hook = useInfiniteScroll(async () => {
				setPage(current => current + 1);
				return [page];
			}, { hasMore });
			return { ...hook, restart: () => { setPage(1); hook.reset(); } };
		}, { initialProps: { hasMore: false } });
		await act(() => result.current.loadMore());
		expect(result.current.items).toEqual([]);
		rerender({ hasMore: true });
		await waitFor(() => expect(result.current.items).toEqual([1]));
		await act(() => result.current.loadMore());
		expect(result.current.items).toEqual([1, 2]);
		act(() => result.current.restart());
		await waitFor(() => expect(result.current.items).toEqual([1]));
	});
});
