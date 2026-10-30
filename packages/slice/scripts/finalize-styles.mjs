import { promises as fs } from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const esmStylesPath = path.join(distDir, 'esm', 'styles.css');
const cjsStylesPath = path.join(distDir, 'cjs', 'styles.css');
const packageStylesPath = path.join(distDir, 'styles.css');

async function readIfExists(filePath) {
	try {
		return await fs.readFile(filePath, 'utf8');
	} catch (error) {
		if (error && typeof error === 'object' && 'code' in error) {
			if (error.code === 'ENOENT') return null;
		}
		throw error;
	}
}

async function removeIfExists(filePath) {
	try {
		await fs.rm(filePath);
	} catch (error) {
		if (error && typeof error === 'object' && 'code' in error) {
			if (error.code === 'ENOENT') return;
		}
		throw error;
	}
}

const esmStyles = await readIfExists(esmStylesPath);
const cjsStyles = await readIfExists(cjsStylesPath);
const packageStyles = esmStyles ?? cjsStyles;

console.log('Consolidating extracted CSS files...');

if (!packageStyles) {
	throw new Error('Expected an extracted stylesheet in dist/esm or dist/cjs.');
}

if (esmStyles && cjsStyles && esmStyles !== cjsStyles) {
	throw new Error('Extracted ESM and CJS stylesheets differ.');
}

await fs.writeFile(packageStylesPath, packageStyles);
await removeIfExists(esmStylesPath);
await removeIfExists(cjsStylesPath);

console.log('Consolidating extracted CSS files done.');
