import type React from 'react';
import type { CellContext, ColumnDefinition } from 'src';
import { corners } from '../../src/theme/corners/corners';
import { elevations } from '../../src/theme/elevations/elevations';
import { spacing } from '../../src/theme/spacing/spacing';
import { typeStyles } from '../../src/theme/type/type';

// one row per raw design token - shared by the Spacing, Corners and Elevations pages
export type StyleTokenRow = {
	name: string;
	value: string;
	cssUsage: string;
	jsUsage: string;
	/** the raw numeric value, used by the preview column */
	raw: number;
	/** optional "use it for" hint */
	description?: string;
};

// Pull the data straight from the theme's token objects so these tables can never
// drift out of sync with the real tokens. `cssPrefix` is empty for tokens whose object
// key is already the full CSS name (corners / elevations: 'corner-m' -> --corner-m).
function toRows(
	cssPrefix: string,
	objectName: string,
	tokens: Record<string, number>,
	unit: string,
	descriptions: Record<string, string> = {},
): StyleTokenRow[] {
	return Object.entries(tokens).map(([key, raw]) => {
		const cssName = cssPrefix ? `${cssPrefix}-${key}` : key;
		return {
			name: cssName,
			value: `${raw}${unit}`,
			cssUsage: `var(--${cssName})`,
			jsUsage: `${objectName}['${key}']`,
			raw,
			description: descriptions[key],
		};
	});
}

export const spacingTokens = toRows('spacing', 'spacing', spacing, 'px');
export const cornerTokens = toRows('', 'corners', corners, 'px');

// The elevation values live in a comment in elevations.ts - keep the plain-language
// "use it for" hints here so the docs page can show them
export const elevationTokens = toRows('', 'elevations', elevations, '', {
	'elevation-below-surface': 'Items hidden from view',
	'elevation-surface': 'Default level for regular content',
	'elevation-float': 'Toolbars, floating action buttons',
	'elevation-describe': 'Tooltips and info',
	'elevation-status': 'Status bars and toasts',
	'elevation-notify': 'Alerts and other critical status',
	'elevation-overlay': 'Overlay covers',
	'elevation-confirm': 'Confirmation dialogs that require an action to dismiss',
});

// custom styles for the "Example Usage" cell - two stacked, monospaced lines
const usageWrapperStyle: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	gap: 2,
	padding: '8px 0',
	fontFamily: 'monospace',
	fontSize: '0.8125rem',
	lineHeight: 1.4,
};

const nameColumn: ColumnDefinition<StyleTokenRow> = {
	id: 'col-name',
	key: 'name',
	title: 'Name',
	justify: 'start',
	width: 240,
	renderHeader: () => <span style={typeStyles['body-l-medium']}>Name</span>,
	renderCell: ({ row }: CellContext<StyleTokenRow, unknown>) => (
		<div style={{ color: 'var(--core-text-special)' }}>{row.name}</div>
	),
};

const valueColumn: ColumnDefinition<StyleTokenRow> = {
	id: 'col-value',
	key: 'value',
	title: 'Value',
	justify: 'center',
	width: 110,
};

const usageColumn: ColumnDefinition<StyleTokenRow> = {
	id: 'col-usage',
	title: 'Example Usage',
	justify: 'center',
	renderCell: ({ row }: CellContext<StyleTokenRow, unknown>) => (
		<div style={usageWrapperStyle}>
			<code>
				<span style={{ color: 'var(--core-text-primary)' }}>CSS: {row.cssUsage}</span>
			</code>
			<code>
				<span style={{ color: 'var(--core-text-secondary)' }}>JSX: {row.jsUsage}</span>
			</code>
		</div>
	),
};

// Spacing: a bar exactly as wide as the token
export const spacingColumnDefinitions: ColumnDefinition<StyleTokenRow>[] = [
	nameColumn,
	valueColumn,
	{
		id: 'col-preview',
		title: 'Preview',
		justify: 'start',
		width: 160,
		renderCell: ({ row }: CellContext<StyleTokenRow, unknown>) => (
			<div
				role="img"
				aria-label={`${row.value} wide`}
				style={{
					width: row.raw,
					height: 12,
					borderRadius: 2,
					background: 'var(--core-text-special)',
				}}
			/>
		),
	},
	usageColumn,
];

// Corners: a tile using the real token as its border-radius
export const cornerColumnDefinitions: ColumnDefinition<StyleTokenRow>[] = [
	nameColumn,
	valueColumn,
	{
		id: 'col-preview',
		title: 'Preview',
		justify: 'center',
		width: 110,
		renderCell: ({ row }: CellContext<StyleTokenRow, unknown>) => (
			<div
				role="img"
				aria-label={`Tile with ${row.value} corners`}
				style={{
					width: 56,
					height: 40,
					margin: '8px 0',
					boxSizing: 'border-box',
					background: 'var(--core-surface-secondary)',
					border: '2px solid var(--core-text-special)',
					borderRadius: `var(--${row.name})`,
				}}
			/>
		),
	},
	usageColumn,
];

// Elevations: the number is a z-index, so surface the "use it for" hint instead of a swatch
export const elevationColumnDefinitions: ColumnDefinition<StyleTokenRow>[] = [
	{ ...nameColumn, width: 280 },
	{ ...valueColumn, width: 90 },
	{
		id: 'col-description',
		title: 'Use For',
		justify: 'start',
		width: 260,
		renderCell: ({ row }: CellContext<StyleTokenRow, unknown>) => <span>{row.description}</span>,
	},
	usageColumn,
];
