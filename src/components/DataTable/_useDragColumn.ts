import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveDragHandleXPos } from './columnHelper';

export type DragColumnElement = {
	id: string;
	cell: HTMLElement /* the cell the drag started from to compute the starting x position */;
	col: HTMLTableColElement /* the <col> element that owns this column's width in colgroup */;
	handle?: HTMLDivElement | null /* element for the visual drag affordance */;
	parent?: HTMLDivElement | null /* parent wrapper for calcs */;
};

// resolve touch or mouse event to client position
const resolveClientPos = (e: MouseEvent | TouchEvent) => {
	if (e.type.startsWith('touch')) {
		const touchEvent = e as TouchEvent;
		return { x: touchEvent.touches[0].clientX, y: touchEvent.touches[0].clientY };
	}
	const mouseEvent = e as MouseEvent;
	return { x: mouseEvent.clientX, y: mouseEvent.clientY };
};

export function useDragColumn(element: DragColumnElement | null, onResizeEnd?: (id: string, width: number) => void) {
	const [client, setClient] = useState<{ x: number; y: number } | null>(null);
	const [dragging, setDragging] = useState(false);
	const didSetListenersRef = useRef<boolean>(false);
	const colStartX = useRef<number>(0);
	const lastWidthRef = useRef<number>(0);
	const hasMovedRef = useRef<boolean>(false);

	// resolve the starting x position of the column from the origin cell's rect
	const resolveStartingXPos = useCallback(() => {
		if (!element?.cell) return 0;
		return element.cell.getBoundingClientRect().left;
	}, [element]);

	// update the position visual drag handle affordance
	const applyHandlePos = useCallback(
		(show?: boolean) => {
			const { cell, handle, parent } = element ?? {};
			if (!show && handle) handle.style.left = '-500px';
			else resolveDragHandleXPos({ cell, handle, parent });
		},
		[element],
	);

	// write the new width straight to the <col> element
	const applyWidth = useCallback(
		(clientX: number) => {
			if (!element?.col) return;
			const newWidth = Math.max(0, clientX - colStartX.current);
			element.col.style.width = `${newWidth}px`;
			lastWidthRef.current = newWidth;
			hasMovedRef.current = true;
		},
		[element],
	);

	// mouse move handler
	const handleMouseMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			e.stopPropagation();
			e.preventDefault();
			setDragging(true);
			const nextClientPos = resolveClientPos(e);
			setClient(nextClientPos);
			applyWidth(nextClientPos.x);
			applyHandlePos(true);
		},
		[applyWidth, applyHandlePos],
	);

	// mouse up handler
	const handleMouseUp = useCallback(
		(e: MouseEvent | TouchEvent) => {
			e.stopPropagation();
			e.preventDefault();
			setDragging(false);
			setClient(null);
			if (element && hasMovedRef.current) {
				onResizeEnd?.(element.id, lastWidthRef.current);
			}
			applyHandlePos(false);
			clearListeners();
		},
		[element, onResizeEnd, applyHandlePos],
	);

	// listen to move or up
	const initListeners = useCallback(() => {
		if (!didSetListenersRef.current) {
			document.documentElement.addEventListener('mousemove', handleMouseMove, false);
			document.documentElement.addEventListener('mouseup', handleMouseUp, false);
			document.documentElement.addEventListener('touchmove', handleMouseMove, false);
			document.documentElement.addEventListener('touchend', handleMouseUp, false);
			// styles
			document.documentElement.style.userSelect = 'none';
			document.documentElement.style.webkitUserSelect = 'none'; // needed for ios/sfari
			document.documentElement.style.cursor = 'col-resize';
			// calc helpers
			colStartX.current = resolveStartingXPos();
			didSetListenersRef.current = true;
		}
	}, [handleMouseMove, handleMouseUp, resolveStartingXPos]);

	// clean up
	const clearListeners = useCallback(() => {
		if (didSetListenersRef.current) {
			document.documentElement.removeEventListener('mousemove', handleMouseMove);
			document.documentElement.removeEventListener('mouseup', handleMouseUp);
			document.documentElement.removeEventListener('touchmove', handleMouseMove, false);
			document.documentElement.removeEventListener('touchend', handleMouseUp, false);
			// styles
			document.documentElement.style.userSelect = 'auto';
			document.documentElement.style.webkitUserSelect = 'auto'; // needed for ios/sfari
			document.documentElement.style.cursor = 'default';
			// calc helpers
			colStartX.current = 0;
			lastWidthRef.current = 0;
			hasMovedRef.current = false;
			didSetListenersRef.current = false;
		}
	}, [handleMouseMove, handleMouseUp]);

	useEffect(() => {
		if (element) initListeners();
		else clearListeners();
		return () => clearListeners();
	}, [element, initListeners, clearListeners]);

	return { client, dragging };
}
