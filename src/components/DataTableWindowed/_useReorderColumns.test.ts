import { act, renderHook } from '@testing-library/react';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import type { ColumnDefinition } from './_types';
import { useReorderColumns } from './_useReorderColumns';

type Row = { name: string };

function col(id: string): ColumnDefinition<Row, unknown> {
	return { id, title: id, accessor: (row) => row.name };
}

// natural order is always a, b, c, d
const columnDefinitions = [col('a'), col('b'), col('c'), col('d')];

function makeDragEvent() {
	return {
		preventDefault: vi.fn(),
		stopPropagation: vi.fn(),
		dataTransfer: { setData: vi.fn() },
	} as unknown as React.DragEvent<HTMLTableCellElement>;
}

// mirrors how DataTable wires the hook up: columnOrder/draggedColId are lifted
// state the hook's setters write into, so a real useState round-trip is needed
// (not a plain vi.fn()) for moveColumn's functional update to do anything.
function setup(freezeColumn = false) {
	const onColumnReorder = vi.fn();
	const rendered = renderHook(() => {
		const [columnOrder, setColumnOrder] = useState<string[] | null>(null);
		const [draggedColId, setDraggedColId] = useState<string | null>(null);
		const reorder = useReorderColumns<Row>(
			columnDefinitions,
			setColumnOrder,
			setDraggedColId,
			onColumnReorder,
			freezeColumn,
		);
		return { columnOrder, draggedColId, ...reorder };
	});
	return { ...rendered, onColumnReorder };
}

describe('useReorderColumns', () => {
	it('moves the dragged column next to the hovered column and notifies onColumnReorder', () => {
		const { result, onColumnReorder } = setup();

		act(() => result.current.dragStart(columnDefinitions[0], makeDragEvent())); // drag 'a'
		act(() => result.current.dragOver(columnDefinitions[2], 2, makeDragEvent())); // over 'c'

		expect(result.current.columnOrder).toEqual(['b', 'c', 'a', 'd']);
		expect(onColumnReorder).toHaveBeenCalledWith(['b', 'c', 'a', 'd']);
	});

	it('never moves the frozen (first) column, or anything else into its slot', () => {
		const { result, onColumnReorder } = setup(true);

		act(() => result.current.dragStart(columnDefinitions[1], makeDragEvent())); // drag 'b'
		act(() => result.current.dragOver(columnDefinitions[0], 0, makeDragEvent())); // over frozen 'a'

		expect(result.current.columnOrder).toBeNull();
		expect(onColumnReorder).not.toHaveBeenCalled();
	});

	it('keeps the new order and does not re-notify on a valid drop', () => {
		const { result, onColumnReorder } = setup();

		act(() => result.current.dragStart(columnDefinitions[0], makeDragEvent()));
		act(() => result.current.dragOver(columnDefinitions[2], 2, makeDragEvent()));
		onColumnReorder.mockClear();

		act(() => result.current.dragDrop(makeDragEvent()));

		expect(result.current.columnOrder).toEqual(['b', 'c', 'a', 'd']);
		expect(result.current.draggedColId).toBeNull();
		expect(onColumnReorder).not.toHaveBeenCalled();
	});

	it('reverts the order and re-notifies onColumnReorder when the drop lands on the frozen column', () => {
		// regression: onColumnReorder used to only fire mid-drag from moveColumn, so a
		// consumer persisting its value into their own view state never heard about a revert
		const { result, onColumnReorder } = setup(true);

		act(() => result.current.dragStart(columnDefinitions[1], makeDragEvent())); // drag 'b'
		act(() => result.current.dragOver(columnDefinitions[2], 2, makeDragEvent())); // over 'c' - valid move
		expect(result.current.columnOrder).toEqual(['a', 'c', 'b', 'd']);
		onColumnReorder.mockClear();

		act(() => result.current.dragOver(columnDefinitions[0], 0, makeDragEvent())); // over frozen 'a' just before dropping
		act(() => result.current.dragDrop(makeDragEvent()));

		expect(result.current.columnOrder).toEqual(['a', 'b', 'c', 'd']);
		expect(onColumnReorder).toHaveBeenCalledWith(['a', 'b', 'c', 'd']);
	});

	it('reverts via the global listener - and re-notifies - when the drop lands outside the table', () => {
		// also covers the very first drag on a table (columnOrder starts null): the revert
		// snapshot must be the natural order, not skipped just because it collapses to null
		const { result, onColumnReorder } = setup();

		act(() => result.current.dragStart(columnDefinitions[0], makeDragEvent()));
		act(() => result.current.dragOver(columnDefinitions[2], 2, makeDragEvent()));
		expect(result.current.columnOrder).toEqual(['b', 'c', 'a', 'd']);
		onColumnReorder.mockClear();

		act(() => {
			document.dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }));
		});

		expect(result.current.columnOrder).toEqual(['a', 'b', 'c', 'd']);
		expect(onColumnReorder).toHaveBeenCalledWith(['a', 'b', 'c', 'd']);
	});

	it('is a no-op if it fires again after a valid drop already committed (mirrors dragend firing after drop)', () => {
		const { result, onColumnReorder } = setup();

		act(() => result.current.dragStart(columnDefinitions[0], makeDragEvent()));
		act(() => result.current.dragOver(columnDefinitions[2], 2, makeDragEvent()));
		act(() => result.current.dragDrop(makeDragEvent())); // onDrop
		onColumnReorder.mockClear();

		act(() => result.current.dragDrop(makeDragEvent(), true)); // onDragEnd, firing right after

		expect(result.current.columnOrder).toEqual(['b', 'c', 'a', 'd']);
		expect(onColumnReorder).not.toHaveBeenCalled();
	});

	it('adds and removes the same drop listener reference, so unmounting mid-drag actually detaches it', () => {
		// regression: addEventListener/removeEventListener used to each get a fresh inline
		// arrow function, so the listener was never really removed and leaked across drags
		const addSpy = vi.spyOn(document, 'addEventListener');
		const removeSpy = vi.spyOn(document, 'removeEventListener');
		const { result, unmount } = setup();

		act(() => result.current.dragStart(columnDefinitions[0], makeDragEvent()));

		const addedDropHandler = addSpy.mock.calls.find(([type]) => type === 'drop')?.[1];
		expect(addedDropHandler).toBeDefined();

		unmount();

		expect(removeSpy).toHaveBeenCalledWith('drop', addedDropHandler);

		addSpy.mockRestore();
		removeSpy.mockRestore();
	});

	it('does not react to a drop once unmounted mid-drag', () => {
		const { result, onColumnReorder, unmount } = setup();

		act(() => result.current.dragStart(columnDefinitions[0], makeDragEvent()));
		act(() => result.current.dragOver(columnDefinitions[2], 2, makeDragEvent()));
		onColumnReorder.mockClear();

		unmount();
		document.dispatchEvent(new Event('drop', { bubbles: true, cancelable: true }));

		expect(onColumnReorder).not.toHaveBeenCalled();
	});
});
