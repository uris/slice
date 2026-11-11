import { describe, expect, it } from 'vitest';
import { compareValues } from './compareValues';

describe('compareValues', () => {
	it('keeps absent values last in both directions', () => {
		for (const direction of ['asc', 'desc'] as const) {
			expect(compareValues(undefined, 2, direction)).toBeGreaterThan(0);
			expect(compareValues(2, null, direction)).toBeLessThan(0);
			expect(compareValues(NaN, undefined, direction)).toBe(0);
		}
	});
	it('orders numbers, dates, and mixed values consistently', () => {
		expect(compareValues(2, 10, 'asc')).toBeLessThan(0);
		expect(compareValues(new Date(0), new Date(10), 'desc')).toBeGreaterThan(0);
		expect(compareValues('2', 10, 'asc')).toBeLessThan(0);
		expect(compareValues(10, '2', 'asc')).toBeGreaterThan(0);
		expect(compareValues('same', 'same', 'asc')).toBe(0);
	});
});
