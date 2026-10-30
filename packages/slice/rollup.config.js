import fs from 'node:fs';
import path from 'node:path';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import url from '@rollup/plugin-url';
import svgr from '@svgr/rollup';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import stripCode from 'rollup-plugin-strip-code';
import preserveDirectivesPlugin from 'rollup-preserve-directives';

const shouldMinify = process.env.MINIFY === 'true';
const keepJsDocComments = (_node, comment) => comment.type === 'comment2' && comment.value.startsWith('*');
const preserveDirectives = preserveDirectivesPlugin.default ?? preserveDirectivesPlugin;

const buildInputs = () => {
	const inputs = {
		index: 'src/index.ts',
		hooks: 'src/hooks/index.ts',
		providers: 'src/providers/index.ts',
		stores: 'src/stores/index.ts',
		theme: 'src/theme/index.ts',
		utils: 'src/utils/index.ts',
		'utils/objects': 'src/utils/objects/index.ts',
	};

	const componentsDir = path.resolve('src/components');
	for (const entry of fs.readdirSync(componentsDir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const componentEntry = path.join(componentsDir, entry.name, 'index.ts');
		if (fs.existsSync(componentEntry)) {
			inputs[`components/${entry.name}`] = componentEntry;
		}
	}

	const hooksDir = path.resolve('src/hooks');
	for (const entry of fs.readdirSync(hooksDir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		const hookName = entry.name;
		const tsEntry = path.join(hooksDir, hookName, `${hookName}.ts`);
		const tsxEntry = path.join(hooksDir, hookName, `${hookName}.tsx`);
		if (fs.existsSync(tsEntry)) {
			inputs[`hooks/${hookName}`] = tsEntry;
			continue;
		}
		if (fs.existsSync(tsxEntry)) {
			inputs[`hooks/${hookName}`] = tsxEntry;
		}
	}

	const providersDir = path.resolve('src/providers');
	for (const fileName of fs.readdirSync(providersDir)) {
		if (!fileName.endsWith('.ts') && !fileName.endsWith('.tsx')) continue;
		if (fileName === 'index.ts') continue;
		if (fileName.includes('.stories.')) continue;
		const providerName = fileName.replace(/\.(ts|tsx)$/, '');
		inputs[`providers/${providerName}`] = path.join(providersDir, fileName);
	}

	const storesDir = path.resolve('src/stores');
	if (fs.existsSync(storesDir)) {
		for (const entry of fs.readdirSync(storesDir, { withFileTypes: true })) {
			if (!entry.isDirectory()) continue;
			const storeEntry = path.join(storesDir, entry.name, 'index.ts');
			if (fs.existsSync(storeEntry)) {
				inputs[`stores/${entry.name}`] = storeEntry;
			}
		}
	}

	const workersDir = path.resolve('src/workers');
	if (fs.existsSync(workersDir)) {
		for (const entry of fs.readdirSync(workersDir, { withFileTypes: true })) {
			if (!entry.isDirectory()) continue;
			const workerName = entry.name;
			const candidates = [
				path.join(workersDir, workerName, `${workerName}.ts`),
				path.join(workersDir, workerName, `${workerName}.worker.ts`),
				path.join(workersDir, workerName, 'index.ts'),
			];
			const workerEntry = candidates.find((candidate) => fs.existsSync(candidate));
			if (!workerEntry) continue;
			inputs[`workers/${workerName}/${workerName}`] = workerEntry;
		}
	}

	const themeEntries = [
		['theme/colors', 'src/theme/colors/colors.ts'],
		['theme/corners', 'src/theme/corners/corners.ts'],
		['theme/elevations', 'src/theme/elevations/elevations.ts'],
		['theme/motion', 'src/theme/motion/motion.ts'],
		['theme/type', 'src/theme/type/type.ts'],
		['theme/themes', 'src/theme/themes.ts'],
	];
	for (const [outputName, inputPath] of themeEntries) {
		if (fs.existsSync(path.resolve(inputPath))) {
			inputs[outputName] = inputPath;
		}
	}

	return inputs;
};

const entryFileName = (format) => (chunkInfo) => {
	const ext = format === 'esm' ? '.mjs' : '.js';
	if (chunkInfo.name === 'index') return `index${ext}`;
	if (chunkInfo.name === 'utils') return `utils/index${ext}`;
	if (chunkInfo.name === 'utils/objects') return `utils/objects/index${ext}`;
	if (chunkInfo.name.startsWith('components/')) return `${chunkInfo.name}/index${ext}`;
	if (chunkInfo.name.startsWith('workers/')) return `${chunkInfo.name}${ext}`;
	return `[name]${ext}`;
};

const chunkFileName = (format) => `chunks/[name]-[hash]${format === 'esm' ? '.mjs' : '.js'}`;

// Dynamic import of rollup-plugin-visualizer to avoid bundling it in production
const rollup = async () => {
	const { visualizer } = await import('rollup-plugin-visualizer');

	return {
		input: buildInputs(),
		output: [
			{
				dir: 'dist/cjs',
				format: 'cjs',
				sourcemap: false,
				entryFileNames: entryFileName('cjs'),
				chunkFileNames: chunkFileName('cjs'),
			},
			{
				dir: 'dist/esm',
				format: 'esm',
				sourcemap: false,
				entryFileNames: entryFileName('esm'),
				chunkFileNames: chunkFileName('esm'),
			},
		],
		external: ['react', 'react-dom', 'motion'],
		plugins: [
			stripCode({
				start_comment: 'START.DEBUG',
				end_comment: 'END.DEBUG',
			}),
			peerDepsExternal(),
			resolve({ extensions: ['.js', '.ts', '.tsx'] }),
			commonjs(),
			babel({
				exclude: ['node_modules/**', 'documentation/**'],
				presets: ['@babel/preset-react'],
				babelHelpers: 'bundled',
			}),
			typescript({
				tsconfig: './tsconfig.rollup.json',
				exclude: ['documentation/**', '**/*.stories.ts', '**/*.stories.tsx'],
			}),
			postcss({
				extract: 'styles.css',
				inject: false,
				config: {
					path: path.resolve('postcss.config.cjs'),
				},
			}),
			svgr({
				icon: true, // Optimize for icon size
				svgo: true, // Enable SVGO for optimizing SVGs
				svgoConfig: {
					// Custom SVGO config (optional)
					plugins: [{ name: 'removeViewBox', active: false }],
				},
			}),
			// Export SVGs and PNgs as URLs for assets
			// include public path to make sure these get refenced ok
			url({
				include: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.gif'],
				limit: 0, // Always copy images as assets
				fileName: 'assets/[name][extname]',
				emitFiles: true,
				publicPath: '../', // Change to navigate from dist/index.js to dist/assets
			}),
			terser(
				shouldMinify
					? {
							compress: {
								pure_funcs: ['console.log'],
							},
							format: {
								comments: keepJsDocComments,
							},
						}
					: {
							compress: {
								pure_funcs: ['console.log'],
							},
							mangle: false,
							format: {
								beautify: true,
								comments: keepJsDocComments,
							},
						},
			),
			visualizer({
				filename: 'reports/package-size-visualizer.html',
				gzipSize: true,
				brotliSize: true,
			}),
			preserveDirectives(),
		],
	};
};
export default rollup;
