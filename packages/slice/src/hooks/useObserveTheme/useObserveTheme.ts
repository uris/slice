'use client';

import { useEffect, useState } from 'react';
import { useThemeContext } from '../../providers/ThemeProvider';
import { type SliceTheme, darkTheme, lightTheme } from '../../theme';

function resolveTheme(themeName: string | undefined): SliceTheme {
	if (!themeName || themeName === '' || themeName.includes(lightTheme.name)) {
		return lightTheme;
	}
	return darkTheme;
}

export function useObserveTheme() {
	const { initialTheme } = useThemeContext();

	const [theme, setTheme] = useState<SliceTheme>(() => {
		if (typeof document === 'undefined') return resolveTheme(initialTheme);
		return resolveTheme(document.documentElement.dataset.sliceTheme || initialTheme);
	});

	useEffect(() => {
		// Sync once on mount in case the theme was set before this hook subscribed.
		setTheme(resolveTheme(document.documentElement.dataset.sliceTheme || initialTheme));

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'data-slice-theme') {
					const newTheme = document.documentElement.dataset.sliceTheme;
					setTheme(resolveTheme(newTheme || initialTheme));
				}
			}
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['data-slice-theme'],
		});

		return () => observer.disconnect();
	}, [initialTheme]);

	return theme;
}
