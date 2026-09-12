import type { ColumnDefinition, SortKey } from './_types';

/*
 * DataTableViewState is the part of a table's configuration that's safe to
 * persist: plain strings and numbers, no accessor/render functions. It
 * references columns purely by `id`, so it can be serialized to storage if needed
 */
export type DataTableViewState = {
	/* Column ids, in the order they should be displayed. */
	columnOrder: string[];
	/* Column ids to hide. */
	hiddenColumns?: string[];
	/* Per-column width overrides, keyed by column id. */
	columnWidths?: Record<string, number | string>;
	/* The active sort, if any. References the sorted column by `id` */
	sort?: { columnId: string; dir: 'asc' | 'desc' };
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

/*
 * Resolves a persisted DataTableViewState's sort into the SortKey<T> that
 * DataTable's `sort` prop expects, by looking up the referenced column's
 * `sort` field (the actual row key) via `sort.columnId`.
 */
export function resolveSortFromViewState<T>(
	columns: ColumnDefinition<T, any>[],
	state?: DataTableViewState | null,
): SortKey<T> {
	if (!state?.sort) return undefined;
	const column = columns.find((c) => c.id === state.sort?.columnId);
	if (!column?.sort) return undefined;
	return { key: column.sort, dir: state.sort.dir };
}

/*
 * The inverse of resolveSortFromViewState - captures a live SortKey<T>
 * (e.g. from DataTable's onSortChange) back into the persistable shape, by
 * finding the column whose `sort` field matches the sorted key.
 */
export function captureSortToViewState<T>(
	columns: ColumnDefinition<T, any>[],
	sort: SortKey<T>,
): DataTableViewState['sort'] {
	if (!sort?.key) return undefined;
	const column = columns.find((c) => c.sort === sort.key);
	if (!column) return undefined;
	return { columnId: column.id, dir: sort.dir };
}
