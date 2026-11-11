import { useLayoutEffect, useState } from 'react';

export type PopMenuPortalContainer = 'auto' | HTMLElement | false;
export type PopMenuPortalTarget = HTMLElement | false;

// Automatic hosts are shared per DOM scope and removed after their last owner unmounts.
const hosts = new WeakMap<Node, { element: HTMLElement; users: number }>();

export function usePopMenuPortal(
	caller: HTMLElement | undefined,
	preference: PopMenuPortalContainer | undefined,
	inherited: PopMenuPortalTarget | undefined,
): PopMenuPortalTarget | undefined {
	// An omitted preference inherits the parent; explicit auto requests scope resolution again.
	const automatic = preference === 'auto' || (preference === undefined && inherited === undefined);
	const [managed, setManaged] = useState<{ caller: HTMLElement; element: HTMLElement }>();

	useLayoutEffect(() => {
		if (!automatic || !caller) return;
		// Preserve the nearest theme/dialog boundary, falling back to the shadow root or document body.
		const root = caller.getRootNode();
		const scope = caller.closest<HTMLElement>('[data-slice-theme-scope], dialog, [role="dialog"]');
		const parent = scope ?? (root.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? root : caller.ownerDocument.body);
		let host = hosts.get(parent);
		if (!host) {
			const element = caller.ownerDocument.createElement('div');
			element.dataset.slicePopMenuHost = '';
			parent.appendChild(element);
			host = { element, users: 0 };
			hosts.set(parent, host);
		}
		const acquired = host;
		acquired.users += 1;
		setManaged({ caller, element: acquired.element });
		return () => {
			acquired.users -= 1;
			if (acquired.users === 0) {
				acquired.element.remove();
				hosts.delete(parent);
			}
		};
	}, [automatic, caller]);

	// Custom hosts and inline mode are caller-owned; only automatic hosts need acquisition and cleanup.
	if (preference === false) return false;
	if (preference !== undefined && preference !== 'auto') return preference;
	if (!automatic) return inherited;
	if (managed?.caller === caller) return managed?.element;
	return undefined;
}
