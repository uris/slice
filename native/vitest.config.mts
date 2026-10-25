import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Deliberately independent of the root web/Storybook projects and coverage gate.
export default defineConfig({
	root: fileURLToPath(new URL('.', import.meta.url)),
	test: {
		name: 'native',
		environment: 'node',
		include: ['components/**/*.test.{ts,tsx}', 'theme/**/*.test.ts'],
	},
});
