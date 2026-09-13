import {type ColumnDefinition, Icon, type SortKey, type Type} from '../../src';
import { typeStyles } from '../../src/theme/type/type';
import type React from "react";

// 1. define your data model for the table - one row per core type style
export type TypeDataRow = {
	styleName: keyof Type;
	fontSizeRem: string;
	fontSizePix: string;
	fontSize: string;
	fontWeight: string;
	lineHeight: string;
	letterSpacing: string;
};

// 2. default sort largest to smallest
export const typeDefaultSort:SortKey<TypeDataRow> = {key:"fontSize", dir:"desc"}

// 3. pull the data straight from the theme's typeStyles, so this table can
// never drift out of sync with the real tokens defined in theme/type/type.ts
const typeData: TypeDataRow[] = Object.keys(typeStyles).map((key) => {
	const styleName = key as keyof Type;
	const { fontSize, fontWeight, lineHeight, letterSpacing } = typeStyles[styleName];
	const fontSizeNoRem = fontSize?.toString().replace("rem", "") ?? "";
	const fontSizePix = `${Number(fontSizeNoRem) * 16}px`

	return {
		styleName,
		fontSizeRem: String(fontSize),
		fontSizePix: String(fontSizePix),
		fontSize: String(fontSizeNoRem),
		fontWeight: String(fontWeight),
		lineHeight: String(lineHeight),
		letterSpacing: String(letterSpacing),
	};
});

export const headingStyles = typeData.filter((row) => row.styleName.startsWith("h")).sort((a,b)=>a.fontSize < b.fontSize ? 1:-1)
export const bodyStyles = typeData.filter((row) => !row.styleName.startsWith("h")).sort((a,b)=>a.fontSize < b.fontSize ? 1:-1)
export const headingThenNonHeading = [...headingStyles, ...bodyStyles]

// 4. define your columns - `key` reads straight off TypeDataRow
export const typeDataColumnDefinitions: ColumnDefinition<TypeDataRow>[] = [
	{
		id: 'col-1',
		key: 'styleName',
		title: 'Style',
		justify: 'start',
		renderHeader:({column, sortKey})=> <HeaderRenderer<TypeDataRow> column={column} sortKey={sortKey} />,
		renderCell:({row})=> <CellRenderer<TypeDataRow> row={row} />,
	},
	{
		id: 'col-2',
		key: 'fontSize',
		title: 'Size (calc. px)',
		justify: 'start',
		renderCell:({row})=> <SizeRenderer<TypeDataRow> row={row} />,
		renderHeader:({column, sortKey})=> <HeaderRenderer<TypeDataRow> column={column} sortKey={sortKey} />,
	},
	{
		id: 'col-4',
		key: 'fontWeight',
		title: 'Weight',
		justify: 'center',
		renderHeader:({column, sortKey})=> <HeaderRenderer<TypeDataRow> center column={column} sortKey={sortKey} />,
	},
	{
		id: 'col-5',
		key: 'lineHeight',
		title: 'Line Height',
		justify: 'center',
		renderHeader:({column, sortKey})=> <HeaderRenderer<TypeDataRow> center column={column} sortKey={sortKey} />,
	},
	{
		id: 'col-6',
		key: 'letterSpacing',
		title: 'Spacing',
		justify: 'center',
		renderHeader:({column, sortKey})=> <HeaderRenderer<TypeDataRow> center column={column} sortKey={sortKey} />,
	},
];

// 5. custom styles for cell renderer
const textStyle: React.CSSProperties = {margin:0, padding:0, color:'var(--core-text-special)', lineHeight:'1em'}
const divStyle: React.CSSProperties = {boxSizing: "border-box",display:"flex", alignItems:"center",justifyContent:"flex-start", padding:0, margin:0, whiteSpace:'nowrap' }

interface CellRendererProps<T> {
	row: TypeDataRow;
}

// render style column
export function CellRenderer<T>(props: Readonly<CellRendererProps<T>>) {
	const { row } = props;
	switch(row.styleName)
	{
		case 'h1':
			return <div style={divStyle}><h1 style={textStyle}>{row.styleName}</h1></div>;
		case 'h2':
			return <div style={divStyle}><h2 style={textStyle}>{row.styleName}</h2></div>;
		case 'h3':
			return <div style={divStyle}><h3 style={textStyle}>{row.styleName}</h3></div>;
		case 'h4':
			return <div style={divStyle}><h4 style={textStyle}>{row.styleName}</h4></div>;
		case 'h5':
			return <div style={divStyle}><h5 style={textStyle}>{row.styleName}</h5></div>;
		case 'h6':
			return <div style={divStyle}><h6 style={textStyle}>{row.styleName}</h6></div>;
		default: {
			const fontStyle = typeStyles[row.styleName as keyof typeof typeStyles];
			return <div style={divStyle}><span style={{...textStyle, ...fontStyle}}>{row.styleName}</span></div>;
		}
	}
}

// render combined style size column
export function SizeRenderer<T>(props: Readonly<CellRendererProps<T>>) {
	const { row } = props;
	return <div style={divStyle}>{row.fontSize}rem <span style={{color:'var(--core-text-disabled)', marginLeft:8}}>({row.fontSizePix})</span></div>;
}

interface HeaderRendererProps<T> {
	column: ColumnDefinition<TypeDataRow, any>
	sortKey: SortKey<T>;
	center?: boolean;
}

export function HeaderRenderer<T>(props: Readonly<HeaderRendererProps<T>>) {
	const { column, sortKey, center = false } = props;
	const sortable = !!column.sort;
	const sorted = !!(sortKey?.key && sortKey.key === column.sort);
	const sortIcon = sortKey?.dir === 'asc' ? 'arrow up' : 'arrow down';
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent: "center", width:"100%", gap:16, whiteSpace:'nowrap' }}>
			<div style={{...typeStyles.h6, display:"flex", justifyContent:center?"center":"flex-start", flex:1}}>{column.title}</div>
			{sortable && <Icon name={sorted ? sortIcon : 'blank'} pointerEvents={'none'} size={16} />}
		</div>
	);
}
