'use client';

import { useCallback, useEffect } from 'react';

export interface KeyboardShortcut {
	key: string;
	metaPressed?: boolean;
	shiftPressed?: boolean;
	altPressed?: boolean;
	name: string;
}

export type KeyboardShortcuts = KeyboardShortcut[];

function normalizeShortcutKey(key: string) {
	if (key.length === 1) return key.toLowerCase();
	return key.toLowerCase();
}

export function useKeyboardShortcuts(
	shortcuts: KeyboardShortcuts,
	shortCutHandler: (shortcut: KeyboardShortcut) => void,
	isAppleDevice: boolean,
) {
	// don't process shortcuts on editable elements, like inputs, editable divs, etc.

	const isEditable = useCallback((e: KeyboardEvent) => {
		const target = e.target as HTMLElement | null;
		if (target) {
			const tag = target.tagName;
			return target.isContentEditable || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
		}
		return false;
	}, []);

	// get keyboard event check if it's a shortcut
	const handleKeyPress = useCallback(
		(e: KeyboardEvent) => {
			if (isEditable(e)) return;
			const isMeta = (isAppleDevice && e.metaKey) || (!isAppleDevice && e.ctrlKey);
			const normalizedEventKey = normalizeShortcutKey(e.key);
			for (const s of shortcuts) {
				if (Boolean(s.metaPressed) !== isMeta) continue;
				if (Boolean(s.shiftPressed) !== e.shiftKey) continue;
				if (Boolean(s.altPressed) !== e.altKey) continue;
				if (normalizeShortcutKey(s.key) === normalizedEventKey) {
					e.preventDefault();
					shortCutHandler(s);
					break;
				}
			}
		},
		[isAppleDevice, shortcuts, shortCutHandler, isEditable],
	);

	// set keyboard listener
	useEffect(() => {
		if (shortcuts.length === 0) return;
		globalThis.addEventListener('keydown', handleKeyPress, false);
		return () => {
			globalThis.removeEventListener('keydown', handleKeyPress, false);
		};
	}, [shortcuts, handleKeyPress]);
}
