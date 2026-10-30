module.exports = {
	plugins: {
		'postcss-import': {},
		[require.resolve('./postcss-nested.cjs')]: {},
		'@csstools/postcss-global-data': {
			files: [require('node:path').resolve(__dirname, '../../packages/slice/src/theme/breakpoints/custom-media.css')],
		},
		'postcss-custom-media': { preserve: false },
	},
};
