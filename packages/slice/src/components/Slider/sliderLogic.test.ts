import { expect, it } from 'vitest';
import { clampSliderValue, keyboardSliderValue, normalizeSliderRange, sliderLength, sliderPercent } from './sliderLogic';

it('normalizes bounds and keeps clamping/percent values finite', () => {
	expect(normalizeSliderRange(100, 0)).toEqual([0, 100]);
	expect(normalizeSliderRange(Number.NaN, Number.POSITIVE_INFINITY)).toEqual([0, 100]);
	expect(normalizeSliderRange(-1e308, 1e308)).toEqual([0, 100]);
	expect(clampSliderValue(200, 0, 100)).toBe(100);
	expect(clampSliderValue(Number.NaN, 5, 10)).toBe(5);
	expect(sliderPercent(25, 0, 100)).toBe(0.25);
	expect(sliderPercent(20, 5, 5)).toBe(0);
});

it('preserves keyboard increments without snapping an existing fractional value', () => {
	for (const key of ['ArrowRight', 'ArrowUp', 'PageUp']) expect(keyboardSliderValue(12.5, key, 0, 100, 10)).toBe(22.5);
	for (const key of ['ArrowLeft', 'ArrowDown', 'PageDown']) expect(keyboardSliderValue(12.5, key, 0, 100, 10)).toBe(2.5);
	expect(keyboardSliderValue(0.2, 'ArrowRight', 0, 1, 0.1)).toBe(0.3);
	expect(keyboardSliderValue(0.25, 'ArrowRight', 0, 1)).toBe(0.26);
	expect(keyboardSliderValue(0, 'End', 0, 100, 3)).toBe(100);
	expect(keyboardSliderValue(99, 'Home', 0, 100, 3)).toBe(0);
	expect(keyboardSliderValue(99, 'ArrowRight', 0, 100, 10)).toBe(100);
	for (const step of [0, -1, Number.NaN, Number.POSITIVE_INFINITY]) expect(keyboardSliderValue(20, 'ArrowRight', 0, 100, step)).toBe(21);
	expect(keyboardSliderValue(0, 'Escape', 0, 100)).toBeNull();
});

it('normalizes numeric dimensions while retaining CSS lengths', () => {
	expect(sliderLength(10, 2)).toBe('10px');
	expect(sliderLength(-10, 2)).toBe('0px');
	expect(sliderLength(Number.NaN, 2)).toBe('2px');
	expect(sliderLength('100%', 100)).toBe('100%');
	expect(sliderLength(undefined, 24)).toBe('24px');
});
