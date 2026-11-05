import { type RefObject, useEffect } from 'react';

const focusableSelector = 'button, a[href], input, select, textarea, [tabindex], [contenteditable="true"]';

/** The host owns modality; DialogBox only supplies the named dialog panel. */
export function useModalHost(
	ref: RefObject<HTMLDivElement | null>,
	dismiss: () => void,
	opener: RefObject<HTMLElement | null>,
) {
	useEffect(() => {
		const host = ref.current;
		if (!host) return;
		const document = host.ownerDocument;
		const activeElement = document.activeElement;
		const previousFocus = activeElement === document.body ? opener.current : activeElement;
		const blocked = new Map<HTMLElement, boolean>();
		let branch: HTMLElement = host;
		while (branch.parentElement && branch !== document.body) {
			for (const sibling of Array.from(branch.parentElement.children)) {
				if (sibling !== branch && sibling instanceof HTMLElement && !sibling.hasAttribute('data-overlay')) {
					blocked.set(sibling, sibling.inert);
					sibling.inert = true;
				}
			}
			branch = branch.parentElement;
		}
		const overflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		const panel = host.querySelector<HTMLElement>('[role="dialog"]') ?? host;
		const choices = () =>
			Array.from(host.querySelectorAll<HTMLElement>(focusableSelector)).filter(
				(element) =>
					element.tabIndex >= 0 &&
					!element.matches(':disabled') &&
					!element.closest('[inert]') &&
					element.getClientRects().length > 0 &&
					getComputedStyle(element).visibility !== 'hidden',
			);
		const focusFirst = () => (choices()[0] ?? panel).focus({ preventScroll: true });
		focusFirst();
		const onFocus = (event: FocusEvent) => {
			if (!host.contains(event.target as Node)) focusFirst();
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && !event.defaultPrevented) {
				event.preventDefault();
				event.stopPropagation();
				dismiss();
				return;
			}
			if (event.key !== 'Tab' || event.defaultPrevented) return;
			const elements = choices();
			const first = elements[0];
			const last = elements[elements.length - 1];
			if (!first) {
				event.preventDefault();
				panel.focus();
				return;
			}
			if (
				event.shiftKey &&
				(document.activeElement === first || !elements.includes(document.activeElement as HTMLElement))
			) {
				event.preventDefault();
				last.focus();
			} else if (
				!event.shiftKey &&
				(document.activeElement === last || !elements.includes(document.activeElement as HTMLElement))
			) {
				event.preventDefault();
				first.focus();
			}
		};
		document.addEventListener('focusin', onFocus);
		document.addEventListener('keydown', onKeyDown);
		return () => {
			document.removeEventListener('focusin', onFocus);
			document.removeEventListener('keydown', onKeyDown);
			for (const [element, inert] of blocked) element.inert = inert;
			document.body.style.overflow = overflow;
			if (previousFocus instanceof HTMLElement && previousFocus.isConnected && !previousFocus.closest('[inert]'))
				previousFocus.focus({ preventScroll: true });
		};
	}, [ref, dismiss, opener]);
}
