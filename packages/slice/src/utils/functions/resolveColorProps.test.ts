import { describe, expect, it } from 'vitest';
import { resolveColorProps } from './resolveColorProps';

describe('resolveColorProps', () => {
	it('resolves lowercase-prefixed color states while preserving CSS colors and unrelated text', () => {
		const props = Object.freeze({ colorOn: 'core-text-primary', colorHover: 'core-text-special', colorOff: '#123456', colorful: 'core-text-primary' });
		expect(resolveColorProps(props)).toEqual({ colorOn: 'var(--core-text-primary)', colorHover: 'var(--core-text-special)', colorOff: '#123456', colorful: 'core-text-primary' });
		expect(props.colorOn).toBe('core-text-primary');
	});
	it('resolves color states and nested options without mutating frozen props', () => {
		const iconLeft = Object.freeze({ name: 'home', color: 'core-icon-primary' });
		const props = Object.freeze({
			background: 'core-surface-primary',
			borderColorHover: 'core-outline-special',
			backgroundColorDisabled: 'core-button-disabled',
			scrollHandle: 'scroll-bar',
			iconLeft,
			resizeHandle: Object.freeze({ color: 'core-outline-primary' }),
			dragHandleStyle: Object.freeze({ strokeColor: 'core-outline-secondary' }),
		});
		const resolved = resolveColorProps(props);
		expect(resolved).toEqual({
			background: 'var(--core-surface-primary)',
			borderColorHover: 'var(--core-outline-special)',
			backgroundColorDisabled: 'var(--core-button-disabled)',
			scrollHandle: 'var(--scroll-bar)',
			iconLeft: { name: 'home', color: 'var(--core-icon-primary)' },
			resizeHandle: { color: 'var(--core-outline-primary)' },
			dragHandleStyle: { strokeColor: 'var(--core-outline-secondary)' },
		});
		expect(props.iconLeft).toBe(iconLeft);
		expect(iconLeft.color).toBe('core-icon-primary');
	});

	it('leaves CSS values, numeric opacity, styles, content, and object identities intact', () => {
		const props = {
			color: '#123456', backgroundColor: 'var(--my-color)', borderColor: null,
			fillColor: 0.2, label: 'core-text-primary', name: 'core-icon-primary',
			style: { color: 'core-text-primary' }, iconLeft: { name: 'home', color: 'red' },
		};
		expect(resolveColorProps(props)).toBe(props);
		expect(resolveColorProps({ color: undefined })).toEqual({ color: undefined });
	});
});
