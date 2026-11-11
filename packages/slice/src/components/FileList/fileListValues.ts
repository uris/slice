import type { FileItem } from './_types';

const identities = new WeakMap<object, number>();
let nextIdentity = 0;

/** IDs survive immutable updates; object identity supports existing controlled arrays. */
export function fileItemKey(item: File | FileItem): string {
	const fileItem = 'file' in item ? item : undefined;
	if (fileItem?.id !== undefined) return `id:${fileItem.id}`;
	const identity = fileItem && typeof fileItem.file !== 'string' ? fileItem.file : item;
	let key = identities.get(identity);
	if (key === undefined) {
		key = nextIdentity++;
		identities.set(identity, key);
	}
	return `object:${key}`;
}

/** Progress uses percentages only. Invalid or missing values are indeterminate while uploading. */
export function fileProgress(item: FileItem): number | undefined {
	if (typeof item.progress !== 'number' || !Number.isFinite(item.progress)) return item.uploading ? undefined : 100;
	return Math.round(Math.max(0, Math.min(100, item.progress)));
}
