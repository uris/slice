import type { Meta, StoryObj } from '@storybook/react-vite';
import { FlexDiv } from 'src/components/FlexDiv';
import { fn } from 'storybook/test';
import { DataTable } from './DataTable';
import { sampleTableColumnDefinitions, sampleTableData } from './_data';
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
		backgroundColor: 'var(--core-surface-primary)',
		headerBackgroundColor: 'var(--core-surface-secondary)',
		candyStripeBackgroundColor: 'var(--core-surface-primary-tint)',
		freezeColumn: true,
		headerSticky: true,
		borderColor: 'var(--core-outline-primary)',
		columnDefinitions: sampleTableColumnDefinitions,
		tableData: sampleTableData,
		borderStyle: 'box',
		sort: { key: 'started', dir: 'asc' },
		colResize: true,
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
