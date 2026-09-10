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
	borderStyle?: 'box' | 'row' | 'none';
	borderColor?: string;
	tableData?: T[];
	columnDefinitions: ColumnDefinition<T, any>[];
	/* get a stable row identity for React keys. Falls back to row index when omitted. */
	getRowId?: (row: T, index: number) => string | number;
	/*
	 * Filters tableData before it's rendered. Matches Array.prototype.filter's
	 * own callback signature, so an existing predicate (including a type-predicate
	 * one) can be passed straight through, and rowIndex downstream (getRowId,
	 * onClick/onMouseOver/etc., hover-row matching) reflects position in the
	 * filtered rows, not the original array.
	 */
	filter?: (row: T, index: number, array: T[]) => boolean;
	caption?: string;
	onClick?: (col: ColumnDefinition<T>, colId: number, row: T, rowIndex: number) => void;
	onDoubleClick?: (col: ColumnDefinition<T>, colId: number, row: T, rowIndex: number) => void;
	onMouseOver?: (col: ColumnDefinition<T>, colId: number, row: T, rowIndex: number) => void;
	onMouseOut?: (col: ColumnDefinition<T>, colId: number, row: T, rowIndex: number) => void;
}
