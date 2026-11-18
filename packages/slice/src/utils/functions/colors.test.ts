import { describe, expect, it } from 'vitest';
import { addOpacity, opacityFromColor, resolveTransparent, tintFromColor } from './colors';

describe('tintFromColor', () => {
 it.each(['inherit', 'unset'])('preserves %s', color => {
  expect(tintFromColor(color, 8)).toBe(color);
 });
 it.each(['#000000', '#abc', '#1234', 'red', 'rgb(1, 2, 3)', 'var(--custom-color)'])('tints CSS color %s without parsing channels', color => {
  expect(tintFromColor(color, 8)).toBe(`color-mix(in srgb, ${color} 92%, white)`);
 });
 it('resolves theme tokens to live CSS variables', () => {
  expect(tintFromColor('core-button-primary', -8)).toBe('color-mix(in srgb, var(--core-button-primary) 92%, black)');
 });
 it('accepts ratios and percentages and clamps extremes', () => {
  expect(tintFromColor('white', 0.5)).toBe(tintFromColor('white', 50));
  expect(tintFromColor('white', -50)).toBe('color-mix(in srgb, white 50%, black)');
  expect(tintFromColor('white', 500)).toBe('color-mix(in srgb, white 0%, white)');
  expect(tintFromColor('white', -500)).toBe('color-mix(in srgb, white 0%, black)');
 });
});

describe('opacityFromColor', () => {
 it.each(['unset', 'inherit'])('preserves %s', color => {
  expect(opacityFromColor(color, 20)).toBe(color);
 });
 it.each(['#abc', '#112233', 'white', 'rgb(1, 2, 3)', 'rgba(1, 2, 3, 0.5)', 'hsl(120 50% 50%)', 'var(--custom-color)', 'transparent'])('mixes CSS color %s with transparent without rewriting its alpha', color => {
  expect(opacityFromColor(color, 20)).toBe(`color-mix(in srgb, ${color} 20%, transparent)`);
 });
 it('resolves Slice tokens while retaining live theme references', () => {
  expect(opacityFromColor('core-button-primary', 0.12)).toBe('color-mix(in srgb, var(--core-button-primary) 12%, transparent)');
 });
 it.each([[0, 0], [1, 100], [0.12, 12], [12, 12], [100, 100], [200, 100], [-0.5, 0], [-20, 0]])('normalizes opacity %s to %s percent', (opacity, percent) => {
  expect(opacityFromColor('red', opacity)).toBe(`color-mix(in srgb, red ${percent}%, transparent)`);
 });
});

describe('addOpacity', () => {
	it('returns an empty string for an empty color', () => {
		expect(addOpacity('', 0.5)).toBe('');
	});

	it('converts a 6-digit hex to rgba', () => {
		expect(addOpacity('#112233', 0.5)).toBe('rgba(17, 34, 51, 0.5)');
	});

	it('expands and converts a 3-digit hex to rgba', () => {
		expect(addOpacity('#123', 1)).toBe('rgba(17, 34, 51, 1)');
	});

	it('returns the original value for an invalid hex', () => {
		expect(addOpacity('#zzz', 0.5)).toBe('#zzz');
	});

	it('rewrites the alpha channel of an existing rgb()/rgba() string', () => {
		expect(addOpacity('rgb(1, 2, 3)', 0.4)).toBe('rgba(1, 2, 3, 0.4)');
		expect(addOpacity('rgba(1, 2, 3, 0.9)', 0.4)).toBe('rgba(1, 2, 3, 0.4)');
	});

	it('returns unrecognized formats unchanged', () => {
		expect(addOpacity('hsl(0, 0%, 0%)', 0.5)).toBe('hsl(0, 0%, 0%)');
	});

	it('clamps opacity to [0, 1] and defaults non-finite opacity to 1', () => {
		expect(addOpacity('#112233', 5)).toBe('rgba(17, 34, 51, 1)');
		expect(addOpacity('#112233', -5)).toBe('rgba(17, 34, 51, 0)');
		expect(addOpacity('#112233', Number.NaN)).toBe('rgba(17, 34, 51, 1)');
	});
});


describe('resolveTransparent', () => {
it('uses a reference color’s RGB channels with zero alpha', () => {
 expect(resolveTransparent('transparent', ['#ffff00'], {}, false)).toBe('rgba(255, 255, 0, 0)');
});
it('resolves theme tokens and strips existing alpha', () => {
 expect(resolveTransparent('transparent', ['var(--surface)'], {surface: '#1f262d'}, true)).toBe('rgba(31, 38, 45, 0)');
 for (const color of ['#ff08', '#ffff0080', 'rgba(255, 255, 0, 0.5)']) {
  expect(resolveTransparent('transparent', [color], {}, false)).toBe('rgba(255, 255, 0, 0)');
 }
});
it('tries subsequent reference colors and falls back according to theme', () => {
 expect(resolveTransparent('transparent', ['transparent', '#abc'], {}, false)).toBe('rgba(170, 187, 204, 0)');
 expect(resolveTransparent(undefined, [], {}, false)).toBe('rgba(0, 0, 0, 0)');
 expect(resolveTransparent('transparent', [], {}, true)).toBe('rgba(255, 255, 255, 0)');
 expect(resolveTransparent('#ffff00', [], {}, false)).toBe('#ffff00');
});

});
