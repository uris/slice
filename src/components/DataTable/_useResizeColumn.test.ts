import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useResizeColumn } from './_useResizeColumn';

function makeReactMouseEvent(currentTargetParent: HTMLElement | null) {
	return {
		stopPropagation: vi.fn(),
		preventDefault: vi.fn(),
		currentTarget: { parentElement: currentTargetParent },
	} as unknown as React.MouseEvent<HTMLDivElement>;
}

function dispatchMouseMove(x: number, y: number) {
	document.documentElement.dispatchEvent(new MouseEvent('mousemove', { clientX: x, clientY: y }));
}

function dispatchMouseUp() {
	document.documentElement.dispatchEvent(new MouseEvent('mouseup'));
}

function dispatchTouchMove(x: number, y: number) {
	const event = new Event('touchmove', { cancelable: true });
	Object.defineProperty(event, 'touches', { value: [{ clientX: x, clientY: y }] });
	document.documentElement.dispatchEvent(event);
}

function rect(overrides: Partial<DOMRect> = {}): DOMRect {
	return {
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		width: 0,
		height: 0,
		x: 0,
		y: 0,
		toJSON: () => ({}),
		...overrides,
	} as DOMRect;
}

// mirrors how DataTable wires the hook up: real DOM nodes for the drag
// handle/parent/cell/col so getBoundingClientRect and inline style writes
// (what the hook actually reads and mutates) behave like they would live.
function setup(colResize = true) {
	const setColumnWidths = vi.fn();
	const onColumnResize = vi.fn();
	const handleEl = document.createElement('div');
	const parentEl = document.createElement('div');
	const cellEl = document.createElement('td');
	const colEl = document.createElement('col') as HTMLTableColElement;
	vi.spyOn(cellEl, 'getBoundingClientRect').mockReturnValue(rect({ left: 40 }));
	vi.spyOn(parentEl, 'getBoundingClientRect').mockReturnValue(rect({ left: 0 }));

	const colRefs = { current: { colA: colEl } } as React.RefObject<Record<string, HTMLTableColElement | null>>;
	const elements = { handle: { current: handleEl }, parent: { current: parentEl } };

	const rendered = renderHook(() => useResizeColumn(elements, colResize, setColumnWidths, onColumnResize));

	return { ...rendered, setColumnWidths, onColumnResize, handleEl, parentEl, cellEl, colEl, colRefs };
}

describe('useResizeColumn', () => {
	afterEach(() => {
		// the hook attaches document-level listeners and mutates shared
		// documentElement styles while dragging; make sure a test that bails
		// out mid-drag can't leak state into the next one
		document.documentElement.style.cursor = '';
		document.documentElement.style.userSelect = '';
	});

	it('ignores dragResize when column resizing is disabled', () => {
		const { result, cellEl, colRefs } = setup(false);
		act(() => result.current.dragResize('colA', makeReactMouseEvent(cellEl), colRefs));
		expect(result.current.resizing).toBe(false);
	});

	it('ignores dragResize when the column ref cannot be resolved', () => {
		const { result, cellEl } = setup(true);
		const emptyColRefs = { current: {} } as React.RefObject<Record<string, HTMLTableColElement | null>>;
		act(() => result.current.dragResize('missing', makeReactMouseEvent(cellEl), emptyColRefs));
		expect(result.current.resizing).toBe(false);
	});

	it('drags a column to a new width and commits it on mouse up', () => {
		const { result, setColumnWidths, onColumnResize, cellEl, colEl, colRefs } = setup(true);

		act(() => result.current.dragResize('colA', makeReactMouseEvent(cellEl), colRefs));
		act(() => dispatchMouseMove(140, 10));

		expect(result.current.resizing).toBe(true);
		expect(result.current.clientX).toBe(140);
		// cell's left (40) becomes colStartX; width = clientX - colStartX = 140 - 40
		expect(colEl.style.width).toBe('100px');

		act(() => dispatchMouseUp());

		expect(setColumnWidths).toHaveBeenCalledTimes(1);
		const updater = setColumnWidths.mock.calls[0][0];
		expect(updater({})).toEqual({ colA: 100 });
		expect(onColumnResize).toHaveBeenCalledWith('colA', 100);
		expect(result.current.resizing).toBe(false);
		expect(result.current.clientX).toBeUndefined();
	});

	it('clamps the dragged width to zero rather than going negative', () => {
		const { result, colEl, cellEl, colRefs } = setup(true);
		act(() => result.current.dragResize('colA', makeReactMouseEvent(cellEl), colRefs));
		act(() => dispatchMouseMove(-50, 0)); // clientX(-50) - colStartX(40) is negative
		expect(colEl.style.width).toBe('0px');
	});

	it('does not commit a width when the pointer never actually moved before mouse up', () => {
		const { result, setColumnWidths, onColumnResize, cellEl, colRefs } = setup(true);
		act(() => result.current.dragResize('colA', makeReactMouseEvent(cellEl), colRefs));
		act(() => dispatchMouseUp());
		expect(setColumnWidths).not.toHaveBeenCalled();
		expect(onColumnResize).not.toHaveBeenCalled();
	});

	it('resolves touch positions from the touch list rather than clientX/clientY', () => {
		const { result, colEl, cellEl, colRefs } = setup(true);
		act(() => result.current.dragResize('colA', makeReactMouseEvent(cellEl), colRefs));
		act(() => dispatchTouchMove(90, 5));
		expect(result.current.clientX).toBe(90);
		expect(colEl.style.width).toBe('50px'); // 90 - 40
	});

	it('parks the drag handle off-screen once dragging ends', () => {
		const { result, handleEl, cellEl, colRefs } = setup(true);
		act(() => result.current.dragResize('colA', makeReactMouseEvent(cellEl), colRefs));
		act(() => dispatchMouseMove(80, 0));
		act(() => dispatchMouseUp());
		expect(handleEl.style.left).toBe('-500px');
	});

	describe('hoverResize', () => {
		it('does nothing when column resizing is disabled', () => {
			const { result, handleEl, cellEl } = setup(false);
			act(() => result.current.hoverResize(true, makeReactMouseEvent(cellEl)));
			expect(handleEl.style.left).toBe('');
		});

		it('does nothing while a drag is already in progress', () => {
			const { result, handleEl, cellEl, colRefs } = setup(true);
			act(() => result.current.dragResize('colA', makeReactMouseEvent(cellEl), colRefs));
			act(() => result.current.hoverResize(true, makeReactMouseEvent(cellEl)));
			expect(handleEl.style.left).toBe('');
		});

		it('positions the handle over the hovered column when shown', () => {
			const { result, handleEl, cellEl } = setup(true);
			act(() => result.current.hoverResize(true, makeReactMouseEvent(cellEl)));
			// left(40) - parentLeft(0) - clientLeft(0) + scrollLeft(0) = 40; default position is 'right' => +width(0)
			expect(handleEl.style.left).toBe('40px');
		});

		it('parks the handle off-screen when hidden', () => {
			const { result, handleEl, cellEl } = setup(true);
			act(() => result.current.hoverResize(false, makeReactMouseEvent(cellEl)));
			expect(handleEl.style.left).toBe('-500px');
		});
	});
});
