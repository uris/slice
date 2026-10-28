import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import ts from 'typescript';

const root = new URL('../', import.meta.url);
const source = readFileSync(new URL('../src/theme/colors/colors.ts', root), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { light, dark } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const catalog = new URL('platform/ios/Resources/SliceColors.xcassets/', root);
const expected = Object.keys(light)
	.filter((name) => !name.startsWith('surface-shadow-'))
	.sort();
assert.deepEqual(
	readdirSync(catalog)
		.filter((name) => name.endsWith('.colorset'))
		.map((name) => name.slice(0, -9))
		.sort(),
	expected,
);
const swift = readFileSync(new URL('platform/ios/SliceColors.generated.swift', root), 'utf8');
for (const name of expected) {
	const asset = JSON.parse(readFileSync(new URL(`${name}.colorset/Contents.json`, catalog), 'utf8'));
	assert.equal(asset.colors.length, 2);
	assert.equal(asset.colors[0].appearances, undefined);
	assert.deepEqual(asset.colors[1].appearances, [{ appearance: 'luminosity', value: 'dark' }]);
	for (const [index, palette] of [light, dark].entries()) {
		const { components } = asset.colors[index].color;
		for (const component of Object.values(components))
			assert(component.includes('.'), `${name}: use decimal components; Xcode interprets integer strings as bytes`);
		const rgba = ['red', 'green', 'blue', 'alpha'].map((key) => Number(components[key]));
		const value = palette[name];
		const expected = value.startsWith('#')
			? [
					...[1, 3, 5].map((i) => Number.parseInt(value.slice(i, i + 2), 16) / 255),
					value.length === 9 ? Number.parseInt(value.slice(7), 16) / 255 : 1,
				]
			: value
					.match(/[\d.]+/g)
					.map(Number)
					.map((v, i) => (i < 3 ? v / 255 : v));
		assert.deepEqual(rgba, expected, `${name} ${index === 0 ? 'light' : 'dark'} mismatch`);
	}
	const id = name.replace(/-([a-z0-9])/g, (_, character) => character.toUpperCase());
	assert(swift.includes(`var ${id}: Color`));
	assert(swift.includes(`var ${id}: UIColor`));
}
assert(
	readFileSync(new URL('SliceNative.podspec', root), 'utf8').includes(
		"'SliceNativeColors' => ['platform/ios/Resources/SliceColors.xcassets']",
	),
);
assert(JSON.parse(readFileSync(new URL('package.json', root), 'utf8')).files.includes('platform'));
console.log(`Verified ${expected.length} light/dark assets, alpha, Swift accessors and resource packaging.`);
