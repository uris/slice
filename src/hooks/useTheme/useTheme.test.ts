import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../providers/ThemeProvider';
import { darkTheme, lightTheme } from '../../theme';
import { useTheme } from './useTheme';

function stubMatchMedia(matches = false) {
	vi.stubGlobal(
		'matchMedia',
		vi.fn().mockReturnValue({
			matches,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		}),
	);
}

function wrapper(props: { initialTheme?: string; system?: boolean } = {}) {
	return ({ children }: { children?: React.ReactNode }) =>
		createElement(ThemeProvider, { system: false, ...props }, children);
}

// set()/toggle() mutate the document dataset, which useObserveTheme picks up
// via a MutationObserver whose callback fires asynchronously. Flush a tick
// inside the same act() call so the follow-up state update is captured.
async function actAndFlush(callback: () => void) {
	await act(async () => {
		callback();
		await new Promise((resolve) => setTimeout(resolve, 0));
	});
}

beforeEach(() => {
	stubMatchMedia(false);
	delete document.documentElement.dataset.sliceTheme;
});

afterEach(() => {
	vi.unstubAllGlobals();
	delete document.documentElement.dataset.sliceTheme;
});

describe('useTheme', () => {
	it('reports the initial theme and isDark flag', () => {
		const { result } = renderHook(() => useTheme(), {
			wrapper: wrapper({ initialTheme: lightTheme.name }),
		});

		expect(result.current.current.name).toBe(lightTheme.name);
		expect(result.current.isDark).toBe(false);
		expect(result.current.darkTheme).toBe(darkTheme);
		expect(result.current.lightTheme).toBe(lightTheme);
	});

	it('set() applies a theme by SliceTheme object and updates the document', async () => {
		const { result } = renderHook(() => useTheme(), {
			wrapper: wrapper({ initialTheme: lightTheme.name }),
		});

		await actAndFlush(() => result.current.set(darkTheme));

		expect(document.documentElement.dataset.sliceTheme).toBe(darkTheme.name);
	});

	it('set() applies a theme by name', async () => {
		const { result } = renderHook(() => useTheme(), {
			wrapper: wrapper({ initialTheme: lightTheme.name }),
		});

		await actAndFlush(() => result.current.set(darkTheme.name));

		expect(document.documentElement.dataset.sliceTheme).toBe(darkTheme.name);
	});

	it('set("system") resolves from the OS preference', async () => {
		stubMatchMedia(true); // system prefers dark
		const { result } = renderHook(() => useTheme(), {
			wrapper: wrapper({ initialTheme: lightTheme.name }),
		});

		await actAndFlush(() => result.current.set('system'));

		expect(result.current.systemTheme).toBe(true);
		expect(document.documentElement.dataset.sliceTheme).toBe(darkTheme.name);
	});

	it('toggle() flips between light and dark', async () => {
		const { result } = renderHook(() => useTheme(), {
			wrapper: wrapper({ initialTheme: lightTheme.name }),
		});

		expect(result.current.current.name).toBe(lightTheme.name);

		await actAndFlush(() => result.current.toggle());

		expect(document.documentElement.dataset.sliceTheme).toBe(darkTheme.name);
	});
});
