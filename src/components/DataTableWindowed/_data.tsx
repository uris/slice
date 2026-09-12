import React from 'react';
import { Avatar } from '../Avatar';
import type { ColumnDefinition } from './_types';

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

export const moreSampleData = (): SampleTableData[] => {
	let runs = 0;
	const data: SampleTableData[] = [];
	while (runs < 100) {
		data.push(...sampleTableData);
		runs++;
	}
	return data;
};

// generates `count` synthetic rows for exercising virtualizeRows at scale -
// distinct field values (rather than repeating the 3-row sample) so sorting
// and filtering stay meaningful even at 10k+ rows
const countries = ['Portugal', 'Spain', 'France', 'Germany', 'Italy', 'Ireland', '', 'Netherlands'];

export const manyRows = (count: number): SampleTableData[] => {
	return Array.from({ length: count }, (_, i) => ({
		name: `Person ${i + 1}`,
		age: 20 + (i % 45),
		pic: '',
		country: countries[i % countries.length],
		compensation: 60000 + ((i * 137) % 140000),
		started: new Date(2000, i % 12, (i % 28) + 1),
	}));
};

// 3. define your columns - `key` reads straight off SampleTableData and
export const sampleTableColumnDefinitions: ColumnDefinition<SampleTableData>[] = [
	{
		id: 'col-1',
		key: 'name',
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
	},
	{
		id: 'col-2',
		key: 'age',
		title: 'Age',
		align: 'end',
		justify: 'center',
		nowrap: true,
		sort: 'age',
		renderCell: ({ value }) => <span>{value} yrs</span>,
	},
	{
		id: 'col-4',
		key: 'country',
		title: 'Country',
		justify: 'center',
		sort: 'country',
		renderCell: ({ value }) => <span>{value || 'Unknown'}</span>,
	},
	{
		id: 'col-5',
		key: 'compensation',
		title: 'Salary',
		justify: 'end',
		sort: 'compensation',
		renderCell: ({ value }) => <span>${value.toLocaleString()}</span>,
	},
	{
		id: 'col-6',
		key: 'started',
		title: 'Start Date',
		justify: 'end',
		sort: 'started',
		renderCell: ({ value }) => <span>{value.toLocaleDateString()}</span>,
	},
];
