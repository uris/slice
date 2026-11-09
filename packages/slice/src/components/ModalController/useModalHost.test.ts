import { cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useModalHost } from './useModalHost';
let opener: HTMLButtonElement, host: HTMLDivElement, first: HTMLButtonElement, last: HTMLButtonElement;
beforeEach(() => {
	opener = document.createElement('button');
	host = document.createElement('div');
	first = document.createElement('button');
	last = document.createElement('button');
	host.append(first, last);
	document.body.append(opener, host);
	for (const element of [first, last])
		vi.spyOn(element, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
	opener.focus();
});
afterEach(() => {
	cleanup();
	document.body.replaceChildren();
	vi.restoreAllMocks();
	document.body.style.overflow = '';
});
function setup(dismiss = vi.fn()) {
	const ref = { current: host },
		previous = { current: opener };
	return renderHook(({ active, dismiss }) => useModalHost(ref, dismiss, previous, active), {
		initialProps: { active: true, dismiss },
	});
}
it('deactivates exiting hosts and restores focus, scroll, and background state', () => {
	document.body.style.overflow = 'scroll';
	const { rerender } = setup();
	expect(document.activeElement).toBe(first);
	expect(opener.inert).toBe(true);
	const dismiss = vi.fn();
	rerender({ active: false, dismiss });
	expect(document.activeElement).toBe(opener);
	expect(opener.inert).toBeFalsy();
	expect(document.body.style.overflow).toBe('scroll');
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	expect(dismiss).not.toHaveBeenCalled();
});
it('updates dismiss callbacks without resetting user focus or modality', () => {
	const { rerender } = setup();
	last.focus();
	const dismiss = vi.fn();
	rerender({ active: true, dismiss });
	expect(document.activeElement).toBe(last);
	document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
	expect(dismiss).toHaveBeenCalledOnce();
});
it('contains focus and respects handled keyboard events', () => {
	const dismiss = vi.fn();
	setup(dismiss);
	opener.focus();
	expect(document.activeElement).toBe(first);
	const handled = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
	handled.preventDefault();
	document.dispatchEvent(handled);
	expect(dismiss).not.toHaveBeenCalled();
});
