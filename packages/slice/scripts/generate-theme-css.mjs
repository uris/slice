import { readFile, writeFile } from 'node:fs/promises';
import { loadThemeColors } from './load-theme-colors.mjs';

const { coreColors, light, dark, neutralThemeCss } = await loadThemeColors();
const path = new URL('../src/theme/colors/colors.css', import.meta.url);
let css = await readFile(path, 'utf8');
// The generated palette has its own imported stylesheet; serialize shared effects here.
const extras = Object.entries(coreColors).filter(([key]) => !/^core-[a-z]+-\d+$/.test(key));
css = css.replace(
	/(\[data-slice-theme-scope\] \{)[\s\S]*?(\n\})/,
	(_, start, end) => `${start}\n${extras.map(([key, value]) => `\t--${key}: ${value};`).join('\n')}${end}`,
);
for (const [mode, colors] of Object.entries({ light, dark })) {
	const neutral = neutralThemeCss(mode);
	const pattern = new RegExp(
		`(:root\\[data-slice-theme="${mode}Mode"\\] \\[data-slice-theme-scope\\] \\{)[\\s\\S]*?(\\n\\})`,
	);
	css = css.replace(pattern, (block, start, end) => {
		const previous = Object.fromEntries(
			[...block.matchAll(/--([\w-]+): var\(--([\w-]+)\);/g)].map(([, token, reference]) => [token, reference]),
		);
		const declarations = Object.entries(colors).map(([token, value]) => {
			let expression = neutral[token];
			if (!expression) {
				let reference = previous[token];
				if (!reference || coreColors[reference] !== value)
					reference = Object.keys(coreColors).find((key) => coreColors[key] === value);
				if (!reference) throw new Error(`No palette/effect source for ${mode}.${token}`);
				expression = `var(--${reference})`;
			}
			return `\t--${token}: ${expression};`;
		});
		return `${start}\n${declarations.join('\n')}${end}`;
	});
	const rootPattern = new RegExp(
		`(:root\\[data-slice-theme="${mode}Mode"\\] \\{)\\s*--core-surface-primary: [^;]+;\\s*\\}`,
	);
	css = css.replace(rootPattern, `$1\n\t--core-surface-primary: ${colors['core-surface-primary']};\n}`);
}
await writeFile(path, css);
console.log('Generated theme CSS from shared palette recipes and theme maps.');
