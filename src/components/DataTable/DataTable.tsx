import React, { useCallback, useState, useMemo } from 'react';
import { accessibleKeyDown, setStyle } from '../../utils/functions/misc';
import styles from './DataTable.module.css';
import type { ColumnDefinition, DataTableProps } from './_types';
import { resolveAlignValue } from './columnHelper';

export function DataTable<T>(props: Readonly<DataTableProps<T>>) {
	const {
		backgroundColor = 'var(--core-surface-primary)',
		headerBackgroundColor = 'var(--core-surface-secondary)',
		candyStripeBackgroundColor = 'var(--core-surface-primary-tint)',
		backgroundColorHoverRow = 'var(--core-surface-primary-tint)',
		freezeColumn = false,
		headerSticky = true,
		height = 'auto',
		width = '100%',
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
	} = props;
	const [hScroll, setHScroll] = useState<boolean>(false);
	const [vScroll, setVScroll] = useState<boolean>(false);
	const [hoveredRow, setHoveredRow] = useState<number | null>(null);
	const wrapperRef = React.useRef<HTMLDivElement>(null);

	// resolve corner shadow
	const cornerBoxShadow = useCallback(() => {
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
	]);

	// scrolling state is used to set drop shadow and border styles for sticky cells
	const handleScroll = useCallback(() => {
		const hScrollAmount = wrapperRef.current?.scrollLeft ?? 0;
		const vScrollAmount = wrapperRef.current?.scrollTop ?? 0;
		setHScroll(hScrollAmount > 0);
		setVScroll(vScrollAmount > 0);
	}, []);

	// memo data based on any active filters
	const rows = useMemo(
		() => (filter ? tableData.filter((row, index, array) => filter(row, index, array)) : tableData),
		[tableData, filter],
	);

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

	return (
		<div ref={wrapperRef} className={`${styles.tableWrapper} ${styles.scroll}`} style={cssVars} onScroll={handleScroll}>
			<table className={styles.table}>
				<caption>{caption}</caption>
				<thead>
					<tr>
						{columnDefinitions.map((column: ColumnDefinition<T>) => {
							const padding = setStyle(column.padding, 16);
							return (
								<th
									key={column.id}
									data-column-id={column.id}
									className={`${styles.baseCell} ${styles.headerCell} ${styles.m}`}
								>
									<div className={styles.headerCellWrapper} style={{ padding }}>
										{column.renderHeader ? column.renderHeader({ column }) : column.title}
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
									return (
										<td
											key={col.id}
											data-column-id={`${col.id}.${rowIndex}`}
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
