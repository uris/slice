import { create } from 'zustand';
import type { WindowGeolocation } from '../../hooks/useWindow/useWindow';
import { FormFactor, type WindowStore, bootstrapBreakPoints } from './_types';

// pre-ordered break points from larget to smallest
const orderedBps = Object.entries(bootstrapBreakPoints).sort((a, b) => -b[1] - a[1]) as [FormFactor, number][];

// get form factor from break point and current viewport width
const getFormFactor = (width: number | undefined): FormFactor => {
	if (!width || width <= 0) return FormFactor.Mobile;
	for (const [formFactor, breakpoint] of orderedBps) {
		if (width >= breakpoint) return formFactor;
	}
	return FormFactor.Mobile;
};

const isBrowser = typeof globalThis !== 'undefined' && typeof navigator !== 'undefined';
const initialSize = processWindowSize();

export const useWindowStore = create<WindowStore>((set, get) => ({
	formFactor: initialSize.formFactor,
	viewportWidth: initialSize.viewportWidth,
	viewportHeight: initialSize.viewportHeight,
	height: initialSize.height,
	isElectron: checkElectron(),
	isAppleDevice: checkAppleDevice(),
	isTouchDevice: checkTouchDevice(),
	dpr: getDpr(),
	locationError: null,
	location: null,
	gettingLocation: false,
	actions: {
		initialize: () => {
			if (!isBrowser) return () => {};
			const win = getViewportWindow();
			win?.addEventListener('resize', handleResize);
			handleResize();
			return () => win?.removeEventListener('resize', handleResize);
		},
		getLocation: async () => {
			if (!supportsGeolocation()) {
				const error = createLocationError('Geolocation is not supported in this browser.', 0);
				set({ locationError: error, gettingLocation: false });
				throw error;
			}

			set({ gettingLocation: true, locationError: null });

			return await new Promise<WindowGeolocation>((resolve, reject) => {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const location = {
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
							accuracy: position.coords.accuracy,
							altitude: position.coords.altitude,
							altitudeAccuracy: position.coords.altitudeAccuracy,
							heading: position.coords.heading,
							speed: position.coords.speed,
							timestamp: position.timestamp,
						} satisfies WindowGeolocation;
						set({ location, gettingLocation: false, locationError: null });
						resolve(location);
					},
					(err) => {
						const error = createLocationError(err.message, err.code);
						set({
							locationError: error,
							gettingLocation: false,
							location: null,
						});
						reject(error);
					},
				);
			});
		},
	},
}));

function checkElectron() {
	if (!isBrowser) return false;
	const userAgent = navigator.userAgent.toLowerCase();
	return userAgent.includes('electron/');
}

function checkAppleDevice() {
	if (!isBrowser) return false;
	return navigator.platform.startsWith('Mac') || navigator.platform === 'iPhone';
}

function checkTouchDevice() {
	if (!isBrowser) return false;
	return 'ontouchstart' in globalThis || navigator.maxTouchPoints > 0;
}

function getDpr(): 1 | 2 | 3 {
	if (!isBrowser) return 1;
	return (Math.min(Math.ceil(window.devicePixelRatio), 3) as 1 | 2 | 3) ?? 1;
}

function supportsGeolocation() {
	return isBrowser && 'geolocation' in navigator;
}

function createLocationError(message: string, code: number) {
	return new Error(message, {
		cause: { code },
	});
}

function getViewportWindow() {
	if (!isBrowser) return null;
	return window.top ?? globalThis;
}

// resize handler
function handleResize() {
	if (!isBrowser) return;
	// process size
	const { formFactor, viewportWidth, viewportHeight, height } = processWindowSize();
	// update store directly
	useWindowStore.setState({
		formFactor,
		viewportWidth,
		viewportHeight,
		height,
	});
}

// return size related store values
function processWindowSize(top = true) {
	if (!isBrowser) {
		return {
			formFactor: FormFactor.Mobile,
			viewportWidth: -1,
			viewportHeight: -1,
			height: '100vh',
		};
	}

	const viewport = top ? getViewportWindow() : globalThis;
	const touch = checkTouchDevice();
	const windowWidth = viewport?.innerWidth ?? -1;
	const windowHeight = viewport?.innerHeight ?? -1;
	return {
		formFactor: getFormFactor(windowWidth),
		viewportWidth: windowWidth,
		viewportHeight: windowHeight,
		height: viewport && touch ? `${windowHeight}px` : '100vh',
	};
}

// atomic hook exports for use in React components
export const useFormFactor = () => useWindowStore((state) => state.formFactor);
export const useViewportWidth = () => useWindowStore((state) => state.viewportWidth);
export const useViewportHeight = () => useWindowStore((state) => state.viewportHeight);
export const useIsAppleDevice = () => useWindowStore((state) => state.isAppleDevice);
export const useIsTouchDevice = () => useWindowStore((state) => state.isTouchDevice);
export const useIsElectron = () => useWindowStore((state) => state.isElectron);
export const useDpr = () => useWindowStore((state) => state.dpr);
export const useLocation = () => useWindowStore((state) => state.location);
export const useLocationError = () => useWindowStore((state) => state.locationError);
export const useGettingLocation = () => useWindowStore((state) => state.gettingLocation);
export const useInitializeWindow = () => useWindowStore((state) => state.actions.initialize);
export const useGetLocation = () => useWindowStore((state) => state.actions.getLocation);

// non-reactive imperative exports for use outside the React context
export const formFactor = () => useWindowStore.getState().formFactor;
export const viewportWidth = () => useWindowStore.getState().viewportWidth;
export const viewportHeight = () => useWindowStore.getState().viewportHeight;
export const isAppleDevice = () => useWindowStore.getState().isAppleDevice;
export const isTouchDevice = () => useWindowStore.getState().isTouchDevice;
export const isElectron = () => useWindowStore.getState().isElectron;
export const dpr = () => useWindowStore.getState().dpr;
export const location = () => useWindowStore.getState().location;
export const locationError = () => useWindowStore.getState().locationError;
export const gettingLocation = () => useWindowStore.getState().gettingLocation;
