import { type RefObject, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import type { PopCaller, PopCoords, PopOffset, PopSizeConstraints } from './_types';

export function usePopMenu(options: {
	menuRef?: RefObject<HTMLDivElement | null>;
	caller?: PopCaller | null;
	offset?: PopOffset | null;
	gap?: number | null;
}) {
	const { menuRef, caller, offset, gap } = options;
	const [coords, setCoords] = useState<PopCoords | undefined>();
	const [constraints, setConstraints] = useState<PopSizeConstraints | undefined>();
	const [visible, setVisible] = useState<boolean>(false);
	const [resolved, setResolved] = useState(false);

	useLayoutEffect(() => {
		setResolved(false);

		const menu = menuRef?.current;
		if (!caller || !menu) return;

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
		// Right placement grows downward from the caller's top, beside its right edge.
		let downwardAnchor = callerRect.bottom + menuGap;
		let horizontalAnchor = callerRect.left;
		if (offset === 'right') {
			downwardAnchor = callerRect.top;
			horizontalAnchor = callerRect.right + menuGap;
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
	}, [caller, menuRef, offset, gap]);

	const dismissMenu = useCallback(() => setResolved(false), []);

	useEffect(() => {
		if (!resolved) return;

		const isInsideMenu = (target: EventTarget | null) => {
			if (!(target instanceof Node)) return false;
			return menuRef?.current?.contains(target) ?? false;
		};

		const handleScroll = (event: Event) => {
			// Allow the menu and its contents to scroll without dismissing it.
			if (isInsideMenu(event.target)) return;
			dismissMenu();
		};

		const handleClick = (event: MouseEvent) => {
			if (!(event.target instanceof Node)) return;
			if (caller?.contains(event.target)) return;
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

	// externally reset menu pos after exit animation
	function resetMenu() {
		setCoords(undefined);
		setConstraints(undefined);
		setResolved(false);
		setVisible(false);
	}

	return { coords, constraints, resolved, visible, resetMenu, dismissMenu };
}
