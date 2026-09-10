import type { ColumnDefinition } from './_types';

/*
 * DataTableViewState is the part of a table's configuration that's safe to
 * persist: plain strings and numbers, no accessor/render functions. It
 * references columns purely by `id`, so it can be written to localStorage,
 * sent to a backend, or round-tripped through JSON without touching the
 * code-defined ColumnDefinition objects (which always carry closures and
 * were never serializable, regardless of how the column's value is read).
 */
export type DataTableViewState = {
	/* Column ids, in the order they should be displayed. */
	columnOrder: string[];
	/* Column ids to hide. */
	hiddenColumns?: string[];
	/* Per-column width overrides, keyed by column id. */
	columnWidths?: Record<string, number | string>;
};

/* A DataTableViewState reflecting the columns' natural, in-code order. Useful
 * as an initial value before the user has customized anything. */
export function createDefaultViewState<T>(columns: ColumnDefinition<T, any>[]): DataTableViewState {
	return { columnOrder: columns.map((column) => column.id) };
}

/*
 * Reconciles a code-defined column list with a persisted DataTableViewState:
 * reorders to match `columnOrder`, drops `hiddenColumns`, applies
 * `columnWidths`, and appends any columns the state doesn't mention (e.g.
 * a column added in code after the state was captured) at the end. Column
 * ids the state mentions but that no longer exist in `columns` (a deleted
 * or renamed column) are silently dropped rather than breaking the table.
 */
export function applyDataTableViewState<T>(
	columns: ColumnDefinition<T, any>[],
	state?: DataTableViewState | null,
): ColumnDefinition<T, any>[] {
	if (!state) return columns;

	const byId = new Map(columns.map((column) => [column.id, column]));
	const hidden = new Set(state.hiddenColumns ?? []);
	const seen = new Set<string>();

	const ordered: ColumnDefinition<T, any>[] = [];
	for (const id of state.columnOrder) {
		if (seen.has(id) || hidden.has(id)) continue;
		const column = byId.get(id);
		if (!column) continue;
		seen.add(id);
		ordered.push(column);
	}

	for (const column of columns) {
		if (seen.has(column.id) || hidden.has(column.id)) continue;
		seen.add(column.id);
		ordered.push(column);
	}

	if (!state.columnWidths) return ordered;
	const widths = state.columnWidths;
	return ordered.map((column) => (column.id in widths ? { ...column, width: widths[column.id] } : column));
}
