import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import type { ColumnDefinition } from './_types';
import { createColumnHelper, resolveAlignValue, resolveColumnValue, resolveColumnSortKey, resolveDragHandleXPos } from './columnHelper';

type Row = { name: string; age: number; nickname?: string };

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

describe('createColumnHelper', () => {
	it('builds a column definition that carries the accessor and definition through untouched', () => {
		const helper = createColumnHelper<Row>();
		const accessor = (row: Row) => row.age;

		const column = helper.accessor(accessor, { id: 'age', title: 'Age' });

		expect(column.accessor).toBe(accessor);
		expect(column.id).toBe('age');
		expect(column.title).toBe('Age');
	});
});

describe('resolveColumnValue', () => {
	const row: Row = { name: 'Ada', age: 30 };

	it('calls the accessor when the column has one', () => {
		const col: ColumnDefinition<Row, number> = { id: 'age', title: 'Age', accessor: (r) => r.age };
		expect(resolveColumnValue(col, row)).toBe(30);
	});

	it('reads straight off the row when the column has a key', () => {
		const col: ColumnDefinition<Row> = { id: 'name', title: 'Name', key: 'name' };
		expect(resolveColumnValue(col, row)).toBe('Ada');
	});

	it('returns undefined for a purely presentational column with neither key nor accessor', () => {
		const col: ColumnDefinition<Row> = { id: 'actions', title: 'Actions', sort: false };
		expect(resolveColumnValue(col, row)).toBeUndefined();
	});
});

describe('resolveAlignValue', () => {
	it('maps start to flex-start', () => expect(resolveAlignValue('start')).toBe('flex-start'));
	it('maps center to center', () => expect(resolveAlignValue('center')).toBe('center'));
	it('maps end to flex-end', () => expect(resolveAlignValue('end')).toBe('flex-end'));
	it('defaults to center when no value is given', () => expect(resolveAlignValue(undefined)).toBe('center'));
});

describe('resolveDragHandleXPos', () => {
	it('does nothing when the cell is missing', () => {
		const handle = document.createElement('div');
		const parent = document.createElement('div');
		resolveDragHandleXPos({ cell: null, handle, parent });
		expect(handle.style.left).toBe('');
	});

	it('does nothing when the handle is missing', () => {
		const cell = document.createElement('div');
		const parent = document.createElement('div');
		const getRect = vi.spyOn(cell, 'getBoundingClientRect');
		resolveDragHandleXPos({ cell, handle: null, parent });
		expect(getRect).not.toHaveBeenCalled();
	});

	it('does nothing when the parent is missing', () => {
		const cell = document.createElement('div');
		const handle = document.createElement('div');
		resolveDragHandleXPos({ cell, handle, parent: null });
		expect(handle.style.left).toBe('');
	});

	it('positions the handle at the column\'s right edge by default', () => {
		const cell = document.createElement('div');
		const handle = document.createElement('div');
		const parent = document.createElement('div');
		vi.spyOn(cell, 'getBoundingClientRect').mockReturnValue(rect({ left: 150, width: 80 }));
		vi.spyOn(parent, 'getBoundingClientRect').mockReturnValue(rect({ left: 100 }));
		Object.defineProperty(parent, 'clientLeft', { value: 2, configurable: true });
		Object.defineProperty(parent, 'scrollLeft', { value: 10, configurable: true });

		resolveDragHandleXPos({ cell, handle, parent });

		// x = 150 - 100 - 2 + 10 = 58; right-edge position => x + width = 58 + 80
		expect(handle.style.left).toBe('138px');
	});

	it('positions the handle at the column\'s left edge when position is "left"', () => {
		const cell = document.createElement('div');
		const handle = document.createElement('div');
		const parent = document.createElement('div');
		vi.spyOn(cell, 'getBoundingClientRect').mockReturnValue(rect({ left: 150, width: 80 }));
		vi.spyOn(parent, 'getBoundingClientRect').mockReturnValue(rect({ left: 100 }));
		Object.defineProperty(parent, 'clientLeft', { value: 0, configurable: true });
		Object.defineProperty(parent, 'scrollLeft', { value: 0, configurable: true });

		resolveDragHandleXPos({ cell, handle, parent, position: 'left' });

		// x = 150 - 100 - 0 + 0 = 50; left-edge position => just x
		expect(handle.style.left).toBe('50px');
	});
});


describe('column defaults', () => {
	it('reads id fields and preserves explicit keys and accessors', () => {
		const row = { name: 'Ada', age: 30 };
		expect(resolveColumnValue({ id: 'name', title: 'Name' }, row)).toBe('Ada');
		expect(resolveColumnValue({ id: 'name', key: 'age', title: 'Age' }, row)).toBe(30);
		expect(resolveColumnValue({ id: 'name', accessor: () => 'computed', title: 'Name' }, row)).toBe('computed');
	});
	it('resolves default, enabled, disabled and overridden sort fields', () => {
		const column: ColumnDefinition<Row> = { id: 'name', title: 'Name' };
		expect(resolveColumnSortKey(column)).toBe('name');
		expect(resolveColumnSortKey({ ...column, sort: true })).toBe('name');
		expect(resolveColumnSortKey<Row>({ id: 'alias', key: 'age' })).toBe('age');
		expect(resolveColumnSortKey({ ...column, sort: 'age' })).toBe('age');
		expect(resolveColumnSortKey({ ...column, sort: false })).toBeUndefined();
	});
	it('infers cell values from the id', () => {
		const column: ColumnDefinition<Row> = {
			id: 'age', title: 'Age',
			renderCell: ({ value }) => {
				expectTypeOf(value).toEqualTypeOf<number>();
				return value.toFixed(0);
			},
		};
		expect(column.id).toBe('age');
		const optional: ColumnDefinition<Row> = {
			id: 'nickname', title: 'Nickname',
			renderCell: ({ value }) => {
				expectTypeOf(value).toEqualTypeOf<string | undefined>();
				return value ?? 'Anonymous';
			},
		};
		expect(optional.id).toBe('nickname');
	});
});
