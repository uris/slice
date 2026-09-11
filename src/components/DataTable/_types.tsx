import type { ReactNode } from 'react';

/* Note: T is the shape of a single row of data the table is bound to. */
/* Note: V is the type of the value resolved by the column's accessor function. */

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

// shape for how to define a table column
export type ColumnDefinition<T, V = unknown> = {
	id: string;
	title: string;
	width?: number | string;
	justify?: 'start' | 'center' | 'end';
	align?: 'start' | 'center' | 'end';
	padding?: number | string;
	nowrap?: boolean;
	sort?: keyof T /* defining a key makes the header click sortable asc/desc */;
	accessor: (row: T) => V /* pull this column's value out of a row. uses createColumnHelper. */;
	renderHeader?: (ctx: HeaderContext<T, V>) => ReactNode /* custom header cell renderer */;
	renderCell?: (ctx: CellContext<T, V>) => ReactNode /* custom body cell renderer */;
};

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
	borderRadius?: number |string;
	borderColor?: string;
	tableData?: T[];
	colResize?: boolean;
	/* Fires when a column resize drag ends, with its new width in px. Not persisted internally -
	 * feed it into your own DataTableViewState (e.g. columnWidths: {...prev.columnWidths, [columnId]: width})
	 * if the resize should survive a reload. */
	onColumnResize?: (columnId: string, width: number) => void;
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
