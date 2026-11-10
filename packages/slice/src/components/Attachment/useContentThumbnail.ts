import { useEffect, useState } from 'react';
import { resolveFileIconType } from '../../utils';
import { FileIconTypes } from '../FileIcon';
import { type Content, ContentType } from './_types';

export type ContentThumbnail = { type: 'image'; src: string } | { type: 'text'; text: string };

/** Image URLs belong to this hook and are revoked on replacement or unmount. */
export function useContentThumbnail(content: Content | undefined) {
	const file = getFile(content);
	const [preview, setPreview] = useState<{
		file: File;
		thumbnail?: ContentThumbnail;
		status: 'loading' | 'ready' | 'error';
	}>();
	const contentType = getContentType(content);
	const contentFormat = getContentFormat(content);
	const previewable =
		file instanceof File && (contentFormat === FileIconTypes.image || isTextFile(file, contentFormat));

	useEffect(() => {
		if (!(file instanceof File) || !previewable) {
			setPreview(undefined);
			return;
		}
		if (contentFormat === FileIconTypes.image) {
			let src: string;
			try {
				src = URL.createObjectURL(file);
			} catch {
				setPreview({ file, status: 'error' });
				return;
			}
			setPreview({ file, thumbnail: { type: 'image', src }, status: 'ready' });
			return () => URL.revokeObjectURL(src);
		}
		const reader = new FileReader();
		setPreview({ file, status: 'loading' });
		reader.onload = () => {
			if (typeof reader.result === 'string') {
				setPreview({ file, thumbnail: { type: 'text', text: reader.result.slice(0, 250) }, status: 'ready' });
			} else setPreview({ file, status: 'error' });
		};
		reader.onerror = () => setPreview({ file, status: 'error' });
		// A bounded UTF-8 prefix is enough for the thumbnail; avoid reading whole uploads.
		reader.readAsText(file.slice(0, 4096));
		return () => {
			reader.onload = null;
			reader.onerror = null;
			if (reader.readyState === FileReader.LOADING) reader.abort();
		};
	}, [file, contentFormat, previewable]);

	const current = preview?.file === file ? preview : undefined;
	const getThumbnail = (): ContentThumbnail | undefined => {
		if (typeof content === 'string') return { type: 'text', text: content.slice(0, 250) };
		return current?.thumbnail;
	};

	return {
		contentType,
		contentFormat,
		thumbnail: getThumbnail(),
		isLoading: previewable && (!current || current.status === 'loading'),
		fileName: typeof content === 'string' ? 'clipboard' : getFileName(file),
		fileExtension: getFileExtension(file),
		fileSize: file instanceof File ? formatFileSize(file.size) : undefined,
	};
}

function getFile(content: Content | undefined) {
	if (typeof content !== 'object') return undefined;
	return 'file' in content ? content.file : content;
}

function getContentType(content: Content | undefined) {
	if (content === undefined) return undefined;
	if (typeof content === 'string') return ContentType.Text;
	return ContentType.File;
}

function getContentFormat(content: Content | undefined) {
	if (content === undefined) return undefined;
	if (typeof content === 'string') return FileIconTypes.text;
	const file = getFile(content);
	if (file === undefined) return undefined;
	if (typeof file === 'string') return resolveFileIconType(file);
	if (file.type.startsWith('image/')) return FileIconTypes.image;
	return resolveFileIconType(file.name);
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
