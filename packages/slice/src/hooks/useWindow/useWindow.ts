'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Form factor names
 */
export enum FormFactor {
	Mobile = 'mobile',
	Tablet = 'tablet',
	Desktop = 'desktop',
	DesktopL = 'desktopL',
	DesktopXL = 'desktopXL',
}

/**
 * Breakpoint type matching form factor to width value
 */
export type BreakPoints = Record<FormFactor, number>;

export type WindowGeolocation = {
	latitude: number;
	longitude: number;
	accuracy: number;
	altitude: number | null;
	altitudeAccuracy: number | null;
	heading: number | null;
	speed: number | null;
	timestamp: number;
};

export type WindowGeolocationError = {
	code: number;
	message: string;
};

/**
 * Use bootstrap proxy breakpoints as defaults
 */
const bootstrapBreakPoints: BreakPoints = {
	[FormFactor.Mobile]: 576,
	[FormFactor.Tablet]: 768,
	[FormFactor.Desktop]: 992,
	[FormFactor.DesktopL]: 1200,
	[FormFactor.DesktopXL]: 1400,
};

const isBrowser = typeof window !== 'undefined' && typeof navigator !== 'undefined';

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

export function useWindow(breakpoints = bootstrapBreakPoints, top = true) {
	const isElectron = checkElectron();
	const isAppleDevice = checkAppleDevice();
	const isTouchDevice = checkTouchDevice();
	const dpr = getDpr();
	const [viewportWidth, setViewportWidth] = useState<number | null>(null);
	const [viewportHeight, setViewportHeight] = useState<number | null>(null);
	const [height, setHeight] = useState<string>('100vh');
	const [formFactor, setFormFactor] = useState<FormFactor>(FormFactor.Desktop);
	const [location, setLocation] = useState<WindowGeolocation | null>(null);
	const [locationError, setLocationError] = useState<Error | null>(null);
	const [gettingLocation, setGettingLocation] = useState<boolean>(false);

	const geolocationSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator;

	useEffect(() => {
		if (!isBrowser) return;
		handleResize();
		window.addEventListener('resize', handleResize, false);
		return () => window.removeEventListener('resize', handleResize, false);
	}, []);

	// callback to set form factor based on break points
	const getFormFactor = useCallback(
		(width: number) => {
			if (!width || width <= 0) return FormFactor.Mobile;
			const orderedBps = Object.entries(breakpoints).sort((a, b) => b[1] - a[1]) as [FormFactor, number][];
			for (const [formFactor, breakpoint] of orderedBps) {
				if (width >= breakpoint) return formFactor;
			}
			return FormFactor.Mobile;
		},
		[breakpoints],
	);

	const requestGeolocation = useCallback(() => {
		if (!geolocationSupported) {
			const error = new Error('Geolocation is not supported in this browser.', {
				cause: { code: 0 },
			});
			setLocationError(error);
			return;
		}

		setGettingLocation(true);
		setLocationError(null);

		navigator.geolocation.getCurrentPosition(
			(position) => {
				setLocation({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
					accuracy: position.coords.accuracy,
					altitude: position.coords.altitude,
					altitudeAccuracy: position.coords.altitudeAccuracy,
					heading: position.coords.heading,
					speed: position.coords.speed,
					timestamp: position.timestamp,
				});
				setGettingLocation(false);
			},
			(err) => {
				const error = new Error(err.message, { cause: { code: err.code } });
				setLocationError(error);
				setGettingLocation(false);
			},
		);
	}, [geolocationSupported]);

	function handleResize() {
		if (!isBrowser) return;
		const windowWidth = top ? (window.top?.innerWidth ?? window.innerWidth) : window.innerWidth;
		const windowHeight = top ? (window.top?.innerHeight ?? window.innerHeight) : window.innerHeight;
		setFormFactor(getFormFactor(windowWidth));
		setViewportHeight(windowHeight);
		setViewportWidth(windowWidth);
		// note: mobile devices can have task bars that are included inside the viewport.
		// for mobile devices, set root containers to the inner height pixel which removes
		// the height of any toolbars and provides the "true" view port height
		if (!isElectron) setHeight(isTouchDevice ? `${windowHeight}px` : '100vh');
	}

	return {
		viewportWidth,
		viewportHeight,
		height,
		isTouchDevice,
		isElectron,
		isAppleDevice,
		formFactor,
		dpr,
		geolocationSupported,
		location,
		locationError,
		gettingLocation,
		requestGeolocation,
	};
}
