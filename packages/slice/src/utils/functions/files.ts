/**
 * Split a file name into its display name and extension.
 */
export function nameAndExtension(fileName: string) {
	const ext = fileName.split('.').pop() ?? 'unknown';
	return { name: fileName, ext };
}

/**
 * Map a file extension to the corresponding file icon name.
 */
export function fileIconName(extension: string) {
	switch (extension) {
		case 'png':
		case 'jpeg':
		case 'jpg':
		case 'gif':
		case 'heic':
			return 'image';
		case 'docx':
		case 'doc':
		case 'txt':
			return 'text';
		case 'md':
			return 'md';
		case 'html':
		case 'js':
		case 'ts':
		case 'tsx':
		case 'json':
		case 'py':
			return 'code';
		case 'xls':
		case 'xlsx':
		case 'csv':
			return 'sheet';
		case 'ppt':
		case 'pptx':
			return 'preso';
		case 'pdf':
			return 'pdf';
		case 'mp3':
		case 'aif':
		case 'wav':
			return 'audio';
		case 'mp4':
		case 'mov':
			return 'video';
		case 'clipboard':
			return 'clipboard';
		default:
			return 'other';
	}
}

/**
 * Create a clipboard-text file with a guaranteed `.clipboard` extension.
 */
export function clipboardTextToFile(content: string, fileName = `clipboard-${Date.now()}.clipboard`) {
	const normalizedName = fileName.endsWith('.clipboard') ? fileName : `${fileName}.clipboard`;
	return new File([content], normalizedName, { type: 'text/plain' });
}
