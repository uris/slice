import { join, resolve } from 'node:path';
import type { NextConfig } from 'next';

// resolved path to slice package source
const sliceSource = resolve(__dirname, '../../packages/slice/src');

const config: NextConfig = {
	allowedDevOrigins: ['127.0.0.1'],
	trailingSlash: true,
	transpilePackages: ['@apple-pie/slice'],
	// keep local slice package source edits visible without a separate library build.
	webpack(config) {
		config.resolve.alias['@apple-pie/slice/styles.css'] = join(sliceSource, 'theme.css');
		// Motion's relative map comments can survive in client boundary modules.
		// Strip the upstream references before Next.js generates its own maps.
		config.module.rules.push({
			test: /\.mjs$/,
			include: /node_modules[\\/]framer-motion[\\/]/,
			enforce: 'pre',
			use: [join(__dirname, 'loaders/strip-source-map-url.cjs')],
		});
		return config;
	},
};

export default config;
