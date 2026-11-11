import { readFile, writeFile } from 'node:fs/promises';

// Oklab transforms: https://bottosson.github.io/posts/oklab/ (public-domain reference).
// Screenshot anchors are never converted back from Oklab: preserve their exact hex.
const root = new URL('../', import.meta.url);
const seeds = JSON.parse(await readFile(new URL('core-palette.json', import.meta.url), 'utf8'));
function toLab(hex) {
	const rgb = hex
		.slice(1)
		.match(/../g)
		.map((value) => {
			const channel = Number.parseInt(value, 16) / 255;
			return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
		});
	const [r, g, b] = rgb;
	const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
	const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
	const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
	return [
		0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
	];
}
function linearRgb([L, a, b]) {
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	];
}
function toHex([L, a, b]) {
	// Reduce chroma at a fixed lightness/hue until the color fits sRGB.
	let low = 0;
	let high = 1;
	for (let i = 0; i < 28; i++) {
		const scale = (low + high) / 2;
		if (linearRgb([L, a * scale, b * scale]).every((c) => c >= 0 && c <= 1)) low = scale;
		else high = scale;
	}
	return `#${linearRgb([L, a * low, b * low])
		.map((c) => {
			const value = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
			return Math.round(Math.min(1, Math.max(0, value)) * 255)
				.toString(16)
				.padStart(2, '0');
		})
		.join('')}`;
}
const palette = {};
const anchors = {};
const standardStops = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
for (const [family, { light, dark }] of Object.entries(seeds)) {
	const base = toLab(light);
	const alternate = toLab(dark);
	let projected = 500 + (500 * (base[0] - alternate[0])) / (base[0] - 0.18);
	if (alternate[0] > base[0]) projected = (500 * (0.99 - alternate[0])) / (0.99 - base[0]);
	let darkStop = Math.max(50, Math.min(950, Math.round(projected / 50) * 50));
	if (darkStop === 500) darkStop = alternate[0] > base[0] ? 450 : 550;
	anchors[family] = { light: 500, dark: darkStop };
	const points = [
		[0, [0.99, 0, 0]],
		[500, base],
		[darkStop, alternate],
		[1000, [0.18, base[1] * 0.25, base[2] * 0.25]],
	].sort((a, b) => a[0] - b[0]);
	for (const stop of [...new Set([...standardStops, darkStop])].sort((a, b) => a - b)) {
		let value = light;
		if (stop === darkStop) value = dark;
		else if (stop !== 500) {
			const upper = points.findIndex(([position]) => position > stop);
			const [from, start] = points[upper - 1];
			const [to, end] = points[upper];
			const t = (stop - from) / (to - from);
			value = toHex(start.map((channel, index) => channel + (end[index] - channel) * t));
		}
		palette[`core-${family}-${stop}`] = value;
	}
}

// Neutrals have multiple fixed screenshot anchors, rather than a single accent pair.
const greySource = JSON.parse(await readFile(new URL('grey-palette.json', import.meta.url), 'utf8'));
const greyHexes = [
	...new Set(
		Object.values(greySource).flatMap((group) => Object.values(group).flatMap((entry) => [entry.light, entry.dark])),
	),
];
const greyBase = toLab(greySource.grays.gray.light)[0];
const greyFloor = toLab(greySource.grays['gray-6'].dark)[0];
const greyAnchors = {};
const greyPoints = [];
let previousStop = -1;
for (const hex of greyHexes.sort((a, b) => toLab(b)[0] - toLab(a)[0])) {
	const lab = toLab(hex);
	let stop;
	if (hex === '#ffffff') stop = 0;
	else if (hex === '#000000') stop = 1000;
	else if (hex === greySource.grays.gray.light) stop = 500;
	else if (hex === greySource.grays['gray-6'].dark) stop = 950;
	else {
		let projected = (500 * (1 - lab[0])) / (1 - greyBase);
		let maximum = 499;
		if (lab[0] < greyBase) {
			projected = 500 + (450 * (greyBase - lab[0])) / (greyBase - greyFloor);
			maximum = 949;
		}
		stop = Math.min(maximum, Math.max(previousStop + 1, Math.round(projected / 5) * 5));
	}
	if (stop <= previousStop) throw new Error(`Gray anchors collide at ${stop}: ${hex}`);
	previousStop = stop;
	greyAnchors[hex] = `core-grey-${stop}`;
	greyPoints.push({ stop, hex, lab });
}
// Additional design stops preserve the screenshot anchors and source recipes.
const customGreys = JSON.parse(await readFile(new URL('grey-custom.json', import.meta.url), 'utf8'));
for (const [label, hex] of Object.entries(customGreys)) {
	const stop = Number(label);
	if (!Number.isInteger(stop) || stop <= 0 || stop >= 1000 || greyPoints.some((point) => point.stop === stop))
		throw new Error(`Invalid custom gray stop: ${label}`);
	greyPoints.push({ stop, hex, lab: toLab(hex) });
}
greyPoints.sort((a, b) => a.stop - b.stop);
const greyPalette = {};
const greyStops = [...new Set([0, ...standardStops, 1000, ...greyPoints.map((point) => point.stop)])].sort(
	(a, b) => a - b,
);
for (const stop of greyStops) {
	const exact = greyPoints.find((point) => point.stop === stop);
	let hex;
	if (exact) hex = exact.hex;
	else {
		const upper = greyPoints.findIndex((point) => point.stop > stop);
		const from = greyPoints[upper - 1];
		const to = greyPoints[upper];
		const t = (stop - from.stop) / (to.stop - from.stop);
		hex = toHex(from.lab.map((value, index) => value + (to.lab[index] - value) * t));
	}
	greyPalette[`core-grey-${stop}`] = hex;
}
const greyLayers = {};
const greyRecipes = {};
for (const [group, entries] of Object.entries(greySource)) {
	for (const [name, entry] of Object.entries(entries)) {
		if (group !== 'grays') {
			greyRecipes[`${group}-${name}`] = {
				light: { token: greyAnchors[entry.light], opacity: entry.opacity ?? 1 },
				dark: { token: greyAnchors[entry.dark], opacity: entry.opacity ?? 1 },
			};
		}
		if (entry.opacity === undefined) continue;
		greyLayers[`${group}-${name}`] = {
			light: { token: greyAnchors[entry.light], opacity: entry.opacity },
			dark: { token: greyAnchors[entry.dark], opacity: entry.opacity },
		};
	}
}
Object.assign(palette, greyPalette);
anchors.grey = { light: 500, dark: Number(greyAnchors[greySource.grays.gray.dark].split('-').at(-1)) };
const header = '// Generated by scripts/generate-core-palette.mjs from core-palette.json and grey-palette.json.\n';
await writeFile(
	new URL('src/theme/colors/palette.ts', root),
	`${header}export const corePalette = ${JSON.stringify(palette, null, 2)} as const;\nexport const corePaletteAnchors = ${JSON.stringify(anchors, null, 2)} as const;\nexport const coreGreyAnchors = ${JSON.stringify(greyAnchors, null, 2)} as const;\nexport const coreGreyLayers = ${JSON.stringify(greyLayers, null, 2)} as const;\nexport const coreGreyRecipes = ${JSON.stringify(greyRecipes, null, 2)} as const;\n`,
);
await writeFile(
	new URL('src/theme/colors/palette.css', root),
	`/* Generated by scripts/generate-core-palette.mjs. */\n[data-slice-theme-scope] {\n${Object.entries(palette)
		.map(([key, value]) => `\t--${key}: ${value};`)
		.join('\n')}\n}\n`,
);
console.log(JSON.stringify(anchors, null, 2));
