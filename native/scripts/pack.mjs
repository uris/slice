import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = fileURLToPath(new URL('../pack/', import.meta.url));
mkdirSync(destination, { recursive: true });

// Isolate packaging from permissions or stale data in the user's global npm cache.
const cache = mkdtempSync(join(tmpdir(), 'slice-native-pack-'));
try {
	// npm pack runs prepack, ensuring the archive includes a fresh build.
	const result = spawnSync(
		process.execPath,
		[process.env.npm_execpath, 'pack', '.', '--cache', cache, '--pack-destination', destination],
		{ cwd: root, stdio: 'inherit' },
	);
	if (result.error) throw result.error;
	process.exitCode = result.status ?? 1;
	if (process.exitCode === 0) {
		const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
		console.log(`\nTarball created: ${join(destination, `apple-pie-slice-native-${version}.tgz`)}`);
	}
} finally {
	rmSync(cache, { recursive: true, force: true });
}
