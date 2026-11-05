module.exports = function stripSourceMapUrl(source, map) {
	this.callback(null, source.replace(/^[ \t]*\/\/[#@][ \t]*sourceMappingURL=.*$/gm, ''), map);
};
