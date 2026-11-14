import { ComponentCanvas } from '@/components/ComponetCanvas/ComponentCanvas';
import type { TrackedItem } from '@/components/OnThisPage/OnThisPage';
import { Path } from '@/components/Path/Path';
import { TipBox } from '@/components/TipBox/TipBox';
import { Code, DefaultVal, Definition, H1, H2, H3, P, Prop, TypeDef } from '@/components/Type/Type';
import { contentMaxWidth, contentMinWidth } from '@/src/consts/consts';
import { FlexBox, Preset } from '@apple-pie/slice';
import { CustomCellsPreview, LargeTablePreview, TablePreview } from './Preview';
import { customCode, largeCode, usageCode } from './code';

export default function DataTableDoc() {
	return (
		<FlexBox preset={Preset.Column} maxWidth={contentMaxWidth} style={{ minWidth: contentMinWidth }}>
			<Path />
			<H1 id="title">DataTable component</H1>
			<P clipWidth>
				Give DataTable your rows and columns, and it takes care of sorting, resizing, and scrolling. You can also render
				your own cells and respond when someone chooses a row.
			</P>
			<H2 id="usage">Usage</H2>
			<P>
				Start with a few fields. Add <Code>sort</Code> to a column to make its header sortable, and use{' '}
				<Code>onRowClick</Code> to receive the chosen row.
			</P>
			<TipBox inline noBorder>
				Click a header to sort, drag its edge to resize, or drag the header to move a column. Click a row to show its
				name.
			</TipBox>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-datatable--row-activation"
				components={[
					{
						label: 'Default Table',
						component: <TablePreview />,
						code: { code: usageCode.trim() },
						hasRefresh: true,
					},
				]}
			/>
			<H3>Make cells your own</H3>
			<P>
				Use <Code>renderCell</Code> and <Code>renderHeader</Code> to add an Avatar, a Chip, or a formatted amount to
				cells and headers. The renderer receives the column/row context, its value, and for rows, its current index.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-datatable--plain-and-custom-header-column"
				components={[
					{
						label: 'Custom cells rendering',
						component: <CustomCellsPreview />,
						code: { code: customCode.trim() },
						hasRefresh: true,
					},
				]}
			/>
			<P>
				The custom examples share one <Code>CustomHeader</Code> function across columns. <Code>renderHeader</Code>{' '}
				receives <Code>column</Code> and <Code>sortKey</Code>, so the same function can show each title and its active
				sort indicator.
			</P>
			<H3>Auto Virtualization</H3>
			<P>
				Above 500 rows, virtualization turns on automatically to keep performance of your app smooth. The table must
				have a <Code>height</Code>, then give it a <Code>rowHeight</Code> and a stable <Code>getRowId</Code>; only
				nearby rows need to stay mounted. This example uses <Code>{'rowHeight={66}'}</Code> to give the Avatars room.
			</P>
			<ComponentCanvas
				storybookUrl="https://react.slice-uikit.com/?path=/story/components-datatable--auto-virtualized-1k-rows"
				components={[
					{
						label: 'Virtualization: 1,000 rows',
						component: <LargeTablePreview />,
						code: { code: largeCode.trim() },
						hasRefresh: true,
					},
				]}
			/>
			<H2 id="behavior">Behavior</H2>
			<P>
				Filtering runs before sorting. Callback indices describe the displayed rows, and your original data stays
				unchanged. Row activation reports data; it does not maintain a selected-row state.
			</P>
			<P>
				For an initial sort, use <Code>defaultSort</Code>. To manage it yourself, pair <Code>sort</Code> with{' '}
				<Code>onSortChange</Code>. Passing <Code>{'sort={undefined}'}</Code> explicitly clears it.
			</P>
			<P>
				Virtualized rows use a fixed <Code>rowHeight</Code> and clip overflowing content. If your cells need to grow
				with their content, set <Code>{'virtualizeRows={false}'}</Code>. Without a bounded height, all rows render
				normally.
			</P>
			<P>
				You can control widths and order through <Code>columnWidths</Code> and <Code>columnOrder</Code>. Connect their
				callbacks to save changes. Borders, colors, and frozen columns are independent of your cell renderers.
			</P>
			<H2 id="accessibility">Accessibility</H2>
			<P>
				The table has native headers and a visually hidden <Code>caption</Code>. Sortable headers work with Enter or
				Space; Alt+Left and Alt+Right move a focused header. Focus a resize separator and use Left or Right to adjust
				its column by 10px, down to a 40px minimum.
			</P>
			<P>
				When <Code>onRowClick</Code> is set, rows can be activated with Enter or Space. Buttons, links, and inputs
				inside a cell keep their own actions. Label any controls you add through custom renderers.
			</P>
			<H2 id="props">Props</H2>
			<P>
				Only <Code>columnDefinitions</Code> is required. Color props accept Slice color tokens or CSS colors.
			</P>
			<Definition id="backgroundColor">
				<Prop>backgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-primary'}</DefaultVal>
			</Definition>
			<P>Background for body cells.</P>
			<Definition id="backgroundColorHoverRow">
				<Prop>backgroundColorHoverRow</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-primary-tint'}</DefaultVal>
			</Definition>
			<P>Row highlight on hover or keyboard focus.</P>
			<Definition id="borderColor">
				<Prop>borderColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-outline-primary'}</DefaultVal>
			</Definition>
			<P>Color of the table borders.</P>
			<Definition id="borderRadius">
				<Prop>borderRadius</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'8'}</DefaultVal>
			</Definition>
			<P>Outer radius for box borders. Numbers are pixels.</P>
			<Definition id="borderStyle">
				<Prop>borderStyle</Prop>
				<TypeDef>{"'box' | 'row' | 'none'"}</TypeDef>
				<DefaultVal>{'box'}</DefaultVal>
			</Definition>
			<P>Choose a full grid, horizontal borders, or no borders.</P>
			<Definition id="candyStripeBackgroundColor">
				<Prop>candyStripeBackgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-primary-tint'}</DefaultVal>
			</Definition>
			<P>Background for alternating body rows.</P>
			<Definition id="caption">
				<Prop>caption</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'Data Table'}</DefaultVal>
			</Definition>
			<P>Accessible table name, visually hidden.</P>
			<Definition id="cellPadding">
				<Prop>cellPadding</Prop>
				<TypeDef>number | string</TypeDef>
				<DefaultVal>spacing-m (16px)</DefaultVal>
			</Definition>
			<P>
				Default header and body cell padding. Set <Code>{'cellPadding={0}'}</Code> to remove it. A column’s own{' '}
				<Code>padding</Code> takes precedence, including zero.
			</P>
			<Definition id="colReorder">
				<Prop>colReorder</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>Allows dragging columns and reordering with Alt+Arrow.</P>
			<Definition id="colResize">
				<Prop>colResize</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>Allows resizing from header boundaries.</P>
			<Definition id="columnDefinitions">
				<Prop>columnDefinitions</Prop>
				<TypeDef>{'ColumnDefinition<T>[]'}</TypeDef>
				<DefaultVal>{'required'}</DefaultVal>
			</Definition>
			<P>Columns to display. Each needs a unique id and a title.</P>
			<Definition id="columnOrder">
				<Prop>columnOrder</Prop>
				<TypeDef>{'string[]'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Controlled display order by column ID. Missing IDs are appended; an empty array restores definition order.</P>
			<Definition id="columnWidths">
				<Prop>columnWidths</Prop>
				<TypeDef>{'Record<string, number | string>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Controlled width overrides by column ID. An empty object restores definition widths.</P>
			<Definition id="defaultSort">
				<Prop>defaultSort</Prop>
				<TypeDef>{'SortKey<T>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Initial sort when sort is omitted.</P>
			<Definition id="filter">
				<Prop>filter</Prop>
				<TypeDef>{'(row: T, index: number, array: T[]) => boolean'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Keep rows matching this predicate, before sorting.</P>
			<Definition id="freezeColumn">
				<Prop>freezeColumn</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Keeps the first displayed column in view while scrolling horizontally.</P>
			<Definition id="freezeColumnBackgroundColor">
				<Prop>freezeColumnBackgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Optional background for the frozen first column.</P>
			<Definition id="getRowId">
				<Prop>getRowId</Prop>
				<TypeDef>{'(row: T, index: number) => string | number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Stable row identity. Defaults to the displayed index; provide IDs when data can change.</P>
			<Definition id="handleHoverColor">
				<Prop>handleHoverColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-button-primary'}</DefaultVal>
			</Definition>
			<P>Color of the resize guide.</P>
			<Definition id="headerBackgroundColor">
				<Prop>headerBackgroundColor</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-secondary'}</DefaultVal>
			</Definition>
			<P>Header cell background.</P>
			<Definition id="headerBackgroundColorHover">
				<Prop>headerBackgroundColorHover</Prop>
				<TypeDef>{'ColorValue'}</TypeDef>
				<DefaultVal>{'core-surface-primary-tint'}</DefaultVal>
			</Definition>
			<P>Header cell background on hover, including headers with custom content.</P>
			<Definition id="headerSticky">
				<Prop>headerSticky</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>Keeps headers visible while scrolling vertically.</P>
			<Definition id="height">
				<Prop>height</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'auto'}</DefaultVal>
			</Definition>
			<P>Scroll area height. Give large tables a bounded height to enable virtualization.</P>
			<Definition id="margin">
				<Prop>margin</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'0'}</DefaultVal>
			</Definition>
			<P>Outer margin. Numbers are pixels.</P>
			<Definition id="maxWidth">
				<Prop>maxWidth</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'unset'}</DefaultVal>
			</Definition>
			<P>Maximum width of the scroll area.</P>
			<Definition id="overscanRows">
				<Prop>overscanRows</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'6'}</DefaultVal>
			</Definition>
			<P>Extra rows mounted beyond each visible edge while virtualized.</P>
			<Definition id="name">
				<Prop>name</Prop>
				<TypeDef>string</TypeDef>
				<DefaultVal>undefined</DefaultVal>
			</Definition>
			<P>
				Optional identifier exposed to custom header renderers as <Code>ctx.tableName</Code>. It remains undefined when
				omitted. The accessible name still comes from <Code>caption</Code>.
			</P>
			<Definition id="noTopBorder">
				<Prop>noTopBorder</Prop>
				<TypeDef>boolean</TypeDef>
				<DefaultVal>false</DefaultVal>
			</Definition>
			<P>Removes the top edge above the header. Header bottom borders and the remaining grid borders are preserved.</P>
			<Definition id="rowHeight">
				<Prop>rowHeight</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'44'}</DefaultVal>
			</Definition>
			<P>Fixed height in pixels for virtualized rows. Overflowing content is clipped.</P>
			<Definition id="sort">
				<Prop>sort</Prop>
				<TypeDef>{'SortKey<T>'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Controlled sort: <Code>{'{ key, dir }'}</Code>, where dir is asc or desc. Passing undefined explicitly clears
				it.
			</P>
			<Definition id="tableData">
				<Prop>tableData</Prop>
				<TypeDef>{'T[]'}</TypeDef>
				<DefaultVal>{'[]'}</DefaultVal>
			</Definition>
			<P>Your row data. Filtering and sorting do not mutate it.</P>
			<Definition id="virtualizeRows">
				<Prop>virtualizeRows</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'automatic'}</DefaultVal>
			</Definition>
			<P>
				Automatically enabled above the threshold when height is bounded. Set false to opt out, or true to enable for
				smaller tables.
			</P>
			<Definition id="virtualizeRowThreshold">
				<Prop>virtualizeRowThreshold</Prop>
				<TypeDef>{'number'}</TypeDef>
				<DefaultVal>{'500'}</DefaultVal>
			</Definition>
			<P>
				Virtualize when the filtered row count is greater than this number. Ignored when virtualizeRows is explicit.
			</P>
			<Definition id="width">
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'100%'}</DefaultVal>
			</Definition>
			<P>Width of the scroll area.</P>
			<H2 id="columns">Columns</H2>
			<P>
				Each <Code>ColumnDefinition&lt;T&gt;</Code> describes one column. Columns read the row field named by{' '}
				<Code>id</Code> unless <Code>key</Code> overrides it; use <Code>createColumnHelper&lt;T&gt;()</Code> for
				computed values.
			</P>
			<Definition id="column-accessor">
				<Prop>accessor</Prop>
				<TypeDef>{'(row: T) => V'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Compute a value instead of using key. <Code>{'createColumnHelper<T>().accessor'}</Code> keeps the value type
				inferred.
			</P>
			<Definition id="column-align">
				<Prop>align</Prop>
				<TypeDef>{"'start' | 'center' | 'end'"}</TypeDef>
				<DefaultVal>{'center'}</DefaultVal>
			</Definition>
			<P>Vertical cell alignment.</P>
			<Definition id="column-compare">
				<Prop>compare</Prop>
				<TypeDef>{'(a: T, b: T) => number'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Custom ascending row comparator for a sortable column. The table applies the direction.</P>
			<Definition id="column-id">
				<Prop>id</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'required'}</DefaultVal>
			</Definition>
			<P>Unique, stable column identity for ordering and widths.</P>
			<Definition id="column-justify">
				<Prop>justify</Prop>
				<TypeDef>{"'start' | 'center' | 'end'"}</TypeDef>
				<DefaultVal>{'start'}</DefaultVal>
			</Definition>
			<P>Horizontal alignment for cells and, by default, headers.</P>
			<Definition id="column-justifyHeader">
				<Prop>justifyHeader</Prop>
				<TypeDef>{"'start' | 'center' | 'end'"}</TypeDef>
				<DefaultVal>{'justify'}</DefaultVal>
			</Definition>
			<P>
				Overrides header alignment without changing body cells. Custom headers receive this alignment on their
				container.
			</P>
			<Definition id="column-key">
				<Prop>key</Prop>
				<TypeDef>{'keyof T'}</TypeDef>
				<DefaultVal>{'id'}</DefaultVal>
			</Definition>
			<P>
				Read a field directly from each row. Defaults to <Code>id</Code>. Use <Code>key</Code> or <Code>accessor</Code>,
				not both; set <Code>sort={false}</Code> for an actions column.
			</P>
			<Definition id="column-nowrap">
				<Prop>nowrap</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'false'}</DefaultVal>
			</Definition>
			<P>Keeps cell content on one line.</P>
			<Definition id="column-padding">
				<Prop>padding</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'var(--spacing-m)'}</DefaultVal>
			</Definition>
			<P>Cell padding. Numbers are pixels.</P>
			<Definition id="column-renderCell">
				<Prop>renderCell</Prop>
				<TypeDef>{'({ row, value, rowIndex }) => ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Render custom cell content. Otherwise values are converted to text.</P>
			<Definition id="column-renderHeader">
				<Prop>renderHeader</Prop>
				<TypeDef>{'({ column, sortKey, sorted, ascending }) => ReactNode'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Render a custom header. <Code>column.sort</Code> is the resolved row field, or <Code>undefined</Code> when
				sorting is disabled. <Code>sorted</Code> indicates whether this column is sorted. <Code>ascending</Code> is{' '}
				<Code>true</Code> for ascending, <Code>false</Code> for descending, and <Code>undefined</Code> when this column
				is not sorted. The table keeps sorting and reordering behavior.
			</P>
			<Definition id="column-showSortIcon">
				<Prop>showSortIcon</Prop>
				<TypeDef>{'boolean'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				Shows the sort icon beside sortable header text. False removes the icon and its reserved space without disabling
				sorting. Has no effect when renderHeader is supplied.
			</P>
			<Definition id="column-sort">
				<Prop>sort</Prop>
				<TypeDef>{'boolean | keyof T'}</TypeDef>
				<DefaultVal>{'true'}</DefaultVal>
			</Definition>
			<P>
				Defaults to <Code>true</Code>, sorting by <Code>key</Code> or <Code>id</Code>. Pass a row field to override it,
				or <Code>false</Code> to disable sorting.
			</P>
			<Definition id="column-title">
				<Prop>title</Prop>
				<TypeDef>{'string'}</TypeDef>
				<DefaultVal>{'required'}</DefaultVal>
			</Definition>
			<P>Column title and accessible header name.</P>
			<Definition id="column-width">
				<Prop>width</Prop>
				<TypeDef>{'number | string'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Initial column width, before user resizing or controlled overrides.</P>
			<H2 id="events">Events</H2>
			<P>
				Cell callbacks receive the column definition, displayed column index, row data, and displayed row index. These
				are table callbacks; native div event props are not forwarded.
			</P>
			<Definition id="onClick">
				<Prop>onClick</Prop>
				<TypeDef>{'(column, columnIndex, row, rowIndex) => void'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Runs when a body cell is clicked. Nested interactive controls are excluded.</P>
			<Definition id="onColumnReorder">
				<Prop>onColumnReorder</Prop>
				<TypeDef>{'(columnOrder: string[]) => void'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Receives each live order change, including restoration after a cancelled drag.</P>
			<Definition id="onColumnResize">
				<Prop>onColumnResize</Prop>
				<TypeDef>{'(columnId: string, width: number) => void'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Receives the new pixel width after a drag or keyboard adjustment.</P>
			<Definition id="onDoubleClick">
				<Prop>onDoubleClick</Prop>
				<TypeDef>{'(column, columnIndex, row, rowIndex) => void'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Runs on a body cell double-click. Browser click events also run normally.</P>
			<Definition id="onMouseOut">
				<Prop>onMouseOut</Prop>
				<TypeDef>{'(column, columnIndex, row, rowIndex) => void'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Runs when the pointer or focus leaves a body cell.</P>
			<Definition id="onMouseOver">
				<Prop>onMouseOver</Prop>
				<TypeDef>{'(column, columnIndex, row, rowIndex) => void'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Runs when the pointer or focus enters a body cell.</P>
			<Definition id="onRowClick">
				<Prop>onRowClick</Prop>
				<TypeDef>{'(row: T, rowIndex: number) => void'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>
				Receives the activated row and its filtered/sorted index. Enter and Space work too; nested controls keep their
				own actions.
			</P>
			<Definition id="onSortChange">
				<Prop>onSortChange</Prop>
				<TypeDef>{'(sort: SortKey<T>) => void'}</TypeDef>
				<DefaultVal>{'undefined'}</DefaultVal>
			</Definition>
			<P>Receives the requested sort. Feed it back through sort when controlled.</P>
			<H2 id="saved-views">Saved views</H2>
			<P>
				<Code>DataTableViewState</Code> stores plain data: <Code>columnOrder</Code>, optional <Code>hiddenColumns</Code>
				, <Code>columnWidths</Code>, and <Code>sort</Code> as a column ID and direction.
			</P>
			<P>
				<Code>createDefaultViewState(columns)</Code> creates a starting layout.{' '}
				<Code>applyDataTableViewState(columns, state)</Code> applies visibility, order, and widths while keeping your
				render functions. <Code>resolveSortFromViewState(columns, state)</Code> reads the saved sort;{' '}
				<Code>captureSortToViewState(columns, sort)</Code> converts a live sort back for storage.
			</P>
			<P>
				Pass saved order and widths through the matching controlled props so restoring a view also replaces any changes
				made while the table was mounted. Store the state wherever it suits your app.
			</P>
		</FlexBox>
	);
}
export const trackedItems: TrackedItem[] = [
	{ id: 'title', title: 'DataTable component' },
	{ id: 'usage', title: 'Usage' },
	{ id: 'behavior', title: 'Behavior' },
	{ id: 'accessibility', title: 'Accessibility' },
	{
		id: 'props',
		title: 'Props',
		items: [
			{ id: 'backgroundColor', title: 'backgroundColor', code: true },
			{ id: 'backgroundColorHoverRow', title: 'backgroundColorHoverRow', code: true },
			{ id: 'borderColor', title: 'borderColor', code: true },
			{ id: 'borderRadius', title: 'borderRadius', code: true },
			{ id: 'borderStyle', title: 'borderStyle', code: true },
			{ id: 'candyStripeBackgroundColor', title: 'candyStripeBackgroundColor', code: true },
			{ id: 'caption', title: 'caption', code: true },
			{ id: 'cellPadding', title: 'cellPadding', code: true },
			{ id: 'colReorder', title: 'colReorder', code: true },
			{ id: 'colResize', title: 'colResize', code: true },
			{ id: 'columnDefinitions', title: 'columnDefinitions', code: true },
			{ id: 'columnOrder', title: 'columnOrder', code: true },
			{ id: 'columnWidths', title: 'columnWidths', code: true },
			{ id: 'defaultSort', title: 'defaultSort', code: true },
			{ id: 'filter', title: 'filter', code: true },
			{ id: 'freezeColumn', title: 'freezeColumn', code: true },
			{ id: 'freezeColumnBackgroundColor', title: 'freezeColumnBackgroundColor', code: true },
			{ id: 'getRowId', title: 'getRowId', code: true },
			{ id: 'handleHoverColor', title: 'handleHoverColor', code: true },
			{ id: 'headerBackgroundColor', title: 'headerBackgroundColor', code: true },
			{ id: 'headerBackgroundColorHover', title: 'headerBackgroundColorHover', code: true },
			{ id: 'headerSticky', title: 'headerSticky', code: true },
			{ id: 'height', title: 'height', code: true },
			{ id: 'margin', title: 'margin', code: true },
			{ id: 'maxWidth', title: 'maxWidth', code: true },
			{ id: 'overscanRows', title: 'overscanRows', code: true },
			{ id: 'name', title: 'name', code: true },
			{ id: 'noTopBorder', title: 'noTopBorder', code: true },
			{ id: 'rowHeight', title: 'rowHeight', code: true },
			{ id: 'sort', title: 'sort', code: true },
			{ id: 'tableData', title: 'tableData', code: true },
			{ id: 'virtualizeRows', title: 'virtualizeRows', code: true },
			{ id: 'virtualizeRowThreshold', title: 'virtualizeRowThreshold', code: true },
			{ id: 'width', title: 'width', code: true },
		],
	},
	{
		id: 'columns',
		title: 'Columns',
		items: [
			{ id: 'column-accessor', title: 'accessor', code: true },
			{ id: 'column-align', title: 'align', code: true },
			{ id: 'column-compare', title: 'compare', code: true },
			{ id: 'column-id', title: 'id', code: true },
			{ id: 'column-justify', title: 'justify', code: true },
			{ id: 'column-justifyHeader', title: 'justifyHeader', code: true },
			{ id: 'column-key', title: 'key', code: true },
			{ id: 'column-nowrap', title: 'nowrap', code: true },
			{ id: 'column-padding', title: 'padding', code: true },
			{ id: 'column-renderCell', title: 'renderCell', code: true },
			{ id: 'column-renderHeader', title: 'renderHeader', code: true },
			{ id: 'column-showSortIcon', title: 'showSortIcon', code: true },
			{ id: 'column-sort', title: 'sort', code: true },
			{ id: 'column-title', title: 'title', code: true },
			{ id: 'column-width', title: 'width', code: true },
		],
	},
	{
		id: 'events',
		title: 'Events',
		items: [
			{ id: 'onClick', title: 'onClick', code: true },
			{ id: 'onColumnReorder', title: 'onColumnReorder', code: true },
			{ id: 'onColumnResize', title: 'onColumnResize', code: true },
			{ id: 'onDoubleClick', title: 'onDoubleClick', code: true },
			{ id: 'onMouseOut', title: 'onMouseOut', code: true },
			{ id: 'onMouseOver', title: 'onMouseOver', code: true },
			{ id: 'onRowClick', title: 'onRowClick', code: true },
			{ id: 'onSortChange', title: 'onSortChange', code: true },
		],
	},
	{ id: 'saved-views', title: 'Saved views' },
];
