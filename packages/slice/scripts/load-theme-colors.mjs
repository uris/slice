import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Evaluate only plain palette data and color utilities; never load web entrypoints.
export async function loadThemeColors() {
	const root = new URL('../src/theme/colors/', import.meta.url);
	const compile = (source) =>
		ts.transpileModule(source, {
			compilerOptions: { module: ts.ModuleKind.ESNext },
		}).outputText;
	const asModule = (source) => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
	const paletteUrl = asModule(compile(readFileSync(new URL('palette.ts', root), 'utf8')));
	const utilityUrl = asModule(compile(readFileSync(new URL('../../utils/functions/addOpacity.ts', root), 'utf8')));
	const source = readFileSync(new URL('colors.ts', root), 'utf8');
	const colorsUrl = asModule(
		compile(source)
			.replace(/from ['"]\.\/palette['"]/g, `from '${paletteUrl}'`)
			.replace(/from ['"]\.\.\/\.\.\/utils\/functions\/addOpacity['"]/g, `from '${utilityUrl}'`),
	);
	const colors = await import(colorsUrl);

	// Serialize the explicit TS declarations directly, preserving CSS palette references.
	const file = ts.createSourceFile('colors.ts', source, ts.ScriptTarget.Latest, true);
	const css = {};
	for (const statement of file.statements) {
		if (!ts.isVariableStatement(statement)) continue;
		for (const declaration of statement.declarationList.declarations) {
			const mode = declaration.name.getText(file);
			if (mode !== 'light' && mode !== 'dark') continue;
			css[mode] = Object.fromEntries(
				declaration.initializer.properties.map((property) => {
					const value = property.initializer;
					const opacity = ts.isCallExpression(value);
					const reference = opacity ? value.arguments[0] : value;
					if (
						!ts.isElementAccessExpression(reference) ||
						reference.expression.getText(file) !== 'coreColors' ||
						(opacity && value.expression.getText(file) !== 'addOpacity')
					) {
						throw new Error(`Expected coreColors reference or addOpacity for ${mode}.${property.name.text}`);
					}
					const color = `var(--${reference.argumentExpression.text})`;
					const expression = opacity
						? `color-mix(in srgb, ${color} ${Number(value.arguments[1].getText(file)) * 100}%, transparent)`
						: color;
					return [property.name.text, expression];
				}),
			);
		}
	}
	return { ...colors, themeCss: (mode) => css[mode] };
}
