import React, { useCallback, useState, useMemo } from 'react';
import { setStyle } from '../../utils/functions/misc';
import styles from './DataTable.module.css';
import type { ColumnDefinition, DataTableProps } from './_types';
import { resolveAlignValue } from './columnHelper';

export function DataTable<T>(props: Readonly<DataTableProps<T>>) {
	const {
		backgroundColor = 'var(--core-surface-primary)',
		headerBackgroundColor = 'var(--core-surface-secondary)',
		candyStripeBackgroundColor = 'var(--core-surface-primary-tint)',
		freezeColumn = false,
		headerSticky = true,
		height = 'auto',
		width = '100%',
		borderColor = 'var(--core-outline-primary)',
		columnDefinitions = [],
		tableData = [],
		getRowId,
	} = props;
	const [hScroll, setHScroll] = useState<boolean>(false);
	const [vScroll, setVScroll] = useState<boolean>(false);
	const wrapperRef = React.useRef<HTMLDivElement>(null);

	// set box shadows for sticky header cells and freeze column cells
	const cornerBoxShadow = useCallback(
		(cell: 'header' | 'column' | 'corner') => {
			const shadows: string[] = [];
			if (cell === 'corner') {
				if (hScroll && freezeColumn) {
					shadows.push(
						'1px 0 0 var(--core-outline-primary)',
						'5px 0 0 rgba(0,0,0,0.1)',
					);
				}
				if (vScroll && headerSticky) {
					shadows.push('0 1px 0 var(--core-outline-primary)');
				}
				if (vScroll && headerSticky && !hScroll) {
					shadows.push('0 5px 0 rgba(0,0,0,0.1)');
				}
			} else if (cell === 'header') {
				if (vScroll && headerSticky) {
					shadows.push(
						'0 1px 0 var(--core-outline-primary)',
						'0 5px 0 rgba(0,0,0,0.1)',
					);
				}
			} else if (cell === 'column') {
				if (hScroll && freezeColumn) {
					shadows.push(
						'1px 0 0 var(--core-outline-primary)',
						'5px 0 0 rgba(0,0,0,0.1)',
					);
				}
			}
			return shadows.length > 0 ? shadows.join(',') : 'none';
		},
		[hScroll, vScroll, freezeColumn, headerSticky],
	);

	const cssVars = useMemo(() => {
		return {
			'--table-width': setStyle(width),
			'--table-height': setStyle(height),
			'--table-background-color': backgroundColor,
			'--table-column-box-shadow': cornerBoxShadow('column'),
			'--table-header-box-shadow': cornerBoxShadow('header'),
			'--table-corner-box-shadow': cornerBoxShadow('corner'),
			'--table-header-background-color': headerBackgroundColor,
			'--table-candy-stripe-background-color': candyStripeBackgroundColor,
			'--table-freeze-column-position': freezeColumn ? 'sticky' : 'relative',
			'--table-header-sticky-poition': headerSticky ? 'sticky' : 'relative',
			'--table-border-color': borderColor,
			'--table-corner-position':
				freezeColumn || headerSticky ? 'sticky' : 'relative',
			'--table-corner-left': freezeColumn ? '0px' : 'unset',
		} as React.CSSProperties;
	}, [
		backgroundColor,
		headerBackgroundColor,
		candyStripeBackgroundColor,
		cornerBoxShadow,
		freezeColumn,
		headerSticky,
		width,
		height,
		borderColor,
	]);

	const handleScroll = useCallback(() => {
		const hScrollAmount = wrapperRef.current?.scrollLeft ?? 0;
		const vScrollAmount = wrapperRef.current?.scrollTop ?? 0;
		setHScroll(hScrollAmount > 0);
		setVScroll(vScrollAmount > 0);
	}, []);

	return (
		<div
			ref={wrapperRef}
			className={`${styles.tableWrapper} ${styles.scroll}`}
			style={cssVars}
			onScroll={handleScroll}
		>
			<table className={styles.table}>
				<caption>Table Caption</caption>
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
									<div className={styles.headerCellWrapper} style={{padding}}>
										{column.renderHeader
											? column.renderHeader({ column })
											: column.title}
									</div>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody>
					{tableData.map((row, rowIndex: number) => (
						<tr key={getRowId ? getRowId(row, rowIndex) : rowIndex}>
							{columnDefinitions.map((column: ColumnDefinition<T>) => {
								const value = column.accessor(row);
								const justifyContent = resolveAlignValue(column.justify);
								const alignItems = resolveAlignValue(column.align);
								const padding = setStyle(column.padding, 16);
								const whiteSpace = column.nowrap ? 'nowrap' : '';
								return (
									<td
										key={column.id}
										data-column-id={`${column.id}.${rowIndex}`}
										className={`${styles.baseCell} ${styles.m}`}
									>
										<div
											className={styles.baseCellWrapper}
											style={{ justifyContent, alignItems, padding, whiteSpace }}
										>
											{column.renderCell
												? column.renderCell({ row, value, rowIndex })
												: String(value ?? '')}
										</div>
									</td>
								);
							})}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
