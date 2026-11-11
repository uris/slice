import type { UploadFileRejection } from './_types';

/** Picker hints and runtime validation share one normalized, deduplicated token list. */
export function normalizeAcceptedTypes(types: readonly string[]): string[] {
	const tokens = types.map((value) => {
		const token = value.trim().toLowerCase();
		if (!token || token.includes('/')) return token;
		return token.startsWith('.') ? token : `.${token}`;
	});
	return [
		...new Set(
			tokens.filter(
				(token) =>
					/^\.[a-z0-9][a-z0-9._+-]*$/.test(token) ||
					/^(audio|video|image)\/\*$/.test(token) ||
					/^[a-z0-9!#$&^_.+-]+\/[a-z0-9!#$&^_.+-]+$/.test(token),
			),
		),
	];
}

export function selectUploadFiles(files: readonly File[], types: readonly string[], multiple: boolean) {
	const tokens = normalizeAcceptedTypes(types);
	const accepted: File[] = [];
	const rejected: UploadFileRejection[] = [];
	for (const file of files) {
		const matches =
			types.length === 0 ||
			tokens.some((token) => {
				if (token.startsWith('.')) return file.name.toLowerCase().endsWith(token);
				const mime = file.type.toLowerCase().split(';')[0].trim();
				if (token.endsWith('/*')) return mime.startsWith(token.slice(0, -1));
				return mime === token;
			});
		if (!matches) rejected.push({ file, reason: 'type' });
		else if (!multiple && accepted.length) rejected.push({ file, reason: 'multiple' });
		else accepted.push(file);
	}
	return { accepted, rejected };
}
