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
const metroRoot = new URL('dist/react-native/slice-native/', root);
const componentRoot = new URL('src/components/LiquidGlass/', metroRoot);
for (const path of ['LiquidGlass.js', 'LiquidGlass.ios.js', 'index.js']) {
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
	['themePreference', 'glassStyle', 'glassTintColor', 'interactive', 'cornerRadius'],
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

// Native glass buttons must retain their iOS route, typed Codegen spec and assets.
const buttonRoot = new URL('src/components/Button/', metroRoot);
for (const path of ['Button.js', 'Button.ios.js', 'ButtonRegular.js']) {
	assert(existsSync(new URL(path, buttonRoot)), `Missing button platform file: ${path}`);
}
const buttonSpecPath = new URL('src/specs/GlassButtonNativeComponent.ts', metroRoot);
const buttonSpec = readFileSync(buttonSpecPath, 'utf8');
assert.equal(buttonSpec, readFileSync(new URL('src/specs/GlassButtonNativeComponent.ts', root), 'utf8'));
assert(!existsSync(new URL('src/specs/GlassButtonNativeComponent.js', metroRoot)));
const glassButton = new TypeScriptParser().parseString(buttonSpec).modules.SliceGlassButton.components.SliceGlassButton;
assert.deepEqual(glassButton.excludedPlatforms, ['android']);
assert.deepEqual(glassButton.events.map((event) => event.name).sort(), ['onButtonEvent', 'onIntrinsicSizeChange']);
for (const prop of [
	'label',
	'iconName',
	'tintToken',
	'themePreference',
	'fontFamily',
	'fontSize',
	'paddingLeading',
	'textTintToken',
	'iconTintToken',
]) {
	assert(
		glassButton.props.some((entry) => entry.name === prop),
		`Missing native button prop: ${prop}`,
	);
}
assert.equal(manifest.codegenConfig.ios.componentProvider.SliceGlassButton, 'RCTGlassButtonView');
for (const path of [
	'platform/ios/GlassButtonSurface.swift',
	'platform/ios/RCTGlassButtonView.h',
	'platform/ios/RCTGlassButtonView.mm',
	'platform/ios/SliceIcons.generated.swift',
	'platform/ios/SliceColors.generated.swift',
]) {
	assert(existsSync(new URL(path, root)), `Missing native button source: ${path}`);
}
const buttonTransform = require('@babel/core').transformSync(buttonSpec, {
	filename: fileURLToPath(buttonSpecPath),
	babelrc: false,
	configFile: false,
	plugins: [require.resolve('@react-native/babel-plugin-codegen')],
	parserOpts: { plugins: ['typescript'] },
});
assert(buttonTransform.code.includes('NativeComponentRegistry'));

// Background blur must ship both native platform support and its typed Codegen input.
const blurRoot = new URL('src/components/BackgroundBlur/', metroRoot);
for (const path of ['BackgroundBlur.js', 'BackgroundBlur.native.js', 'index.js']) {
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
			new URL(`dist/types/slice-native/src/${entry === 'hooks' ? 'hooks/index' : 'index'}.d.ts`, root),
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
	assert(!output.code.includes('ButtonRegular') && !output.code.includes('STATIC_ICON_REGISTRY'));
}
const hook = await bundleSelection('hooks', 'useCreateThemedStyles');
assert(!hook.imports.some((id) => /react-native-(svg|reanimated)/.test(id)));

// Adaptive text must ship its iOS renderer and the original typed Codegen input.
for (const name of ['Text.js', 'Text.ios.js', 'TextRegular.js']) {
	assert(existsSync(new URL(`src/components/Text/${name}`, metroRoot)));
}
const textSpec = readFileSync(new URL('src/specs/GlassTextNativeComponent.ts', metroRoot), 'utf8');
assert.equal(textSpec, readFileSync(new URL('src/specs/GlassTextNativeComponent.ts', root), 'utf8'));
const glassText = new TypeScriptParser().parseString(textSpec).modules.SliceGlassText.components.SliceGlassText;
assert.deepEqual(glassText.excludedPlatforms, ['android']);
assert.equal(manifest.codegenConfig.ios.componentProvider.SliceGlassText, 'RCTGlassTextView');
for (const name of ['GlassTextSurface.swift', 'RCTGlassTextView.h', 'RCTGlassTextView.mm']) {
	assert(existsSync(new URL(`platform/ios/${name}`, root)));
}

const textTransform = require('@babel/core').transformSync(textSpec, {
	filename: 'GlassTextNativeComponent.ts',
	babelrc: false,
	configFile: false,
	plugins: [require.resolve('@react-native/babel-plugin-codegen')],
	parserOpts: { plugins: ['typescript'] },
});
assert(textTransform.code.includes('NativeComponentRegistry'));
// Glass icons select existing templates without losing the SVG platform route.
for (const name of ['Icon.js', 'Icon.ios.js', 'IconSvg.js']) {
	assert(existsSync(new URL(`src/components/Icon/${name}`, metroRoot)));
}
const iconSpecPath = new URL('src/specs/GlassIconNativeComponent.ts', metroRoot);
const iconSpec = readFileSync(iconSpecPath, 'utf8');
assert.equal(iconSpec, readFileSync(new URL('src/specs/GlassIconNativeComponent.ts', root), 'utf8'));
assert(!existsSync(new URL('src/specs/GlassIconNativeComponent.js', metroRoot)));
const glassIcon = new TypeScriptParser().parseString(iconSpec).modules.SliceGlassIcon.components.SliceGlassIcon;
assert.deepEqual(glassIcon.excludedPlatforms, ['android']);
assert.equal(manifest.codegenConfig.ios.componentProvider.SliceGlassIcon, 'RCTGlassIconView');
for (const name of ['GlassIconSurface.swift', 'RCTGlassIconView.h', 'RCTGlassIconView.mm']) {
	assert(existsSync(new URL(`platform/ios/${name}`, root)));
}
const iconTransform = require('@babel/core').transformSync(iconSpec, {
	filename: fileURLToPath(iconSpecPath),
	babelrc: false,
	configFile: false,
	plugins: [require.resolve('@react-native/babel-plugin-codegen')],
	parserOpts: { plugins: ['typescript'] },
});
assert(iconTransform.code.includes('NativeComponentRegistry'));
// iOS input colors must keep a platform sibling so web does not import DynamicColorIOS.
for (const name of ['inputColors.js', 'inputColors.ios.js']) {
	assert(existsSync(new URL(`src/components/TextInput/${name}`, metroRoot)));
}
console.log('Verified package exports, Metro platform files, Codegen/Babel spec, native sources and ESM tree shaking.');

// Both public entry points expose the renamed component API.
for (const entry of ['index', 'components']) {
	const declarations = readFileSync(
		new URL(`dist/types/slice-native/src/${entry === 'components' ? 'components/index' : 'index'}.d.ts`, root),
		'utf8',
	);
	for (const name of ['BackgroundBlur', 'Button', 'FabButton', 'Icon', 'LiquidGlass', 'Text', 'TextInput']) {
		assert(new RegExp(`\\b${name}\\b`).test(declarations), `Missing public component: ${name}`);
	}
}

// Android input action updates keep a platform sibling and an optional TurboModule.
for (const name of ['useKeyboardActionRefresh.js', 'useKeyboardActionRefresh.android.js']) {
	assert(existsSync(new URL(`src/components/TextInput/${name}`, metroRoot)));
}
const keyboardSpecPath = new URL('src/specs/NativeTextInputKeyboard.ts', metroRoot);
const keyboardSpec = readFileSync(keyboardSpecPath, 'utf8');
assert.equal(keyboardSpec, readFileSync(new URL('src/specs/NativeTextInputKeyboard.ts', root), 'utf8'));
assert(!existsSync(new URL('src/specs/NativeTextInputKeyboard.js', metroRoot)));
const keyboardModule = new TypeScriptParser().parseString(keyboardSpec, fileURLToPath(keyboardSpecPath)).modules
	.NativeTextInputKeyboard;
assert.equal(keyboardModule.moduleName, 'SliceTextInputKeyboard');
assert.deepEqual(
	keyboardModule.spec.methods.map((method) => method.name),
	['restartInput'],
);
assert(existsSync(new URL('platform/android/src/main/java/com/slice/SliceTextInputKeyboardModule.java', root)));

for (const entry of ['index', 'components']) {
	const fab = await bundleSelection(entry, 'FabButton');
	assert(fab.exports.includes('FabButton'));
}
for (const name of ['FabButton.js', 'index.js']) {
	assert(existsSync(new URL(`src/components/FabButton/${name}`, metroRoot)));
}
