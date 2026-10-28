import { describe, expect, it, vi } from 'vitest';
import { lightTheme, darkTheme } from '../../theme';
import { isSliceColorToken, resolveGlassColorToken, resolveSliceColor } from './colors';

vi.mock('react-native', async () => ({ processColor: (await import('../../../tests/helpers/processColor')).processColor }));

describe('shared foreground colors', () => {
	it('resolves tokens in regular rendering while preserving literal and native colors', () => {
		expect(resolveSliceColor('core-text-secondary', lightTheme.colors, 'core-text-primary')).toBe(lightTheme.colors['core-text-secondary']);
		expect(resolveSliceColor('core-text-secondary', darkTheme.colors, 'core-text-primary')).toBe(darkTheme.colors['core-text-secondary']);
		expect(resolveSliceColor(undefined, lightTheme.colors, 'core-icon-primary')).toBe(lightTheme.colors['core-icon-primary']);
		expect(resolveSliceColor('red', lightTheme.colors, 'core-text-primary')).toBe('red');
		const native = { semantic: ['label'] } as any;
		expect(resolveSliceColor(native, lightTheme.colors, 'core-text-primary')).toBe(native);
	});
	it('rejects prototype names as tokens and preserves explicitly named token identity', () => {
		expect(isSliceColorToken('toString')).toBe(false);
		expect(isSliceColorToken(null)).toBe(false);
		expect(resolveGlassColorToken('core-text-light', 'core-icon-primary')).toBe('core-text-light');
	});
	it('recovers native tokens from both palette variants and equivalent color syntax', () => {
		expect(resolveGlassColorToken(lightTheme.colors['core-text-primary'], 'core-icon-primary')).toBe('core-icon-primary');
		expect(resolveGlassColorToken('rgb(31, 38, 45)', 'core-text-primary')).toBe('core-text-primary');
		expect(resolveGlassColorToken('#fff', 'core-text-primary')).toBe('core-text-primary');
		expect(resolveGlassColorToken(lightTheme.colors['core-text-secondary'], 'core-text-secondary', 'core-text-primary')).toBe('core-text-secondary');
	});
	it('uses role-specific matches, then other Slice tokens, before the primary fallback', () => {
		expect(resolveGlassColorToken(lightTheme.colors['core-icon-secondary'], 'core-icon-primary')).toBe('core-icon-secondary');
		expect(resolveGlassColorToken(lightTheme.colors['core-text-secondary'], 'core-text-primary')).toBe('core-text-secondary');
		const recovered = resolveGlassColorToken(lightTheme.colors['feedback-positive'], 'core-text-primary');
        expect(lightTheme.colors[recovered]).toBe(lightTheme.colors['feedback-positive']);
		expect(resolveGlassColorToken('red', 'core-icon-primary')).toBe('core-icon-primary');
		expect(resolveGlassColorToken('not-a-color', 'core-text-secondary', 'core-text-primary')).toBe('core-text-primary');
		expect(resolveGlassColorToken({ semantic: ['label'] } as any, 'core-icon-primary')).toBe('core-icon-primary');
		expect(resolveGlassColorToken(undefined, 'core-text-secondary', 'core-text-primary')).toBe('core-text-secondary');
	});
});
