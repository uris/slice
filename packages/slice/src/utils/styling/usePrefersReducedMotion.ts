'use client';

import { useSyncExternalStore } from 'react';

const queryText = '(prefers-reduced-motion: reduce)';
const canObserve = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function';
const getSnapshot = () => canObserve() && window.matchMedia(queryText).matches;
const getServerSnapshot = () => false;
const subscribe = (listener: () => void) => {
	if (!canObserve()) return () => {};
	const query = window.matchMedia(queryText);
	query.addEventListener('change', listener);
	return () => query.removeEventListener('change', listener);
};

/** Internal shared preference observer. Responds to live changes and cleans up on unmount. */
export function usePrefersReducedMotion() {
	return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
