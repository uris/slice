import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Deliberately independent of the root web/Storybook projects and coverage gate.
export default defineConfig({
	root: fileURLToPath(new URL('.', import.meta.url)),
	resolve: { alias: { react: fileURLToPath(new URL('../node_modules/react', import.meta.url)) } },
	test: {
		name: 'native',
		environment: 'node',
		include: ['components/**/*.test.{ts,tsx}', 'theme/**/*.test.ts', 'providers/**/*.test.tsx'],
		coverage: {
			provider: 'v8',
			reportsDirectory: './coverage',
			reporter: ['text', 'html', 'lcov', 'json-summary'],
			include: ['index.ts', 'components/**/*.{ts,tsx}', 'providers/**/*.{ts,tsx}', 'theme/**/*.ts'],
			exclude: ['**/*.test.{ts,tsx}', '**/*.d.ts', '**/_types.ts'],
		},
	},
});
