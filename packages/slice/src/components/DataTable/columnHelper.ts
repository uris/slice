import type { AccessorColumn, ColumnDefinition, ResolvedColumnDefinition } from './_types';

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

/* Accessors take precedence; field lookup defaults to the column id. */
export function resolveColumnValue<T>(col: ColumnDefinition<T, any>, row: T): any {
	if (col.accessor) return col.accessor(row);
	return row[(col.key ?? col.id) as keyof T];
}

/** Resolve the row field used by headers, comparators, and persisted sorts. */
export function resolveColumnSortKey<T>(col: { id: string; key?: keyof T; sort?: boolean | keyof T }):
	| keyof T
	| undefined {
	if (col.sort === false) return undefined;
	if (col.sort === undefined || col.sort === true) return (col.key ?? col.id) as keyof T;
	return col.sort;
}

/** Keep input shorthand out of renderer contexts. */
export function resolveColumnDefinition<T, V>(col: ColumnDefinition<T, V>): ResolvedColumnDefinition<T, V> {
	return { ...col, sort: resolveColumnSortKey<T>(col) } as ResolvedColumnDefinition<T, V>;
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
