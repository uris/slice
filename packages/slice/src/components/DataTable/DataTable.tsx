'use client';

import React, { useCallback, useState, useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useObserveResize } from '../../hooks';
import { corners } from '../../theme/corners/corners';
import { accessibleKeyDown, setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { Icon } from '../Icon';
import styles from './DataTable.module.css';
import { resolveVirtualizeRows } from './_resolveVirtualizeRows';
import type { CellContext, ColumnDefinition, DataTableProps, HeaderContext, SortKey } from './_types';
import { useReorderColumns } from './_useReorderColumns';
import { useResizeColumn } from './_useResizeColumn';
import { useRowWindow } from './_useRowWindow';
import { resolveAlignValue, resolveColumnDefinition, resolveColumnSortKey, resolveColumnValue } from './columnHelper';
import { compareValues } from './compareValues';

export function DataTable<T>(rawProps: Readonly<DataTableProps<T>>) {
	const props = resolveColorProps(rawProps);
	const {
		backgroundColor = 'var(--core-surface-primary)',
		headerBackgroundColor = 'var(--core-surface-secondary)',
		headerBackgroundColorHover = 'var(--core-surface-primary-tint)',
		candyStripeBackgroundColor = 'var(--core-surface-primary-tint)',
		backgroundColorHoverRow = 'var(--core-surface-primary-tint)',
		handleHoverColor = 'var(--core-button-primary)',
		freezeColumn = false,
		headerSticky = true,
		height = 'auto',
		width = '100%',
		maxWidth,
		colResize = true,
		colReorder = true,
		columnOrder: controlledColumnOrder,
		columnWidths: controlledColumnWidths,
		defaultSort,
		onRowClick,
		freezeColumnBackgroundColor,
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
		borderRadius = corners['corner-m'],
		virtualizeRows,
		virtualizeRowThreshold = 500,
		rowHeight = 44,
		overscanRows,
		margin,
	} = props;
	const [hScroll, setHScroll] = useState<boolean>(false);
	const [vScroll, setVScroll] = useState<boolean>(false);
	const [internalSort, setInternalSort] = useState<SortKey<T>>(defaultSort);
	const sortControlled = Object.hasOwn(rawProps, 'sort');
	const sortKey = sortControlled ? sort : internalSort;
	const [internalColumnWidths, setInternalColumnWidths] = useState<Record<string, number | string>>({});
	const [internalColumnOrder, setInternalColumnOrder] = useState<string[] | null>(null);
	const columnOrder = controlledColumnOrder ?? internalColumnOrder;
	const columnWidths = controlledColumnWidths ?? internalColumnWidths;
	const setColumnWidths = useCallback(
		(next: React.SetStateAction<Record<string, number | string>>) => {
			if (controlledColumnWidths === undefined) setInternalColumnWidths(next);
		},
		[controlledColumnWidths],
	);
	const setColumnOrder = useCallback(
		(next: React.SetStateAction<string[] | null>) => {
			if (controlledColumnOrder === undefined) setInternalColumnOrder(next);
		},
		[controlledColumnOrder],
	);
	const [draggedColId, setDraggedColId] = useState<string | null>(null);
	const wrapperRef = React.useRef<HTMLDivElement>(null);
	const headerRef = React.useRef<HTMLTableSectionElement>(null);
	const headerSize = useObserveResize(headerRef, { ignore: 'width' });
	const resizeBarRef = React.useRef<HTMLDivElement>(null);
	const colRefs = React.useRef<Record<string, HTMLTableColElement | null>>({});
	// stable identity across renders (resizeBarRef/wrapperRef never change) - an inline
	// object literal here would give useResizeColumn's callbacks a new `elements`
	// reference on every render, cascading into new applyHandlePos/handleMouseMove/
	// handleMouseUp identities and causing the hook's document-level drag listeners to be
	// torn down and re-attached (with mismatched closures failing to actually remove the
	// old ones) on every re-render while a drag is in progress, not just when it starts.
	const elements = useMemo(() => ({ handle: resizeBarRef, parent: wrapperRef }), []);

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
			'--table-max-width': setStyle(maxWidth),
			'--table-height': setStyle(height),
			'--table-margin': setStyle(margin, 0),
			'--table-background-color': backgroundColor,
			'--table-hover-background': backgroundColorHoverRow,
			'--table-row-height': `${rowHeight}px`,
			'--table-column-box-shadow': columnBoxShadow,
			'--table-header-box-shadow': headerBoxShadow,
			'--table-corner-box-shadow': cornerBoxShadow,
			'--table-header-background-color': headerBackgroundColor,
			'--table-header-background-color-hover': headerBackgroundColorHover,
			'--table-candy-stripe-background-color': candyStripeBackgroundColor,
			'--table-freeze-column-position': freezeColumn ? 'sticky' : 'relative',
			'--table-header-sticky-position': headerSticky ? 'sticky' : 'relative',
			'--table-border-color': borderColor,
			'--table-corner-position': freezeColumn || headerSticky ? 'sticky' : 'relative',
			'--table-corner-left': freezeColumn ? '0px' : 'unset',
			'--table-corner-top': headerSticky ? '0px' : 'auto',
			'--table-border-width': borderStyle === 'none' ? '0' : '1px',
			'--table-border-sides': borderStyle === 'box' ? '1px' : '0',
			'--table-handle-hover-color': handleHoverColor,
			'--table-border-radius': borderStyle === 'box' ? setStyle(borderRadius) : corners['corner-none'],
		} as React.CSSProperties;
	}, [
		backgroundColor,
		backgroundColorHoverRow,
		rowHeight,
		headerBackgroundColor,
		headerBackgroundColorHover,
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
		maxWidth,
		margin,
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
	const finishResize = useCallback(
		(id: string, width: number) => {
			const element = colRefs.current[id];
			if (controlledColumnWidths !== undefined && element) {
				const column = orderedColumns.find((column) => column.id === id);
				element.style.width = setStyle(controlledColumnWidths[id] ?? column?.width);
			}
			onColumnResize?.(id, width);
		},
		[controlledColumnWidths, orderedColumns, onColumnResize],
	);
	const { dragResize, hoverResize } = useResizeColumn(elements, colResize, setColumnWidths, finishResize);

	// reorder column logic and handlers
	const { dragStart, dragOver, dragDrop } = useReorderColumns<T>(
		orderedColumns,
		setColumnOrder,
		setDraggedColId,
		onColumnReorder,
		freezeColumn,
	);

	// memo data based on any active filters and sorts
	const rows = useMemo(() => {
		const sortFunction = (a: T, b: T) => {
			if (sortKey?.key === undefined) return 0;
			const compare = orderedColumns.find((column) => resolveColumnSortKey(column) === sortKey.key)?.compare;
			if (compare) return compare(a, b) * (sortKey.dir === 'desc' ? -1 : 1);
			const { key, dir } = sortKey;
			return compareValues(a[key], b[key], dir);
		};
		const filtered = filter ? tableData.filter((row, index, array) => filter(row, index, array)) : tableData;
		return sortKey?.key === undefined ? filtered : [...filtered].sort(sortFunction);
	}, [tableData, filter, sortKey, orderedColumns]);

	// virtualizeRows left unset auto-enables once rows.length passes virtualizeRowThreshold - an
	// explicit true/false always overrides that regardless of row count
	const requestedVirtualization = resolveVirtualizeRows(virtualizeRows, rows.length, virtualizeRowThreshold);
	const shouldVirtualize = requestedVirtualization && height !== 'auto';

	// compute which rows should actually mount, given shouldVirtualize/rowHeight/overscanRows
	const rowWindow = useRowWindow(wrapperRef, rows.length, {
		enabled: shouldVirtualize,
		rowHeight,
		headerHeight: headerSize.height,
		overscan: overscanRows,
	});

	// dev-time guardrails - both are silent no-ops in production builds
	useEffect(() => {
		if (process.env.NODE_ENV === 'production') return;
		if (requestedVirtualization && height === 'auto') {
			console.warn(
				'[DataTable] `virtualizeRows` needs a bounded `height` (e.g. a fixed px or vh value) to create a ' +
					'scrollable viewport smaller than the full row count - with height="auto" the wrapper grows to fit every row ' +
					"and there's nothing to trim.",
			);
		}
		if (shouldVirtualize && !getRowId) {
			console.warn(
				'[DataTable] `virtualizeRows` is on without `getRowId`. Rows fall back to index-based keys, which ' +
					'can misattach hover/focus state to the wrong row as the window scrolls - pass `getRowId` for stable identity.',
			);
		}
	}, [shouldVirtualize, requestedVirtualization, height, getRowId]);

	// scrolling state is used to set drop shadow and border styles for sticky cells, and (when
	// virtualizeRows is on) to recompute which rows should be mounted
	const handleScroll = useCallback(() => {
		const hScrollAmount = wrapperRef.current?.scrollLeft ?? 0;
		const vScrollAmount = wrapperRef.current?.scrollTop ?? 0;
		setHScroll(hScrollAmount > 0);
		setVScroll(vScrollAmount > 0);
		rowWindow.handleScroll(vScrollAmount);
	}, [rowWindow.handleScroll]);

	// emit click or dbl click
	const handleClick = useCallback(
		(col: ColumnDefinition<T>, colId: number, row: T, rowId: number, dbl?: boolean) => {
			if (dbl && onDoubleClick) onDoubleClick(col, colId, row, rowId);
			else if (!dbl && onClick) onClick(col, colId, row, rowId);
		},
		[onDoubleClick, onClick],
	);

	// update sort state
	const handleSort = useCallback(
		(key?: keyof T) => {
			if (key === undefined) return;
			const next: SortKey<T> =
				sortKey?.key === key ? { key, dir: sortKey?.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' };
			let didChange = true;
			if (sortKey?.key === next?.key && sortKey?.dir === next?.dir) didChange = false;
			if (didChange) {
				if (!sortControlled) setInternalSort(next);
				onSortChange?.(next);
			}
		},
		[sortKey, onSortChange, sortControlled],
	);

	// resolve Aria sort
	const resolveAriaSort = useCallback(
		(column: ColumnDefinition<T>) => {
			const field = resolveColumnSortKey(column);
			const sortable = field !== undefined;
			const isSortedColumn = sortable && sortKey?.key === field;
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
					role="separator"
					aria-label={`Resize ${col.title}`}
					aria-orientation="vertical"
					aria-valuenow={
						typeof (columnWidths[col.id] ?? col.width) === 'number' ? Number(columnWidths[col.id] ?? col.width) : 40
					}
					aria-valuemin={40}
					tabIndex={0}
					onClick={(event) => event.stopPropagation()}
					onKeyDown={(event) => {
						if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
						event.preventDefault();
						event.stopPropagation();
						const element = colRefs.current[col.id];
						if (!element) return;
						const current = element.getBoundingClientRect().width;
						const width = Math.max(40, current + (event.key === 'ArrowRight' ? 10 : -10));
						setColumnWidths((previous) => ({ ...previous, [col.id]: width }));
						onColumnResize?.(col.id, width);
					}}
					onTouchStart={(e) => dragResize(col.id, e, colRefs)}
					onMouseDown={(e) => dragResize(col.id, e, colRefs)}
					onMouseOver={(e) => hoverResize(true, e)}
					onFocus={(e) => hoverResize(true, e)}
					onMouseOut={(e) => hoverResize(false, e)}
					onBlur={(e) => hoverResize(false, e)}
				/>
			);
		},
		[colResize, dragResize, hoverResize, columnWidths, setColumnWidths, onColumnResize],
	);

	// render header
	const renderHeader = useCallback((col: ColumnDefinition<T, unknown>, sortKey: SortKey<T>) => {
		if (col.renderHeader) {
			const renderFn = col.renderHeader as (ctx: HeaderContext<T, unknown>) => ReactNode;
			const column = resolveColumnDefinition(col);
			const sorted = column.sort !== undefined && sortKey?.key === column.sort;
			let ascending: boolean | undefined;
			if (sorted) ascending = sortKey?.dir === 'asc';
			return renderFn({ column, sortKey, sorted, ascending });
		}
		return <DefaultHeaderRenderer<T> col={resolveColumnDefinition(col)} sortKey={sortKey} />;
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

	return (
		<div ref={wrapperRef} className={`${styles.tableWrapper} ${styles.scroll}`} style={cssVars} onScroll={handleScroll}>
			<table className={styles.table} aria-rowcount={rowWindow.enabled ? rows.length + 1 : undefined}>
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
				<thead ref={headerRef}>
					<tr>
						{orderedColumns.map((col: ColumnDefinition<T>, colIndex: number) => {
							const padding = setStyle(col.padding, 'var(--spacing-m)');
							const sortable = resolveColumnSortKey(col) !== undefined;
							const cursor = sortable ? 'pointer' : 'default';
							const last = colIndex === orderedColumns.length - 1;
							const background = draggedColId === col.id ? backgroundColor : headerBackgroundColor;
							return (
								<th
									key={col.id}
									data-column-id={col.id}
									aria-label={col.title}
									className={`${styles.baseCell} ${styles.headerCell} ${styles.m}`}
									onClick={(event) => {
										if (!isInteractiveTarget(event.target, event.currentTarget)) handleSort(resolveColumnSortKey(col));
									}}
									onKeyDown={(event) => {
										if (event.target !== event.currentTarget) return;
										if (colReorder && event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
											event.preventDefault();
											const next = orderedColumns.map((column) => column.id);
											const target = colIndex + (event.key === 'ArrowRight' ? 1 : -1);
											if (target < 0 || target >= next.length || (freezeColumn && (colIndex === 0 || target === 0)))
												return;
											[next[colIndex], next[target]] = [next[target], next[colIndex]];
											setColumnOrder(next);
											onColumnReorder?.(next);
											return;
										}
										accessibleKeyDown(event, () => handleSort(resolveColumnSortKey(col)));
									}}
									style={{ cursor, '--table-header-cell-background': background } as React.CSSProperties}
									tabIndex={sortable || colReorder ? 0 : undefined}
									role={sortable ? 'columnheader' : undefined}
									aria-sort={resolveAriaSort(col)}
									draggable={colReorder && !(freezeColumn && colIndex === 0)}
									onDragStart={(e) => {
										if (colReorder) dragStart(col, e);
									}}
									onDragOver={(e) => {
										if (colReorder) dragOver(col, colIndex, e);
									}}
									onDrop={(e) => dragDrop(e)}
									onDragEnd={(e) => dragDrop(e, true)}
								>
									{renderCellResizeHandle(last, col)}
									<div
										className={styles.headerCellWrapper}
										style={{ padding, justifyContent: resolveAlignValue(col.justifyHeader ?? col.justify ?? 'start') }}
									>
										{renderHeader(col, sortKey)}
									</div>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{rowWindow.enabled && rowWindow.topSpacerHeight > 0 && (
						/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: Spacer rows have no focusable content or tabIndex. */
						<tr aria-hidden="true" data-spacer="true">
							<td
								role="presentation"
								colSpan={Math.max(1, orderedColumns.length)}
								style={{ height: rowWindow.topSpacerHeight, padding: 0, border: 0, background: backgroundColor }}
							/>
						</tr>
					)}
					{(rowWindow.enabled ? rows.slice(rowWindow.startIndex, rowWindow.endIndex) : rows).map(
						(row, localIndex: number) => {
							const rowIndex = rowWindow.enabled ? rowWindow.startIndex + localIndex : localIndex;
							const isLastRow = rowIndex === rows.length - 1;
							return (
								<tr
									key={getRowId ? getRowId(row, rowIndex) : rowIndex}
									aria-rowindex={rowWindow.enabled ? rowIndex + 2 : undefined}
									tabIndex={onRowClick ? 0 : undefined}
									onClick={(event) => {
										if (!isInteractiveTarget(event.target, event.currentTarget)) onRowClick?.(row, rowIndex);
									}}
									onKeyDown={(event) => {
										if (event.target !== event.currentTarget || !onRowClick) return;
										accessibleKeyDown(event, () => onRowClick(row, rowIndex));
									}}
								>
									{orderedColumns.map((col: ColumnDefinition<T>, colIndex: number) => {
										const justifyContent = resolveAlignValue(col.justify ?? 'start');
										const alignItems = resolveAlignValue(col.align);
										const padding = setStyle(col.padding, 'var(--spacing-m)');
										const whiteSpace = col.nowrap ? 'nowrap' : '';
										const background =
											candyStripeBackgroundColor && rowIndex % 2 !== 0 ? candyStripeBackgroundColor : backgroundColor;
										const opacity = draggedColId === col.id ? 0.2 : 1;
										// once a bottom spacer row exists, the true last row is no longer the DOM's
										// `:last-child`, so the CSS rule dropping its bottom border no longer matches it -
										// reproduce that explicitly here instead
										const borderBottom =
											rowWindow.enabled && isLastRow && rowWindow.bottomSpacerHeight > 0 ? 0 : undefined;
										return (
											<td
												key={col.id}
												data-column-id={`${colIndex}.${rowIndex}`}
												className={`${styles.baseCell} ${styles.m}${rowWindow.enabled ? ` ${styles.fixedCell}` : ''}`}
												onClick={(event) => {
													if (!isInteractiveTarget(event.target, event.currentTarget))
														handleClick(col, colIndex, row, rowIndex, false);
												}}
												onDoubleClick={(event) => {
													if (!isInteractiveTarget(event.target, event.currentTarget))
														handleClick(col, colIndex, row, rowIndex, true);
												}}
												tabIndex={onClick && !onRowClick ? 0 : undefined}
												onKeyDown={(e) => {
													if (e.target === e.currentTarget && onClick) {
														e.stopPropagation();
														accessibleKeyDown(e, () => handleClick(col, colIndex, row, rowIndex, false));
													}
												}}
												onMouseEnter={() => onMouseOver?.(col, colIndex, row, rowIndex)}
												onFocus={() => onMouseOver?.(col, colIndex, row, rowIndex)}
												onMouseLeave={() => onMouseOut?.(col, colIndex, row, rowIndex)}
												onBlur={() => onMouseOut?.(col, colIndex, row, rowIndex)}
												style={
													{
														'--table-cell-background':
															freezeColumn && colIndex === 0 ? (freezeColumnBackgroundColor ?? background) : background,
														opacity,
														borderBottom,
													} as React.CSSProperties
												}
											>
												<div className={styles.cellViewport}>
													<div
														className={styles.baseCellWrapper}
														style={{ justifyContent, alignItems, padding, whiteSpace }}
													>
														{renderBodyCell(col, row, rowIndex)}
													</div>
												</div>
											</td>
										);
									})}
								</tr>
							);
						},
					)}
					{rowWindow.enabled && rowWindow.bottomSpacerHeight > 0 && (
						/* biome-ignore lint/a11y/noAriaHiddenOnFocusable: Spacer rows have no focusable content or tabIndex. */
						<tr aria-hidden="true" data-spacer="true">
							<td
								role="presentation"
								colSpan={Math.max(1, orderedColumns.length)}
								style={{ height: rowWindow.bottomSpacerHeight, padding: 0, border: 0, background: backgroundColor }}
							/>
						</tr>
					)}
				</tbody>
			</table>
			<div className={styles.resizeBar} ref={resizeBarRef} />
		</div>
	);
}

interface DefaultHeaderRendererProps<T> {
	col: HeaderContext<T, unknown>['column'];
	sortKey: SortKey<T>;
}
export function DefaultHeaderRenderer<T>(props: Readonly<DefaultHeaderRendererProps<T>>) {
	const { col, sortKey } = props;
	const sortable = col.sort !== undefined;
	const sorted = sortKey?.key !== undefined && sortKey.key === col.sort;
	const sortIcon = sortKey?.dir === 'asc' ? 'arrows.arrow-top' : 'arrows.arrow-bottom';
	const justify = col.justifyHeader ?? col.justify ?? 'start';
	const showSortIcon = sortable && (col.showSortIcon ?? true);
	const indicator = showSortIcon ? (
		<Icon name={sorted ? sortIcon : 'system.blank'} pointerEvents={'none'} size={16} />
	) : null;
	return (
		<div className={styles.header} style={{ justifyContent: resolveAlignValue(justify) }}>
			{justify === 'end' && indicator}
			<div className={styles.headerTitle} style={{ flex: '0 1 auto' }}>
				{col.title}
			</div>
			{justify !== 'end' && indicator}
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

function isInteractiveTarget(target: EventTarget, row: HTMLElement) {
	return (
		target instanceof Element &&
		Boolean(
			target.closest(
				'button, a, input, select, textarea, summary, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="checkbox"], [role="switch"], [role="link"], [role="slider"], [role="combobox"], [role="textbox"], [role="radio"]',
			),
		) &&
		target !== row
	);
}
