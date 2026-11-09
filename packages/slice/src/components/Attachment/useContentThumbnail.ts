import { useEffect, useState } from 'react';
import { resolveFileIconType } from '../../utils';
import { FileIconTypes } from '../FileIcon';
import { type Content, ContentType } from './_types';

export type ContentThumbnail = { type: 'image'; src: string } | { type: 'text'; text: string };

/** Image URLs belong to this hook and are revoked on replacement or unmount. */
export function useContentThumbnail(content: Content | undefined) {
	const file = typeof content === 'object' ? content.file : undefined;
	const [text, setText] = useState<{ file: File; value: string }>();
	const [image, setImage] = useState<{ file: File; src: string }>();
	const contentType = getContentType(content);
	const contentFormat = getContentFormat(content);

	useEffect(() => {
		if (!(file instanceof File) || contentFormat !== FileIconTypes.image) return;
		const src = URL.createObjectURL(file);
		setImage({ file, src });
		return () => URL.revokeObjectURL(src);
	}, [file, contentFormat]);

	useEffect(() => {
		if (!(file instanceof File) || !isTextFile(file, contentFormat)) return;
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === 'string') setText({ file, value: reader.result.slice(0, 250) });
		};
		// A bounded UTF-8 prefix is enough for the thumbnail; avoid reading whole uploads.
		reader.readAsText(file.slice(0, 4096));
		return () => {
			reader.onload = null;
			if (reader.readyState === FileReader.LOADING) reader.abort();
		};
	}, [file, contentFormat]);

	const getThumbnail = (): ContentThumbnail | undefined => {
		if (typeof content === 'string') return { type: 'text', text: content.slice(0, 250) };
		if (text && text.file === file) return { type: 'text', text: text.value };
		if (contentFormat === FileIconTypes.image && image && image.file === file) {
			return { type: 'image', src: image.src };
		}
		return undefined;
	};

	return {
		contentType,
		contentFormat,
		thumbnail: getThumbnail(),
		fileName: typeof content === 'string' ? 'clipboard' : getFileName(file),
		fileExtension: getFileExtension(file),
		fileSize: file instanceof File ? formatFileSize(file.size) : undefined,
	};
}

function getContentType(content: Content | undefined) {
	if (content === undefined) return undefined;
	if (typeof content === 'string') return ContentType.Text;
	return ContentType.File;
}

function getContentFormat(content: Content | undefined) {
	if (content === undefined) return undefined;
	if (typeof content === 'string') return FileIconTypes.text;
	if (typeof content.file === 'string') return resolveFileIconType(content.file);
	if (content.file.type.startsWith('image/')) return FileIconTypes.image;
	return resolveFileIconType(content.file.name);
}

function getBasename(file: File | string | undefined) {
	if (file === undefined) return undefined;
	let name = typeof file === 'string' ? file : file.name;
	if (typeof file === 'string' && name.includes('/')) name = name.split(/[?#]/)[0];
	return name.split(/[\\/]/).pop() ?? '';
}

function getFileName(file: File | string | undefined) {
	const basename = getBasename(file);
	if (basename === undefined) return undefined;
	const dot = basename.lastIndexOf('.');
	if (dot <= 0 || dot === basename.length - 1) return basename;
	return basename.slice(0, dot);
}

/** Lowercase extension without a dot; filenames and URL paths are supported. */
function getFileExtension(file: File | string | undefined) {
	const basename = getBasename(file);
	if (basename === undefined) return undefined;
	const dot = basename.lastIndexOf('.');
	if (dot <= 0 || dot === basename.length - 1) return undefined;
	return basename.slice(dot + 1).toLowerCase();
}

/** Use 1024 bytes per k, with at most one decimal place. */
function formatFileSize(bytes: number) {
	const megabyte = 1024 * 1024;
	if (bytes < megabyte) return `${Math.round((bytes / 1024) * 10) / 10} k`;
	return `${Math.round((bytes / megabyte) * 10) / 10} mb`;
}

function isTextFile(file: File, format: ReturnType<typeof getContentFormat>) {
	if (format === FileIconTypes.image) return false;
	if (file.type.startsWith('text/')) return true;
	if (format === FileIconTypes.code || format === FileIconTypes.md) return true;
	return /\.(txt|text|log|clipboard)$/i.test(file.name);
}
