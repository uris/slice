import { describe, expect, it } from 'vitest';
import type { ColumnDefinition } from './_types';
import {
	applyDataTableViewState,
	createDefaultViewState,
	type DataTableViewState,
} from './viewState';

type Row = { name: string; age: number };

function col(id: string): ColumnDefinition<Row, unknown> {
	return { id, title: id, accessor: (row) => row[id as keyof Row] };
}

const columns = [col('name'), col('age'), col('country')];

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
