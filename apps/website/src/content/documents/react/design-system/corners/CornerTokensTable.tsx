'use client';

import { Code, TrackedFlexBox } from '@/components/Type/Type';
import { type CellContext, DataTable, FlexBox, type HeaderContext, Preset, useClipboard } from '@apple-pie/slice';
import type { ColumnDefinition } from '@apple-pie/slice/components/DataTable';
import { useToastActions } from '@apple-pie/slice/stores';
import { lightTheme } from '@apple-pie/slice/theme';

interface CornerTokenRow {
	token: string;
	value: string;
}

export const cornerRows: CornerTokenRow[] = Object.entries(lightTheme.corners)
	.map(([token, value]) => ({
		token,
		value: `${value}px`,
	}))
	.filter((item) => item.token !== 'corner-none' && item.token !== 'corner-round');

export const square: CornerTokenRow[] = [
	{
		token: 'corner-none',
		value: '0px',
	},
];

export const pill: CornerTokenRow[] = [
	{
		token: 'corner-round',
		value: `${lightTheme.corners['corner-round']}px`,
	},
];

const columns: ColumnDefinition<CornerTokenRow>[] = [
	{
		id: 'token',
		title: 'Token',
		sort: false,
		width: '70%',
		renderHeader: RenderHeader,
		renderCell: (ctx: CellContext<CornerTokenRow, string>) => RenderCell(ctx, true),
	},
	{
		id: 'value',
		title: 'Value',
		sort: false,
		renderHeader: RenderHeader,
		renderCell: (ctx: CellContext<CornerTokenRow, string>) => RenderCell(ctx, false),
	},
];

export function RenderCell(ctx: CellContext<CornerTokenRow, string>, token: boolean) {
	const { value } = ctx;
	const justify = token ? 'start' : 'center';
	return (
		<FlexBox preset={Preset.Row} justify={justify} width={'fill'} gap={8} padding={'24-24'}>
			{token && <span style={{ color: 'var(--core-text-secondary)' }}>{value}</span>}
			{!token && <Code>{value}</Code>}
		</FlexBox>
	);
}

export function RenderHeader<V>(ctx: HeaderContext<CornerTokenRow, V>) {
	const { column, tableName } = ctx;
	const { id, title } = column;
	const justify = id !== 'token' ? 'center' : 'start';
	return (
		<FlexBox preset={Preset.Row} width={'fill'} justify={justify} gap={8} padding={'0-24-16-24'}>
			{id === 'token' && <span className={'body-xl-bold'}>{tableName}</span>}
			{id !== 'token' && <span className={'body-l-regular'}>{title}</span>}
		</FlexBox>
	);
}

export interface CornerTableProps {
	id?: string;
	name?: string;
	tableData?: CornerTokenRow[];
	caption?: string;
}

export function CornerTokensTable(props: Readonly<CornerTableProps>) {
	const { id, name, tableData, caption } = props;
	const { copy } = useClipboard();
	const { push } = useToastActions();
	const handleRowClick = async (row: CornerTokenRow) => {
		const copied = await copy(`${row.token}, ${row.value}`);
		if (copied) push({ message: 'Corner values copied to clipboard', type: 'success', duration: 2000 });
		else push({ message: 'Unable to copy to clipboard', type: 'error', duration: 2000 });
	};
	return (
		<TrackedFlexBox id={id} preset={Preset.FillCenterMiddle} width={'fill'} height={'auto'} padding={'64-24-0-24'}>
			<DataTable
				name={name}
				onRowClick={handleRowClick}
				tableData={tableData}
				columnDefinitions={columns}
				caption={caption}
				cellPadding={0}
				noTopBorder
				borderStyle={'row'}
				candyStripeBackgroundColor={'transparent'}
				backgroundColorHoverRow={'transparent'}
				headerBackgroundColor={'transparent'}
				headerBackgroundColorHover={'transparent'}
			/>
		</TrackedFlexBox>
	);
}
