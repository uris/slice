import React, { useCallback, useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { accessibleKeyDown, setStyle } from '../../utils/functions/misc';
import { Icon } from '../Icon';
import styles from './DataTable.module.css';
import type { CellContext, ColumnDefinition, DataTableProps, HeaderContext, SortKey } from './_types';
import { useReorderColumns } from './_useReorderColumns';
import { useResizeColumn } from './_useResizeColumn';
import { resolveAlignValue, resolveColumnValue } from './columnHelper';

export function DataTable<T>(props: Readonly<DataTableProps<T>>) {
	const {
		backgroundColor = 'var(--core-surface-primary)',
		headerBackgroundColor = 'var(--core-surface-secondary)',
		candyStripeBackgroundColor = 'var(--core-surface-primary-tint)',
		backgroundColorHoverRow = 'var(--core-surface-primary-tint)',
		handleHoverColor = 'var(--core-outline-special)',
		freezeColumn = false,
		headerSticky = true,
		height = 'auto',
		width = '100%',
		colResize = true,
		borderColor = 'var(--core-outline-primary)',
		borderStyle = 'box',
		columnDefinitions = [],
		tableData = [],
		getRowId,
		filter,
		caption = 'Data Table',
		onDoubleClick,
		onClick,
		onMouseOut,
		onMouseOver,
		sort,
		onSortChange,
		onColumnResize,
		onColumnReorder,
		borderRadius = 8,
	} = props;
	const [hScroll, setHScroll] = useState<boolean>(false);
	const [vScroll, setVScroll] = useState<boolean>(false);
	const [hoveredRow, setHoveredRow] = useState<number | null>(null);
	const [sortKey, setSortKey] = useState<SortKey<T>>(sort);
	const [columnWidths, setColumnWidths] = useState<Record<string, number | string>>({});
	const [columnOrder, setColumnOrder] = useState<string[] | null>(null);
	const [draggedColId, setDraggedColId] = useState<string | null>(null);
	const wrapperRef = React.useRef<HTMLDivElement>(null);
	const resizeBarRef = React.useRef<HTMLDivElement>(null);
	const colRefs = React.useRef<Record<string, HTMLTableColElement | null>>({});
	const elements = { handle: resizeBarRef, parent: wrapperRef };

	// resolve corner shadow
	const cornerBoxShadow = useMemo(() => {
		const shadows: string[] = [];
		if (hScroll && freezeColumn) {
			shadows.push('1px 0 0 var(--core-outline-primary)', '5px 0 0 rgba(0,0,0,0.1)');
		}
		if (vScroll && headerSticky) {
			shadows.push('0 1px 0 var(--core-outline-primary)');
		}
		if (vScroll && headerSticky && !hScroll) {
			shadows.push('0 5px 0 rgba(0,0,0,0.1)');
		}
		return shadows.length > 0 ? shadows.join(',') : 'none';
	}, [hScroll, vScroll, freezeColumn, headerSticky]);

	// resolve column drop shadow
	const columnBoxShadow = useMemo(() => {
		const shadows: string[] = [];
		if (hScroll && freezeColumn) {
			shadows.push('1px 0 0 var(--core-outline-primary)', '5px 0 0 rgba(0,0,0,0.1)');
		}
		return shadows.length > 0 ? shadows.join(',') : 'none';
	}, [hScroll, freezeColumn]);

	// resolve header shadow
	const headerBoxShadow = useMemo(() => {
		const shadows: string[] = [];
		if (vScroll && headerSticky) {
			shadows.push('0 1px 0 var(--core-outline-primary)', '0 5px 0 rgba(0,0,0,0.1)');
		}
		return shadows.length > 0 ? shadows.join(',') : 'none';
	}, [vScroll, headerSticky]);

	// memo styling props
	const cssVars = useMemo(() => {
		return {
			'--table-width': setStyle(width),
			'--table-height': setStyle(height),
			'--table-background-color': backgroundColor,
			'--table-column-box-shadow': columnBoxShadow,
			'--table-header-box-shadow': headerBoxShadow,
			'--table-corner-box-shadow': cornerBoxShadow,
			'--table-header-background-color': headerBackgroundColor,
			'--table-candy-stripe-background-color': candyStripeBackgroundColor,
			'--table-freeze-column-position': freezeColumn ? 'sticky' : 'relative',
			'--table-header-sticky-position': headerSticky ? 'sticky' : 'relative',
			'--table-border-color': borderColor,
			'--table-corner-position': freezeColumn || headerSticky ? 'sticky' : 'relative',
			'--table-corner-left': freezeColumn ? '0px' : 'unset',
			'--table-border-width': borderStyle === 'none' ? '0' : '1px',
			'--table-border-sides': borderStyle === 'box' ? '1px' : '0',
			'--table-handle-hover-color': handleHoverColor,
			'--table-border-radius': borderStyle === 'box' ? setStyle(borderRadius) : 0,
		} as React.CSSProperties;
	}, [
		backgroundColor,
		headerBackgroundColor,
		candyStripeBackgroundColor,
		cornerBoxShadow,
		columnBoxShadow,
		headerBoxShadow,
		freezeColumn,
		headerSticky,
		width,
		height,
		borderColor,
		borderStyle,
		handleHoverColor,
		borderRadius,
	]);

	// handler create col refs for each col in the colgroup
	const handleCreateRefs = useCallback((el: HTMLTableColElement | null, id: string) => {
		colRefs.current[id] = el;
	}, []);

	// live drag-and-drop column order, falling back to columnDefinitions natural order.
	const orderedColumns = useMemo(() => {
		if (!columnOrder) return columnDefinitions;
		const byId = new Map(columnDefinitions.map((column) => [column.id, column]));
		const ordered = columnOrder.map((id) => byId.get(id)).filter((column): column is ColumnDefinition<T> => !!column);
		const seen = new Set(columnOrder);
		const appended = columnDefinitions.filter((column) => !seen.has(column.id));
		return [...ordered, ...appended];
	}, [columnDefinitions, columnOrder]);

	// resize column logic and handlers
	const { dragResize, hoverResize } = useResizeColumn(elements, colResize, setColumnWidths, onColumnResize);

	// reorder column logic and handlers
	const { dragStart, dragOver, dragDrop } = useReorderColumns<T>(
		columnDefinitions,
		setColumnOrder,
		setDraggedColId,
		onColumnReorder,
		freezeColumn,
	);

	// scrolling state is used to set drop shadow and border styles for sticky cells
	const handleScroll = useCallback(() => {
		const hScrollAmount = wrapperRef.current?.scrollLeft ?? 0;
		const vScrollAmount = wrapperRef.current?.scrollTop ?? 0;
		setHScroll(hScrollAmount > 0);
		setVScroll(vScrollAmount > 0);
	}, []);

	// memo data based on any active filters and sorts
	const rows = useMemo(() => {
		const sortFunction = (a: T, b: T) => {
			if (!sortKey?.key) return 0;
			const { key, dir } = sortKey;
			if (a[key] === b[key]) return 0;
			const isGreater = a[key] > b[key];
			return (isGreater ? 1 : -1) * (dir === 'desc' ? -1 : 1);
		};
		const filtered = filter ? tableData.filter((row, index, array) => filter(row, index, array)) : tableData;
		return [...filtered].sort(sortFunction);
	}, [tableData, filter, sortKey]);

	// set and emit hover states
	const handleCellHover = useCallback(
		(col: ColumnDefinition<T>, colId: number, row: T, rowId: number, over: boolean) => {
			if (over) {
				setHoveredRow(rowId);
				if (onMouseOver) onMouseOver(col, colId, row, rowId);
			} else {
				setHoveredRow((prev) => {
					return prev === rowId ? null : prev;
				});
				if (onMouseOut) onMouseOut(col, colId, row, rowId);
			}
		},
		[onMouseOut, onMouseOver],
	);

	// emit click or dbl click
	const handleClick = useCallback(
		(col: ColumnDefinition<T>, colId: number, row: T, rowId: number, dbl?: boolean) => {
			if (dbl && onDoubleClick) onDoubleClick(col, colId, row, rowId);
			else if (onClick) onClick(col, colId, row, rowId);
		},
		[onDoubleClick, onClick],
	);

	// resolve bg to hover, cany stripe or default cell bg
	const resolveCellBG = useCallback(
		(rowId: number) => {
			const isHovered = backgroundColorHoverRow && hoveredRow === rowId;
			const isStripped = !!candyStripeBackgroundColor && rowId % 2 !== 0;
			if (isHovered) return backgroundColorHoverRow;
			if (isStripped) return candyStripeBackgroundColor;
			return backgroundColor;
		},
		[hoveredRow, backgroundColorHoverRow, candyStripeBackgroundColor, backgroundColor],
	);

	// update sort state
	const handleSort = useCallback(
		(key?: keyof T) => {
			if (!key) return;
			const next: SortKey<T> =
				sortKey?.key === key ? { key, dir: sortKey?.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' };
			let didChange = true;
			if (sortKey?.key === next?.key && sortKey?.dir === next?.dir) didChange = false;
			if (didChange) {
				setSortKey(next);
				onSortChange?.(next);
			}
		},
		[sortKey, onSortChange],
	);

	// resolve Aria sort
	const resolveAriaSort = useCallback(
		(column: ColumnDefinition<T>) => {
			const sortable = column.sort !== undefined;
			const isSortedColumn = sortable && sortKey?.key === column.sort;
			if (!sortable) return undefined;
			if (isSortedColumn) return sortKey?.dir === 'asc' ? 'ascending' : 'descending';
			return undefined;
		},
		[sortKey],
	);

	// render resize handle to trigger resizing if this is active
	const renderCellResizeHandle = useCallback(
		(last: boolean, col: ColumnDefinition<T>) => {
			if (last || !colResize) return null;
			return (
				<div
					className={styles.colResizeHandle}
					onMouseDown={(e) => dragResize(col.id, e, colRefs)}
					onMouseOver={(e) => hoverResize(true, e)}
					onFocus={(e) => hoverResize(true, e)}
					onMouseOut={(e) => hoverResize(false, e)}
					onBlur={(e) => hoverResize(false, e)}
				/>
			);
		},
		[colResize, dragResize, hoverResize],
	);

	// render header
	const renderHeader = useCallback((col: ColumnDefinition<T, unknown>, sortKey: SortKey<T>) => {
		if (col.renderHeader) {
			const renderFn = col.renderHeader as (ctx: HeaderContext<T, unknown>) => ReactNode;
			return renderFn({ column: col, sortKey });
		}
		return <DefaultHeaderRenderer<T> col={col} sortKey={sortKey} />;
	}, []);

	// render body cells. Same reasoning as renderHeader above for the cast.
	const renderBodyCell = useCallback((col: ColumnDefinition<T>, row: T, rowIndex: number) => {
		const value = resolveColumnValue(col, row);
		if (col.renderCell) {
			const renderFn = col.renderCell as (ctx: CellContext<T, unknown>) => ReactNode;
			return renderFn({ row, value, rowIndex });
		}
		return <DefaultCellRenderer<T> value={value} />;
	}, []);

	// update sort state on prop change
	useEffect(() => {
		setSortKey((prev) => {
			if (prev?.key === sort?.key && prev?.dir === sort?.dir) return prev;
			return sort;
		});
	}, [sort]);

	return (
		<div ref={wrapperRef} className={`${styles.tableWrapper} ${styles.scroll}`} style={cssVars} onScroll={handleScroll}>
			<table className={styles.table}>
				<caption>{caption}</caption>
				<colgroup>
					{orderedColumns.map((column: ColumnDefinition<T>) => {
						return (
							<col
								key={column.id}
								ref={(el) => handleCreateRefs(el, column.id)}
								style={{ width: setStyle(columnWidths[column.id] ?? column.width) }}
							/>
						);
					})}
				</colgroup>
				<thead>
					<tr>
						{orderedColumns.map((col: ColumnDefinition<T>, colIndex: number) => {
							const padding = setStyle(col.padding, 16);
							const sortable = col.sort !== undefined;
							const cursor = sortable ? 'pointer' : 'default';
							const last = colIndex === orderedColumns.length - 1;
							const opacity = draggedColId === col.id ? 0.2 : 1;
							return (
								<th
									key={col.id}
									data-column-id={col.id}
									className={`${styles.baseCell} ${styles.headerCell} ${styles.m}`}
									onClick={() => handleSort(col.sort)}
									onKeyDown={(e) => accessibleKeyDown(e, () => handleSort(col.sort))}
									style={{ cursor, opacity }}
									tabIndex={sortable ? 0 : undefined}
									role={sortable ? 'columnheader' : undefined}
									aria-sort={resolveAriaSort(col)}
									draggable={!(freezeColumn && colIndex === 0)}
									onDragStart={(e) => dragStart(col, e)}
									onDragOver={(e) => dragOver(col, colIndex, e)}
									onDrop={(e) => dragDrop(e)}
									/* dragend always fires, drop doesn't (e.g. released outside the browser
									 * window, or the drag was cancelled) - route both through dragDrop so the
									 * ghosted column and the global listeners always get cleaned up. Safe to
									 * fire after a real onDrop already ran: dragDrop is idempotent once its
									 * refs are cleared. */
									onDragEnd={(e) => dragDrop(e, true)}
								>
									{renderCellResizeHandle(last, col)}
									<div className={styles.headerCellWrapper} style={{ padding }}>
										{renderHeader(col, sortKey)}
									</div>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{rows.map((row, rowIndex: number) => {
						return (
							<tr key={getRowId ? getRowId(row, rowIndex) : rowIndex}>
								{orderedColumns.map((col: ColumnDefinition<T>, colIndex: number) => {
									const justifyContent = resolveAlignValue(col.justify);
									const alignItems = resolveAlignValue(col.align);
									const padding = setStyle(col.padding, 16);
									const whiteSpace = col.nowrap ? 'nowrap' : '';
									const background = resolveCellBG(rowIndex);
									const last = colIndex === orderedColumns.length - 1;
									const opacity = draggedColId === col.id ? 0.2 : 1;
									return (
										<td
											key={col.id}
											data-column-id={`${colIndex}.${rowIndex}`}
											className={`${styles.baseCell} ${styles.m}`}
											onClick={() => handleClick(col, colIndex, row, rowIndex, false)}
											onDoubleClick={() => handleClick(col, colIndex, row, rowIndex, true)}
											onKeyDown={(e) => accessibleKeyDown(e, () => handleClick(col, colIndex, row, rowIndex, false))}
											onMouseOver={() => handleCellHover(col, colIndex, row, rowIndex, true)}
											onFocus={() => handleCellHover(col, colIndex, row, rowIndex, true)}
											onMouseOut={() => handleCellHover(col, colIndex, row, rowIndex, false)}
											onBlur={() => handleCellHover(col, colIndex, row, rowIndex, false)}
											style={{ background, opacity }}
										>
											{renderCellResizeHandle(last, col)}
											<div
												className={styles.baseCellWrapper}
												style={{ justifyContent, alignItems, padding, whiteSpace }}
											>
												{renderBodyCell(col, row, rowIndex)}
											</div>
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
			<div className={styles.resizeBar} ref={resizeBarRef} />
		</div>
	);
}

interface DefaultHeaderRendererProps<T> {
	col: ColumnDefinition<T, unknown>;
	sortKey: SortKey<T>;
}
export function DefaultHeaderRenderer<T>(props: Readonly<DefaultHeaderRendererProps<T>>) {
	const { col, sortKey } = props;
	const sortable = !!col.sort;
	const sorted = !!(sortKey?.key && sortKey.key === col.sort);
	const sortIcon = sortKey?.dir === 'asc' ? 'arrow up' : 'arrow down';
	return (
		<div className={styles.header}>
			<div className={styles.headerLeft} />
			<div className={styles.headerTitle}>{col.title}</div>
			<div className={styles.headerRight}>
				{sortable && <Icon name={sorted ? sortIcon : 'blank'} pointerEvents={'none'} size={16} />}
			</div>
		</div>
	);
}

interface DefaultCellRendererProps<T> {
	value: unknown;
}
export function DefaultCellRenderer<T>(props: Readonly<DefaultCellRendererProps<T>>) {
	const { value } = props;
	return value?.toString() ?? '';
}
