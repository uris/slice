import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Deliberately independent of the root web/Storybook projects and coverage gate.
export default defineConfig({
	root: fileURLToPath(new URL('.', import.meta.url)),
	resolve: { alias: { react: fileURLToPath(new URL('../../node_modules/react', import.meta.url)) } },
	test: {
		name: 'native',
		environment: 'node',
		include: ['src/**/*.test.{ts,tsx}'],
		coverage: {
			provider: 'v8',
			thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
			reportsDirectory: './coverage',
			reporter: ['text', 'html', 'lcov', 'json-summary'],
			include: ['src/**/*.{ts,tsx}'],
			// Colocated Storybook examples are validated by the Storybook build, not native unit tests.
			exclude: ['**/*.test.{ts,tsx}', '**/*.stories.{ts,tsx}', '**/*.d.ts', '**/_types.ts'],
		},
	},
});
