import { type State, addons } from 'storybook/manager-api';
import { sliceDarkTheme, sliceLightTheme } from './sliceTheme';

// Mirrors `darkTheme.name` in `src/theme/themes.ts`. Kept as a literal instead of
// importing '../src' so the manager bundle doesn't pull in the whole component
// library just to read a theme name.
const DARK_THEME_GLOBAL_NAME = 'darkMode';

// The runtime value of Storybook's GLOBALS_UPDATED channel event. The constant
// itself is only exported from 'storybook/internal/core-events', and 'internal'
// paths aren't a supported/stable import surface (no public './core-events'
// export exists in this version) - the event *name*, on the other hand, is
// effectively part of Storybook's manager<->preview postMessage protocol, so
// it's the more stable thing to depend on directly.
const GLOBALS_UPDATED = 'globalsUpdated';

const mediaQuery = globalThis.matchMedia('(prefers-color-scheme: dark)');

const applyManagerTheme = (isDark: boolean) => {
	addons.setConfig({
		theme: isDark ? sliceDarkTheme : sliceLightTheme,
		layoutCustomisations: {
			showToolbar(state: State, defaultValue: boolean) {
				if (state.viewMode === 'docs') {
					return false;
				}
				return defaultValue;
			},
		},
	});
};

// Initialize from the OS preference...
applyManagerTheme(mediaQuery.matches);
mediaQuery.addEventListener('change', (event) => {
	applyManagerTheme(event.matches);
});

// ...then keep the manager theme (sidebar, toolbar, and the docs page shell -
// including raw Markdown blocks like the performance report, which render
// outside of the app's own ThemeProvider) in sync with the `theme` global
// switched via the preview toolbar in preview.tsx. Without this, the manager
// theme only ever follows the OS setting and never reflects the in-app toggle,
// so anything styled by it looks "stuck" on whatever the OS preference was on
// load.
addons.getChannel().on(GLOBALS_UPDATED, ({ globals }: { globals?: Record<string, unknown> }) => {
	if (globals && typeof globals.theme === 'string') {
		applyManagerTheme(globals.theme === DARK_THEME_GLOBAL_NAME);
	}
});
