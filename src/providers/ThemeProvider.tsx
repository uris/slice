'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { type SliceTheme, darkTheme, lightTheme } from '../theme';

interface ThemeProviderProps {
	children?: React.ReactNode;
	theme?: string;
	initialTheme?: string;
	initialSystem?: boolean;
	system?: boolean;
	global?: boolean;
}

type ThemeContextValue = {
	initialTheme: string;
	systemTheme: boolean;
	setSystemTheme: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
	initialTheme: darkTheme.name,
	systemTheme: true,
	setSystemTheme: () => undefined,
});

export function useThemeContext() {
	return useContext(ThemeContext);
}

// set up a media query for system theme
function getDarkModeMediaQuery() {
	if (typeof globalThis === 'undefined' || typeof globalThis.matchMedia !== 'function') {
		return null;
	}
	return globalThis.matchMedia('(prefers-color-scheme: dark)');
}

function resolveTheme(theme?: string, system?: boolean): SliceTheme | undefined {
	if (system) return getDarkModeMediaQuery()?.matches ? darkTheme : lightTheme;
	if (theme) return theme.includes('dark') ? darkTheme : lightTheme;

	return undefined;
}

function setDocumentTheme(name: string, system: boolean) {
	if (typeof document === 'undefined') return;
	document.documentElement.dataset.sliceTheme = name;
	document.cookie = `slice-theme=${encodeURIComponent(name)}; path=/; max-age=31536000; samesite=lax`;
	document.cookie = `slice-system-theme=${encodeURIComponent(system)}; path=/; max-age=31536000; samesite=lax`;
}

export function ThemeProvider(props: Readonly<ThemeProviderProps>) {
	const { children, theme, system, global, initialTheme, initialSystem } = props;
	const [systemTheme, setSystemTheme] = useState<boolean>(system ?? initialSystem ?? true);

	// keep local system-theme state aligned with controlled provider props
	useEffect(() => {
		if (system === undefined) return;
		setSystemTheme(system);
	}, [system]);

	// memo provider context value
	const contextValue = useMemo(() => {
		return {
			initialTheme: initialTheme ?? darkTheme.name,
			systemTheme,
			setSystemTheme,
		};
	}, [initialTheme, systemTheme]);

	// sync the explicitly provided theme to the document root
	useEffect(() => {
		if (theme) {
			setSystemTheme(false);
			const newTheme = resolveTheme(theme, false);
			if (!newTheme) return;
			setDocumentTheme(newTheme.name, false);
			return;
		}

		// only seed the DOM from the SSR startup theme when no client theme exists yet
		if (
			initialTheme &&
			!systemTheme &&
			typeof document !== 'undefined' &&
			!document.documentElement.dataset.sliceTheme
		) {
			const newTheme = resolveTheme(initialTheme, false);
			if (!newTheme) return;
			setDocumentTheme(newTheme.name, false);
		}
	}, [theme, initialTheme, systemTheme]);

	// keep the document theme aligned with system preference when enabled
	useEffect(() => {
		if (!systemTheme) return;

		const darkModeMediaQuery = getDarkModeMediaQuery();
		if (!darkModeMediaQuery) return;
		const handleSystemThemeChange = (e: MediaQueryListEvent) => {
			if (systemTheme) {
				const autoTheme = e.matches ? darkTheme : lightTheme;
				setDocumentTheme(autoTheme.name, true);
			}
		};

		// apply the current system theme on mount or when `system` changes
		if (systemTheme) {
			const autoTheme = darkModeMediaQuery.matches ? darkTheme : lightTheme;
			setDocumentTheme(autoTheme.name, true);
		}

		// subscribe to OS theme changes
		darkModeMediaQuery.addEventListener('change', handleSystemThemeChange);

		return () => {
			darkModeMediaQuery.removeEventListener('change', handleSystemThemeChange);
		};
	}, [systemTheme]);

	// optionally mirror the active Slice surface color onto the document body
	useEffect(() => {
		if (!global) {
			if (typeof document === 'undefined') return;
			document.body.classList.remove('slice-global-body');
			return;
		}
		if (typeof document === 'undefined') return;
		document.body.classList.add('slice-global-body');

		return () => {
			document.body.classList.remove('slice-global-body');
		};
	}, [global]);

	return (
		<ThemeContext.Provider value={contextValue}>
			<div data-slice-theme-scope>{children}</div>
		</ThemeContext.Provider>
	);
}
