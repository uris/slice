import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const repository = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
	root: fileURLToPath(new URL('.', import.meta.url)),
	server: {
		open: true,
	},
	plugins: [
		react({
			babel: {
				plugins: [
					{
						name: 'landing-client-directives',
						visitor: {
							Directive(directive: { node: { value: { value: string } }; remove: () => void }) {
								// This app runs entirely in the browser; no server/client boundary is needed.
								// Remove the library directive before Rollup tries to report it through sourcemaps.
								if (directive.node.value.value === 'use client') directive.remove();
							},
						},
					},
				],
			},
		}),
	],
	// Consume the local Slice source through the same imports used by package consumers.
	resolve: {
		alias: {
			'@apple-pie/slice/components': path.join(repository, 'src/components'),
			'@apple-pie/slice/providers': path.join(repository, 'src/providers'),
			'@apple-pie/slice/hooks': path.join(repository, 'src/hooks'),
			'@apple-pie/slice/utils': path.join(repository, 'src/utils'),
			'@apple-pie/slice/theme': path.join(repository, 'src/theme'),
			'@apple-pie/slice/styles.css': path.join(repository, 'src/theme.css'),
			'@apple-pie/slice': path.join(repository, 'src/index.ts'),
		},
		dedupe: ['react', 'react-dom'],
	},
	build: { outDir: 'dist', emptyOutDir: true },
});
