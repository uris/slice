/** Clipboard length and native maxLength both use JavaScript string length. */
export function pasteBecomesAttachment(text: string, threshold?: number) {
	return typeof threshold === 'number' && Number.isFinite(threshold) && threshold >= 0 && text.length > threshold;
}
export function insertPromptText(value: string, text: string, start: number, end: number, maxLength?: number) {
	const before = value.slice(0, start);
	const after = value.slice(end);
	let inserted = text;
	if (typeof maxLength === 'number' && Number.isFinite(maxLength) && maxLength >= 0) {
		let limit = Math.max(0, Math.floor(maxLength) - before.length - after.length);
		const previous = text.charCodeAt(limit - 1);
		const next = text.charCodeAt(limit);
		if (previous >= 0xd800 && previous <= 0xdbff && next >= 0xdc00 && next <= 0xdfff) limit -= 1;
		inserted = text.slice(0, limit);
	}
	return { value: before + inserted + after, caret: before.length + inserted.length };
}
