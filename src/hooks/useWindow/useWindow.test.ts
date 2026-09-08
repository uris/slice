import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { FormFactor, useWindow } from './useWindow';

function setViewport(width: number, height: number) {
	Object.defineProperty(window, 'innerWidth', {
		writable: true,
		configurable: true,
		value: width,
	});
	Object.defineProperty(window, 'innerHeight', {
		writable: true,
		configurable: true,
		value: height,
	});
}

function setNavigatorProp(key: string, value: unknown) {
	Object.defineProperty(navigator, key, {
		configurable: true,
		value,
	});
}

// jsdom always defines `ontouchstart` as an own, configurable property on
// `window` regardless of real touch support, so `'ontouchstart' in
// globalThis` is true by default in every test here. Delete it so
// `isTouchDevice` genuinely reflects `navigator.maxTouchPoints` per test,
// matching how the hook is meant to behave on a real non-touch desktop.
beforeEach(() => {
	delete (window as unknown as Record<string, unknown>).ontouchstart;
});

afterEach(() => {
	delete (navigator as unknown as Record<string, unknown>).geolocation;
	// Reset every navigator override back to jsdom's default (the prototype
	// getter) so a mutation in one test (e.g. userAgent/platform) can't bleed
	// into later tests via the shared jsdom window for this file.
	delete (navigator as unknown as Record<string, unknown>).userAgent;
	delete (navigator as unknown as Record<string, unknown>).platform;
	setNavigatorProp('maxTouchPoints', 0);
});

describe('useWindow', () => {
	it('reports viewport size and desktop form factor on mount', () => {
		setViewport(1200, 800);
		const { result } = renderHook(() => useWindow());

		expect(result.current.viewportWidth).toBe(1200);
		expect(result.current.viewportHeight).toBe(800);
		expect(result.current.formFactor).toBe(FormFactor.DesktopL);
		expect(result.current.height).toBe('100vh');
	});

	it('falls back to the mobile form factor below the smallest breakpoint', () => {
		setViewport(400, 700);
		const { result } = renderHook(() => useWindow());

		expect(result.current.formFactor).toBe(FormFactor.Mobile);
	});

	it('updates on window resize', () => {
		setViewport(1200, 800);
		const { result } = renderHook(() => useWindow());

		act(() => {
			setViewport(500, 900);
			window.dispatchEvent(new Event('resize'));
		});

		expect(result.current.viewportWidth).toBe(500);
		expect(result.current.viewportHeight).toBe(900);
		expect(result.current.formFactor).toBe(FormFactor.Mobile);
	});

	it('detects Apple devices from navigator.platform', () => {
		setNavigatorProp('platform', 'MacIntel');
		const { result } = renderHook(() => useWindow());
		expect(result.current.isAppleDevice).toBe(true);
	});

	it('detects Electron from the user agent', () => {
		setNavigatorProp('userAgent', 'Mozilla/5.0 electron/28.0.0');
		const { result } = renderHook(() => useWindow());
		expect(result.current.isElectron).toBe(true);
	});

	it('uses the touch-adjusted pixel height on touch devices', () => {
		setViewport(400, 700);
		setNavigatorProp('maxTouchPoints', 1);
		const { result } = renderHook(() => useWindow());

		expect(result.current.isTouchDevice).toBe(true);
		expect(result.current.height).toBe('700px');
	});

	it('reports geolocation as unsupported and sets an error', () => {
		const { result } = renderHook(() => useWindow());
		expect(result.current.geolocationSupported).toBe(false);

		act(() => {
			result.current.requestGeolocation();
		});

		expect(result.current.locationError?.message).toBe(
			'Geolocation is not supported in this browser.',
		);
	});

	it('resolves the current position when geolocation succeeds', () => {
		setNavigatorProp('geolocation', {
			getCurrentPosition: (success: PositionCallback) => {
				success({
					coords: {
						latitude: 1,
						longitude: 2,
						accuracy: 3,
						altitude: null,
						altitudeAccuracy: null,
						heading: null,
						speed: null,
					},
					timestamp: 12345,
				} as GeolocationPosition);
			},
		});
		const { result } = renderHook(() => useWindow());
		expect(result.current.geolocationSupported).toBe(true);

		act(() => {
			result.current.requestGeolocation();
		});

		expect(result.current.location).toEqual(
			expect.objectContaining({ latitude: 1, longitude: 2 }),
		);
		expect(result.current.gettingLocation).toBe(false);
	});

	it('reports a geolocation error when it fails', () => {
		setNavigatorProp('geolocation', {
			getCurrentPosition: (
				_success: PositionCallback,
				error: PositionErrorCallback,
			) => {
				error({ code: 1, message: 'denied' } as GeolocationPositionError);
			},
		});
		const { result } = renderHook(() => useWindow());

		act(() => {
			result.current.requestGeolocation();
		});

		expect(result.current.locationError?.message).toBe('denied');
		expect(result.current.gettingLocation).toBe(false);
	});
});
