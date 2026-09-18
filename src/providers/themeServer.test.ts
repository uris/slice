import { describe, expect, it } from 'vitest';
import { getThemeHtmlAttributes, resolveInitialTheme } from './themeServer';

describe('resolveInitialTheme', () => {
	it('falls back to darkMode and system=true when no options are given', () => {
		expect(resolveInitialTheme()).toEqual({
			initialTheme: 'darkMode',
			initialSystem: true,
		});
	});

	it('prefers an explicit theme over activeTheme and the fallback', () => {
		expect(
			resolveInitialTheme({
				theme: 'lightMode',
				activeTheme: 'darkMode',
				fallbackTheme: 'darkMode',
			}),
		).toEqual({ initialTheme: 'lightMode', initialSystem: true });
	});

	it('falls back to activeTheme when theme is not provided', () => {
		expect(resolveInitialTheme({ activeTheme: 'lightMode' })).toEqual({
			initialTheme: 'lightMode',
			initialSystem: true,
		});
	});

	it('falls back to fallbackTheme when neither theme nor activeTheme is provided', () => {
		expect(resolveInitialTheme({ fallbackTheme: 'lightMode' })).toEqual({
			initialTheme: 'lightMode',
			initialSystem: true,
		});
	});

	it('treats any non-lightMode string as darkMode, not just recognized values', () => {
		expect(resolveInitialTheme({ theme: 'some-unrelated-cookie-value' })).toEqual({
			initialTheme: 'darkMode',
			initialSystem: true,
		});
	});

	it('ignores an empty-string or null theme/activeTheme and keeps resolving down the chain', () => {
		expect(
			resolveInitialTheme({ theme: '', activeTheme: null, fallbackTheme: 'lightMode' }),
		).toEqual({ initialTheme: 'lightMode', initialSystem: true });
	});

	it('resolves initialSystem from an explicit systemTheme value', () => {
		expect(resolveInitialTheme({ systemTheme: false }).initialSystem).toBe(false);
		expect(resolveInitialTheme({ systemTheme: true }).initialSystem).toBe(true);
	});

	it('defaults initialSystem to true when systemTheme is undefined', () => {
		expect(resolveInitialTheme({ systemTheme: undefined }).initialSystem).toBe(true);
	});
});

describe('getThemeHtmlAttributes', () => {
	it('defaults to darkMode when no theme is given', () => {
		expect(getThemeHtmlAttributes()).toEqual({ 'data-slice-theme': 'darkMode' });
	});

	it('defaults to darkMode for a null theme', () => {
		expect(getThemeHtmlAttributes(null)).toEqual({ 'data-slice-theme': 'darkMode' });
	});

	it('resolves lightMode when the theme string contains lightMode', () => {
		expect(getThemeHtmlAttributes('lightMode')).toEqual({ 'data-slice-theme': 'lightMode' });
	});

	it('treats any other non-empty theme string as darkMode', () => {
		expect(getThemeHtmlAttributes('some-unrelated-value')).toEqual({
			'data-slice-theme': 'darkMode',
		});
	});
});
