import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useState } from 'react';
import { FlexDiv } from 'src/components/FlexDiv';
import { fn } from 'storybook/test';
import { DataTable } from './DataTable';
import { manyRows, sampleTableColumnDefinitions, sampleTableData } from './_data';
import type { SampleTableData } from './_data';
import { type DataTableViewState, applyDataTableViewState } from './viewState';

// storybook needs the typed table to render properly
const TypedDataTable = DataTable<SampleTableData>;

const meta: Meta<typeof TypedDataTable> = {
	title: 'Components/DataTable',
	component: TypedDataTable,
	argTypes: {
		borderStyle: {
			control: { type: 'select' },
			options: ['box', 'row', 'none'],
		},
	},
	args: {
		width: '100%',
		height: 'auto',
		freezeColumn: true,
		headerSticky: true,
		colResize: true,
		backgroundColor: 'var(--core-surface-primary)',
		backgroundColorHoverRow: 'var(--core-surface-primary-tint)',
		headerBackgroundColor: 'var(--core-surface-secondary)',
		candyStripeBackgroundColor: 'var(--core-surface-primary-tint)',
		handleHoverColor: 'var(--core-outline-special)',
		borderStyle: 'box',
		borderColor: 'var(--core-outline-primary)',
		borderRadius: 8,
		columnDefinitions: sampleTableColumnDefinitions,
		tableData: sampleTableData,
		sort: { key: 'started', dir: 'asc' },
		onMouseOver: fn(),
		onMouseOut: fn(),
		onClick: fn(),
		onDoubleClick: fn(),
		onSortChange: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof TypedDataTable> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<TypedDataTable {...args} />
			</FlexDiv>
		);
	},
};

const filter = (row: SampleTableData) => {
	return row.country !== '';
};
export const FilteredNoCountry: StoryObj<typeof TypedDataTable> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={8}>
				<code
					style={{ padding: '4px 8px', borderRadius: 4, fontSize: 14 }}
				>{`const filter = (row: SampleTableData) => row.country !== ''`}</code>
				<TypedDataTable {...args} filter={filter} />
			</FlexDiv>
		);
	},
};

// Demonstrates the persistable half of column config: `viewState` is plain
// JSON (as if it had just been read back from localStorage/a backend) and
// gets reconciled against the code-defined columns at render time - reordered,
// with Age hidden and Salary widened - without touching any accessor/renderer.
const savedViewState: DataTableViewState = {
	columnOrder: ['col-4', 'col-1', 'col-5'],
	hiddenColumns: ['col-2', 'col-3'],
	columnWidths: { 'col-5': '30%' },
};

export const WithPersistedViewState: StoryObj<typeof TypedDataTable> = {
	render: (args) => {
		return (
			<FlexDiv absolute justify={'center'} align={'center'} padding={64}>
				<TypedDataTable
					{...args}
					columnDefinitions={applyDataTableViewState(sampleTableColumnDefinitions, savedViewState)}
				/>
			</FlexDiv>
		);
	},
};

// note: open devtools > Elements panel while scrolling Virtualized10kRows to
// see the mounted <tr> count stay flat regardless of total row count.
type BigDatasetArgs = Omit<React.ComponentProps<typeof TypedDataTable>, 'tableData'>;

function VirtualizedDemo(props: Readonly<{ args: BigDatasetArgs; rowCount: number; caption: string }>) {
	const { args, rowCount, caption } = props;
	const [tableData] = useState(() => manyRows(rowCount));
	return (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={8}>
			<code style={{ padding: '4px 8px', borderRadius: 4, fontSize: 14 }}>{caption}</code>
			<TypedDataTable {...args} tableData={tableData} />
		</FlexDiv>
	);
}

// `virtualizeRows` is deliberately absent from args here - it's left unset,
// so DataTable decides for itself. 500 rows is past the default
// virtualizeRowThreshold (200), so it auto-enables with no prop needed;
export const AutoVirtualized1KRows: StoryObj<typeof TypedDataTable> = {
	args: {
		height: 600,
		sort: undefined,
	},
	render: (args) => (
		<VirtualizedDemo args={args} rowCount={1000} caption={'1K rows, virtualizeRows auto-enabled - No Slugishness'} />
	),
};

// Same row count than the story above: this one mounts
// every row as a real <tr> at once (that's the point of the comparison), and
// a full unvirtualized 500 rows feels much more slugich that the auto virutalizaed
export const Unvirtualized1kRows: StoryObj<typeof TypedDataTable> = {
	args: {
		height: 600,
		virtualizeRows: false,
		sort: undefined,
	},
	render: (args) => (
		<VirtualizedDemo
			args={args}
			rowCount={1000}
			caption={'1K rows, virtualizeRows set as off - every row mounts at once. Sluggishness should be noticeable'}
		/>
	),
};
