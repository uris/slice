import type { FileIconType } from '../../components/FileIcon/_types';

/**
 * Split a file name into its display name and extension.
 */
export function nameAndExtension(fileName: string) {
	const ext = fileName.split('.').pop() ?? 'unknown';
	return { name: fileName, ext };
}

/** Resolve filename/extension or File.name only; MIME type is deliberately ignored. */
export function resolveFileIconType(file?: string | Pick<File, 'name'>): FileIconType {
	let name = typeof file === 'string' ? file : file?.name;
	if (!name?.trim()) return 'other';
	name = name.trim();
	// URL/path suffixes are transport metadata; literal File names are left intact.
	if (typeof file === 'string' && (/^[a-z][a-z0-9+.-]*:\/\//i.test(name) || name.includes('/')))
		name = name.split(/[?#]/)[0];
	const basename = name.split(/[\\/]/).pop() ?? '';
	const extension = (basename.split('.').pop() ?? '').toLowerCase();
	return extensions.get(extension) ?? 'other';
}

const extensions = new Map<string, FileIconType>(
	Object.entries({
		pdf: ['pdf'],
		text: ['txt', 'text', 'rtf', 'doc', 'docx', 'odt', 'pages', 'log', 'clipboard'],
		sheet: ['xls', 'xlsx', 'xlsm', 'xlsb', 'csv', 'tsv', 'ods', 'numbers'],
		preso: ['ppt', 'pptx', 'pps', 'ppsx', 'odp', 'key'],
		md: ['md', 'markdown', 'mdown', 'mdx'],
		code: [
			'html',
			'htm',
			'css',
			'scss',
			'sass',
			'less',
			'js',
			'jsx',
			'mjs',
			'cjs',
			'ts',
			'tsx',
			'json',
			'xml',
			'yaml',
			'yml',
			'py',
			'java',
			'c',
			'h',
			'cpp',
			'hpp',
			'cs',
			'go',
			'rs',
			'rb',
			'php',
			'swift',
			'kt',
			'sh',
			'sql',
			'toml',
			'ini',
		],
		image: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'avif', 'heic', 'heif', 'bmp', 'tif', 'tiff', 'ico'],
		audio: ['mp3', 'wav', 'wave', 'aif', 'aiff', 'ogg', 'oga', 'opus', 'aac', 'm4a', 'flac', 'wma'],
		video: ['mp4', 'm4v', 'mov', 'webm', 'avi', 'wmv', 'flv', 'mkv', 'mpeg', 'mpg', 'ogv', '3gp'],
	} satisfies Record<Exclude<FileIconType, 'other'>, string[]>).flatMap(([type, values]) =>
		values.map((extension): [string, FileIconType] => [extension, type as FileIconType]),
	),
);

/**
 * Create a clipboard-text file with a guaranteed `.clipboard` extension.
 */
export function clipboardTextToFile(content: string, fileName = `clipboard-${Date.now()}.clipboard`) {
	const normalizedName = fileName.endsWith('.clipboard') ? fileName : `${fileName}.clipboard`;
	return new File([content], normalizedName, { type: 'text/plain' });
}
