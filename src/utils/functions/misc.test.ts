import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
	accessibleKeyDown,
	cleanString,
	copyToClipboard,
	createPropChangeArray,
	debug,
	filterClasses,
	hexToRgb,
	isDarkMode,
	normalizedPercent,
	pointerPosition,
	setProps,
	setSizeStyle,
	setStyle,
} from './misc';

describe('setSizeStyle', () => {
	it('returns "auto" for undefined or falsy values', () => {
		expect(setSizeStyle(undefined)).toBe('auto');
		expect(setSizeStyle(0)).toBe('auto');
	});

	it('returns a string value unchanged', () => {
		expect(setSizeStyle('100%')).toBe('100%');
	});

	it('appends px to a number', () => {
		expect(setSizeStyle(240)).toBe('240px');
	});
});

describe('cleanString', () => {
	it('always strips script tags', () => {
		expect(cleanString('a<script>alert(1)</script>b', false, false)).toBe(
			'ab',
		);
	});

	it('removes invisible characters when requested', () => {
		expect(cleanString('a\nb\tc\rd', true, false)).toBe('abcd');
	});

	it('removes html tags when requested', () => {
		expect(cleanString('<b>bold</b>', false, true)).toBe('bold');
	});

	it('leaves invisible characters and html tags when disabled', () => {
		expect(cleanString('<b>a\nb</b>', false, false)).toBe('<b>a\nb</b>');
	});
});

describe('isDarkMode', () => {
	afterEach(() => {
		delete document.documentElement.dataset.sliceTheme;
	});

	it('is false when no theme is set', () => {
		expect(isDarkMode()).toBe(false);
	});

	it('is true when the theme name includes "dark"', () => {
		document.documentElement.dataset.sliceTheme = 'slice-dark';
		expect(isDarkMode()).toBe(true);
	});

	it('is false for a light theme', () => {
		document.documentElement.dataset.sliceTheme = 'slice-light';
		expect(isDarkMode()).toBe(false);
	});
});

describe('debug / setProps', () => {
	beforeEach(() => {
		vi.stubEnv('NODE_ENV', 'development');
	});

	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it('debug() returns a fresh props/mount/unmount snapshot outside of tests', () => {
		const previous = { current: { props: { a: 1 }, mount: false, unmount: false } };
		const result = debug(previous, { a: 2 });
		expect(result).toEqual({ props: { a: 2 }, mount: false, unmount: false });
	});

	it('debug() exits early while running under the test env', () => {
		vi.stubEnv('NODE_ENV', 'test');
		const previous = { current: { props: {}, mount: false, unmount: false } };
		expect(debug(previous, {})).toBeUndefined();
	});

	it('setProps() returns props/mount/unmount outside of tests', () => {
		expect(setProps({ a: 1 }, true, false)).toEqual({
			props: { a: 1 },
			mount: true,
			unmount: false,
		});
	});

	it('setProps() exits early while running under the test env', () => {
		vi.stubEnv('NODE_ENV', 'test');
		expect(setProps({ a: 1 })).toBeUndefined();
	});
});

describe('createPropChangeArray', () => {
	it('reports keys whose value changed', () => {
		const reasons = createPropChangeArray({ a: 1, b: 2 }, { a: 1, b: 3 });
		expect(reasons).toEqual(['b: 2 > 3']);
	});

	it('falls back to the error message when a value cannot be stringified', () => {
		const circular: Record<string, unknown> = {};
		circular.self = circular;
		const reasons = createPropChangeArray({ a: undefined }, { a: circular });
		expect(reasons).toHaveLength(1);
		expect(reasons[0]).toContain('a');
	});
});

describe('hexToRgb', () => {
	it('returns undefined for an undefined hex', () => {
		expect(hexToRgb(undefined)).toBeUndefined();
	});

	it('converts a hex color to rgba with a default alpha of 1', () => {
		expect(hexToRgb('#112233')).toBe('rgba(17, 34, 51, 1)');
	});

	it('applies a custom opacity', () => {
		expect(hexToRgb('#112233', 0.5)).toBe('rgba(17, 34, 51, 0.5)');
	});
});

describe('accessibleKeyDown', () => {
	function keyEvent(key: string) {
		return {
			key,
			preventDefault: vi.fn(),
		} as unknown as React.KeyboardEvent<any>;
	}

	it('activates on Enter and Space by default', () => {
		const onClick = vi.fn();
		const enterEvent = keyEvent('Enter');
		accessibleKeyDown(enterEvent, onClick);
		expect(onClick).toHaveBeenCalledTimes(1);
		expect(enterEvent.preventDefault).toHaveBeenCalled();

		const spaceEvent = keyEvent(' ');
		accessibleKeyDown(spaceEvent, onClick);
		expect(onClick).toHaveBeenCalledTimes(2);
	});

	it('does not activate on a non-matching key', () => {
		const onClick = vi.fn();
		accessibleKeyDown(keyEvent('Escape'), onClick);
		expect(onClick).not.toHaveBeenCalled();
	});

	it('supports a custom activation key list', () => {
		const onClick = vi.fn();
		accessibleKeyDown(keyEvent('a'), onClick, ['a']);
		expect(onClick).toHaveBeenCalledTimes(1);
	});
});

describe('pointerPosition', () => {
	it('reads clientX from a mouse event', () => {
		const event = { type: 'mousedown', clientX: 42 } as MouseEvent;
		expect(pointerPosition(event)).toBe(42);
	});

	it('reads the first touch clientX from a touch event', () => {
		const event = {
			type: 'touchstart',
			touches: [{ clientX: 24 }],
		} as unknown as TouchEvent;
		expect(pointerPosition(event)).toBe(24);
	});
});

describe('filterClasses', () => {
	it('drops empty class names and joins the rest', () => {
		expect(filterClasses(['a', '', 'b', ''])).toBe('a b');
	});
});

describe('setStyle', () => {
	it('returns "unset" when both value and default are missing', () => {
		expect(setStyle(undefined)).toBe('unset');
	});

	it('falls back to the default when value is missing', () => {
		expect(setStyle(undefined, 10)).toBe('10px');
	});

	it('returns a string value unchanged', () => {
		expect(setStyle('auto')).toBe('auto');
	});

	it('appends px to a numeric value', () => {
		expect(setStyle(20)).toBe('20px');
	});
});

describe('copyToClipboard', () => {
	const originalExecCommand = document.execCommand;

	beforeEach(() => {
		// jsdom doesn't implement execCommand, so spyOn (which requires the
		// property to already exist) can't be used directly - stub it first.
		document.execCommand = vi.fn();
	});

	afterEach(() => {
		document.execCommand = originalExecCommand;
		vi.restoreAllMocks();
	});

	it('resolves true on success', async () => {
		vi.spyOn(document, 'execCommand').mockReturnValue(true);
		await expect(copyToClipboard('hello')).resolves.toBe(true);
	});

	it('resolves false when copying throws', async () => {
		vi.spyOn(document, 'execCommand').mockImplementation(() => {
			throw new Error('denied');
		});
		await expect(copyToClipboard('hello')).resolves.toBe(false);
	});
});

describe('normalizedPercent', () => {
	it('passes numbers through unchanged', () => {
		expect(normalizedPercent(0.5)).toBe(0.5);
	});

	it('parses a percent string', () => {
		expect(normalizedPercent('50%')).toBe(50);
	});

	it('divides a bare numeric string by 100', () => {
		expect(normalizedPercent('50')).toBe(0.5);
	});
});
