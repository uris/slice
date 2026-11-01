import { describe, expect, it } from 'vitest';
import { dark, light } from './colors';
import { resolveColor } from './resolveColor';

describe('resolveColor', () => {
	it('resolves every theme token to a theme-independent CSS variable', () => {
		for (const token of Object.keys(light)) {
			expect(resolveColor(token)).toBe(`var(--${token})`);
		}
		expect(Object.keys(dark).sort()).toEqual(Object.keys(light).sort());
	});

	it.each(['#abc', '#12345678', 'red', 'transparent', 'currentColor', 'rgb(1 2 3 / 50%)', 'var(--custom-color)', 'linear-gradient(red, blue)', 'unknown-token', 'toString', '__proto__', ''])('preserves CSS and unrecognized strings: %s', value => {
		expect(resolveColor(value)).toBe(value);
	});

	it('preserves absent and non-string values', () => {
		expect(resolveColor(undefined)).toBeUndefined();
		expect(resolveColor(null)).toBeNull();
		expect(resolveColor(0)).toBe(0);
	});
});
