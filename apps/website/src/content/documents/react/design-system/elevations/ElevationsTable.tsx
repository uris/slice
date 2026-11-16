'use client';

import { Code, TrackedFlexBox } from '@/components/Type/Type';
import {
	type CellContext,
	DataTable,
	type ElevationLevel,
	FlexBox,
	type HeaderContext,
	Preset,
} from '@apple-pie/slice';
import type { ColumnDefinition } from '@apple-pie/slice/components/DataTable';

interface ElevationRow {
	level: ElevationLevel;
	label: string;
	description: string;
}

const rows: ElevationRow[] = [
	{ level: 0, label: 'Flat', description: 'Part of the surrounding surface, with no shadow.' },
	{ level: 1, label: 'Subtle lift', description: 'A small amount of separation from nearby content.' },
	{ level: 2, label: 'Raised', description: 'A clearly defined surface above its background.' },
	{ level: 3, label: 'Floating', description: 'Noticeable depth for menus and other floating surfaces.' },
	{ level: 4, label: 'Prominent', description: 'Stronger separation for a distinct floating layer.' },
	{ level: 5, label: 'Highest', description: 'The strongest lift, suited to focused surfaces such as dialogs.' },
];

function RenderHeader<V>({ column }: HeaderContext<ElevationRow, V>) {
	const { title, id } = column;
	const isSurfaceTitle = id === 'surface';
	const padding = isSurfaceTitle ? '0-64-16-24' : '0-24-16-24';
	return (
		<FlexBox preset={Preset.Row} width="fill" justify={column.id === 'level' ? 'start' : 'center'} padding={padding}>
			<span className="body-l-regular">{title}</span>
		</FlexBox>
	);
}

function RenderCell<V>({ row }: CellContext<ElevationRow, unknown>) {
	return (
		<FlexBox
			preset={Preset.Animatable}
			background={'core-fill-primary'}
			padding={32}
			margin={'24px 0'}
			borderRadius={32}
		>
			<FlexBox width={96} height={96} borderRadius="var(--corner-xxl)" background={'core-blue'} elevation={row.level} />
		</FlexBox>
	);
}

const columns: ColumnDefinition<ElevationRow>[] = [
	{
		id: 'level',
		title: 'Level',
		sort: false,
		renderHeader: RenderHeader,
		renderCell: ({ row }: CellContext<ElevationRow, unknown>) => (
			<FlexBox preset={Preset.Column} width="fill" gap={8} padding={24}>
				<FlexBox preset={Preset.Row} gap={8}>
					<Code>{row.level}</Code>
					<span>{row.label}</span>
				</FlexBox>
				<span style={{ color: 'var(--core-text-secondary)' }}>{row.description}</span>
			</FlexBox>
		),
	},
	{
		id: 'surface',
		title: 'Surface',
		sort: false,
		renderHeader: RenderHeader,
		renderCell: RenderCell,
	},
];

export function ElevationLevelsTable() {
	return (
		<TrackedFlexBox
			id="elevation-levels"
			preset={Preset.FillCenterMiddle}
			width="fill"
			height="auto"
			padding="32-0-0-0"
		>
			<DataTable
				tableData={rows}
				columnDefinitions={columns}
				caption="Elevation levels"
				cellPadding={0}
				noTopBorder
				borderStyle="row"
				candyStripeBackgroundColor="transparent"
				backgroundColorHoverRow="transparent"
				headerBackgroundColor="transparent"
				headerBackgroundColorHover="transparent"
			/>
		</TrackedFlexBox>
	);
}
