import type { KeyboardShortcut } from '../../hooks/useKeyboardShortcuts/useKeyboardShortcuts';

const appleKeys: Record<string, string> = {
	enter: 'Enter',
	escape: 'Esc',
	backspace: '\u232b',
	delete: '\u2326',
	tab: 'Tab',
	arrowup: '\u2191',
	arrowdown: '\u2193',
	arrowleft: '\u2190',
	arrowright: '\u2192',
	' ': 'Space',
};
const otherKeys: Record<string, string> = {
	enter: 'Enter',
	escape: 'Esc',
	backspace: 'Backspace',
	delete: 'Delete',
	tab: 'Tab',
	arrowup: 'Up',
	arrowdown: 'Down',
	arrowleft: 'Left',
	arrowright: 'Right',
	' ': 'Space',
};

function detectAppleDevice() {
	if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
	return navigator.platform.startsWith('Mac') || navigator.platform === 'iPhone';
}

/** Format a shortcut for display only; pass useWindow().isAppleDevice to control the platform explicitly. */
export function resolveShortcut(shortcut: KeyboardShortcut, isAppleDevice = detectAppleDevice()): string {
	const modifiers: string[] = [];
	// Match the activation hook: meta means Command on Apple and Control elsewhere.
	if (isAppleDevice) {
		if (shortcut.altPressed) modifiers.push('\u2325');
		if (shortcut.shiftPressed) modifiers.push('\u21e7');
		if (shortcut.metaPressed) modifiers.push('\u2318');
	} else {
		if (shortcut.metaPressed) modifiers.push('Ctrl');
		if (shortcut.altPressed) modifiers.push('Alt');
		if (shortcut.shiftPressed) modifiers.push('Shift');
	}
	const keyNames = isAppleDevice ? appleKeys : otherKeys;
	const normalizedKey = shortcut.key.toLowerCase();
	const getKeyLabel = () => {
		if (Object.hasOwn(keyNames, normalizedKey)) return keyNames[normalizedKey];
		if (shortcut.key.length === 1) return shortcut.key.toUpperCase();
		return shortcut.key;
	};
	const key = getKeyLabel();
	return [...modifiers, key].join(isAppleDevice ? '' : '+');
}
