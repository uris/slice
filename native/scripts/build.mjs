import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { rollup } from 'rollup';
import ts from 'typescript';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
const temporary = new URL('.build/', root);
const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'));
const peers = Object.keys(manifest.peerDependencies);
const configPath = fileURLToPath(new URL('tsconfig.build.json', root));
const formatHost = {
	getCanonicalFileName: (name) => name,
	getCurrentDirectory: () => fileURLToPath(root),
	getNewLine: () => '\n',
};

function check(diagnostics) {
	if (diagnostics.length) throw new Error(ts.formatDiagnosticsWithColorAndContext(diagnostics, formatHost));
}

rmSync(dist, { recursive: true, force: true });
rmSync(temporary, { recursive: true, force: true });
try {
	const config = ts.readConfigFile(configPath, ts.sys.readFile);
	check(config.error ? [config.error] : []);
	const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, fileURLToPath(root), undefined, configPath);
	check(parsed.errors);
	const program = ts.createProgram(parsed.fileNames, parsed.options);
	check(ts.getPreEmitDiagnostics(program));
	check(program.emit().diagnostics);

	// Metro needs extensionless imports and platform siblings (.ios.js / .js).
	// Keep shared token modules emitted by TypeScript inside this package too.
	const metro = new URL('react-native/', dist);
	cpSync(temporary, metro, { recursive: true });
	const metroSpecs = new URL('native/src/specs/', metro);
	mkdirSync(metroSpecs, { recursive: true });
	// Babel's Codegen transform needs the original prop types, not tsc's JS output.
	for (const name of readdirSync(new URL('src/specs/', root))) {
		if (!name.endsWith('.ts')) continue;
		rmSync(new URL(name.replace(/\.ts$/, '.js'), metroSpecs), { force: true });
		cpSync(new URL(`src/specs/${name}`, root), new URL(name, metroSpecs));
	}

	const bundle = await rollup({
		input: {
			index: fileURLToPath(new URL('native/src/index.js', temporary)),
			...Object.fromEntries(
				['components', 'hooks', 'providers', 'utils', 'theme'].map((name) => [
					name,
					fileURLToPath(new URL(`native/src/${name}/index.js`, temporary)),
				]),
			),
		},
		external: (id) => peers.some((peer) => id === peer || id.startsWith(`${peer}/`)),
		plugins: [
			{
				name: 'resolve-emitted-javascript',
				resolveId(source, importer) {
					if (!source.startsWith('.') || !importer) return null;
					const resolved = ts.resolveModuleName(
						source,
						importer,
						{ moduleResolution: ts.ModuleResolutionKind.Bundler, allowJs: true },
						ts.sys,
					);
					return resolved.resolvedModule?.resolvedFileName ?? null;
				},
			},
		],
		onwarn(warning, warn) {
			if (warning.code === 'UNRESOLVED_IMPORT') throw new Error(warning.message);
			warn(warning);
		},
	});
	try {
		await bundle.write({
			dir: fileURLToPath(new URL('cjs/', dist)),
			entryFileNames: '[name].js',
			preserveModules: true,
			preserveModulesRoot: fileURLToPath(new URL('native/', temporary)),
			format: 'cjs',
			exports: 'named',
		});
		await bundle.write({
			dir: fileURLToPath(new URL('esm/', dist)),
			entryFileNames: '[name].mjs',
			chunkFileNames: '[name]-[hash].mjs',
			preserveModules: true,
			preserveModulesRoot: fileURLToPath(new URL('native/', temporary)),
			format: 'es',
		});
	} finally {
		await bundle.close();
	}
	console.log('Built slice native: dist/cjs, dist/esm, dist/types');
} catch (error) {
	rmSync(dist, { recursive: true, force: true });
	throw error;
} finally {
	rmSync(temporary, { recursive: true, force: true });
}
