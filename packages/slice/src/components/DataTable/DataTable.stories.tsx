import type { Meta, StoryObj } from '@storybook/react-vite';
import type React from 'react';
import { useState } from 'react';
import { FlexBox } from 'src/components/FlexBox';
import {
	runDataTableColumnResizeAndReorderPlay,
	runDataTablePlainAndCustomHeaderColumnPlay,
	runDataTableScrollShadowsPlay,
	runDataTableSortAndCellInteractionPlay,
	runDataTableVirtualizedScrollPlay,
} from 'src/components/playHelpers';
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test';
import { corners } from '../../theme/corners/corners';
import { DataTable } from './DataTable';
import { manyRows, sampleTableColumnDefinitions, sampleTableData } from './_data';
import type { SampleTableData } from './_data';
import type { ColumnDefinition } from './_types';
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
		handleHoverColor: 'var(--core-button-primary)',
		borderStyle: 'box',
		borderColor: 'var(--core-outline-primary)',
		borderRadius: corners['corner-m'],
		columnDefinitions: sampleTableColumnDefinitions,
		tableData: sampleTableData,
		defaultSort: { key: 'started', dir: 'asc' },
		onMouseOver: fn(),
		onMouseOut: fn(),
		onClick: fn(),
		onDoubleClick: fn(),
		onSortChange: fn(),
		onColumnResize: fn(),
		onColumnReorder: fn(),
	},
};

export default meta;

export const Default: StoryObj<typeof TypedDataTable> = {
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<TypedDataTable {...args} />
			</FlexBox>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runDataTableSortAndCellInteractionPlay({ canvasElement, args });
	},
};

// drag-resize a column boundary and drag-and-drop reorder two headers - the
// two interactions Default never touches (sorting/clicking cells doesn't
// exercise useResizeColumn's or useReorderColumns' drag handlers at all).
export const ColumnResizeAndReorder: StoryObj<typeof TypedDataTable> = {
	tags: ['tests'],
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<TypedDataTable {...args} />
			</FlexBox>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runDataTableColumnResizeAndReorderPlay({ canvasElement, args });
	},
};

// a purely presentational column (no key/accessor/sort) and a column with a
// custom renderHeader - neither exists in the shared sample columns, so
// resolveColumnValue's "neither" branch, DefaultCellRenderer's undefined-value
// fallback, the non-sortable header branch, and the renderHeader escape hatch
// are all otherwise unreachable.
const plainAndCustomHeaderColumns: ColumnDefinition<SampleTableData>[] = [
	{
		id: 'plain',
		title: 'Actions',
	},
	{
		id: 'custom-header',
		key: 'name',
		title: 'Name',
		renderHeader: () => <span>Custom Header</span>,
	},
];

export const PlainAndCustomHeaderColumn: StoryObj<typeof TypedDataTable> = {
	tags: ['tests'],
	args: {
		columnDefinitions: plainAndCustomHeaderColumns,
		defaultSort: undefined,
	},
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<TypedDataTable {...args} />
			</FlexBox>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runDataTablePlainAndCustomHeaderColumnPlay({ canvasElement, args });
	},
};

// a small fixed height/width against 30 rows forces real horizontal and
// vertical overflow, which is what actually drives hScroll/vScroll (and the
// corner/column/header drop-shadow branches derived from them) - Default's
// width:100%/height:auto never overflows, so those branches never fire there.
export const ScrollShadows: StoryObj<typeof TypedDataTable> = {
	tags: ['tests'],
	args: {
		width: 320,
		height: 200,
		tableData: manyRows(30),
	},
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<TypedDataTable {...args} />
			</FlexBox>
		);
	},
	play: async ({ canvasElement, args }) => {
		await runDataTableScrollShadowsPlay({ canvasElement, args });
	},
};

