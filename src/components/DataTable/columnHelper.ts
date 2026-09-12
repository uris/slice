import type { AccessorColumn, ColumnDefinition } from './_types';

/*
 * createColumnHelper<T>() gives you back a single builder, `accessor`, that
 * infers a column's value type V from what the accessor function returns
 */
export function createColumnHelper<T>() {
	return {
		accessor<V>(accessor: (row: T) => V, def: Omit<AccessorColumn<T, V>, 'accessor'>): ColumnDefinition<T, V> {
			return { accessor, ...def };
		},
	};
}

/* resolve a column's cell value for a given row: via `key` when present,
 * via `accessor` when present, or undefined for a purely presentational column. */
export function resolveColumnValue<T>(col: ColumnDefinition<T, any>, row: T): any {
	if (col.accessor) return col.accessor(row);
	if (col.key !== undefined) return row[col.key];
	return undefined;
}

/* resolve column alignment values to flex box values */
export const resolveAlignValue = (value?: 'start' | 'center' | 'end') => {
	switch (value) {
		case 'start':
			return 'flex-start';
		case 'center':
			return 'center';
		case 'end':
			return 'flex-end';
		default:
			return 'center';
	}
};

// helper to resolve the position of the drag handle visual element
export const resolveDragHandleXPos = (elements: {
	cell?: HTMLElement | null;
	handle?: HTMLDivElement | null;
	parent?: HTMLDivElement | null;
	position?: 'left' | 'right' /* position highlight on left/right edge of the column */;
}) => {
	const { cell, handle, parent, position = 'right' } = elements ?? {};
	if (!cell || !parent || !handle) return;
	const { left, width } = cell.getBoundingClientRect();
	const parentRect = parent.getBoundingClientRect();
	const x = left - parentRect.left - parent.clientLeft + parent.scrollLeft;
	if (position === 'right') handle.style.left = `${x + width}px`;
	else handle.style.left = `${x}px`;
};
