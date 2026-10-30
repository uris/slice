'use client';

import { useEffect, useState } from 'react';

function canUseLocalStorage() {
	return (
		typeof globalThis !== 'undefined' &&
		'localStorage' in globalThis &&
		globalThis.localStorage !== undefined &&
		globalThis.localStorage !== null
	);
}

function readLocalStorageValue<T>(key: string, fallback: T): T {
	if (!canUseLocalStorage()) return fallback;
	try {
		const raw = globalThis.localStorage.getItem(key);
		if (raw === null) {
			// If not set, initialize with fallback.
			globalThis.localStorage.setItem(key, JSON.stringify(fallback));
			return fallback;
		}
		return JSON.parse(raw) as T;
	} catch {
		return fallback;
	}
}

export function useLocalStore<T>(key: string, value: T) {
	const [item, setItem] = useState<T>(() => readLocalStorageValue(key, value));
	const [hydrated, setHydrated] = useState(false);

	// rehydrate on prop changes
	useEffect(() => {
		setItem(readLocalStorageValue(key, value));
		setHydrated(true);
	}, [key, value]);

	function updateItem(data: T) {
		if (canUseLocalStorage()) {
			try {
				globalThis.localStorage.setItem(key, JSON.stringify(data));
			} catch {}
		}
		setItem(data);
	}

	return [item, updateItem, hydrated] as const;
}
