import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { accessibleKeyDown, setStyle } from '../../utils/functions/misc';
import { Icon } from '../Icon';
import styles from './DataTable.module.css';
import type { ColumnDefinition, DataTableProps, SortKey } from './_types';
import { useDragColumn } from './_useDragColumn';
import type { DragColumnElement } from './_useDragColumn';
import { resolveAlignValue, resolveDragHandleXPos } from './columnHelper';

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
	} = props;
	const [hScroll, setHScroll] = useState<boolean>(false);
	const [vScroll, setVScroll] = useState<boolean>(false);
	const [hoveredRow, setHoveredRow] = useState<number | null>(null);
	const [sortKey, setSortKey] = useState<SortKey<T>>(sort);
	const [draggingCol, setDraggingCol] = useState<DragColumnElement | null>(null);
	const [columnWidths, setColumnWidths] = useState<Record<string, number | string>>({});
	const wrapperRef = React.useRef<HTMLDivElement>(null);
	const resizeBarRef = React.useRef<HTMLDivElement>(null);
	const colRefs = React.useRef<Record<string, HTMLTableColElement | null>>({});

	// handler for when resize ends
	const handleResizeEnd = useCallback(
		(id: string, width: number) => {
			setColumnWidths((prev) => ({ ...prev, [id]: width }));
			setDraggingCol(null); /* clean up listeners */
			onColumnResize?.(id, width);
		},
		[onColumnResize],
	);

	// dragging logic
	useDragColumn(draggingCol, handleResizeEnd);

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
	]);

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

	// render header with custom renderer or default renderer
	const renderHeader = useCallback((col: ColumnDefinition<T, unknown>, sortKey: SortKey<T>) => {
		if (col.renderHeader) return col.renderHeader({ column: col, sortKey });
		return <DefaultHeaderRenderer col={col} sortKey={sortKey} />;
	}, []);

	// resolve area sort
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

	// trigger drag start
	const handleStartDrag = useCallback(
		(id: string, e: React.MouseEvent<HTMLDivElement>) => {
			if (!colResize) return;
			const cell = e.currentTarget.parentElement as HTMLElement | null;
			const col = colRefs.current[id];
			const handle = resizeBarRef.current;
			const parent = wrapperRef.current;
			if (cell && col && parent) setDraggingCol({ id, cell, col, handle, parent });
		},
		[colResize],
	);

	const handleHoverDragHandle = useCallback(
		(show: boolean, e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {
			if (!colResize || draggingCol) return;
			const cell = e.currentTarget.parentElement as HTMLElement | null;
			const handle = resizeBarRef.current;
			const parent = wrapperRef.current;
			if (!show && handle) handle.style.left = '-500px';
			else resolveDragHandleXPos({ cell, handle, parent });
		},
		[draggingCol, colResize],
	);

	// handler create col refs for each col in the colgroup
	const handleCreateRefs = useCallback((el: HTMLTableColElement | null, id: string) => {
		colRefs.current[id] = el;
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
			<div className={styles.resizeBar} ref={resizeBarRef} />
			<table className={styles.table}>
				<caption>{caption}</caption>
				<colgroup>
					{columnDefinitions.map((column: ColumnDefinition<T>) => {
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
						{columnDefinitions.map((column: ColumnDefinition<T>) => {
							const padding = setStyle(column.padding, 16);
							const sortable = column.sort !== undefined;
							const cursor = sortable ? 'pointer' : 'default';
							return (
								<th
									key={column.id}
									data-column-id={column.id}
									className={`${styles.baseCell} ${styles.headerCell} ${styles.m}`}
									onClick={() => handleSort(column.sort)}
									onKeyDown={(e) => accessibleKeyDown(e, () => handleSort(column.sort))}
									style={{ cursor }}
									tabIndex={sortable ? 0 : undefined}
									role={sortable ? 'columnheader' : undefined}
									aria-sort={resolveAriaSort(column)}
								>
									<div className={styles.headerCellWrapper} style={{ padding }}>
										{renderHeader(column, sortKey)}
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
								{columnDefinitions.map((col: ColumnDefinition<T>, colIndex: number) => {
									const value = col.accessor(row);
									const justifyContent = resolveAlignValue(col.justify);
									const alignItems = resolveAlignValue(col.align);
									const padding = setStyle(col.padding, 16);
									const whiteSpace = col.nowrap ? 'nowrap' : '';
									const background = resolveCellBG(rowIndex);
									const notLast = colIndex !== columnDefinitions.length - 1;
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
											style={{ background }}
										>
											{notLast && colResize && (
												<div
													className={styles.colResizeHandle}
													onMouseDown={(e) => handleStartDrag(col.id, e)}
													onMouseOver={(e) => handleHoverDragHandle(true, e)}
													onFocus={(e) => handleHoverDragHandle(true, e)}
													onMouseOut={(e) => handleHoverDragHandle(false, e)}
													onBlur={(e) => handleHoverDragHandle(false, e)}
												/>
											)}
											<div
												className={styles.baseCellWrapper}
												style={{
													justifyContent,
													alignItems,
													padding,
													whiteSpace,
												}}
											>
												{col.renderCell ? col.renderCell({ row, value, rowIndex }) : (value?.toString() ?? '')}
											</div>
										</td>
									);
								})}
							</tr>
						);
					})}
				</tbody>
			</table>
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
	const justifyContent = sortable ? 'space-between' : resolveAlignValue(col.justify);
	return (
		<div style={{ display: 'flex', alignItems: 'center', justifyContent, width: '100%' }}>
			<span style={{ fontWeight: 540 }}>{col.title}</span>
			{sortable && <Icon name={sorted ? sortIcon : 'blank'} size={16} />}
		</div>
	);
}
