import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useLocalStore } from './useLocalStore';

beforeEach(() => {
	localStorage.clear();
});

afterEach(() => {
	localStorage.clear();
});

describe('useLocalStore', () => {
	it('initializes and persists the fallback value when nothing is stored', () => {
		const { result } = renderHook(() => useLocalStore('greeting', 'hello'));
		const [item] = result.current;

		expect(item).toBe('hello');
		expect(localStorage.getItem('greeting')).toBe(JSON.stringify('hello'));
	});

	it('reads an existing stored value instead of the fallback', () => {
		localStorage.setItem('count', JSON.stringify(42));
		const { result } = renderHook(() => useLocalStore('count', 0));

		expect(result.current[0]).toBe(42);
	});

	it('falls back to the provided value when stored JSON is corrupt', () => {
		localStorage.setItem('broken', 'not-json{');
		const { result } = renderHook(() => useLocalStore('broken', 'fallback'));

		expect(result.current[0]).toBe('fallback');
	});

	it('updateItem writes to storage, updates state, and reports hydrated', () => {
		const { result } = renderHook(() => useLocalStore('theme', 'light'));

		expect(result.current[2]).toBe(true);

		act(() => {
			result.current[1]('dark');
		});

		expect(result.current[0]).toBe('dark');
		expect(localStorage.getItem('theme')).toBe(JSON.stringify('dark'));
	});

	it('re-reads storage when the key changes', () => {
		localStorage.setItem('a', JSON.stringify('valueA'));
		localStorage.setItem('b', JSON.stringify('valueB'));

		const { result, rerender } = renderHook(
			({ key }) => useLocalStore(key, 'fallback'),
			{ initialProps: { key: 'a' } },
		);
		expect(result.current[0]).toBe('valueA');

		rerender({ key: 'b' });
		expect(result.current[0]).toBe('valueB');
	});
});
