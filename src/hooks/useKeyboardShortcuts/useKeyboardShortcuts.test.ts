import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import {
	type KeyboardShortcuts,
	useKeyboardShortcuts,
} from './useKeyboardShortcuts';

function dispatchKey(init: KeyboardEventInit, target: EventTarget = window) {
	const event = new KeyboardEvent('keydown', { bubbles: true, ...init });
	const preventDefault = vi.spyOn(event, 'preventDefault');
	target.dispatchEvent(event);
	return preventDefault;
}

const shortcuts: KeyboardShortcuts = [
	{ key: 's', metaPressed: true, name: 'save' },
	{ key: 'k', shiftPressed: true, altPressed: true, name: 'shifted-alt' },
];

describe('useKeyboardShortcuts', () => {
	it('calls the handler when a matching shortcut is pressed (apple device)', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboardShortcuts(shortcuts, handler, true));

		const preventDefault = dispatchKey({ key: 's', metaKey: true });

		expect(handler).toHaveBeenCalledWith(shortcuts[0]);
		expect(preventDefault).toHaveBeenCalled();
	});

	it('uses ctrlKey instead of metaKey on non-apple devices', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboardShortcuts(shortcuts, handler, false));

		dispatchKey({ key: 's', metaKey: true });
		expect(handler).not.toHaveBeenCalled();

		dispatchKey({ key: 's', ctrlKey: true });
		expect(handler).toHaveBeenCalledWith(shortcuts[0]);
	});

	it('requires shift and alt modifiers to match exactly', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboardShortcuts(shortcuts, handler, true));

		dispatchKey({ key: 'k', shiftKey: true });
		expect(handler).not.toHaveBeenCalled();

		dispatchKey({ key: 'k', shiftKey: true, altKey: true });
		expect(handler).toHaveBeenCalledWith(shortcuts[1]);
	});

	it('ignores key presses on editable elements', () => {
		const handler = vi.fn();
		renderHook(() => useKeyboardShortcuts(shortcuts, handler, true));

		const input = document.createElement('input');
		document.body.appendChild(input);

		dispatchKey({ key: 's', metaKey: true }, input);

		expect(handler).not.toHaveBeenCalled();
		document.body.removeChild(input);
	});

	it('does not attach a listener when there are no shortcuts', () => {
		const handler = vi.fn();
		const addSpy = vi.spyOn(window, 'addEventListener');
		renderHook(() => useKeyboardShortcuts([], handler, true));

		expect(addSpy).not.toHaveBeenCalledWith(
			'keydown',
			expect.any(Function),
			false,
		);
		addSpy.mockRestore();
	});

	it('removes the listener on unmount', () => {
		const handler = vi.fn();
		const { unmount } = renderHook(() =>
			useKeyboardShortcuts(shortcuts, handler, true),
		);

		unmount();
		dispatchKey({ key: 's', metaKey: true });

		expect(handler).not.toHaveBeenCalled();
	});
});
