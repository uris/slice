import { coreGreyRecipes, corePalette } from './palette';

export type ColorRecipe = { token: keyof typeof corePalette; opacity: number };
type Appearance = 'light' | 'dark';

/** Resolve a palette reference and alpha into a portable, unflattened color. */
export function resolveColorRecipe(recipe: ColorRecipe): string {
	const hex = corePalette[recipe.token];
	if (recipe.opacity === 1) return hex;
	const [r, g, b] = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
	return `rgba(${r}, ${g}, ${b}, ${recipe.opacity})`;
}

/** Web variables retain their palette references and composite against the real surface. */
export function colorRecipeCss(recipe: ColorRecipe): string {
	const color = `var(--${recipe.token})`;
	if (recipe.opacity === 1) return color;
	return `color-mix(in srgb, ${color} ${recipe.opacity * 100}%, transparent)`;
}

export const neutralThemeRecipes = {
	'core-text-primary': 'text-primary',
	'core-text-secondary': 'text-secondary',
	'core-text-tertiary': 'text-tertiary',
	'core-text-quaternary': 'text-quaternary',
	'core-text-disabled': 'text-quaternary',
	'core-icon-primary': 'text-primary',
	'core-icon-secondary': 'text-secondary',
	'core-icon-disabled': 'text-quaternary',
	'core-fill-primary': 'fills-primary',
	'core-fill-secondary': 'fills-secondary',
	'core-fill-tertiary': 'fills-tertiary',
	'core-button-disabled': 'fills-primary',
	'core-badge-secondary': 'fills-primary',
	'core-surface-primary': 'background-primary',
	'core-surface-secondary': 'background-secondary',
	'core-surface-elevated': 'background-elevated',
	'core-surface-liquid-glass': 'fills-liquid-glass',
	'core-surface-overlay-translucent': 'fills-liquid-glass',
} as const satisfies Record<string, keyof typeof coreGreyRecipes>;

type NeutralToken = keyof typeof neutralThemeRecipes;
function neutralRecipe(token: NeutralToken, mode: Appearance): ColorRecipe {
	if (token === 'core-surface-primary' && mode === 'dark') return { token: 'core-grey-975', opacity: 1 };
	return coreGreyRecipes[neutralThemeRecipes[token]][mode];
}

export function neutralThemeColors(mode: Appearance): Record<NeutralToken, string> {
	return Object.fromEntries(
		Object.keys(neutralThemeRecipes).map((token) => [
			token,
			resolveColorRecipe(neutralRecipe(token as NeutralToken, mode)),
		]),
	) as Record<NeutralToken, string>;
}

export function neutralThemeCss(mode: Appearance): Record<NeutralToken, string> {
	return Object.fromEntries(
		Object.keys(neutralThemeRecipes).map((token) => [
			token,
			colorRecipeCss(neutralRecipe(token as NeutralToken, mode)),
		]),
	) as Record<NeutralToken, string>;
}
