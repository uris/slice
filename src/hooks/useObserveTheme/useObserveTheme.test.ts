import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeProvider } from '../../providers/ThemeProvider';
import { darkTheme, lightTheme } from '../../theme';
import { useObserveTheme } from './useObserveTheme';

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

beforeEach(() => {
	stubMatchMedia(false);
	delete document.documentElement.dataset.sliceTheme;
});

afterEach(() => {
	vi.unstubAllGlobals();
	delete document.documentElement.dataset.sliceTheme;
});

describe('useObserveTheme', () => {
	it('resolves the theme already applied to the document', () => {
		document.documentElement.dataset.sliceTheme = 'darkMode';
		const { result } = renderHook(() => useObserveTheme(), {
			wrapper: wrapper(),
		});

		expect(result.current.name).toBe(darkTheme.name);
	});

	it('falls back to the provider initialTheme when the document has none set', () => {
		const { result } = renderHook(() => useObserveTheme(), {
			wrapper: wrapper({ initialTheme: lightTheme.name }),
		});

		expect(result.current.name).toBe(lightTheme.name);
	});

	it('reacts to a data-slice-theme attribute mutation on the document element', async () => {
		const { result } = renderHook(() => useObserveTheme(), {
			wrapper: wrapper({ initialTheme: lightTheme.name }),
		});

		expect(result.current.name).toBe(lightTheme.name);

		await act(async () => {
			document.documentElement.dataset.sliceTheme = darkTheme.name;
			// MutationObserver callbacks fire asynchronously - give it a tick so
			// the resulting state update lands inside this act() call.
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		expect(result.current.name).toBe(darkTheme.name);
	});
});
