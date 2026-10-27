import { describe, expect, it } from 'vitest';
import type { BorderRadius, Size } from '../../types/sharedTypes';
import { borderRadiusToNumber, sizeToNumber } from './sizes';

describe('sizeToNumber', () => {
	it.each([
		{ size: undefined, expected: 48 },
		{ size: 's' as const, expected: 40 },
		{ size: 'm' as const, expected: 48 },
		{ size: 'l' as const, expected: 56 },
		{ size: 64, expected: 64 },
		{ size: 44.5, expected: 44.5 },
	])('converts $size to $expected points', ({ size, expected }) => {
		expect(sizeToNumber(size)).toBe(expected);
	});

	it('falls back to medium for an unrecognized runtime size', () => {
		expect(sizeToNumber('unknown' as Size)).toBe(48);
	});
});

describe('borderRadiusToNumber', () => {
 it.each([
  [undefined, 0], ['pill', 1000], ['rectangular', 4], [0, 0], [12, 12], [7.5, 7.5],
  [-4, 0], [Number.NaN, 0], [Number.POSITIVE_INFINITY, 0], [Number.NEGATIVE_INFINITY, 0],
 ])('resolves %s to %s', (radius, expected) => {
  expect(borderRadiusToNumber(radius as BorderRadius | undefined)).toBe(expected);
 });
 it('handles unknown values from untyped callers', () => {
  expect(borderRadiusToNumber('unknown' as BorderRadius)).toBe(0);
 });
});
