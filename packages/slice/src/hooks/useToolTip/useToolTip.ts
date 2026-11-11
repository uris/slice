'use client';

import type React from 'react';
import { useLayoutEffect, useRef, useState } from 'react';
import type { ToolTip } from '../../components/sharedTypes';

/** Position one mounted app-wide Tip, following anchor movement without changing its request identity. */
export function useToolTip(toolTip: ToolTip | null, tipElement: React.RefObject<HTMLDivElement | null>) {
	const [coords, setCoords] = useState<{ x: number; y: number }>();
	const previous = useRef<typeof coords>(undefined);
	useLayoutEffect(() => {
		const target = toolTip?.ref?.current;
		const element = tipElement.current;
		const updateCoords = (next: typeof coords) => {
			if (previous.current?.x === next?.x && previous.current?.y === next?.y) return;
			previous.current = next;
			setCoords(next);
		};
		if (!(target instanceof HTMLElement) || !element) {
			updateCoords(undefined);
			return;
		}
		const view = target.ownerDocument.defaultView ?? window;
		const update = () => {
			if (!target.isConnected) {
				updateCoords(undefined);
				return;
			}
			const anchor = target.getBoundingClientRect();
			const tip = element.getBoundingClientRect();
			const clamp = (value: number, maximum: number) => Math.max(10, Math.min(value, Math.max(10, maximum)));
			const x = clamp(anchor.left + anchor.width / 2 - tip.width / 2, view.innerWidth - tip.width - 10);
			const below = anchor.bottom + 10;
			const preferredY = below + tip.height <= view.innerHeight - 10 ? below : anchor.top - tip.height - 10;
			updateCoords({ x, y: clamp(preferredY, view.innerHeight - tip.height - 10) });
		};
		update();
		// A single active request tracks layout/transform changes; unchanged geometry does not trigger renders.
		let frame = 0;
		const track = () => {
			update();
			frame = view.requestAnimationFrame(track);
		};
		frame = view.requestAnimationFrame(track);
		view.addEventListener('resize', update);
		view.addEventListener('scroll', update, true);
		return () => {
			view.cancelAnimationFrame(frame);
			view.removeEventListener('resize', update);
			view.removeEventListener('scroll', update, true);
		};
	}, [toolTip, tipElement]);
	return coords;
}
