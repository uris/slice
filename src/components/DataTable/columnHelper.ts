import type { ColumnDefinition } from './_types';

/*
 * createColumnHelper<T>() gives you back a single builder, `accessor`, that
 * infers a column's value type V from what the accessor function returns -
 * so renderCell/renderHeader get a typed `value` instead of `unknown`,
 * without having to annotate anything by hand.
 *
 *   const col = createColumnHelper<Person>();
 *   col.accessor(row => row.age, { id: 'age', title: 'Age' });               // V inferred as number
 *   col.accessor(row => row.first + row.last, { id: 'name', title: 'Name' }); // V inferred as string

 */
export function createColumnHelper<T>() {
	return {
		accessor<V>(
			accessor: (row: T) => V,
			def: Omit<ColumnDefinition<T, V>, 'accessor'>,
		): ColumnDefinition<T, V> {
			return { accessor, ...def };
		},
	};
}

/* resolve column alignement values to flex box values */
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
