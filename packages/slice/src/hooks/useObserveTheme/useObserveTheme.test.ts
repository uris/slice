import { act, renderHook } from '@testing-library/react';
import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
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


describe('theme hydration', () => {
 it.each([
  [darkTheme.name, lightTheme.name],
  [lightTheme.name, darkTheme.name],
 ])('hydrates %s markup before observing saved %s', async (initialTheme, savedTheme) => {
  function Probe() {
   const theme = useObserveTheme();
   return createElement('div', { 'data-theme': theme.name }, theme.name);
  }
  const tree = createElement(ThemeProvider, { initialTheme, initialSystem: false }, createElement(Probe));
  const container = document.createElement('div');
  container.innerHTML = renderToString(tree);
  expect(container.textContent).toBe(initialTheme);
  document.body.append(container);
  document.documentElement.dataset.sliceTheme = savedTheme;
  const recoverableError = vi.fn();
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
  let root: ReturnType<typeof hydrateRoot> | undefined;
  try {
   await act(async () => {
    root = hydrateRoot(container, tree, { onRecoverableError: recoverableError });
   });
   expect(container.textContent).toBe(savedTheme);
   expect(container.querySelector('[data-theme]')?.getAttribute('data-theme')).toBe(savedTheme);
   expect(document.documentElement.dataset.sliceTheme).toBe(savedTheme);
   expect(recoverableError).not.toHaveBeenCalled();
   expect(consoleError).not.toHaveBeenCalled();
  } finally {
   await act(async () => root?.unmount());
   container.remove();
   consoleError.mockRestore();
  }
 });
});
