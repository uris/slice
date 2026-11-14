'use client';

import { Code } from '@/components/Type/Type';
import { type CellContext, DataTable, FlexBox, type HeaderContext, Preset, useClipboard } from '@apple-pie/slice';
import type { ColumnDefinition } from '@apple-pie/slice/components/DataTable';
import { useToastActions } from '@apple-pie/slice/stores';
import { spacing } from '@apple-pie/slice/theme';

interface SpacingTokenRow {
	token: string;
	value: number;
}

const rows: SpacingTokenRow[] = Object.entries(spacing).map(([token, value]) => ({
	token: `spacing-${token}`,
	value,
}));

function RenderHeader<V>({ column }: HeaderContext<SpacingTokenRow, V>) {
	const isToken = column.id === 'token';
	return (
		<FlexBox preset={Preset.Row} width="fill" justify={isToken ? 'start' : 'center'} padding="0-24-16-24">
			<span className={isToken ? 'body-xl-bold' : 'body-l-regular'}>{column.title}</span>
		</FlexBox>
	);
}

const columns: ColumnDefinition<SpacingTokenRow>[] = [
	{
		id: 'token',
		title: 'Token',
		sort: false,
		width: '70%',
		renderHeader: RenderHeader,
		renderCell: ({ value }: CellContext<SpacingTokenRow, string>) => (
			<FlexBox preset={Preset.Row} width="fill" padding="24-24">
				<span style={{ color: 'var(--core-text-secondary)' }}>{value}</span>
			</FlexBox>
		),
	},
	{
		id: 'value',
		title: 'Value (px)',
		sort: false,
		renderHeader: RenderHeader,
		renderCell: ({ value }: CellContext<SpacingTokenRow, number>) => (
			<FlexBox preset={Preset.Row} width="fill" justify="center" padding="24-24">
				<Code>{value}</Code>
			</FlexBox>
		),
	},
];

export function SpacingTokensTable() {
	const { copy } = useClipboard();
	const { push } = useToastActions();
	const handleRowClick = async (row: SpacingTokenRow) => {
		const copied = await copy(row.token);
		if (copied) push({ message: 'Spacing token copied to clipboard', type: 'success', duration: 2000 });
		else push({ message: 'Unable to copy to clipboard', type: 'error', duration: 2000 });
	};
	return (
		<FlexBox preset={Preset.FillCenterMiddle} width="fill" height="auto" padding="24-24-0-24">
			<DataTable
				name="Spacing tokens"
				caption="Spacing tokens"
				tableData={rows}
				onRowClick={handleRowClick}
				columnDefinitions={columns}
				cellPadding={0}
				noTopBorder
				borderStyle="row"
				candyStripeBackgroundColor="transparent"
				backgroundColorHoverRow="transparent"
				headerBackgroundColor="transparent"
				headerBackgroundColorHover="transparent"
			/>
		</FlexBox>
	);
}
