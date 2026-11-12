'use client';

import { TrackedFlexBox } from '@/components/Type/Type';

import { ColorButton, type ColorData } from '@/documents/react/design-system/colors/ColorButton';
import { DataTable, FlexBox, type HeaderContext, Icon, Preset, type SliceIcon, useClipboard } from '@apple-pie/slice';
import type { CellContext, ColumnDefinition } from '@apple-pie/slice/components/DataTable';
import { useToastActions } from '@apple-pie/slice/stores';

/** Base #RRGGBB colors with per-theme opacity stored separately. */
export interface ColorTokenRow {
	token: string;
	/** Base ramp tables may use a different fixed token for the dark anchor. */
	darkToken?: string;
	lightHex: string;
	darkHex: string;
	/** 0 is transparent; 1 is fully opaque. */
	opacity: { light: number; dark: number };
}

// Snapshot of the Slice light/dark theme tokens, grouped to match ColorsDoc.
// surface-shadow-soft/strong are box-shadow declarations rather than single colors.

export const backgrounds: ColorTokenRow[] = [
	{
		token: 'core-drop-shadow',
		lightHex: '#000000',
		darkHex: '#000000',
		opacity: {
			light: 0.1,
			dark: 0.48,
		},
	},
	{
		token: 'core-surface-primary',
		lightHex: '#FFFFFF',
		darkHex: '#101010',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-surface-primary-tint',
		lightHex: '#F7F6F5',
		darkHex: '#1E1E1D',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-surface-secondary',
		lightHex: '#F5F4F2',
		darkHex: '#1F1E1E',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-surface-special',
		lightHex: '#E5F1FE',
		darkHex: '#00232C',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
];

export const fills: ColorTokenRow[] = [
	{
		token: 'core-fill-primary',
		lightHex: '#808080',
		darkHex: '#808080',
		opacity: {
			light: 0.12,
			dark: 0.12,
		},
	},
	{
		token: 'core-fill-secondary',
		lightHex: '#3C3C43',
		darkHex: '#EBEBF5',
		opacity: {
			light: 0.3,
			dark: 0.3,
		},
	},
	{
		token: 'core-fill-tertiary',
		lightHex: '#787878',
		darkHex: '#787878',
		opacity: {
			light: 0.2,
			dark: 0.2,
		},
	},
];

export const outlinesAndBorders: ColorTokenRow[] = [
	{
		token: 'core-outline-primary',
		lightHex: '#EAE9E8',
		darkHex: '#3C3C3B',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-outline-secondary',
		lightHex: '#EAE9E8',
		darkHex: '#2E2E2D',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-outline-tertiary',
		lightHex: '#0088FF',
		darkHex: '#7EDEFE',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-outline-special',
		lightHex: '#CFE6FF',
		darkHex: '#00323E',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
];

export const text: ColorTokenRow[] = [
	{
		token: 'core-text-primary',
		lightHex: '#000000',
		darkHex: '#FFFFFF',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-text-secondary',
		lightHex: '#434242',
		darkHex: '#F5F3F0',
		opacity: {
			light: 0.6,
			dark: 0.6,
		},
	},
	{
		token: 'core-text-tertiary',
		lightHex: '#434242',
		darkHex: '#F5F3F0',
		opacity: {
			light: 0.3,
			dark: 0.3,
		},
	},
	{
		token: 'core-text-quaternary',
		lightHex: '#434242',
		darkHex: '#EBEBF5',
		opacity: {
			light: 0.18,
			dark: 0.18,
		},
	},
	{
		token: 'core-text-dark',
		lightHex: '#000000',
		darkHex: '#000000',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-text-light',
		lightHex: '#FFFFFF',
		darkHex: '#FFFFFF',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-text-disabled',
		lightHex: '#434242',
		darkHex: '#EBEBF5',
		opacity: {
			light: 0.18,
			dark: 0.18,
		},
	},
	{
		token: 'core-link-primary',
		lightHex: '#036ECF',
		darkHex: '#7EDEFE',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-text-error',
		lightHex: '#CF2D2F',
		darkHex: '#FF4245',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-text-special',
		lightHex: '#036ECF',
		darkHex: '#7EDEFE',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
];

export const buttonsAndBadges: ColorTokenRow[] = [
	{
		token: 'core-button-primary',
		lightHex: '#036ECF',
		darkHex: '#036ECF',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-button-disabled',
		lightHex: '#808080',
		darkHex: '#808080',
		opacity: {
			light: 0.12,
			dark: 0.12,
		},
	},
	{
		token: 'core-badge-primary',
		lightHex: '#036ECF',
		darkHex: '#036ECF',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-badge-secondary',
		lightHex: '#808080',
		darkHex: '#808080',
		opacity: {
			light: 0.12,
			dark: 0.12,
		},
	},
];

export const scrollBars: ColorTokenRow[] = [
	{
		token: 'scroll-bar',
		lightHex: '#D6D5D4',
		darkHex: '#3C3C3B',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'scroll-bar-hover',
		lightHex: '#CCCBCA',
		darkHex: '#4A4949',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
];

export const messagesAndFeedback: ColorTokenRow[] = [
	{
		token: 'feedback-attention',
		lightHex: '#FFCC00',
		darkHex: '#FFD600',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'feedback-informative',
		lightHex: '#00758E',
		darkHex: '#009ABA',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'feedback-positive',
		lightHex: '#5E7C12',
		darkHex: '#5E7C12',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'feedback-urgency',
		lightHex: '#FF8D28',
		darkHex: '#FF8D28',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'feedback-warning',
		lightHex: '#CF2D2F',
		darkHex: '#CF2D2F',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
];

export const icons: ColorTokenRow[] = [
	{
		token: 'core-icon-primary',
		lightHex: '#000000',
		darkHex: '#FFFFFF',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-icon-secondary',
		lightHex: '#434242',
		darkHex: '#F5F3F0',
		opacity: {
			light: 0.6,
			dark: 0.6,
		},
	},
	{
		token: 'core-icon-tertiary',
		lightHex: '#0088FF',
		darkHex: '#7EDEFE',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-icon-dark',
		lightHex: '#000000',
		darkHex: '#000000',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-icon-light',
		lightHex: '#FFFFFF',
		darkHex: '#FFFFFF',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
	{
		token: 'core-icon-disabled',
		lightHex: '#434242',
		darkHex: '#EBEBF5',
		opacity: {
			light: 0.18,
			dark: 0.18,
		},
	},
	{
		token: 'core-icon-error',
		lightHex: '#CF2D2F',
		darkHex: '#FF4245',
		opacity: {
			light: 1,
			dark: 1,
		},
	},
];

export const array: ColorTokenRow[] = [
	{ token: 'array-blue', lightHex: '#0088FF', darkHex: '#0088FF', opacity: { light: 0.1, dark: 0.16 } },
	{ token: 'array-blue-accent', lightHex: '#0455A1', darkHex: '#3C9EFF', opacity: { light: 1, dark: 1 } },
	{ token: 'array-cyan', lightHex: '#00C0E8', darkHex: '#00C0E8', opacity: { light: 0.1, dark: 0.16 } },
	{ token: 'array-cyan-accent', lightHex: '#005265', darkHex: '#3CD3FE', opacity: { light: 1, dark: 1 } },
	{ token: 'array-lime', lightHex: '#9DCC29', darkHex: '#9DCC29', opacity: { light: 0.1, dark: 0.16 } },
	{ token: 'array-lime-accent', lightHex: '#5E7C12', darkHex: '#AAD254', opacity: { light: 1, dark: 1 } },
	{ token: 'array-pink', lightHex: '#FF2D55', darkHex: '#FF2D55', opacity: { light: 0.1, dark: 0.16 } },
	{ token: 'array-pink-accent', lightHex: '#A11B33', darkHex: '#FF5C72', opacity: { light: 1, dark: 1 } },
	{ token: 'array-orange', lightHex: '#FF8D28', darkHex: '#FF8D28', opacity: { light: 0.1, dark: 0.16 } },
	{ token: 'array-orange-accent', lightHex: '#9D5413', darkHex: '#FF9F53', opacity: { light: 1, dark: 1 } },
	{ token: 'array-purple', lightHex: '#CB30E0', darkHex: '#CB30E0', opacity: { light: 0.1, dark: 0.16 } },
	{ token: 'array-purple-accent', lightHex: '#A527B6', darkHex: '#E056F4', opacity: { light: 1, dark: 1 } },
	{ token: 'array-yellow', lightHex: '#FFCC00', darkHex: '#FFCC00', opacity: { light: 0.1, dark: 0.16 } },
	{ token: 'array-yellow-accent', lightHex: '#997900', darkHex: '#FFD600', opacity: { light: 1, dark: 1 } },
];

// Exact light/dark accent anchors from the core palette, rather than semantic theme roles.
export const coreColorMidpoints: ColorTokenRow[] = [
	{
		token: 'core-red',
		lightHex: '#FF383C',
		darkHex: '#FF4245',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-orange',
		lightHex: '#FF8D28',
		darkHex: '#FF9230',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-yellow',
		lightHex: '#FFCC00',
		darkHex: '#FFD600',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-lime',
		lightHex: '#9DCC29',
		darkHex: '#A0CC33',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-green',
		lightHex: '#34C759',
		darkHex: '#30D158',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-mint',
		lightHex: '#00C8B3',
		darkHex: '#00DAC3',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-teal',
		lightHex: '#00C3D0',
		darkHex: '#00D2E0',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-cyan',
		lightHex: '#00C0E8',
		darkHex: '#3CD3FE',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-blue',
		lightHex: '#0088FF',
		darkHex: '#0091FF',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-indigo',
		lightHex: '#6155F5',
		darkHex: '#6B5DFF',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-purple',
		lightHex: '#CB30E0',
		darkHex: '#DB34F2',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-pink',
		lightHex: '#FF2D55',
		darkHex: '#FF375F',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-brown',
		lightHex: '#AC7F5E',
		darkHex: '#B78A66',
		opacity: { light: 1, dark: 1 },
	},
];

export const coreGreys: ColorTokenRow[] = [
	{ token: 'core-grey-1000', lightHex: '#000000', darkHex: '#000000', opacity: { light: 1, dark: 1 } },
	{
		token: 'core-grey-1',
		lightHex: '#939292',
		darkHex: '#939290',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-grey-2',
		lightHex: '#B2B1B0',
		darkHex: '#666564',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-grey-3',
		lightHex: '#CCCBCA',
		darkHex: '#4A4949',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-grey-4',
		lightHex: '#D6D5D4',
		darkHex: '#3C3C3B',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-grey-5',
		lightHex: '#EAE9E8',
		darkHex: '#2E2E2D',
		opacity: { light: 1, dark: 1 },
	},
	{
		token: 'core-grey-6',
		lightHex: '#F7F6F5',
		darkHex: '#1E1E1D',
		opacity: { light: 1, dark: 1 },
	},
	{ token: 'core-grey-0', lightHex: '#FFFFFF', darkHex: '#FFFFFF', opacity: { light: 1, dark: 1 } },
];

/** Rendering stays customizable; opacity is metadata, not a separate column. */
export const colorColumns: ColumnDefinition<ColorTokenRow>[] = [
	{ id: 'token', title: 'Token name', sort: false, width: '50%', renderHeader: RenderHeader, renderCell: RenderToken },
	{
		id: 'lightHex',
		title: 'Light color hex',
		justify: 'center',
		sort: false,
		renderHeader: RenderHeader,
		renderCell: (ctx: CellContext<ColorTokenRow, string>) => <ColorRender row={ctx.row} light />,
	},
	{
		id: 'darkHex',
		title: 'Dark color hex',
		justify: 'center',
		sort: false,
		renderHeader: RenderHeader,
		renderCell: (ctx: CellContext<ColorTokenRow, string>) => <ColorRender row={ctx.row} light={false} />,
	},
];

export const colorTables = {
	coreColorMidpoints,
	coreGreys,
	backgrounds,
	fills,
	outlinesAndBorders,
	text,
	buttonsAndBadges,
	scrollBars,
	messagesAndFeedback,
	icons,
	array,
};

export function ColorRender({ row, light }: { row: ColorTokenRow; light: boolean }) {
	const { push } = useToastActions();
	const { copy } = useClipboard();
	const { lightHex, darkHex, opacity } = row;
	const token = !light && row.darkToken ? row.darkToken : row.token;
	const color = {
		token,
		value: light ? lightHex.toLowerCase() : darkHex.toLowerCase(),
		opacity: light ? opacity.light : opacity.dark,
		theme: light ? 'light' : 'dark',
	};

	const handleClick = async (color?: ColorData) => {
		if (color) {
			const values = [color.token, color.value];
			const opacity = color.opacity ?? 1;
			if (opacity < 1) values.push(`${Number((opacity * 100).toFixed(4))}%`);
			const result = await copy(values.join(', '));
			if (result) push({ message: 'Color values copied to clipboard', type: 'success', duration: 2000 });
			else push({ message: 'Unable to copy to clipboard', type: 'error', duration: 2000 });
		}
	};
	return (
		<FlexBox preset={Preset.Row} width={'fill'} justify={'center'} gap={8} padding={'16-16'}>
			<ColorButton color={color} onClick={handleClick} />
		</FlexBox>
	);
}

export function RenderToken<V>(ctx: CellContext<ColorTokenRow, V>) {
	const { row } = ctx;
	const { token, darkToken } = row;
	if (darkToken) {
		return (
			<FlexBox preset={Preset.Column} width="fill" gap={4} padding={0}>
				<span style={{ color: 'var(--core-text-secondary)' }}>Light: {token}</span>
				<span style={{ color: 'var(--core-text-secondary)' }}>Dark: {darkToken}</span>
			</FlexBox>
		);
	}
	return (
		<FlexBox preset={Preset.Row} width={'fill'} gap={8} padding={0}>
			<span style={{ color: 'var(--core-text-secondary)' }}>{token}</span>
		</FlexBox>
	);
}

export function RenderHeader<V>(ctx: HeaderContext<ColorTokenRow, V>) {
	const { column, tableName } = ctx;
	const { id } = column;
	const icon: SliceIcon = id === 'lightHex' ? 'weather.sun' : 'weather.moon';
	const label = id === 'lightHex' ? 'Light' : 'Dark';
	const justify = id !== 'token' ? 'center' : 'start';
	return (
		<FlexBox preset={Preset.Row} width={'fill'} justify={justify} gap={8} padding={'0-0-16-0'}>
			{id !== 'token' && <Icon name={icon} size={18} stroke={1.5} />}
			{id !== 'token' && label}
			{id === 'token' && <span className={'body-xl-bold'}>{tableName ?? column.title}</span>}
		</FlexBox>
	);
}

export interface ColorTableProps {
	id?: string;
	name?: string;
	tableData?: ColorTokenRow[];
	columns?: ColumnDefinition<ColorTokenRow>[];
	caption?: string;
}

export function ColorTableTemplate(props: Readonly<ColorTableProps>) {
	const { id, name, tableData, columns, caption } = props;
	if (!columns || !tableData) return null;
	return (
		<TrackedFlexBox id={id} preset={Preset.FillCenterMiddle} width={'fill'} height={'auto'} padding={'64-24-0-24'}>
			<DataTable
				name={name}
				tableData={tableData}
				columnDefinitions={columns}
				caption={caption}
				cellPadding={0}
				noTopBorder
				borderStyle={'none'}
				candyStripeBackgroundColor={'transparent'}
				backgroundColorHoverRow={'transparent'}
				headerBackgroundColor={'transparent'}
				headerBackgroundColorHover={'transparent'}
			/>
		</TrackedFlexBox>
	);
}
