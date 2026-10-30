import { describe, expect, it } from 'vitest';
import type { ColumnDefinition } from './_types';
import {
	applyDataTableViewState,
	captureSortToViewState,
	createDefaultViewState,
	resolveSortFromViewState,
	type DataTableViewState,
} from './viewState';

type Row = { name: string; age: number };

function col(id: string, sort?: keyof Row): ColumnDefinition<Row, unknown> {
	return { id, title: id, sort, accessor: (row) => row[id as keyof Row] };
}

const columns = [col('name', 'name'), col('age', 'age'), col('country')];

describe('createDefaultViewState', () => {
	it('reflects the columns in their natural order', () => {
		expect(createDefaultViewState(columns)).toEqual({
			columnOrder: ['name', 'age', 'country'],
		});
	});
});

describe('applyDataTableViewState', () => {
	it('returns the original columns when no state is given', () => {
		expect(applyDataTableViewState(columns, undefined)).toBe(columns);
		expect(applyDataTableViewState(columns, null)).toBe(columns);
	});

	it('reorders columns to match columnOrder', () => {
		const state: DataTableViewState = { columnOrder: ['country', 'name', 'age'] };
		expect(applyDataTableViewState(columns, state).map((c) => c.id)).toEqual([
			'country',
			'name',
			'age',
		]);
	});

	it('drops hidden columns', () => {
		const state: DataTableViewState = {
			columnOrder: ['name', 'age', 'country'],
			hiddenColumns: ['age'],
		};
		expect(applyDataTableViewState(columns, state).map((c) => c.id)).toEqual([
			'name',
			'country',
		]);
	});

	it('appends columns missing from columnOrder instead of dropping them', () => {
		const state: DataTableViewState = { columnOrder: ['country'] };
		expect(applyDataTableViewState(columns, state).map((c) => c.id)).toEqual([
			'country',
			'name',
			'age',
		]);
	});

	it('ignores ids in columnOrder that no longer exist as columns', () => {
		const state: DataTableViewState = {
			columnOrder: ['deleted-column', 'name', 'age', 'country'],
		};
		expect(applyDataTableViewState(columns, state).map((c) => c.id)).toEqual([
			'name',
			'age',
			'country',
		]);
	});

	it('ignores duplicate ids in columnOrder', () => {
		const state: DataTableViewState = {
			columnOrder: ['name', 'name', 'age', 'country'],
		};
		expect(applyDataTableViewState(columns, state).map((c) => c.id)).toEqual([
			'name',
			'age',
			'country',
		]);
	});

	it('applies width overrides by column id', () => {
		const state: DataTableViewState = {
			columnOrder: ['name', 'age', 'country'],
			columnWidths: { age: 120 },
		};
		const result = applyDataTableViewState(columns, state);
		expect(result.find((c) => c.id === 'age')?.width).toBe(120);
		expect(result.find((c) => c.id === 'name')?.width).toBeUndefined();
	});

	it('round-trips through JSON (state is plain data, no functions)', () => {
		const state: DataTableViewState = {
			columnOrder: ['age', 'name'],
			hiddenColumns: ['country'],
			columnWidths: { age: '10%' },
		};
		const roundTripped = JSON.parse(JSON.stringify(state));
		expect(
			applyDataTableViewState(columns, roundTripped).map((c) => c.id),
		).toEqual(['age', 'name']);
	});
});

describe('resolveSortFromViewState', () => {
	it('returns undefined when there is no saved sort', () => {
		expect(resolveSortFromViewState(columns, undefined)).toBeUndefined();
		expect(resolveSortFromViewState(columns, { columnOrder: [] })).toBeUndefined();
	});

	it('resolves the saved columnId to that column\'s sort key', () => {
		const state: DataTableViewState = {
			columnOrder: ['name', 'age', 'country'],
			sort: { columnId: 'age', dir: 'desc' },
		};
		expect(resolveSortFromViewState(columns, state)).toEqual({ key: 'age', dir: 'desc' });
	});

	it('drops the sort when the saved columnId no longer exists', () => {
		const state: DataTableViewState = {
			columnOrder: ['name', 'age', 'country'],
			sort: { columnId: 'deleted-column', dir: 'asc' },
		};
		expect(resolveSortFromViewState(columns, state)).toBeUndefined();
	});

	it('drops the sort when the saved column is no longer sortable in code', () => {
		const state: DataTableViewState = {
			columnOrder: ['name', 'age', 'country'],
			sort: { columnId: 'country', dir: 'asc' },
		};
		expect(resolveSortFromViewState(columns, state)).toBeUndefined();
	});
});

describe('captureSortToViewState', () => {
	it('returns undefined for no active sort', () => {
		expect(captureSortToViewState(columns, undefined)).toBeUndefined();
	});

	it('captures a live SortKey as the sorted column\'s id', () => {
		expect(captureSortToViewState(columns, { key: 'age', dir: 'desc' })).toEqual({
			columnId: 'age',
			dir: 'desc',
		});
	});

	it('returns undefined when no column sorts on that key', () => {
		expect(
			captureSortToViewState(columns, { key: 'unknown' as keyof Row, dir: 'asc' }),
		).toBeUndefined();
	});

	it('round-trips through resolveSortFromViewState', () => {
		const sort = { key: 'age' as const, dir: 'asc' as const };
		const captured = captureSortToViewState(columns, sort);
		const state: DataTableViewState = { columnOrder: [], sort: captured };
		expect(resolveSortFromViewState(columns, state)).toEqual(sort);
	});
});
