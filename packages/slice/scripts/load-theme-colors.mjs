import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Only plain token/recipe data is evaluated. No web providers, stores, or styles are loaded.
export async function loadThemeColors() {
	const root = new URL('../src/theme/colors/', import.meta.url);
	const compile = (name) =>
		ts.transpileModule(readFileSync(new URL(name, root), 'utf8'), {
			compilerOptions: { module: ts.ModuleKind.ESNext },
		}).outputText;
	const asModule = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
	const paletteUrl = asModule(compile('palette.ts'));
	const recipesUrl = asModule(compile('recipes.ts').replace(/from ['"]\.\/palette['"]/g, `from '${paletteUrl}'`));
	const colorsUrl = asModule(
		compile('colors.ts')
			.replace(/from ['"]\.\/palette['"]/g, `from '${paletteUrl}'`)
			.replace(/from ['"]\.\/recipes['"]/g, `from '${recipesUrl}'`),
	);
	const colors = await import(colorsUrl);
	const { neutralThemeCss } = await import(recipesUrl);
	return { ...colors, neutralThemeCss };
}
