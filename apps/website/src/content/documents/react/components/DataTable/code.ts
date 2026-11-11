export const usageCode = `
import { Chip, DataTable, type ColumnDefinition } from '@apple-pie/slice';
import { useToastActions } from '@apple-pie/slice/stores';

type Person = { id: number; name: string; team: string; salary: number; photo?: string };
const people: Person[] = [
    {id: 1, name: 'John Wick', team: 'Security', salary: 500000, photo: '/images/jw-profile.png'},
    {id: 2, name: 'Sam Rivera', team: 'Engineering', salary: 112000, photo: '/images/profile-pic-male-3.png'},
    {id: 3, name: 'Jamie Lee', team: 'Product', salary: 104000, photo: '/images/profile-pic-female-1.png'},
    {id: 4, name: 'Taylor Brooks', team: 'Design', salary: 98000, photo: '/images/profile-pic-female-2.png'},
    {id: 5, name: 'Casey Chen', team: 'Engineering', salary: 118000, photo: '/images/profile-pic-female-3.png'},
    {id: 6, name: 'Jordan Patel', team: 'Product', salary: 106000, photo: '/images/profile-male-2.jpg'},
];
const columns: ColumnDefinition<Person>[] = [
    {id: 'name', key: 'name', title: 'Name', sort: 'name'},
    {id: 'team', key: 'team', title: 'Team', sort: 'team'},
    {id: 'salary', key: 'salary', title: 'Salary', sort: 'salary'},
];

export default function TeamTable() {
    const { push } = useToastActions();
    return <>
        <DataTable columnDefinitions={columns} tableData={people}
            getRowId={person => person.id} caption="Team members"
            defaultSort={{ key: 'name', dir: 'asc' }} onRowClick={person => push({ message: \`Selected: \${person.name}\`, duration: 1500, type: 'success' })}
            borderStyle="row"
            headerBackgroundColor="core-surface-primary"
            candyStripeBackgroundColor="transparent" />
        <Chip>Click a row to select a person.</Chip>
    </>;
}
`;

export const customCode = `
import { Avatar, Chip, DataTable, FlexBox, Preset, Icon, type HeaderContext, type SliceIcon, type ColumnDefinition } from '@apple-pie/slice';

// the type of data for the table
type Person = { id: number; name: string; team: string; salary: number; photo?: string };

// the table data array
const people: Person[] = [
    {id: 1, name: 'John Wick', team: 'Security', salary: 500000, photo: '/images/jw-profile.png'},
    {id: 2, name: 'Sam Rivera', team: 'Engineering', salary: 112000, photo: '/images/profile-pic-male-3.png'},
    {id: 3, name: 'Jamie Lee', team: 'Product', salary: 104000, photo: '/images/profile-pic-female-1.png'},
    {id: 4, name: 'Taylor Brooks', team: 'Design', salary: 98000, photo: '/images/profile-pic-female-2.png'},
    {id: 5, name: 'Casey Chen', team: 'Engineering', salary: 118000, photo: '/images/profile-pic-female-3.png'},
    {id: 6, name: 'Jordan Patel', team: 'Product', salary: 106000, photo: '/images/profile-male-2.jpg'},
];

// you column definitions with custom cell rendering
const customColumns: ColumnDefinition<Person>[] = [
    {
        id: 'name',
        key: 'name',
        title: 'Name',
        sort: 'name',
        width: 220,
        renderHeader: CustomHeader,
        renderCell: ({row}) => {
            return (
                <FlexBox preset={Preset.Row} gap={8}>
                    <Avatar name={row.name} image={row.photo}/>
                    {row.name}
                </FlexBox>
            );
        },
    },
    {
        id: 'team',
        key: 'team',
        title: 'Team',
        width: 180,
        justify: 'start',
        renderHeader: CustomHeader,
        renderCell: ({value}) => <Chip label={value}/>,
    },
    {
        key: 'salary',
        id: 'salary',
        title: 'Salary',
        sort: 'salary',
        width: 160,
        justify: 'end',
        justifyHeader: 'end',
        renderHeader: CustomHeader,
        renderCell: ({value}) => (
            <span style={{ color: 'var(--core-text-primary)' }}>\${value.toLocaleString('en-US')}</span>
        ),
    },
];

// one customer header renderer for all headers
function CustomHeader<V>(context: HeaderContext<Person, V>) {
    const {column, sortKey} = context;
    if (!column) return null;
    const sorted = column.sort !== undefined && sortKey?.key === column.sort;
    const sortIcon: SliceIcon = sortKey?.dir === 'asc' ? 'arrows.chevron-down' : 'arrows.chevron-up';
    return (
        <FlexBox preset={Preset.Row} justify={column.justifyHeader ?? column.justify ?? 'start'} gap={4}>
            <strong>{column.title}</strong>
            {sorted && <Icon name={sortIcon} size={16} decorative/>}
        </FlexBox>
    );
}

// the table itself
export default function TeamTableWithCustomCells() {
    return (
        <DataTable
            columnDefinitions={customColumns}
            tableData={people}
            getRowId={person => person.id}
            caption="Team members"
            defaultSort={{ key: 'name', dir: 'asc' }}
            borderStyle="row"
            headerBackgroundColor="core-surface-primary"
            candyStripeBackgroundColor="transparent"
        />
    );
}
`;