const filter = (row: SampleTableData) => {
	return row.country !== '';
};
export const FilteredNoCountry: StoryObj<typeof TypedDataTable> = {
	render: (args) => {
		return (
			<FlexBox absolute justify={'center'} align={'center'} padding={64} gap={8}>
				<code
					style={{ padding: '4px 8px', borderRadius: corners['corner-xs'], fontSize: 14 }}
				>{`const filter = (row: SampleTableData) => row.country !== ''`}</code>
				<TypedDataTable {...args} filter={filter} />
			</FlexBox>
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
			<FlexBox absolute justify={'center'} align={'center'} padding={64}>
				<TypedDataTable
					{...args}
					columnDefinitions={applyDataTableViewState(sampleTableColumnDefinitions, savedViewState)}
				/>
			</FlexBox>
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
		<FlexBox absolute justify={'center'} align={'center'} padding={64} gap={8}>
			<code style={{ padding: '4px 8px', borderRadius: corners['corner-xs'], fontSize: 14 }}>{caption}</code>
			<TypedDataTable {...args} tableData={tableData} />
		</FlexBox>
	);
}

// `virtualizeRows` is deliberately absent from args here - it's left unset,
// so DataTable decides for itself. 1000 rows is past the default
// virtualizeRowThreshold (500), so it auto-enables with no prop needed;
export const AutoVirtualized1KRows: StoryObj<typeof TypedDataTable> = {
	args: {
		height: 600,
		defaultSort: undefined,
	},
	render: (args) => (
		<VirtualizedDemo args={args} rowCount={1000} caption={'1K rows, virtualizeRows auto-enabled - No Slugishness'} />
	),
};

// tests-tagged sibling of the story above: scrolls partway down the
// virtualized list so a top spacer row, a bottom spacer row, and the
// aria-rowindex/aria-rowcount attributes all exist simultaneously - none of
// which the un-scrolled AutoVirtualized1KRows story above ever reaches.
export const VirtualizedScroll: StoryObj<typeof TypedDataTable> = {
	tags: ['tests'],
	args: {
		height: 600,
		defaultSort: undefined,
	},
	render: (args) => (
		<VirtualizedDemo args={args} rowCount={1000} caption={'Scrolled partway through 1K virtualized rows'} />
	),
	play: async ({ canvasElement, args }) => {
		await runDataTableVirtualizedScrollPlay({ canvasElement, args });
	},
};

// Same row count than the story above: this one mounts
// every row as a real <tr> at once (that's the point of the comparison), and
// a full unvirtualized 500 rows feels much more slugich that the auto virutalizaed
export const Unvirtualized1kRows: StoryObj<typeof TypedDataTable> = {
	args: {
		height: 600,
		virtualizeRows: false,
		defaultSort: undefined,
	},
	render: (args) => (
		<VirtualizedDemo
			args={args}
			rowCount={1000}
			caption={'1K rows, virtualizeRows set as off - every row mounts at once. Sluggishness should be noticeable'}
		/>
	),
};

type ReviewRow = { id: number; name: string; age: number };
const reviewRows: ReviewRow[] = [
	{ id: 1, name: 'Beta', age: 20 },
	{ id: 2, name: 'Alpha', age: 10 },
];
const reviewColumns: ColumnDefinition<ReviewRow>[] = [
	{ id: 'name', key: 'name', title: 'Name', sort: 'name', width: 180 },
	{ id: 'age', key: 'age', title: 'Age', sort: 'age', width: 120 },
	{ id: 'action', title: 'Action', renderCell: () => <button type="button">Inspect</button> },
];
export const RowActivation: StoryObj<typeof DataTable<ReviewRow>> = {
	tags: ['tests'],
	render: () => (
		<DataTable columnDefinitions={reviewColumns} tableData={reviewRows} onRowClick={rowActivated} caption="People" />
	),
	play: async ({ canvasElement }) => {
		rowActivated.mockClear();
		const canvas = within(canvasElement);
		expect(canvas.getByRole('table', { name: 'People' })).toBeInTheDocument();
		await userEvent.click(canvas.getByText('Beta'));
		expect(rowActivated).toHaveBeenLastCalledWith(reviewRows[0], 0);
		rowActivated.mockClear();
		await userEvent.click(canvas.getAllByRole('button', { name: 'Inspect' })[0]);
		expect(rowActivated).not.toHaveBeenCalled();
		const row = canvas.getByText('Alpha').closest('tr');
		row?.focus();
		await userEvent.keyboard('{Enter}');
		expect(rowActivated).toHaveBeenLastCalledWith(reviewRows[1], 1);
		await userEvent.click(canvas.getByRole('columnheader', { name: 'Name' }));
		await userEvent.click(canvas.getByText('Alpha'));
		expect(rowActivated).toHaveBeenLastCalledWith(reviewRows[1], 0);
	},
};
const rowActivated = fn();
function ControlledTableDemo() {
	const [sort, setSort] = useState<import('./_types').SortKey<ReviewRow>>({ key: 'name', dir: 'asc' });
	const [order, setOrder] = useState(['name', 'age', 'action']);
	const [widths, setWidths] = useState<Record<string, number | string>>({ name: 180 });
	return (
		<>
			<button
				type="button"
				onClick={() => {
					setSort(undefined);
					setOrder(['name', 'age', 'action']);
					setWidths({ name: 180 });
				}}
			>
				Reset view
			</button>
			<DataTable
				columnDefinitions={reviewColumns}
				tableData={reviewRows}
				sort={sort}
				onSortChange={setSort}
				columnOrder={order}
				onColumnReorder={setOrder}
				columnWidths={widths}
				onColumnResize={(id, width) => setWidths((previous) => ({ ...previous, [id]: width }))}
			/>
		</>
	);
}
export const ControlledViewAndKeyboard: StoryObj = {
	tags: ['tests'],
	render: () => <ControlledTableDemo />,
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const header = canvas.getByRole('columnheader', { name: 'Name' });
		expect(header).toHaveAttribute('aria-sort', 'ascending');
		await userEvent.click(header);
		expect(header).toHaveAttribute('aria-sort', 'descending');
		const resize = canvas.getByRole('separator', { name: 'Resize Name' });
		resize.focus();
		await userEvent.keyboard('{ArrowRight}');
		expect(resize).toHaveAttribute('aria-valuenow', '190');
		header.focus();
		await userEvent.keyboard('{Alt>}{ArrowRight}{/Alt}');
		expect(canvas.getAllByRole('columnheader')[1]).toHaveTextContent('Name');
		await userEvent.click(canvas.getByRole('button', { name: 'Reset view' }));
		expect(canvas.getAllByRole('columnheader')[0]).toHaveTextContent('Name');
		expect(canvas.getByRole('columnheader', { name: 'Name' })).not.toHaveAttribute('aria-sort');
		expect(canvas.getByRole('separator', { name: 'Resize Name' })).toHaveAttribute('aria-valuenow', '180');
	},
};
export const VirtualizedFixedHeight: StoryObj = {
	tags: ['tests'],
	render: () => (
		<DataTable
			columnDefinitions={[
				{
					id: 'name',
					key: 'name',
					title: 'Name',
					padding: 64,
					renderCell: ({ value }) => <div style={{ height: 100 }}>{value}</div>,
				},
			]}
			tableData={Array.from({ length: 300 }, (_, id) => ({ id, name: `Person ${id}` }))}
			getRowId={(row) => row.id}
			height={240}
			rowHeight={44}
			caption="Virtual people"
			freezeColumn
			virtualizeRows
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const table = canvas.getByRole('table', { name: 'Virtual people' });
		const wrapper = table.parentElement as HTMLElement;
		await waitFor(() => expect(table.querySelectorAll('tbody tr:not([data-spacer])').length).toBeLessThan(40));
		for (const row of Array.from(table.querySelectorAll('tbody tr:not([data-spacer])')))
			expect(row.getBoundingClientRect().height).toBeCloseTo(44, 0);
		wrapper.scrollTop = wrapper.scrollHeight;
		fireEvent.scroll(wrapper);
		await waitFor(() => expect(canvas.getByText('Person 299')).toBeInTheDocument());
		expect(table).toHaveAttribute('aria-rowcount', '301');
		const spacer = table.querySelector('tr[data-spacer] td') as HTMLElement;
		expect(getComputedStyle(spacer).position).toBe('static');
		expect(getComputedStyle(spacer).zIndex).toBe('auto');
		expect(getComputedStyle(spacer).boxShadow).toBe('none');
		const firstCell = table.querySelector('tr[aria-rowindex] td') as HTMLElement;
		expect(getComputedStyle(firstCell).position).toBe('sticky');
	},
};

