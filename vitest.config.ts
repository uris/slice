import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

const coverageExclude = [
	'node_modules/**',
	'dist/**',
	'coverage/**',
	'storybook-static/**',
	'reports/**',
	'public/**',
	'**/*.bench.{ts,tsx}',
	'**/*.stories.{ts,tsx}',
	'**/*.css',
	'.storybook/**',
];

// Browser-mode (v8) coverage captures EVERYTHING that executes in the page -
// Vite's client/HMR runtime, the coverage-v8 browser hook itself, CSS module
// scripts, etc. Those aren't real source files and don't have usable source
// maps, which can make the report-merge step throw and silently produce no
// report at all. Scoping to an explicit include is more reliable than trying
// to exclude every virtual/internal module by name.
const coverageInclude = ['src/**/*.{ts,tsx}'];

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
	plugins: [react()],
	test: {
		coverage: {
			provider: 'v8',
			reporter: ['text', 'json', 'html'],
			reportsDirectory: 'reports/coverage',
			include: coverageInclude,
			exclude: coverageExclude,
			thresholds: {
				// Coverage floor. CI runs `npm run coverage` and fails the build if
				// coverage drops below these numbers.
				//
				// Set ~1.5 points below the last confirmed-stable full-suite
				// run on purpose, not matched exactly to it. v8/browser-mode coverage
				// has small run-to-run measurement noise (a few hundredths of a
				// percent), so an exact-matched threshold fails intermittently
				//
				// autoUpdate is intentionally OFF: it rewrites this file on every run
				//
				// To raise the floor: run `npm run coverage` locally a few times to
				// find a stable current number, then hand-set these values to roughly
				// 1.5 points below that, and run `npm run lint` to fix formatting
				// before committing. Never set them to exactly the last measured
				// number, and never lower them to make a failing PR pass.
				statements: 69.4,
				branches: 61.8,
				functions: 65.2,
				lines: 71.7,
			},
		},
		projects: [
			{
				test: {
					name: 'unit',
					environment: 'jsdom',
					globals: true,
					include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
					exclude: ['**/*.stories.{ts,tsx}', '**/*.bench.{ts,tsx}', '**/*.mdx'],
				},
			},
			{
				test: {
					name: 'benchmarks',
					environment: 'jsdom',
					globals: true,
					setupFiles: ['./benchmarks/setup.tsx'],
					include: ['**/*.bench.{ts,tsx}'],
					benchmark: {
						include: ['**/*.bench.{ts,tsx}'],
						exclude: ['node_modules', 'dist'],
					},
				},
			},
			{
				plugins: [
					// The plugin will run tests for the stories defined in your Storybook config
					// See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
					react(),
					storybookTest({
						configDir: path.join(dirname, '.storybook'),
					}),
				],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({}),
						instances: [
							{
								browser: 'chromium',
							},
						],
					},
					setupFiles: ['.storybook/vitest.setup.ts'],
				},
			},
		],
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@components': path.resolve(__dirname, './src/components'),
		},
	},
});
