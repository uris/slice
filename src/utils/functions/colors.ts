/**
 * Lighten or darken a hex color by mixing it toward white or black.
 */
export const tintFromColor = (hex: string, percent: number) => {
	const normalizedHex = hex.trim().replace('#', '');
	const isValidLength = normalizedHex.length === 3 || normalizedHex.length === 6;
	if (!isValidLength || !/^[0-9a-fA-F]+$/.test(normalizedHex)) return hex;

	const fullHex =
		normalizedHex.length === 3
			? normalizedHex
					.split('')
					.map((char) => `${char}${char}`)
					.join('')
			: normalizedHex;

	// Supports both [-1..1] and [-100..100] input ranges.
	const ratio = Math.max(-1, Math.min(1, Math.abs(percent) > 1 ? percent / 100 : percent));
	const mixTo = ratio >= 0 ? 255 : 0;
	const mix = Math.abs(ratio);

	const channels = [0, 2, 4].map((start) => Number.parseInt(fullHex.slice(start, start + 2), 16));
	const tinted = channels.map((channel) => {
		const next = Math.round(channel + (mixTo - channel) * mix);
		return Math.max(0, Math.min(255, next));
	});

	return `#${tinted.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
};

/**
 * Convert a hex or RGB color into an RGBA string with the requested opacity.
 */
export const addOpacity = (color: string, opacity: number) => {
	if (!color) return '';

	const alpha = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 1;
	const trimmed = color.trim();

	if (trimmed.startsWith('#')) {
		const normalized = trimmed.slice(1);
		const fullHex =
			normalized.length === 3
				? normalized
						.split('')
						.map((char) => `${char}${char}`)
						.join('')
				: normalized;

		if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) return color;

		const r = Number.parseInt(fullHex.slice(0, 2), 16);
		const g = Number.parseInt(fullHex.slice(2, 4), 16);
		const b = Number.parseInt(fullHex.slice(4, 6), 16);
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	const rgbMatch = trimmed.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+\s*)?\)$/);
	if (rgbMatch) {
		const [, r, g, b] = rgbMatch;
		return `rgba(${r}, ${g}, ${b}, ${alpha})`;
	}

	return color;
};
