import { resolveColor } from '../../theme';
import { addOpacity } from './addOpacity';

export { addOpacity } from './addOpacity';

/**
 * Return a CSS color-mix expression that tints a color toward white or black.
 */
export const tintFromColor = (colorValue: string, percent: number) => {
	if (colorValue === 'unset' || colorValue === 'inherit') return colorValue;
	const resolvedColor = resolveColor(colorValue);
	const ratio = Math.max(-1, Math.min(1, Math.abs(percent) > 1 ? percent / 100 : percent));
	const retained = (1 - Math.abs(ratio)) * 100;
	const mixToColor = percent >= 0 ? 'white' : 'black';
	return `color-mix(in srgb, ${resolvedColor} ${retained}%, ${mixToColor})`;
};

/**
 * Return a CSS color-mix expression that tints a color toward transparency.
 */
export const opacityFromColor = (colorValue: string, opacity: number) => {
	if (colorValue === 'unset' || colorValue === 'inherit') return colorValue;
	const resolvedColor = resolveColor(colorValue);
	const ratio = Math.max(0, Math.min(1, Math.abs(opacity) > 1 ? opacity / 100 : opacity));
	return `color-mix(in srgb, ${resolvedColor} ${ratio * 100}%, transparent)`;
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
			document?: {
				createElement: (tag: 'canvas') => { getContext: (kind: '2d') => { fillStyle: string } | null };
			};
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
