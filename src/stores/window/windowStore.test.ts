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
		expect(useWindowStore.getState().locationError?.message).toBe('Geolocation is not supported in this browser.');
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
			getCurrentPosition: (_success: PositionCallback, error: PositionErrorCallback) => {
				error({ code: 1, message: 'denied' } as GeolocationPositionError);
			},
		});

		await expect(useWindowStore.getState().actions.getLocation()).rejects.toThrow('denied');
		expect(useWindowStore.getState().gettingLocation).toBe(false);
	});
});

describe('window public accessors and server initialization', () => {
	it('imperative getters expose the latest store snapshot', async () => {
		const store = await import('./windowStore');
		const error = new Error('Location denied');
		const position = {
			latitude: 10,
			longitude: 20,
			accuracy: 5,
			altitude: null,
			altitudeAccuracy: null,
			heading: null,
			speed: null,
			timestamp: 123,
		};
		store.useWindowStore.setState({
			formFactor: FormFactor.Mobile,
			viewportWidth: 390,
			viewportHeight: 844,
			isAppleDevice: true,
			isTouchDevice: true,
			isElectron: false,
			dpr: 3,
			location: position,
			locationError: error,
			gettingLocation: true,
		});
		expect(store.formFactor()).toBe(FormFactor.Mobile);
		expect(store.viewportWidth()).toBe(390);
		expect(store.viewportHeight()).toBe(844);
		expect(store.isAppleDevice()).toBe(true);
		expect(store.isTouchDevice()).toBe(true);
		expect(store.isElectron()).toBe(false);
		expect(store.dpr()).toBe(3);
		expect(store.location()).toEqual(position);
		expect(store.locationError()).toBe(error);
		expect(store.gettingLocation()).toBe(true);
	});

	it('initializes safely without browser globals', async () => {
		vi.resetModules();
		vi.stubGlobal('navigator', undefined);
		vi.stubGlobal('window', undefined);
		try {
			const { useWindowStore: serverStore } = await import('./windowStore');
			expect(serverStore.getState()).toMatchObject({
				formFactor: FormFactor.Mobile,
				viewportWidth: -1,
				viewportHeight: -1,
				height: '100vh',
				isAppleDevice: false,
				isTouchDevice: false,
				isElectron: false,
				dpr: 1,
			});
			expect(() => serverStore.getState().actions.initialize()()).not.toThrow();
			await expect(serverStore.getState().actions.getLocation()).rejects.toThrow('Geolocation is not supported');
		} finally {
			vi.unstubAllGlobals();
			vi.resetModules();
		}
	});

	it('treats a zero-width viewport as mobile', () => {
		setViewport(0, 600);
		const cleanup = useWindowStore.getState().actions.initialize();
		try {
			expect(useWindowStore.getState().formFactor).toBe(FormFactor.Mobile);
			expect(useWindowStore.getState().viewportWidth).toBe(0);
		} finally {
			cleanup();
		}
	});
});
