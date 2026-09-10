import path from 'node:path';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', '../src/**/*.mdx', '../documentation/**/*.mdx'],
	addons: [
		'@storybook/addon-onboarding',
		'@chromatic-com/storybook',
		'@storybook/addon-docs',
		'@storybook/addon-a11y',
		'@storybook/addon-vitest',
	],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	tags: {
		tests: { defaultFilterSelection: 'exclude' }, // default filter out test
	},
	staticDirs: [{ from: '../public', to: '/public' }],
	viteFinal: (config) => {
		config.resolve = config.resolve || {};
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			src: path.resolve(process.cwd(), 'src'),
		};

		// Remove @fs prefix for image paths
		config.server = config.server || {};
		config.server.fs = {
			strict: false,
			allow: ['/'],
		};

		return config;
	},
};
export default config;
