import { createRequire } from 'node:module';
import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-native-web-vite';

const require = createRequire(import.meta.url);

const config: StorybookConfig = {
	stories: [
		'../../../packages/slice-native/src/**/*.stories.@(ts|tsx)',
		'../../../packages/slice-native/src/**/*.mdx',
		'../../../packages/slice-native/documentation/**/*.mdx',
	],
	typescript: {
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			tsconfigPath: path.resolve('.storybook/tsconfig.json'),
			propFilter: (prop) => !prop.parent?.fileName.includes('node_modules'),
		},
	},
	addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
	framework: {
		name: '@storybook/react-native-web-vite',
		options: {
			modulesToTranspile: ['react-native-reanimated', 'react-native-worklets'],
			pluginReactOptions: { babel: { plugins: [require.resolve('react-native-worklets/plugin')] } },
		},
	},
	viteFinal(config) {
		config.resolve = config.resolve || {};
		config.resolve.dedupe = ['react', 'react-dom', 'react-native-web'];
		// SVG's lazy native sound module must not be scanned by the dev optimizer.
		// Prebundle only its CommonJS path parser; serve its browser elements as ESM.
		config.optimizeDeps = config.optimizeDeps || {};

		config.optimizeDeps.exclude = [...(config.optimizeDeps.exclude || []), 'react-native-svg'];
		// This generated parser is CommonJS even in SVG's ESM distribution.
		// Vite serves excluded dependencies directly, so expose its real functions as ESM.
		config.plugins = [
			...(config.plugins || []),
			{
				name: 'svg-web-parser-commonjs',
				apply: 'serve',
				transform(code, id) {
					const file = id.split('?')[0];
					if (
						!file.includes('/react-native-svg/lib/module/') ||
						!/(?:transform|transformToRn|extractFiltersString)\.js$/.test(file)
					)
						return;
					const exports = /module\.exports\s*=\s*\{([\s\S]*?)\};/;
					const match = code.match(exports);
					if (!match) throw new Error('SVG parser export format changed; update the Storybook ESM bridge.');
					const names = [...match[1].matchAll(/(?:^|,)\s*(\w+)\s*:/g)].map((entry) => entry[1]);
					if (!names.includes('parse')) throw new Error('SVG parser no longer exports parse.');
					return { code: code.replace(exports, `export const { ${names.join(', ')} } = {${match[1]}};`), map: null };
				},
			},
		];
		const aliases = config.resolve.alias || {};
		config.resolve.alias = [
			{
				find: /^react-native-svg$/,
				replacement: path.join(
					path.dirname(require.resolve('react-native-svg/package.json')),
					'lib/module/elements.web.js',
				),
			},
			{
				find: '@react-native/assets-registry/registry',
				replacement: path.join(
					path.dirname(require.resolve('react-native-web/package.json')),
					'dist/modules/AssetRegistry/index.js',
				),
			},
			{ find: /^react$/, replacement: path.dirname(require.resolve('react/package.json')) },
			{ find: /^react\/(.*)$/, replacement: `${path.dirname(require.resolve('react/package.json'))}/$1` },
			{ find: /^react-dom$/, replacement: path.dirname(require.resolve('react-dom/package.json')) },
			...(Array.isArray(aliases)
				? aliases
				: Object.entries(aliases).map(([find, replacement]) => ({ find, replacement }))),
		];
		return config;
	},
};
export default config;
