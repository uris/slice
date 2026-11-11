import type { Constraint } from './_types';

const defaults: Constraint = { initial: 250, min: 250, max: 500 };
function resolve(value: number, containerWidth: number | undefined, fallback: number) {
	if (!Number.isFinite(value) || value < 0) return fallback;
	if (value <= 1) return containerWidth === undefined ? 0 : containerWidth * value;
	return Math.max(50, value);
}
/** Relative widths wait for a real container measurement; fixed widths are SSR-safe. */
export function resolvePanelConstraints(values: Constraint, containerWidth?: number): Constraint {
	const min = resolve(values.min, containerWidth, defaults.min);
	const max = Math.max(min, resolve(values.max, containerWidth, defaults.max));
	const initial = Math.min(max, Math.max(min, resolve(values.initial, containerWidth, defaults.initial)));
	return { initial, min, max };
}
