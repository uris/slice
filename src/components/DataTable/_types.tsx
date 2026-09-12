import type { ReactNode } from 'react';

/* Note: T is the shape of a single row of data the table is bound to. */
/* Note: V is the type of the value resolved for the column's cell - either */
/* T[K] for a `key`-based column, or the accessor fn's return type. */

// the context data for rendering a table cell
export type CellContext<T, V> = {
	row: T;
	value: V;
	rowIndex: number;
};

// the context data for rendering a table header
export type HeaderContext<T, V> = {
	column: ColumnDefinition<T, V>;
	sortKey?: SortKey<T>;
};

// fields shared by every column shape, regardless of how its value is resolved
type ColumnBase<T, V> = {
	id: string;
	title: string;
	width?: number | string;
	justify?: 'start' | 'center' | 'end';
	align?: 'start' | 'center' | 'end';
	padding?: number | string;
	nowrap?: boolean;
	sort?: keyof T /* defining a key makes the header click sortable asc/desc */;
	renderHeader?: (ctx: HeaderContext<T, V>) => ReactNode /* custom header cell renderer */;
	renderCell?: (ctx: CellContext<T, V>) => ReactNode /* custom body cell renderer */;
};

// a column whose value is read straight off the row: { key: 'age' }.
// distributes over every K in keyof T so V is inferred as T[K] per-column -
// no wrapper/helper call needed, `renderCell`'s `value` just comes out typed.
type KeyColumn<T> = {
	[K in keyof T]: ColumnBase<T, T[K]> & { key: K; accessor?: never };
}[keyof T];

// a column whose value is computed. Build these with createColumnHelper() so
// V gets inferred from the accessor fn's return type instead of written by hand.
export type AccessorColumn<T, V> = ColumnBase<T, V> & { accessor: (row: T) => V; key?: never };

// a purely presentational column with no row-derived value (e.g. row actions)
type PlainColumn<T> = ColumnBase<T, undefined> & { key?: never; accessor?: never };

// shape for how to define a table column. Prefer `key` for a plain field
// lookup; fall back to `accessor` (via createColumnHelper) when the cell
// value needs to be computed from more than one field.
export type ColumnDefinition<T, V = unknown> = KeyColumn<T> | AccessorColumn<T, V> | PlainColumn<T>;

export interface DataTableProps<T> {
	height: number | string;
	width: number | string;
	headerSticky: boolean;
	freezeColumn: boolean;
	backgroundColor?: string;
	backgroundColorHoverRow?: string;
	freezeColumnBackgroundColor?: string;
	headerBackgroundColor?: string;
	candyStripeBackgroundColor?: string;
	handleHoverColor?: string;
	borderStyle?: 'box' | 'row' | 'none';
	borderRadius?: number | string;
	borderColor?: string;
	tableData?: T[];
	colResize?: boolean;
	/* Fires when a column resize drag ends, with its new width in px. Not persisted internally -
	 * feed it into your own DataTableViewState (e.g. columnWidths: {...prev.columnWidths, [columnId]: width})
	 * if the resize should survive a reload. */
	onColumnResize?: (columnId: string, width: number) => void;
	/* Fires when a column drag-and-drop reorder completes, with the new full column id order.
	 * Not persisted internally - same as onColumnResize, feed it into your own DataTableViewState
	 * (e.g. columnOrder: newOrder) if the order should survive a reload. */
	onColumnReorder?: (columnOrder: string[]) => void;
	columnDefinitions: ColumnDefinition<T, any>[];
	/* get a stable row identity for React keys. Falls back to row index when omitted. */
	getRowId?: (row: T, index: number) => string | number;
	filter?: (row: T, index: number, array: T[]) => boolean;
	sort?: SortKey<T>;
	onSortChange?: (sort: SortKey<T>) => void;
	caption?: string;
	onClick?: (col: ColumnDefinition<T>, colId: number, row: T, rowIndex: number) => void;
	onDoubleClick?: (col: ColumnDefinition<T>, colId: number, row: T, rowIndex: number) => void;
	onMouseOver?: (col: ColumnDefinition<T>, colId: number, row: T, rowIndex: number) => void;
	onMouseOut?: (col: ColumnDefinition<T>, colId: number, row: T, rowIndex: number) => void;
}

export type SortKey<T> = { key?: keyof T; dir: 'asc' | 'desc' } | undefined;
