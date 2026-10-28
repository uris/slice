import { describe, expect, it, vi } from 'vitest';
import { darkTheme } from '../../theme';
import { getGlassInputColor } from './inputColors';

// Deliberately provide no DynamicColorIOS export: the fallback platform must
// remain usable without importing or calling an iOS-only color API.
vi.mock('react-native', () => ({}));

describe('input colors on fallback platforms', () => {
	it('resolves theme tokens and preserves literal/native color values', () => {
		expect(getGlassInputColor('core-text-secondary', darkTheme.colors, 'core-text-primary')).toBe(darkTheme.colors['core-text-secondary']);
		expect(getGlassInputColor('red', darkTheme.colors, 'core-text-secondary', 'core-text-primary')).toBe('red');
		expect(getGlassInputColor(undefined, darkTheme.colors, 'core-text-secondary')).toBe(darkTheme.colors['core-text-secondary']);
		const native = { semantic: ['label'] } as any;
		expect(getGlassInputColor(native, darkTheme.colors, 'core-text-primary')).toBe(native);
	});
});
