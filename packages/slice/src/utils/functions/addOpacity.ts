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
