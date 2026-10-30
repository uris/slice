export type SliceThemeName = 'lightMode' | 'darkMode';

type ResolveInitialThemeOptions = {
	theme?: string | null;
	systemTheme?: boolean;
	activeTheme?: string | null;
	fallbackTheme?: SliceThemeName;
};

function normalizeThemeName(theme?: string | null): SliceThemeName | undefined {
	if (!theme) return undefined;
	return theme.includes('lightMode') ? 'lightMode' : 'darkMode';
}

function resolveSystem(system?: boolean): boolean {
	if (system === undefined) return true;
	return system;
}

/**
 * Resolve the startup Slice theme from an explicit theme value, cookie value,
 * or fallback theme in that order. Resolves a system to true if undefined.
 */
export function resolveInitialTheme(options: ResolveInitialThemeOptions = {}): {
	initialTheme: SliceThemeName;
	initialSystem: boolean;
} {
	const { theme, activeTheme, systemTheme, fallbackTheme = 'darkMode' } = options;

	return {
		initialTheme: normalizeThemeName(theme) ?? normalizeThemeName(activeTheme) ?? fallbackTheme,
		initialSystem: resolveSystem(systemTheme),
	};
}

/**
 * Return the root HTML attributes needed to render the active Slice theme
 * before client hydration.
 */
export function getThemeHtmlAttributes(theme?: string | null) {
	const resolvedTheme = normalizeThemeName(theme) ?? 'darkMode';

	return {
		'data-slice-theme': resolvedTheme,
	} as const;
}
