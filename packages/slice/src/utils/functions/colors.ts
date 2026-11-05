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

/**
 * Resolve a missing or transparent color to an explicit RGBA value with zero alpha.
 * Use the first resolvable reference color's RGB channels, falling back to transparent
 * white in dark themes or transparent black in light themes. Nontransparent inputs
 * are returned unchanged. This is a general color utility; animation is one use case.
 */
export function resolveTransparent(
	color: string | null | undefined,
	referenceColors: (string | null | undefined)[],
	colors: Record<string, string>,
	isDark: boolean,
): string {
	if (color && color.trim().toLowerCase() !== 'transparent') return color;
	for (const reference of referenceColors) {
		if (!reference || reference.trim().toLowerCase() === 'transparent') continue;
		let resolved = reference.trim();
		const visited = new Set<string>();
		while (!visited.has(resolved)) {
			visited.add(resolved);
			const token = resolved.match(/^var\(--([\w-]+)\)$/)?.[1] ?? resolved;
			if (!colors[token]) break;
			resolved = colors[token];
		}
		// Discard existing alpha while retaining the color's RGB channels.
		if (/^#[\da-f]{4}$/i.test(resolved)) resolved = resolved.slice(0, 4);
		else if (/^#[\da-f]{8}$/i.test(resolved)) resolved = resolved.slice(0, 7);
		let transparent = addOpacity(resolved, 0);
		// Optional browser capabilities keep this shared utility usable without DOM types.
		const browser = globalThis as typeof globalThis & {
			document?: { createElement: (tag: 'canvas') => { getContext: (kind: '2d') => { fillStyle: string } | null } };
			CSS?: { supports: (property: string, value: string) => boolean };
		};
		if (transparent === resolved && browser.document && browser.CSS && !resolved.includes('var(')) {
			// A detached canvas normalizes named colors and HSL without changing the DOM.
			const context = browser.document.createElement('canvas').getContext('2d');
			if (context && browser.CSS.supports('color', resolved) && resolved.toLowerCase() !== 'currentcolor') {
				context.fillStyle = resolved;
				transparent = addOpacity(context.fillStyle, 0);
			}
		}

		if (/^rgba\(.+, 0\)$/.test(transparent)) return transparent;
	}
	return addOpacity(isDark ? '#ffffff' : '#000000', 0);
}
