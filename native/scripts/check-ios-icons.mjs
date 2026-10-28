import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { iconSources } from './ios-icon-source.mjs';

const root = new URL('../', import.meta.url);
const icons = await iconSources();
const manifest = JSON.parse(readFileSync(new URL('platform/ios/Resources/SliceIcons.manifest.json', root), 'utf8'));
const expected = icons.flatMap((icon) => icon.variants.map((v) => `${icon.name}|${v.state}|${v.filled}`)).sort();
assert.deepEqual(manifest.map((v) => `${v.name}|${v.state}|${v.filled}`).sort(), expected);
assert.equal(new Set(manifest.map((v) => v.asset)).size, manifest.length);
const catalog = new URL('platform/ios/Resources/SliceIcons.xcassets/', root);
assert.deepEqual(
	readdirSync(catalog)
		.filter((name) => name.endsWith('.imageset'))
		.sort(),
	manifest.map((v) => `${v.asset}.imageset`).sort(),
);
for (const asset of manifest) {
	const folder = new URL(`${asset.asset}.imageset/`, catalog);
	const contents = JSON.parse(readFileSync(new URL('Contents.json', folder), 'utf8'));
	assert.equal(contents.properties['template-rendering-intent'], 'template');
	assert.equal(contents.images.length, 3);
	for (const scale of [1, 2, 3]) {
		const entry = contents.images.find((image) => image.scale === `${scale}x`);
		const png = readFileSync(new URL(entry.filename, folder));
		assert.equal(png.subarray(1, 4).toString(), 'PNG');
		assert.equal(png.readUInt32BE(16), 20 * scale);
		assert.equal(png.readUInt32BE(20), 20 * scale);
	}
}
const swift = readFileSync(new URL('platform/ios/SliceIcons.generated.swift', root), 'utf8');
for (const icon of icons) assert(swift.includes(`= ${JSON.stringify(icon.name)}`));
assert(
	readFileSync(new URL('SliceNative.podspec', root), 'utf8').includes(
		"'SliceNativeIcons' => ['platform/ios/Resources/SliceIcons.xcassets']",
	),
);
console.log(`Verified ${icons.length} native icons, ${manifest.length} variants, template metadata and PNG scales.`);

// Optional pixel checks require the same Chromium installation as the generator.
if (process.argv.includes('--pixels')) {
	const { chromium } = await import('playwright');
	const browser = await chromium.launch({ headless: true });
	try {
		const page = await browser.newPage();
		const inputs = manifest.map((asset) => ({
			...asset,
			png: readFileSync(new URL(`${asset.asset}.imageset/icon@3x.png`, catalog)).toString('base64'),
		}));
		const results = await page.evaluate(async (inputs) => {
			const results = [];
			for (const input of inputs) {
				const image = new Image();
				image.src = `data:image/png;base64,${input.png}`;
				await image.decode();
				const canvas = document.createElement('canvas');
				canvas.width = canvas.height = 60;
				const context = canvas.getContext('2d');
				context.drawImage(image, 0, 0);
				const pixels = context.getImageData(0, 0, 60, 60).data;
				let visible = false;
				for (let i = 0; i < pixels.length; i += 4) {
					if (!pixels[i + 3]) continue;
					visible = true;
					if (pixels[i] !== 255 || pixels[i + 1] !== 255 || pixels[i + 2] !== 255)
						throw new Error(`Nonwhite template: ${input.name}`);
				}
				results.push({
					name: input.name,
					state: input.state,
					filled: input.filled,
					visible,
					center: pixels[(30 * 60 + 30) * 4 + 3],
					cutout: pixels[(27 * 60 + 46) * 4 + 3],
				});
			}
			return results;
		}, inputs);
		for (const result of results)
			assert.equal(result.visible, result.name !== 'blank', `Unexpected blank icon: ${result.name}`);
		assert.equal(results.find((v) => v.name === 'wallet').cutout, 0, 'Wallet cover-up must erase underlying paths');
		assert(results.find((v) => v.name === 'view' && v.state === 'normal').center > 0);
		assert.equal(results.find((v) => v.name === 'view' && v.state === 'on').center, 0);
		console.log('Verified monochrome pixels, empty icon, cover-up cutout and toggle masks.');
	} finally {
		await browser.close();
	}
}
