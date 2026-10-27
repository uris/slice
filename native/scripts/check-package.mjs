import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const require = createRequire(new URL('package.json', root));
for (const entry of Object.values(manifest.exports)) {
	for (const path of typeof entry === 'string' ? [entry] : Object.values(entry)) {
		assert(existsSync(new URL(path, root)), `Missing package export: ${path}`);
	}
}

// Verify Metro's iOS route and the original specification shipped for Babel/Codegen.
const metroRoot = new URL('dist/react-native/native/', root);
const componentRoot = new URL('src/components/SliceLiquidGlassView/', metroRoot);
for (const path of ['SliceLiquidGlassView.js', 'SliceLiquidGlassView.ios.js', 'index.js']) {
	assert(existsSync(new URL(path, componentRoot)), `Missing Metro component file: ${path}`);
}
const specPath = new URL('src/specs/LiquidGlassNativeComponent.ts', metroRoot);
const spec = readFileSync(specPath, 'utf8');
assert.equal(spec, readFileSync(new URL('src/specs/LiquidGlassNativeComponent.ts', root), 'utf8'));
assert(
	!existsSync(new URL('src/specs/LiquidGlassNativeComponent.js', metroRoot)),
	'Compiled JS must not shadow the typed Codegen spec',
);
const { TypeScriptParser } = require('@react-native/codegen/lib/parsers/typescript/parser');
const schema = new TypeScriptParser().parseString(spec);
const component = schema.modules.SliceLiquidGlassView.components.SliceLiquidGlassView;
assert.deepEqual(component.excludedPlatforms, ['android']);
assert.deepEqual(
	component.props.map((prop) => prop.name),
	['glassStyle', 'glassTintColor', 'interactive', 'cornerRadius'],
);
const transformed = require('@babel/core').transformSync(spec, {
	filename: fileURLToPath(specPath),
	babelrc: false,
	configFile: false,
	plugins: [require.resolve('@react-native/babel-plugin-codegen')],
	parserOpts: { plugins: ['typescript'] },
});
assert(transformed.code.includes('NativeComponentRegistry'), 'Babel must generate a native view config');
for (const path of [
	'SliceNative.podspec',
	'platform/ios/LiquidGlassSurface.swift',
	'platform/ios/RCTLiquidGlassView.h',
	'platform/ios/RCTLiquidGlassView.mm',
]) {
	assert(existsSync(new URL(path, root)), `Missing native source: ${path}`);
}
assert.equal(manifest.codegenConfig.ios.componentProvider.SliceLiquidGlassView, 'RCTLiquidGlassView');

// Background blur must ship both native platform support and its typed Codegen input.
const blurRoot = new URL('src/components/SliceBackgroundBlur/', metroRoot);
for (const path of ['SliceBackgroundBlur.js', 'SliceBackgroundBlur.native.js', 'index.js']) {
	assert(existsSync(new URL(path, blurRoot)), `Missing background blur platform file: ${path}`);
}
const blurSpecPath = new URL('src/specs/BackgroundBlurNativeComponent.ts', metroRoot);
const blurSpec = readFileSync(blurSpecPath, 'utf8');
assert.equal(blurSpec, readFileSync(new URL('src/specs/BackgroundBlurNativeComponent.ts', root), 'utf8'));
assert(!existsSync(new URL('src/specs/BackgroundBlurNativeComponent.js', metroRoot)));
const blurComponent = new TypeScriptParser().parseString(blurSpec).modules.SliceBackgroundBlur.components
	.SliceBackgroundBlur;
assert.deepEqual(
	blurComponent.props.map((prop) => prop.name),
	['blurIntensity', 'fadeStop', 'direction', 'fallbackColor'],
);
assert.equal(blurComponent.props.find((prop) => prop.name === 'fadeStop').typeAnnotation.default, 0);
assert.equal(manifest.codegenConfig.ios.componentProvider.SliceBackgroundBlur, 'RCTBackgroundBlurView');
for (const path of [
	'platform/ios/BackgroundBlurSurface.swift',
	'platform/ios/RCTBackgroundBlurView.h',
	'platform/ios/RCTBackgroundBlurView.mm',
	'react-native.config.js',
	'platform/android/build.gradle',
	'platform/android/src/main/java/com/slice/SlicePackage.java',
	'platform/android/src/main/java/com/slice/SliceBackgroundBlurManager.java',
	'platform/android/src/main/java/com/slice/SliceBackgroundBlurView.java',
]) {
	assert(existsSync(new URL(path, root)), `Missing background blur native source: ${path}`);
}
for (const dependency of ['expo-blur', 'expo-linear-gradient', '@react-native-masked-view/masked-view']) {
	assert(!manifest.peerDependencies[dependency], `Unexpected blur dependency: ${dependency}`);
}

const capabilitiesSpec = new URL('src/specs/NativeDeviceCapabilities.ts', metroRoot);
assert.equal(
	readFileSync(capabilitiesSpec, 'utf8'),
	readFileSync(new URL('src/specs/NativeDeviceCapabilities.ts', root), 'utf8'),
);
assert(!existsSync(new URL('src/specs/NativeDeviceCapabilities.js', metroRoot)));
const capabilitiesModule = new TypeScriptParser().parseString(
	readFileSync(capabilitiesSpec, 'utf8'),
	fileURLToPath(capabilitiesSpec),
).modules.NativeDeviceCapabilities;
assert.equal(capabilitiesModule.moduleName, 'SliceDeviceCapabilities');
assert.equal(manifest.codegenConfig.type, 'all');
assert.equal(manifest.codegenConfig.ios.modulesProvider.SliceDeviceCapabilities, 'SliceDeviceCapabilities');
for (const path of [
	'platform/ios/SliceDeviceCapabilities.h',
	'platform/ios/SliceDeviceCapabilities.mm',
	'platform/android/src/main/java/com/slice/SliceDeviceCapabilitiesModule.java',
])
	assert(existsSync(new URL(path, root)), `Missing device capabilities native source: ${path}`);
for (const entry of ['index', 'hooks']) {
	assert(
		readFileSync(
			new URL(`dist/types/native/src/${entry === 'hooks' ? 'hooks/index' : 'index'}.d.ts`, root),
			'utf8',
		).includes('useDeviceCapabilities'),
	);
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
console.log('Verified package exports, Metro platform files, Codegen/Babel spec, native sources and ESM tree shaking.');
