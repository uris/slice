import { readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';

// Usage: node packages/slice/scripts/import-icons.mjs /path/to/icons
// Each immediate subfolder becomes a group. Fail closed on unfamiliar artwork.
const source = process.argv[2];
if (!source) throw new Error('Provide the folder containing icon group folders.');
const target = fileURLToPath(new URL('../src/components/Icon/', import.meta.url));
const groups = {};
const entries = new Map();
const outlined = new Set();
async function svgFiles(directory) {
	const files = [];
	for (const entry of await readdir(directory, { withFileTypes: true })) {
		const fullPath = path.join(directory, entry.name);
		if (entry.isDirectory()) files.push(...(await svgFiles(fullPath)));
		else if (entry.name.endsWith('.svg')) files.push(fullPath);
	}
	return files.sort();
}
for (const folder of (await readdir(source, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
	if (!folder.isDirectory()) continue;
	const group = folder.name;
	if (!/^[a-z][a-z0-9]*$/.test(group)) throw new Error(`Unsupported group name: ${group}`);
	groups[group] = {};
	for (const fullPath of await svgFiles(path.join(source, group))) {
		const file = path.basename(fullPath);
		const name = file.slice(0, -4);
		if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) throw new Error(`Unsupported icon name: ${name}`);
		const key = name.replace(/-([a-z0-9])/g, (_, letter) => letter.toUpperCase());
		if (Object.hasOwn(groups[group], key)) throw new Error(`Duplicate key: ${group}.${key}`);
		const svg = await readFile(fullPath, 'utf8');
		const paths = [];
		optimize(svg, {
			plugins: [
				{
					name: 'inspect',
					fn: () => ({
						element: {
							enter(node, parent) {
								const a = node.attributes;
								if (node.name === 'circle') {
									const x = Number(a.cx || 0);
									const y = Number(a.cy || 0);
									const r = Number(a.r);
									a.d = `M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;
									for (const key of ['cx', 'cy', 'r']) delete a[key];
									node.name = 'path';
								}
								if (node.name === 'rect' && parent.name !== 'clipPath') {
									const x = Number(a.x || 0);
									const y = Number(a.y || 0);
									const w = Number(a.width);
									const h = Number(a.height);
									const r = Math.min(Number(a.rx || 0), w / 2, h / 2);
									if (a.ry) throw new Error(`Unsupported elliptical corners: ${file}`);
									a.d = `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;
									for (const key of ['x', 'y', 'width', 'height', 'rx']) delete a[key];
									node.name = 'path';
								}
								if (!['svg', 'g', 'path', 'defs', 'clipPath', 'rect'].includes(node.name))
									throw new Error(`Unsupported element in ${file}: ${node.name}`);
								if (node.name === 'svg' && a.viewBox !== '0 0 24 24') throw new Error(`Expected 24px viewBox: ${file}`);
								if (node.name === 'g' && Object.keys(a).some((k) => k !== 'clip-path'))
									throw new Error(`Styled group: ${file}`);
								if (
									node.name === 'rect' &&
									(parent.name !== 'clipPath' ||
										a.width !== '24' ||
										a.height !== '24' ||
										Object.keys(a).some((k) => !['width', 'height', 'fill'].includes(k)))
								)
									throw new Error(`Non-viewport clip: ${file}`);
								if (node.name === 'path') {
									if (
										Object.keys(a).some(
											(k) =>
												![
													'd',
													'fill',
													'stroke',
													'stroke-width',
													'stroke-linecap',
													'stroke-linejoin',
													'opacity',
												].includes(k),
										)
									)
										throw new Error(`Unsupported path attributes: ${file}`);
									paths.push(a);
								}
							},
						},
					}),
				},
			],
		});
		if (!paths.length) throw new Error(`No paths: ${file}`);
		const rendered = paths.map((a) => {
			// Transform geometry without scaling the runtime-controlled stroke width.
			const result = optimize(
				`<svg xmlns="http://www.w3.org/2000/svg"><path transform="scale(${20 / 24})" d="${a.d}"/></svg>`,
				{ plugins: [{ name: 'convertPathData', params: { floatPrecision: 5 } }] },
			).data;
			if (result.includes('transform=')) throw new Error(`Unflattened transform: ${file}`);
			const d = result.match(/ d="([^"]+)"/)[1];
			if (!a.stroke) {
				outlined.add(`${group}.${name}`);
				return `<path d="${d}" fill={strokeColor}${a.opacity ? ` opacity={${Number(a.opacity)}}` : ''} />`;
			}
			return `<path d="${d}" fill="none" stroke={strokeColor} strokeWidth={stroke}${a.opacity ? ` opacity={${Number(a.opacity)}}` : ''}${a['stroke-linecap'] ? ` strokeLinecap="${a['stroke-linecap']}"` : ''}${a['stroke-linejoin'] ? ` strokeLinejoin="${a['stroke-linejoin']}"` : ''} />`;
		});
		const id = `${group}.${name}`;
		groups[group][key] = id;
		entries.set(
			id,
			`[${JSON.stringify(id)}, { line: ({ strokeColor${paths.some((a) => a.stroke) ? ', stroke' : ''} }) => (${rendered.length > 1 ? `<>${rendered.join('')}</>` : rendered[0]}) }],`,
		);
	}
}

const templates = new URL('./', import.meta.url);
const preservedGroups = JSON.parse(await readFile(new URL('preserved-icon-groups.json', templates), 'utf8'));
for (const [group, icons] of Object.entries(preservedGroups)) {
	groups[group] = { ...groups[group], ...icons };
	for (const name of Object.values(icons)) entries.delete(name);
}
const generatedHeader = '// Generated by scripts/import-icons.mjs. Edit the importer templates instead.\n';
const registry = await readFile(new URL('icon-registry.template.txt', templates), 'utf8');
await writeFile(
	path.join(target, 'iconRegistry.tsx'),
	generatedHeader + registry.replace('/* IMPORTED_ICON_ENTRIES */', [...entries.values()].join('\n')),
);
const props = await readFile(new URL('icon-types.template.txt', templates), 'utf8');
await writeFile(
	path.join(target, '_types.ts'),
	`${generatedHeader}${props}export const SliceIcons = ${JSON.stringify(groups, null, 2)} as const;\n\ntype IconGroups = typeof SliceIcons;\nexport type SliceIcon = { [G in keyof IconGroups]: IconGroups[G][keyof IconGroups[G]] }[keyof IconGroups];\n`,
);
console.log(
	`Imported ${entries.size} icons plus preserved artwork. Fixed-width outlined artwork: ${[...outlined].join(', ')}`,
);
