'use client';

import { useCallback, useSyncExternalStore } from 'react';
import { useThemeContext } from '../../providers/ThemeProvider';
import { type SliceTheme, darkTheme, lightTheme } from '../../theme';

function resolveTheme(themeName: string | undefined): SliceTheme {
	if (!themeName || themeName === '' || themeName.includes(lightTheme.name)) {
		return lightTheme;
	}
	return darkTheme;
}

function subscribe(onChange: () => void) {
	const observer = new MutationObserver(onChange);
	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ['data-slice-theme'],
	});
	return () => observer.disconnect();
}

export function useObserveTheme() {
	const { initialTheme } = useThemeContext();
	const getSnapshot = useCallback(
		() => resolveTheme(document.documentElement.dataset.sliceTheme || initialTheme),
		[initialTheme],
	);
	// Hydration must use the same snapshot as SSR, even if the bootstrap script
	// has already applied a different saved theme to the document for first paint.
	const getServerSnapshot = useCallback(() => resolveTheme(initialTheme), [initialTheme]);
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
