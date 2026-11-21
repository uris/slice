import { type SizeValue, resolveSize } from '../../theme/resolveSize';

/** Resolve a CSS length in the element's theme scope for JS layout calculations. */
export function measureCssLength(element: HTMLElement, value: SizeValue | null | undefined, fallback: number) {
	if (typeof value !== 'string') return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
	const probe = element.ownerDocument.createElement('span');
	probe.style.position = 'absolute';
	probe.style.visibility = 'hidden';
	probe.style.setProperty('margin-left', resolveSize(value, fallback));
	if (!probe.style.marginLeft) return fallback;
	element.appendChild(probe);
	const pixels = Number.parseFloat(getComputedStyle(probe).marginLeft);
	probe.remove();
	return Number.isFinite(pixels) ? pixels : fallback;
}
