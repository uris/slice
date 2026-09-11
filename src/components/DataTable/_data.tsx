import React from 'react';
import { Avatar } from '../Avatar';
import type { ColumnDefinition } from './_types';
import { createColumnHelper } from './columnHelper';

// 1. define your data model for the table
export type SampleTableData = {
	name: string;
	age: number;
	pic: string;
	country: string;
	compensation: number;
	started: Date;
};

// 2. pull data for the data
export const sampleTableData: SampleTableData[] = [
	{
		name: 'John Appleseed',
		age: 25,
		pic: 'https://www.slice-uikit.com/public/images/profile-male-02.jpg',
		country: 'Portugal',
		compensation: 175000,
		started: new Date('2001-02-10'),
	},
	{
		name: 'Susan Appleseed',
		age: 28,
		pic: '',
		country: 'Spain',
		compensation: 150000,
		started: new Date('2020-09-02'),
	},
	{
		name: 'Thomas Appleseed',
		age: 36,
		pic: '',
		country: '',
		compensation: 100000,
		started: new Date('2018-05-12'),
	},
];

// 3.  Create a column accessor based on your data model
const column = createColumnHelper<SampleTableData>();

// 4. define your column definitions using the accessor
export const sampleTableColumnDefinitions: ColumnDefinition<SampleTableData, any>[] = [
	column.accessor((row) => row.name, {
		id: 'col-1',
		title: 'Name',
		justify: 'start',
		sort: 'name',
		renderCell: ({ row }) => {
			return (
				<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
					<Avatar image={row.pic} name={row.name} />
					{row.name}
				</div>
			);
		},
	}),
	column.accessor((row) => row.age, {
		id: 'col-2',
		title: 'Age',
		align: 'end',
		justify: 'center',
		nowrap: true,
		sort: 'age',
		renderCell: ({ value }) => <span>{value} yrs</span>,
	}),
	column.accessor((row) => row.country, {
		id: 'col-4',
		title: 'Country',
		justify: 'center',
		sort: 'country',
		renderCell: ({ value }) => <span>{value || 'Unknown'}</span>,
	}),
	column.accessor((row) => row.compensation, {
		id: 'col-5',
		title: 'Salary',
		justify: 'end',
		sort: 'compensation',
		renderCell: ({ value }) => <span>${value.toLocaleString()}</span>,
	}),
	column.accessor((row) => row.started, {
		id: 'col-6',
		title: 'Start Date',
		justify: 'end',
		sort: 'started',
		renderCell: ({ value }) => <span>{value.toLocaleDateString()}</span>,
	}),
];
