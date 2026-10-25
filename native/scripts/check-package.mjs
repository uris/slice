import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
for (const entry of Object.values(manifest.exports)) {
	for (const path of typeof entry === 'string' ? [entry] : Object.values(entry)) {
		assert(existsSync(new URL(path, root)), `Missing package export: ${path}`);
	}
}

async function bundleSelection(entry, name) {
	const bundle = await rollup({
		input: 'consumer',
		external: (id) => !id.startsWith('.') && !id.startsWith('/') && id !== 'consumer',
		// Reflect the published package's sideEffects:false contract.
		treeshake: { moduleSideEffects: false },
		plugins: [
			{
				name: 'consumer-fixture',
				resolveId(id) {
					if (id === 'consumer') return id;
				},
				load(id) {
					if (id === 'consumer')
						return `export { ${name} } from ${JSON.stringify(fileURLToPath(new URL(`dist/esm/${entry}.mjs`, root)))};`;
				},
			},
		],
	});
	try {
		const { output } = await bundle.generate({ format: 'es' });
		return output[0];
	} finally {
		await bundle.close();
	}
}
for (const entry of ['utils', 'index']) {
	const output = await bundleSelection(entry, 'lineHeightTextStyle');
	assert.equal(output.imports.length, 0, `${entry} utility unexpectedly imports runtime dependencies`);
	assert(!output.code.includes('SliceButton') && !output.code.includes('STATIC_ICON_REGISTRY'));
}
const hook = await bundleSelection('hooks', 'useCreateThemedStyles');
assert(!hook.imports.some((id) => /react-native-(svg|reanimated)/.test(id)));
console.log('Verified package export targets and ESM tree shaking for utility and hook imports.');
