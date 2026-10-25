import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Deliberately independent of the root web/Storybook projects and coverage gate.
export default defineConfig({
	root: fileURLToPath(new URL('.', import.meta.url)),
	resolve: { alias: { react: fileURLToPath(new URL('../node_modules/react', import.meta.url)) } },
	test: {
		name: 'native',
		environment: 'node',
		include: ['src/**/*.test.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			reportsDirectory: './coverage',
			reporter: ['text', 'html', 'lcov', 'json-summary'],
			include: ['index.ts', 'src/**/*.{ts,tsx}'],
			exclude: ['**/*.test.{ts,tsx}', '**/*.d.ts', '**/_types.ts'],
		},
	},
});
