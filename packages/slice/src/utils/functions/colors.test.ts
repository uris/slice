import { describe, expect, it } from 'vitest';
import { addOpacity, tintFromColor } from './colors';

describe('tintFromColor', () => {
	it('returns the original value for an invalid hex', () => {
		expect(tintFromColor('not-a-color', 50)).toBe('not-a-color');
		expect(tintFromColor('#1234', 50)).toBe('#1234');
	});

	it('lightens a color toward white with a positive percent', () => {
		expect(tintFromColor('#000000', 50)).toBe('#808080');
	});

	it('darkens a color toward black with a negative percent', () => {
		expect(tintFromColor('#ffffff', -50)).toBe('#808080');
	});

	it('treats a [-1..1] ratio the same as an equivalent [-100..100] percent', () => {
		expect(tintFromColor('#000000', 0.5)).toBe(tintFromColor('#000000', 50));
	});

	it('expands 3-digit hex shorthand', () => {
		expect(tintFromColor('#000', 50)).toBe('#808080');
	});

	it('clamps ratios beyond -100/100', () => {
		expect(tintFromColor('#000000', 500)).toBe('#ffffff');
		expect(tintFromColor('#ffffff', -500)).toBe('#000000');
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
