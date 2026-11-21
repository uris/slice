import { readFile, writeFile } from 'node:fs/promises';
import { loadThemeColors } from './load-theme-colors.mjs';

const { coreColors, light, dark, themeCss } = await loadThemeColors();
const path = new URL('../src/theme/colors/colors.css', import.meta.url);
let css = await readFile(path, 'utf8');
// The generated palette has its own imported stylesheet; serialize shared effects here.
const extras = Object.entries(coreColors).filter(([key]) => !/^core-[a-z]+-\d+$/.test(key));
css = css.replace(
	/(\[data-slice-theme-scope\] \{)[\s\S]*?(\n\})/,
	(_, start, end) => `${start}\n${extras.map(([key, value]) => `\t--${key}: ${value};`).join('\n')}${end}`,
);
for (const [mode, colors] of Object.entries({ light, dark })) {
	const neutral = themeCss(mode);
	const pattern = new RegExp(
		`(:root\\[data-slice-theme="${mode}Mode"\\] \\[data-slice-theme-scope\\] \\{)[\\s\\S]*?(\\n\\})`,
	);
	css = css.replace(pattern, (_, start, end) => {
		const declarations = Object.keys(colors).map((token) => {
			const expression = neutral[token];
			if (!expression) throw new Error(`No explicit color declaration for ${mode}.${token}`);
			return `\t--${token}: ${expression};`;
		});
		return `${start}\n${declarations.join('\n')}${end}`;
	});
	const rootPattern = new RegExp(
		`(:root\\[data-slice-theme="${mode}Mode"\\] \\{)\\s*--core-surface-primary: [^;]+;\\s*\\}`,
	);
	css = css.replace(rootPattern, `$1\n\t--core-surface-primary: ${colors['core-surface-primary']};\n}`);
}
const textUtilities = Object.keys(light)
	.filter((token) => token.startsWith('core-text-'))
	.sort()
	.map((token) => `[data-slice-theme-scope] .${token} {\n\tcolor: var(--${token});\n}`)
	.join('\n\n');
css = css.replace(
	/(\/\* Text color utilities start \*\/)[\s\S]*?(\/\* Text color utilities end \*\/)/,
	(_, start, end) => `${start}\n${textUtilities}\n${end}`,
);
await writeFile(path, css);
console.log('Generated theme CSS from explicit theme color declarations.');