export const largeCode = `
import { Avatar, Chip, DataTable, FlexBox, Preset, Icon, type HeaderContext, type SliceIcon, type ColumnDefinition } from '@apple-pie/slice';

// the type of data for the table
type Person = { id: number; name: string; team: string; salary: number; photo?: string };

// the table data array
const people: Person[] = [
    {id: 1, name: 'John Wick', team: 'Security', salary: 500000, photo: '/images/jw-profile.png'},
    {id: 2, name: 'Sam Rivera', team: 'Engineering', salary: 112000, photo: '/images/profile-pic-male-3.png'},
    {id: 3, name: 'Jamie Lee', team: 'Product', salary: 104000, photo: '/images/profile-pic-female-1.png'},
    {id: 4, name: 'Taylor Brooks', team: 'Design', salary: 98000, photo: '/images/profile-pic-female-2.png'},
    {id: 5, name: 'Casey Chen', team: 'Engineering', salary: 118000, photo: '/images/profile-pic-female-3.png'},
    {id: 6, name: 'Jordan Patel', team: 'Product', salary: 106000, photo: '/images/profile-male-2.jpg'},
];

// you column definitions with custom cell rendering
const customColumns: ColumnDefinition<Person>[] = [
    {
        id: 'name',
        key: 'name',
        title: 'Name',
        sort: 'name',
        width: 220,
        renderHeader: CustomHeader,
        renderCell: ({row}) => {
            return (
                <FlexBox preset={Preset.Row} gap={8}>
                    <Avatar name={row.name} image={row.photo}/>
                    {row.name}
                </FlexBox>
            );
        },
    },
    {
        id: 'team',
        key: 'team',
        title: 'Team',
        width: 180,
        justify: 'start',
        renderHeader: CustomHeader,
        renderCell: ({value}) => <Chip label={value}/>,
    },
    {
        key: 'salary',
        id: 'salary',
        title: 'Salary',
        sort: 'salary',
        width: 160,
        justify: 'end',
        justifyHeader: 'end',
        renderHeader: CustomHeader,
        renderCell: ({value}) => (
            <span style={{ color: 'var(--core-text-primary)' }}>\${value.toLocaleString('en-US')}</span>
        ),
    },
];

// one customer header renderer for all headers
function CustomHeader<V>(context: HeaderContext<Person, V>) {
    const {column, sortKey} = context;
    if (!column) return null;
    const sorted = column.sort !== undefined && sortKey?.key === column.sort;
    const sortIcon: SliceIcon = sortKey?.dir === 'asc' ? 'arrows.chevron-down' : 'arrows.chevron-up';
    return (
        <FlexBox preset={Preset.Row} justify={column.justifyHeader ?? column.justify ?? 'start'} gap={4}>
            <strong>{column.title}</strong>
            {sorted && <Icon name={sortIcon} size={16} decorative/>}
        </FlexBox>
    );
}

// just clone people to create more rows
const manyPeople = Array.from({length: 1000}, (_, index) => ({
    ...people[index % people.length],
    id: index + 1,
    name: \`\${people[index % people.length].name} \${index + 1}\`,
}));

// the table itself
export default function TeamTableWithCustomCells() {
    return (
        <DataTable
            columnDefinitions={customColumns}
            tableData={manyPeople}
            getRowId={person => person.id}
            caption="Team members"
            defaultSort={{ key: 'name', dir: 'asc' }}
            borderStyle="row"
            height={426}
            rowHeight={66}
            headerBackgroundColor="core-surface-primary"
            candyStripeBackgroundColor="transparent"
        />
    );
}
`;
