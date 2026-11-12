import { coreGreyRecipes, corePalette, corePaletteAnchors } from './palette';

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
	const recipe = coreGreyRecipes[neutralThemeRecipes[token]][mode];
	if (token === 'core-fill-secondary') return { ...recipe, opacity: 0.3 };
	return recipe;
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

/** Paired translucent backgrounds and opaque accents for themed array colors. */
export const arrayAccentStops = {
	blue: { light: 700, dark: 400 },
	cyan: { light: 800, dark: 400 },
	lime: { light: 700, dark: 400 },
	pink: { light: 700, dark: 400 },
	orange: { light: 700, dark: 400 },
	purple: { light: 600, dark: 400 },
	yellow: { light: 700, dark: 400 },
} as const;

type ArrayFamily = keyof typeof arrayAccentStops;
type ArrayToken = `array-${ArrayFamily}` | `array-${ArrayFamily}-accent`;

export function arrayThemeRecipes(mode: Appearance): Record<ArrayToken, ColorRecipe> {
	const recipes = {} as Record<ArrayToken, ColorRecipe>;
	for (const family of Object.keys(arrayAccentStops) as ArrayFamily[]) {
		recipes[`array-${family}`] = { token: `core-${family}-500`, opacity: mode === 'light' ? 0.1 : 0.16 };
		recipes[`array-${family}-accent`] = { token: `core-${family}-${arrayAccentStops[family][mode]}`, opacity: 1 };
	}
	return recipes;
}

export function arrayThemeColors(mode: Appearance): Record<ArrayToken, string> {
	return Object.fromEntries(
		Object.entries(arrayThemeRecipes(mode)).map(([token, recipe]) => [token, resolveColorRecipe(recipe)]),
	) as Record<ArrayToken, string>;
}

/** CSS recipes retain palette references and composite with the receiving surface. */
export function themeCss(mode: Appearance): Record<string, string> {
	return {
		...neutralThemeCss(mode),
		...Object.fromEntries(
			Object.entries(baseThemeRecipes(mode)).map(([token, recipe]) => [token, colorRecipeCss(recipe)]),
		),
		...Object.fromEntries(
			Object.entries(arrayThemeRecipes(mode)).map(([token, recipe]) => [token, colorRecipeCss(recipe)]),
		),
	};
}

type BaseFamily = keyof typeof corePaletteAnchors;
export const greyThemeAnchors = {
	1: { light: 500, dark: 501 },
	2: { light: 350, dark: 660 },
	3: { light: 230, dark: 770 },
	4: { light: 185, dark: 821 },
	5: { light: 95, dark: 880 },
	6: { light: 40, dark: 950 },
} as const;

type GreyLevel = keyof typeof greyThemeAnchors;
export type BaseColorToken = `core-${BaseFamily}` | `core-grey-${GreyLevel}`;

/** Appearance-aware base accents; numbered palette stops remain fixed. */
export function baseThemeRecipes(mode: Appearance): Record<BaseColorToken, ColorRecipe> {
	const recipes = {} as Record<BaseColorToken, ColorRecipe>;
	for (const family of Object.keys(corePaletteAnchors) as BaseFamily[]) {
		recipes[`core-${family}`] = {
			token: `core-${family}-${corePaletteAnchors[family][mode]}` as keyof typeof corePalette,
			opacity: 1,
		};
	}
	for (const level of Object.keys(greyThemeAnchors)) {
		const index = Number(level) as GreyLevel;
		recipes[`core-grey-${index}`] = { token: `core-grey-${greyThemeAnchors[index][mode]}`, opacity: 1 };
	}
	return recipes;
}

export function baseThemeColors(mode: Appearance): Record<BaseColorToken, string> {
	return Object.fromEntries(
		Object.entries(baseThemeRecipes(mode)).map(([token, recipe]) => [token, resolveColorRecipe(recipe)]),
	) as Record<BaseColorToken, string>;
}
