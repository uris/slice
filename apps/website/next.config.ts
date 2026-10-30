import path from 'node:path';
import type { NextConfig } from 'next';

const sliceSource = path.resolve(__dirname, '../../packages/slice/src');

const config: NextConfig = {
	output: 'export',
	trailingSlash: true,
	transpilePackages: ['@apple-pie/slice'],
	// Keep local Slice source edits visible without a separate library build.
	webpack(config) {
		config.resolve.alias['@apple-pie/slice/styles.css'] = path.join(sliceSource, 'theme.css');
		return config;
	},
};

export default config;
