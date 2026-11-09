import type { FileItem } from './_types';

const identities = new WeakMap<object, number>();
let nextIdentity = 0;

/** IDs survive immutable updates; object identity supports existing controlled arrays. */
export function fileItemKey(item: FileItem): string {
	if (item.id !== undefined) return `id:${item.id}`;
	const identity = typeof item.file === 'string' ? item : item.file;
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
