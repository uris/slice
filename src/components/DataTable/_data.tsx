import { Avatar } from '../Avatar';
import type { ColumnDefinition, HeaderContext } from './_types';
import { createColumnHelper } from './columnHelper';

export type SampleTableData = {
	name: string;
	age: number;
	pic: string;
	country: string;
	compensation: number;
};

export const sampleTableData: SampleTableData[] = [
	{
		name: 'John Appleseed',
		age: 25,
		pic: 'https://www.slice-uikit.com/public/images/profile-male-02.jpg',
		country: 'Portugal',
		compensation: 1000000,
	},
	{
		name: 'Susan Appleseed',
		age: 25,
		pic: '',
		country: 'Spain',
		compensation: 1000000,
	},
	{
		name: 'Thomas Appleseed',
		age: 25,
		pic: '',
		country: '',
		compensation: 1000000,
	},
];

const column = createColumnHelper<SampleTableData>();

export const sampleTableColumnDefinitions: ColumnDefinition<
	SampleTableData,
	any
>[] = [
	column.accessor((row) => row.name, {
		id: 'col-1',
		title: 'Full Name',
		justify: 'start',
		renderHeader: (ctx) => <HeaderRenderer ctx={ctx} />,
	}),
	column.accessor((row) => row.age, {
		id: 'col-2',
		title: 'Age',
		align: 'end',
		justify: 'center',
		nowrap: true,
		renderCell: ({ value }) => <span>{value} yrs</span>,
		renderHeader: (ctx) => <HeaderRenderer ctx={ctx} />,
	}),
	column.accessor((row) => row.pic, {
		id: 'col-3',
		title: 'Profile Photo',
		justify: 'center',
		renderCell: ({ value, row }) => <Avatar image={value} name={row.name} />,
		renderHeader: (ctx) => <HeaderRenderer ctx={ctx} />,
	}),
	column.accessor((row) => row.country, {
		id: 'col-4',
		title: 'Country',
		justify: 'start',
		renderCell: ({ value }) => <span>{value || 'Unknown'}</span>,
		renderHeader: (ctx) => <HeaderRenderer ctx={ctx} />,
	}),
	column.accessor((row) => row.compensation, {
		id: 'col-5',
		title: 'Salary',
		justify: 'end',
		renderCell: ({ value }) => <span>${value.toLocaleString()}</span>,
		renderHeader: (ctx) => <HeaderRenderer ctx={ctx} />,
	}),
];

// general custom header renderer as example
export const HeaderRenderer = (pros: {
	ctx: HeaderContext<SampleTableData, any>;
}) => {
	const { column } = pros.ctx;
	return <span style={{ fontWeight: 540 }}>{column.title}</span>;
};
