export function normalizeSliderRange(min: number, max: number): [number, number] {
	const low = Number.isFinite(min) ? min : 0;
	const high = Number.isFinite(max) ? max : 100;
	if (!Number.isFinite(high - low)) return [0, 100];
	return low <= high ? [low, high] : [high, low];
}

export function clampSliderValue(value: number, min: number, max: number): number {
	return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;
}

export function sliderPercent(value: number, min: number, max: number): number {
	return max > min ? (clampSliderValue(value, min, max) - min) / (max - min) : 0;
}

/** Keep the existing keyboard-only step contract; pointer movement stays continuous. */
export function keyboardSliderValue(
	value: number,
	key: string,
	min: number,
	max: number,
	step?: number,
): number | null {
	const increment = step !== undefined && Number.isFinite(step) && step > 0 ? step : Math.max((max - min) / 100, 0.01);
	let next: number;
	switch (key) {
		case 'ArrowRight':
		case 'ArrowUp':
		case 'PageUp':
			next = value + increment;
			break;
		case 'ArrowLeft':
		case 'ArrowDown':
		case 'PageDown':
			next = value - increment;
			break;
		case 'Home':
			return min;
		case 'End':
			return max;
		default:
			return null;
	}
	return clampSliderValue(Number(next.toPrecision(15)), min, max);
}

export function sliderLength(value: number | string | undefined, fallback: number): string {
	return typeof value === 'number'
		? `${Number.isFinite(value) ? Math.max(0, value) : fallback}px`
		: value?.trim() || `${fallback}px`;
}
