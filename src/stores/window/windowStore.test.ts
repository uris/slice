import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { FormFactor } from './_types';
import { useWindowStore } from './windowStore';

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

// jsdom always defines `ontouchstart` on window regardless of real touch
// support, so isTouchDevice would always read true unless removed.
beforeEach(() => {
	delete (window as unknown as Record<string, unknown>).ontouchstart;
});

afterEach(() => {
	delete (navigator as unknown as Record<string, unknown>).geolocation;
	delete (navigator as unknown as Record<string, unknown>).userAgent;
	delete (navigator as unknown as Record<string, unknown>).platform;
	setNavigatorProp('maxTouchPoints', 0);
});

describe('windowStore', () => {
	it('initialize() sets viewport size and form factor, and cleans up on teardown', () => {
		setViewport(1200, 800);
		const cleanup = useWindowStore.getState().actions.initialize();

		expect(useWindowStore.getState().viewportWidth).toBe(1200);
		expect(useWindowStore.getState().viewportHeight).toBe(800);
		expect(useWindowStore.getState().formFactor).toBe(FormFactor.DesktopL);
		expect(useWindowStore.getState().height).toBe('100vh');

		expect(() => cleanup()).not.toThrow();
	});

	it('updates on window resize while initialized', () => {
		setViewport(1200, 800);
		const cleanup = useWindowStore.getState().actions.initialize();

		setViewport(400, 700);
		window.dispatchEvent(new Event('resize'));

		expect(useWindowStore.getState().viewportWidth).toBe(400);
		expect(useWindowStore.getState().formFactor).toBe(FormFactor.Mobile);

		cleanup();
	});

	it('uses the touch-adjusted pixel height on touch devices', () => {
		setViewport(400, 700);
		setNavigatorProp('maxTouchPoints', 1);
		const cleanup = useWindowStore.getState().actions.initialize();

		expect(useWindowStore.getState().height).toBe('700px');

		cleanup();
	});

	it('getLocation() rejects when geolocation is unsupported', async () => {
		await expect(useWindowStore.getState().actions.getLocation()).rejects.toThrow(
			'Geolocation is not supported in this browser.',
		);
		expect(useWindowStore.getState().locationError?.message).toBe(
			'Geolocation is not supported in this browser.',
		);
	});

	it('getLocation() resolves and updates state when geolocation succeeds', async () => {
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

		const location = await useWindowStore.getState().actions.getLocation();

		expect(location).toEqual(expect.objectContaining({ latitude: 1, longitude: 2 }));
		expect(useWindowStore.getState().gettingLocation).toBe(false);
	});

	it('getLocation() rejects and sets locationError when geolocation fails', async () => {
		setNavigatorProp('geolocation', {
			getCurrentPosition: (
				_success: PositionCallback,
				error: PositionErrorCallback,
			) => {
				error({ code: 1, message: 'denied' } as GeolocationPositionError);
			},
		});

		await expect(useWindowStore.getState().actions.getLocation()).rejects.toThrow(
			'denied',
		);
		expect(useWindowStore.getState().gettingLocation).toBe(false);
	});
});
