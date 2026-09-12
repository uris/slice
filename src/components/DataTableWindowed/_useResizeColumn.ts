import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { resolveDragHandleXPos } from './columnHelper';

export type ResizeVisualElements = {
	handle?: React.RefObject<HTMLDivElement | null> | null /* element for the visual drag affordance */;
	parent?: React.RefObject<HTMLDivElement | null> | null /* parent wrapper for calculations */;
};

export type ResizeColElements = {
	id: string;
	cell: HTMLElement /* the cell the drag started from to compute the starting x position */;
	col: HTMLTableColElement /* the <col> element that owns this column's width in colgroup */;
};

export type ColRefs = React.RefObject<Record<string, HTMLTableColElement | null>>;

// resolve touch or mouse event to client position
const resolveClientPos = (e: MouseEvent | TouchEvent) => {
	if (e.type.startsWith('touch')) {
		const touchEvent = e as TouchEvent;
		return { x: touchEvent.touches[0].clientX, y: touchEvent.touches[0].clientY };
	}
	const mouseEvent = e as MouseEvent;
	return { x: mouseEvent.clientX, y: mouseEvent.clientY };
};

export function useResizeColumn(
	elements: ResizeVisualElements,
	colResize: boolean,
	setColumnWidths: (value: React.SetStateAction<Record<string, string | number>>) => void,
	onColumnResize: ((columnId: string, width: number) => void) | undefined,
) {
	const [resizeCol, setResizeCol] = useState<ResizeColElements | null>(null);
	const [client, setClient] = useState<{ x: number; y: number } | null>(null);
	const [resizing, setResizing] = useState(false);
	const didSetListenersRef = useRef<boolean>(false);
	const colStartX = useRef<number>(0);
	const lastWidthRef = useRef<number>(0);
	const hasMovedRef = useRef<boolean>(false);

	// resolve the starting x position of the column from the origin cell's rect
	const resolveStartingXPos = useCallback(() => {
		if (!resizeCol?.cell) return 0;
		return resizeCol.cell.getBoundingClientRect().left;
	}, [resizeCol]);

	// update the position visual drag handle affordance
	const applyHandlePos = useCallback(
		(show?: boolean) => {
			const { cell } = resizeCol ?? {};
			const handle = elements.handle?.current;
			const parent = elements.parent?.current;
			if (!show && handle) handle.style.left = '-500px';
			else resolveDragHandleXPos({ cell, handle, parent });
		},
		[resizeCol, elements],
	);

	// write the new width straight to the <col> element
	const applyWidth = useCallback(
		(clientX: number) => {
			if (!resizeCol?.col) return;
			const newWidth = Math.max(0, clientX - colStartX.current);
			resizeCol.col.style.width = `${newWidth}px`;
			lastWidthRef.current = newWidth;
			hasMovedRef.current = true;
		},
		[resizeCol],
	);

	// mouse move handler
	const handleMouseMove = useCallback(
		(e: MouseEvent | TouchEvent) => {
			e.stopPropagation();
			e.preventDefault();
			setResizing(true);
			const nextClientPos = resolveClientPos(e);
			setClient(nextClientPos);
			applyWidth(nextClientPos.x);
			applyHandlePos(true);
		},
		[applyWidth, applyHandlePos],
	);

	// mouse up handler - set widths and clean up
	const handleMouseUp = useCallback(
		(e: MouseEvent | TouchEvent) => {
			e.stopPropagation();
			e.preventDefault();
			// set col width using state callback and emit event
			if (resizeCol && hasMovedRef.current) {
				const colId = resizeCol.id;
				const width = lastWidthRef.current;
				setColumnWidths((prev) => ({ ...prev, [colId]: width }));
				onColumnResize?.(colId, width);
			}
			setResizing(false);
			setClient(null);
			applyHandlePos(false);
			setResizeCol(null);
		},
		[resizeCol, applyHandlePos, setColumnWidths, onColumnResize],
	);

	// install listeners for move/up
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

	// handler to trigger resize start
	const dragResize = useCallback(
		(id: string, e: React.MouseEvent<HTMLDivElement>, colRefs: ColRefs) => {
			e.stopPropagation();
			e.preventDefault();
			if (!colResize) return;
			const cell = e.currentTarget.parentElement as HTMLElement | null;
			const col = colRefs.current[id];
			if (cell && col) setResizeCol({ id, cell, col });
		},
		[colResize],
	);

	// handler to show handle on hover of drag area
	const hoverResize = useCallback(
		(show: boolean, e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {
			if (!colResize || resizeCol) return;
			const cell = e.currentTarget.parentElement as HTMLElement | null;
			const handle = elements.handle?.current;
			const parent = elements.parent?.current;
			if (!show && handle) handle.style.left = '-500px';
			else resolveDragHandleXPos({ cell, handle, parent });
		},
		[resizeCol, colResize, elements],
	);

	useEffect(() => {
		if (resizeCol) initListeners();
		else clearListeners();
		return () => clearListeners();
	}, [resizeCol, initListeners, clearListeners]);

	return { clientX: client?.x, clientY: client?.y, resizing, dragResize, hoverResize };
}