export const ControlledValuesStayAuthoritative: StoryObj = {
	tags: ['tests'],
	render: () => (
		<DataTable
			columnDefinitions={reviewColumns}
			tableData={reviewRows}
			sort={{ key: 'name', dir: 'asc' }}
			onSortChange={sortRequested}
			colReorder={false}
			freezeColumn
			freezeColumnBackgroundColor="rgb(20, 30, 40)"
		/>
	),
	play: async ({ canvasElement }) => {
		sortRequested.mockClear();
		const canvas = within(canvasElement);
		const header = canvas.getByRole('columnheader', { name: 'Name' });
		await userEvent.click(header);
		expect(sortRequested).toHaveBeenLastCalledWith({ key: 'name', dir: 'desc' });
		expect(header).toHaveAttribute('aria-sort', 'ascending');
		expect(header).toHaveAttribute('draggable', 'false');
		expect(getComputedStyle(canvas.getByText('Alpha').closest('td') as HTMLElement).backgroundColor).toBe(
			'rgb(20, 30, 40)',
		);
	},
};
const sortRequested = fn();

export const HeaderAppearance: StoryObj = {
	tags: ['tests'],
	render: () => (
		<DataTable
			tableData={reviewRows}
			colReorder={false}
			colResize={false}
			headerBackgroundColorHover="rgb(12, 34, 56)"
			columnDefinitions={[
				{ id: 'name', key: 'name', title: 'Name', sort: 'name', justify: 'end', showSortIcon: false },
				{ id: 'age', key: 'age', title: 'Age', sort: 'age', justify: 'end', justifyHeader: 'start' },
				{ id: 'custom', title: 'Custom', showSortIcon: true, renderHeader: () => <span>Custom header</span> },
			]}
		/>
	),
	play: async ({ canvasElement }) => {
		const canvas = within(canvasElement);
		const name = canvas.getByRole('columnheader', { name: 'Name' });
		const age = canvas.getByRole('columnheader', { name: 'Age' });
		expect(name.querySelector('svg')).toBeNull();
		expect(age.querySelector('svg')).not.toBeNull();
		expect(canvas.getByRole('columnheader', { name: 'Custom' }).querySelector('svg')).toBeNull();
		expect(getComputedStyle(name.firstElementChild as HTMLElement).justifyContent).toBe('flex-end');
		expect(getComputedStyle(age.firstElementChild as HTMLElement).justifyContent).toBe('flex-start');
		const { MODE } = (import.meta as ImportMeta & { env: { MODE: string } }).env;
		if (MODE === 'test') {
			const { userEvent: pointer } = await import('vitest/browser');
			await pointer.hover(age);
			await waitFor(() => expect(getComputedStyle(age).backgroundColor).toBe('rgb(12, 34, 56)'));
		}
		await userEvent.click(name);
		expect(name).toHaveAttribute('aria-sort', 'ascending');
	},
};
