module.exports = {
	plugins: [
		require('postcss-import'),
		require('postcss-nested').default,
		require('@csstools/postcss-global-data')({
			files: [require('node:path').join(__dirname, 'src/theme/breakpoints/custom-media.css')],
		}),
		require('postcss-custom-media')({ preserve: false }),
	],
};
