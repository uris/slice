import { type RefObject, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import type { PopCaller, PopCoords, PopOffset, PopSizeConstraints } from './_types';

export function usePopMenu(options: {
	menuRef?: RefObject<HTMLDivElement | null>;
	caller?: PopCaller | null;
	offset?: PopOffset | null;
	gap?: number | null;
	container?: HTMLElement | false;
	enabled?: boolean;
}) {
	const { menuRef, caller, offset, gap, container, enabled = true } = options;
	const [coords, setCoords] = useState<PopCoords | undefined>();
	const [constraints, setConstraints] = useState<PopSizeConstraints | undefined>();
	// resolved controls interaction/exit; visible keeps the positioned element mounted through that exit.
	const [visible, setVisible] = useState<boolean>(false);
	const [resolved, setResolved] = useState(false);

	// Measure only after the menu is mounted in its resolved host, before the browser paints.
	useLayoutEffect(() => {
		setResolved(false);

		const menu = menuRef?.current;
		if (!enabled || !caller || !menu) return;
		if (container && !container.contains(menu)) return;

		const callerRect = caller.getBoundingClientRect();
		const menuRect = menu.getBoundingClientRect();
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const callerOutsideViewport =
			callerRect.bottom <= 0 ||
			callerRect.top >= windowHeight ||
			callerRect.right <= 0 ||
			callerRect.left >= windowWidth;
		if (callerOutsideViewport) return;

		const menuGap = gap ?? 0;
		const topEdge = Math.min(windowHeight, Math.max(0, callerRect.top - menuGap));
		// Side placements align with the caller top and flip horizontally before viewport clamping.
		let downwardAnchor = callerRect.bottom + menuGap;
		let horizontalAnchor = callerRect.left;
		if (offset === 'right' || offset === 'left') {
			downwardAnchor = callerRect.top;
			horizontalAnchor = callerRect.right + menuGap;
			if (offset === 'left' || horizontalAnchor + menuRect.width > windowWidth) {
				horizontalAnchor = callerRect.left - menuGap - menuRect.width;
				if (horizontalAnchor < 0 && offset === 'left') horizontalAnchor = callerRect.right + menuGap;
			}
		}
		const bottomEdge = Math.min(windowHeight, Math.max(0, downwardAnchor));
		const topSpace = topEdge;
		const bottomSpace = windowHeight - bottomEdge;

		// Keep the preferred side unless the other side can fit the full menu.
		let placement = offset ?? 'bottom';
		if (placement === 'top' && menuRect.height > topSpace && menuRect.height <= bottomSpace) {
			placement = 'bottom';
		} else if (placement === 'bottom' && menuRect.height > bottomSpace && menuRect.height <= topSpace) {
			placement = 'top';
		}

		let maxHeight = bottomSpace;
		let y = bottomEdge;
		if (placement === 'top') {
			maxHeight = topSpace;
			const displayedHeight = Math.min(menuRect.height, maxHeight);
			y = topEdge - displayedHeight;
		}

		const displayedWidth = Math.min(menuRect.width, windowWidth);
		const x = Math.max(0, Math.min(horizontalAnchor, windowWidth - displayedWidth));

		setCoords({ x, y });
		setConstraints({ maxHeight, maxWidth: windowWidth });
		setResolved(true);
		setVisible(true);
	}, [caller, menuRef, offset, gap, container, enabled]);

	const dismissMenu = useCallback(() => setResolved(false), []);

	useEffect(() => {
		if (!resolved) return;

		// Portaled descendants are DOM siblings, so follow their parent menu IDs to detect the whole branch.
		const isInsideMenu = (target: EventTarget | null) => {
			if (!(target instanceof Node)) return false;
			if (menuRef?.current?.contains(target)) return true;
			let branch =
				target instanceof Element
					? target.closest<HTMLElement>('[data-pop-menu-parent]')
					: target.parentElement?.closest<HTMLElement>('[data-pop-menu-parent]');
			const visited = new Set<string>();
			while (branch?.dataset.popMenuParent) {
				const parentId = branch.dataset.popMenuParent;
				if (visited.has(parentId)) break;
				visited.add(parentId);
				if (parentId === menuRef?.current?.id) return true;
				branch = (branch.getRootNode() as Document | ShadowRoot).getElementById(parentId);
			}
			return false;
		};

		const handleScroll = (event: Event) => {
			// Allow the menu and its contents to scroll without dismissing it.
			if (isInsideMenu(event.composedPath()[0] ?? event.target)) return;
			dismissMenu();
		};

		const handleClick = (event: MouseEvent) => {
			// Use the original shadow-tree target rather than the retargeted shadow host.
			const target = event.composedPath()[0] ?? event.target;
			if (!(target instanceof Node)) return;
			if (caller?.contains(target) || isInsideMenu(target)) return;
			dismissMenu();
		};

		window.addEventListener('resize', dismissMenu);
		document.addEventListener('scroll', handleScroll, true);
		window.addEventListener('click', handleClick);
		return () => {
			window.removeEventListener('resize', dismissMenu);
			document.removeEventListener('scroll', handleScroll, true);
			window.removeEventListener('click', handleClick);
		};
	}, [menuRef, resolved, caller, dismissMenu]);

	// Clear placement only after the exit animation completes to avoid a jump during dismissal.
	function resetMenu() {
		setCoords(undefined);
		setConstraints(undefined);
		setResolved(false);
		setVisible(false);
	}

	return { coords, constraints, resolved, visible, resetMenu, dismissMenu };
}
