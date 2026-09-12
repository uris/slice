import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useState } from 'react';
import { FlexDiv } from 'src/components/FlexDiv';
import { fn } from 'storybook/test';
import { DataTableWindowed } from './DataTableWindowed';
import { manyRows, sampleTableColumnDefinitions, sampleTableData } from './_data';
import type { SampleTableData } from './_data';
import { type DataTableViewState, applyDataTableViewState } from './viewState';

// storybook needs the typed table to render properly
const TypedDataTable = DataTableWindowed<SampleTableData>;

const meta: Meta<typeof TypedDataTable> = {
	title: 'Components/DataTableWindowed',
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

// `tableData` is intentionally kept OUT of `args` in both stories below -
// Storybook syncs args to the manager UI over a websocket to drive the
// Controls panel, and a 10k/2k-row array blown through that channel is
// exactly what trips a "Max payload size exceeded" error from `ws`. Instead
// each row array is generated once as local component state, invisible to
// the args channel, and only the small control values (virtualizeRows,
// rowHeight, overscanRows, height) travel through `args`.
//
// note: open devtools > Elements panel while scrolling Virtualized10kRows to
// see the mounted <tr> count stay flat regardless of total row count.
type BigDatasetArgs = Omit<React.ComponentProps<typeof TypedDataTable>, 'tableData'>;

function VirtualizedDemo(props: { args: BigDatasetArgs; rowCount: number; caption: string }) {
	const { args, rowCount, caption } = props;
	const [tableData] = useState(() => manyRows(rowCount));
	return (
		<FlexDiv absolute justify={'center'} align={'center'} padding={64} gap={8}>
			<code style={{ padding: '4px 8px', borderRadius: 4, fontSize: 14 }}>{caption}</code>
			<TypedDataTable {...args} tableData={tableData} />
		</FlexDiv>
	);
}

export const Virtualized10kRows: StoryObj<typeof TypedDataTable> = {
	args: {
		height: 600,
		virtualizeRows: true,
		rowHeight: 44,
		overscanRows: 6,
		sort: undefined,
	},
	argTypes: {
		virtualizeRows: { control: { type: 'boolean' } },
		rowHeight: { control: { type: 'number' } },
		overscanRows: { control: { type: 'number' } },
	},
	render: (args) => (
		<VirtualizedDemo
			args={args}
			rowCount={10000}
			caption={'10,000 rows - toggle virtualizeRows in Controls to compare DOM node count'}
		/>
	),
};

// Deliberately a smaller row count than the story above: this one mounts
// every row as a real <tr> at once (that's the point of the comparison), and
// a full unvirtualized 10k-row DOM is heavy enough that Storybook's own
// tooling (the accessibility scan, component test runner) chokes trying to
// walk and report on it - itself a pretty good demonstration of the cost
// this fork exists to avoid. 2,000 rows still makes the mount-time and
// scroll-jank difference obvious next to Virtualized10kRows.
export const Unvirtualized2kRows: StoryObj<typeof TypedDataTable> = {
	args: {
		height: 600,
		virtualizeRows: false,
		sort: undefined,
	},
	render: (args) => (
		<VirtualizedDemo
			args={args}
			rowCount={2000}
			caption={'2,000 rows, virtualizeRows off - every row mounts at once'}
		/>
	),
};
