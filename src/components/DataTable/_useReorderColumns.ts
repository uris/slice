import React, { useCallback, useEffect } from 'react';
import type { ColumnDefinition } from './_types';

export function useReorderColumns<T>(
	columnDefinitions: ColumnDefinition<T, unknown>[],
	setColumnOrder: React.Dispatch<React.SetStateAction<string[] | null>>,
	setDraggedColId: React.Dispatch<React.SetStateAction<string | null>>,
	onColumnReorder: ((columnOrder: string[]) => void) | undefined,
	freezeColumn: boolean,
) {
	const [isDragging, setIsDragging] = React.useState(false);
	const draggedColId = React.useRef<string | null>(null);
	const draggedColIndex = React.useRef<number | null>(null);
	const draggedOverColId = React.useRef<string | null>(null);
	const initialColumnOrder = React.useRef<string[] | null>(null);

	// move column - draggedId is the dragged column's id, targetId is the id of the
	// column it was dropped on.
	const moveColumn = useCallback(
		(draggedId: string, targetId: string) => {
			if (draggedId === targetId) return;
			setColumnOrder((prev) => {
				const currentOrder = prev ?? columnDefinitions.map((column) => column.id);
				const draggedIndex = currentOrder.indexOf(draggedId);
				const targetIndex = currentOrder.indexOf(targetId);
				if (draggedIndex === -1 || targetIndex === -1) return prev;
				if (freezeColumn && (draggedIndex === 0 || targetIndex === 0)) return prev;

				/* if this is the first time moving columns save reference to the order before any move. */
				if (!initialColumnOrder.current) initialColumnOrder.current = currentOrder;

				let next: string[];
				let insertAt: number;
				if (targetIndex < draggedIndex) {
					// move draggedId to just before targetId
					next = currentOrder.filter((id) => id !== draggedId);
					insertAt = next.indexOf(targetId);
				} else {
					// move draggedId to just after targetId
					next = currentOrder.filter((id) => id !== draggedId);
					insertAt = next.indexOf(targetId) + 1;
				}
				next.splice(insertAt, 0, draggedId);

				onColumnReorder?.(next);
				return next;
			});
		},
		[columnDefinitions, freezeColumn, onColumnReorder, setColumnOrder],
	);

	// trigger drag start.
	const dragStart = useCallback(
		(col: ColumnDefinition<T, unknown>, e: React.DragEvent) => {
			e.dataTransfer.setData('text/plain', col.id);
			draggedColId.current = col.id;
			setDraggedColId(col.id);
			setIsDragging(true);
			initialColumnOrder.current = null;
		},
		[setDraggedColId],
	);

	// dragover: e.preventDefault() is what tells the browser a drop is allowed
	// here, so skipping it for the frozen column
	const dragOver = useCallback(
		(col: ColumnDefinition<T, unknown>, colIndex: number, e: React.DragEvent<HTMLTableCellElement>) => {
			e.preventDefault();

			/* prevent endless swap and prevent global from capturing event */
			e.stopPropagation();

			/* update drop col index (will capture frozen columns for revert purposes)*/
			draggedColIndex.current = colIndex;

			/* when frozen, column annot be moved */
			if (freezeColumn && colIndex === 0) return;

			/* perform the re-order even though drop was not fired */
			/* needs to be the first time entering the column and can be the same column */
			if (draggedOverColId.current !== col.id && draggedColId.current !== col.id) {
				draggedOverColId.current = col.id;
				if (draggedColId.current) moveColumn(draggedColId.current, col.id);
			}
		},
		[freezeColumn, moveColumn],
	);

	// drop: clean up drag states reverting if dropping in unallowed places
	const dragDrop = useCallback(
		(e: React.DragEvent | DragEvent, global = false) => {
			e.preventDefault();

			/* global drops, or drops on forzen column, revert moves - and tell the consumer,
			 * since onColumnReorder already fired with the (now-abandoned) in-progress order */
			if (initialColumnOrder.current) {
				if (global || (freezeColumn && draggedColIndex.current === 0)) {
					setColumnOrder(initialColumnOrder.current);
					onColumnReorder?.(initialColumnOrder.current);
				}
			}

			/* clean up drag states */
			setDraggedColId(null);
			setIsDragging(false);
			draggedOverColId.current = null;
			draggedColId.current = null;
			draggedColIndex.current = null;
			initialColumnOrder.current = null;
		},
		[setColumnOrder, setDraggedColId, freezeColumn, onColumnReorder],
	);

	// need to prevent default on drag over to activate drop listener
	const handleGlobalOver = useCallback((e: DragEvent) => {
		e.preventDefault();
		draggedOverColId.current = null;
		draggedColIndex.current = null;
	}, []);

	// global drop fallback - a drop landing outside any header cell (table body, or
	// outside the table entirely) still needs to revert. Routed through one stable
	// callback so add/removeEventListener below always agree on which function to detach
	const handleGlobalDrop = useCallback((e: DragEvent) => dragDrop(e, true), [dragDrop]);

	// set/clear listeners outside table area since drop can happen there and we need to clean up
	useEffect(() => {
		if (!isDragging) return;
		document.addEventListener('drop', handleGlobalDrop);
		document.addEventListener('dragover', handleGlobalOver);
		return () => {
			document.removeEventListener('drop', handleGlobalDrop);
			document.removeEventListener('dragover', handleGlobalOver);
		};
	}, [isDragging, handleGlobalDrop, handleGlobalOver]);

	return { dragStart, dragOver, dragDrop };
}
