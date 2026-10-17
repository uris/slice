import { readFileSync, rmSync } from 'node:fs';
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

	const bundle = await rollup({
		input: fileURLToPath(new URL('index.js', temporary)),
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
		await bundle.write({ file: fileURLToPath(new URL('cjs/index.js', dist)), format: 'cjs', exports: 'named' });
		await bundle.write({ file: fileURLToPath(new URL('esm/index.mjs', dist)), format: 'es' });
	} finally {
		await bundle.close();
	}
	console.log('Built native icons: dist/cjs, dist/esm, dist/types');
} catch (error) {
	rmSync(dist, { recursive: true, force: true });
	throw error;
} finally {
	rmSync(temporary, { recursive: true, force: true });
}
