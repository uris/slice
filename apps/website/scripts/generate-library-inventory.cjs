const { readFileSync, readdirSync, writeFileSync } = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const source = path.resolve(__dirname, '../../../packages/slice/src');
const storeEntries = readdirSync(path.join(source, 'stores'), { withFileTypes: true })
	.filter((entry) => entry.isDirectory())
	.map((entry) => path.join(source, 'stores', entry.name, 'index.ts'));
const entries = ['index.ts', 'hooks/index.ts', 'utils/index.ts'].map((entry) => path.join(source, entry));
const configPath = ts.findConfigFile(source, ts.sys.fileExists);
const config = ts.readConfigFile(configPath, ts.sys.readFile);
const { options } = ts.parseJsonConfigFileContent(config.config, ts.sys, path.dirname(configPath));
const program = ts.createProgram([...entries, ...storeEntries], options);
const checker = program.getTypeChecker();
const inventory = { components: new Set(), hooks: new Set(), stores: new Set(), utilities: new Set() };
const seen = new Map(Object.keys(inventory).map((category) => [category, new Set()]));

function add(category, symbol, name) {
	if (seen.get(category).has(symbol)) return;
	seen.get(category).add(symbol);
	inventory[category].add(name);
}
function inspect(file) {
	const module = checker.getSymbolAtLocation(program.getSourceFile(file));
	if (!module) throw new Error(`Missing public entry point: ${file}`);
	for (const exported of checker.getExportsOfModule(module)) {
		const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
		if (!(symbol.flags & ts.SymbolFlags.Value)) continue;
		const declaration = symbol.valueDeclaration ?? symbol.declarations?.[0];
		if (!declaration) continue;
		const name = exported.name;
		const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
		const callable = type.getCallSignatures().length > 0;
		const constructable = type.getConstructSignatures().length > 0;
		const origin = declaration.getSourceFile().fileName.replaceAll('\\', '/');
		if (storeEntries.includes(file)) {
			if (type.getProperty('getState') && type.getProperty('subscribe')) add('stores', symbol, name);
		} else if (file === entries[2]) {
			if (callable || constructable) add('utilities', symbol, name);
		} else if (/^use[A-Z]/.test(name) && callable) {
			add('hooks', symbol, name);
		} else if (file === entries[0]) {
			if (/^[A-Z]/.test(name) && callable && /\/(components|providers)\//.test(origin)) add('components', symbol, name);
			else if (/^[a-z]/.test(name) && (callable || constructable)) add('utilities', symbol, name);
		}
	}
}
for (const file of [...entries, ...storeEntries]) inspect(file);
const data = Object.fromEntries(Object.entries(inventory).map(([key, values]) => [key, [...values].sort()]));
const target = path.resolve(__dirname, '../src/content/documents/react/overview/libraryInventory.json');
const output = `${JSON.stringify(data, null, '\t')}\n`;
let previous;
try {
	previous = readFileSync(target, 'utf8');
} catch {
	/* First generation. */
}
if (previous !== output) writeFileSync(target, output);
console.log(
	Object.entries(data)
		.map(([key, values]) => `${key}: ${values.length}`)
		.join(', '),
);
