'use client';
import { Title } from '@/components/Type/Type';
import {
	Avatar,
	Chip,
	type ColumnDefinition,
	DataTable,
	FlexBox,
	type HeaderContext,
	Icon,
	Preset,
} from '@apple-pie/slice';
import { useToastActions } from '@apple-pie/slice/stores';

type Person = { id: number; name: string; team: string; salary: number; photo?: string };
const people: Person[] = [
	{ id: 1, name: 'John Wick', team: 'Security', salary: 500000, photo: '/images/jw-profile.png' },
	{ id: 2, name: 'Sam Rivera', team: 'Engineering', salary: 112000, photo: '/images/profile-pic-male-3.png' },
	{ id: 3, name: 'Jamie Lee', team: 'Product', salary: 104000, photo: '/images/profile-pic-female-1.png' },
	{ id: 4, name: 'Taylor Brooks', team: 'Design', salary: 98000, photo: '/images/profile-pic-female-2.png' },
	{ id: 5, name: 'Casey Chen', team: 'Engineering', salary: 118000, photo: '/images/profile-pic-female-3.png' },
	{ id: 6, name: 'Jordan Patel', team: 'Product', salary: 106000, photo: '/images/profile-male-2.jpg' },
];
const columns: ColumnDefinition<Person>[] = [
	{ id: 'name', title: 'Name' },
	{ id: 'team', title: 'Team' },
	{ id: 'salary', title: 'Salary' },
];
const customColumns: ColumnDefinition<Person>[] = [
	{
		id: 'name',
		title: 'Name',
		renderHeader: CustomHeader,
		renderCell: ({ row }) => {
			return (
				<FlexBox preset={Preset.Row} gap={8}>
					<Avatar name={row.name} image={row.photo} borderWidth={1} borderColor={'core-text-primary'} />
					{row.name}
				</FlexBox>
			);
		},
	},
	{
		id: 'team',
		title: 'Team',
		renderHeader: CustomHeader,
		renderCell: ({ value }) => <Chip label={value} />,
	},
	{
		id: 'salary',
		title: 'Salary',
		justify: 'end',
		renderHeader: CustomHeader,
		renderCell: ({ value }) => (
			<span style={{ color: 'var(--core-text-primary)' }}>${value.toLocaleString('en-US')}</span>
		),
	},
];

function CustomHeader<V>(context: HeaderContext<Person, V>) {
	const { column, sorted, ascending: asc } = context;
	if (!column) return null;
	return (
		<FlexBox preset={Preset.Row} justify={column.justifyHeader ?? column.justify ?? 'start'} gap={4}>
			<Title>{column.title}</Title>
			{sorted && <Icon name={asc ? 'arrows.chevron-down' : 'arrows.chevron-up'} size={16} />}
		</FlexBox>
	);
}

const manyPeople = Array.from({ length: 1000 }, (_, index) => ({
	...people[index % people.length],
	id: index + 1,
	name: `${people[index % people.length].name} ${index + 1}`,
}));

export function TablePreview() {
	const { push } = useToastActions();

	return (
		<FlexBox width={'fill'} height={'fit'} justify={'center'} align={'center'} gap={16} margin={'24-24-0-24'}>
			<DataTable
				columnDefinitions={columns}
				tableData={people}
				getRowId={(person) => person.id}
				defaultSort={{ key: 'name', dir: 'asc' }}
				caption="Team members"
				onRowClick={(info) => push({ message: `Selected: ${info.name}`, duration: 1500, type: 'success' })}
				borderStyle={'row'}
				headerBackgroundColor={'var(--core-surface-primary)'}
				candyStripeBackgroundColor={'transparent'}
			/>
			<Chip>{'Click a row to select a person.'}</Chip>
		</FlexBox>
	);
}

export function CustomCellsPreview() {
	return (
		<FlexBox width={'fill'} height={'fit'} justify={'center'} align={'center'} gap={16} margin={'24-24-0-24'}>
			<DataTable
				columnDefinitions={customColumns}
				tableData={people}
				getRowId={(person) => person.id}
				defaultSort={{ key: 'name', dir: 'asc' }}
				caption="Team members"
				borderStyle={'row'}
				headerBackgroundColor={'var(--core-surface-primary)'}
				candyStripeBackgroundColor={'transparent'}
			/>
		</FlexBox>
	);
}

export function LargeTablePreview() {
	return (
		<FlexBox width={'fill'} height={'fit'} justify={'center'} align={'center'} gap={16} margin={'24-24-0-24'}>
			<DataTable
				columnDefinitions={customColumns}
				tableData={manyPeople}
				getRowId={(person) => person.id}
				defaultSort={{ key: 'name', dir: 'asc' }}
				borderStyle={'row'}
				height={426}
				rowHeight={66}
				headerBackgroundColor={'var(--core-surface-primary)'}
				candyStripeBackgroundColor={'transparent'}
				freezeColumn
				caption="1,000 team members"
			/>
		</FlexBox>
	);
}
