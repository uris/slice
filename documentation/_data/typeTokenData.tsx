import type React from 'react';
import type { ColumnDefinition } from 'src';
import { fontSizes, fontWeights, letterSpacings, lineHeights, typeStyles } from '../../src/theme/type/type';

// 1. define your data model for the table - one row per raw design token
export type TypeTokenRow = {
	name: string;
	value: string;
	cssUsage: string;
	jsUsage: string;
};

// 2. turn one of the theme's token objects into rows, prefixing each key with
// the CSS custom property family it belongs to (e.g. "m" -> "letter-spacing-m"),
// and pairing it with the matching CSS var() and JS token-object usage
function toTokenRows(cssPrefix: string, objectName: string, tokens: Record<string, string | number>): TypeTokenRow[] {
	return Object.entries(tokens).map(([key, value]) => ({
		name: `${cssPrefix}-${key}`,
		value: String(value),
		cssUsage: `var(--${cssPrefix}-${key})`,
		jsUsage: `${objectName}['${key}']`,
	}));
}

// 3. pull the data straight from the theme's token objects, so this table can
// never drift out of sync with the real tokens defined in theme/type/type.ts
export const fontWeightTokens: TypeTokenRow[] = toTokenRows('font-weight', 'fontWeights', fontWeights);
export const fontSizeTokens: TypeTokenRow[] = toTokenRows('font-size', 'fontSizes', fontSizes);
export const lineHeightTokens: TypeTokenRow[] = toTokenRows('line-height', 'lineHeights', lineHeights);
export const letterSpacingTokens: TypeTokenRow[] = toTokenRows('letter-spacing', 'letterSpacings', letterSpacings);

// 4. custom styles for the "Example Usage" cell - two stacked, monospaced lines
const usageWrapperStyle: React.CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	gap: 2,
	padding: '8px 0',
	fontFamily: 'monospace',
	fontSize: '0.8125rem',
	lineHeight: 1.4,
};
const cssUsageStyle: React.CSSProperties = { color: 'var(--core-text-primary)' };
const jsUsageStyle: React.CSSProperties = { color: 'var(--core-text-secondary)' };

// 5. define your columns - `key` reads straight off TypeTokenRow, "Example Usage"
// is purely presentational (renders both usage lines off the row directly)
export const typeTokenColumnDefinitions: ColumnDefinition<TypeTokenRow>[] = [
	{
		id: 'col-1',
		key: 'name',
		title: 'Name',
		justify: 'start',
		width: 220,
		renderHeader: () => <span style={typeStyles['body-l-medium']}>Name</span>,
		renderCell: ({ row }) => <div style={{ color: 'var(--core-text-special)' }}>{row.name}</div>,
	},
	{
		id: 'col-2',
		key: 'value',
		title: 'Value',
		justify: 'center',
		width: 140,
	},
	{
		id: 'col-3',
		title: 'Example Usage',
		justify: 'center',
		renderCell: ({ row }) => (
			<div style={usageWrapperStyle}>
				<code>
					<span style={cssUsageStyle}>CSS: {row.cssUsage}</span>
				</code>
				<code>
					<span style={jsUsageStyle}>JSX: {row.jsUsage}</span>
				</code>
			</div>
		),
	},
];
