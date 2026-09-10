'use client';

import React, { useCallback, useMemo } from 'react';
import { fileIconName, nameAndExtension } from '../../utils/functions/files';
import { accessibleKeyDown, setStyle } from '../../utils/functions/misc';
import { FileIcon } from '../FileIcon';
import { Icon } from '../Icon';
import { ProgressIndicator } from '../Progress';
import type { ToolTip } from '../sharedTypes';
import css from './FileList.module.css';
import type { FileItem, FileListProps } from './_types';

/**
 * utility get file name from file item
 */
function fileNameFromItem(item: FileItem): string {
	return typeof item.file === 'string' ? item.file : item.file.name;
}

/**
 * cal progress as a percentage string
 */
function normalizeProgress(uploading?: boolean, progress?: number): string {
	if (progress === undefined || Number.isNaN(progress)) {
		return uploading ? '0%' : '100%';
	}
	const percent = progress <= 1 ? progress * 100 : progress;
	const clamped = Math.max(0, Math.min(100, percent));
	return `${Math.round(clamped)}%`;
}

/**
 * display the progress indicator if uploading
 */
function displayProgress(uploading: boolean | undefined): React.CSSProperties {
	if (!uploading) return { display: 'none' };
	return { display: 'flex' };
}

/**
 * display the remove button if not uploading
 */
function displayClose(uploading: boolean | undefined): React.CSSProperties {
	if (!uploading) return { display: 'flex' };
	return { display: 'none' };
}

export const FileList = React.memo((props: FileListProps) => {
	const {
		files = [],
		onChange,
		onToolTip,
		maxWidth,
		minWidth,
		direction = 'row',
		padding,
		gap = 10,
		size = 's',
		iconSize = 24,
		backgroundColor,
		bgColor,
		canRemove = true,
		...divAttributes
	} = props;

	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const resolvedBackgroundColor = backgroundColor ?? bgColor;

	// derive display metadata from the raw file name
	const fileNameToFileItem = useCallback((fileName: string) => {
		const { ext, name } = nameAndExtension(fileName);
		const icon = fileIconName(ext);
		return { name, ext, icon };
	}, []);

	// derive the rendered file metadata list from the incoming files
	const displayList = useMemo(() => {
		return files.map((item, index) => {
			const fileName = fileNameFromItem(item);
			const fileMeta = fileNameToFileItem(fileName);
			const progress = normalizeProgress(item.uploading, item.progress);
			return {
				...fileMeta,
				key: `${fileMeta.name}-${index}`,
				index,
				uploading: item.uploading ?? false,
				progress,
				error: item.error,
			};
		});
	}, [files, fileNameToFileItem]);

	// remove a file from the list and notify the consumer
	const handleRemove = useCallback(
		(index: number) => {
			const updated = files.filter((_, itemIndex) => itemIndex !== index);
			onChange?.(updated);
		},
		[files, onChange],
	);

	// show the remove action tooltip on hover or focus
	const handleMouseOver = useCallback(
		(e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => {
			const toolTip: ToolTip = {
				payload: { label: 'Remove file' },
				ref: { current: e.currentTarget },
			};
			onToolTip?.(toolTip);
		},
		[onToolTip],
	);

	// clear the remove action tooltip
	const handleMouseOut = useCallback(() => {
		onToolTip?.(null);
	}, [onToolTip]);

	// compose CSS custom properties for layout, spacing, and colors
	const cssVars = useMemo(() => {
		return {
			'--file-max-width': direction === 'column' ? '100%' : setStyle(maxWidth),
			'--file-min-width': direction === 'column' && !minWidth ? '100%' : setStyle(minWidth),
			'--file-gap': setStyle(gap),
			'--file-direction': direction,
			'--file-wrap': direction === 'column' ? 'nowrap' : 'wrap',
			'--file-padding': padding ? setStyle(padding) : '4px 4px 4px 2px',
			'--file-icon-size': setStyle(iconSize),
			'--file-overflow': direction === 'column' ? 'unset' : 'hidden',
			'--file-bg-color': resolvedBackgroundColor ?? 'var(--core-surface-secondary)',
		} as React.CSSProperties;
	}, [maxWidth, gap, direction, minWidth, padding, iconSize, resolvedBackgroundColor]);

	// compose per-file CSS custom properties for progress and error state
	const fileCSSVars = useCallback((progress: string, error?: string) => {
		return {
			'--file-progress': `${progress}`,
			'--file-border-color': error ? 'var(--feedback-warning)' : 'var(--core-outline-primary)',
		} as React.CSSProperties;
	}, []);

	return (
		<div className={`${css.wrapper}${divClass}`} style={{ ...divStyle, ...cssVars }} id={divId} {...rest}>
			{displayList.map((i) => (
				<div key={i.key} className={`${css.file} ${css[size]}`} style={fileCSSVars(i.progress, i.error)}>
					<div className={css.fileIcon}>
						<FileIcon name={i.icon} size={iconSize} />
					</div>
					<div className={css.meta}>
						<div className={css.fileName}>{i.name}</div>
						{i.error && <div className={`${css.status} ${i.error ? css.error : ''}`}>{i.error}</div>}
					</div>
					<div className={css.icon} style={displayProgress(i.uploading)}>
						<ProgressIndicator inline size={20} show={i.uploading} />
					</div>
					{canRemove && (
						<div
							className={css.icon}
							style={displayClose(i.uploading)}
							role={'button'}
							aria-label={'remove file'}
							onMouseOver={handleMouseOver}
							onMouseOut={handleMouseOut}
							onFocus={handleMouseOver}
							onBlur={handleMouseOut}
							onClick={() => handleRemove(i.index)}
							onKeyDown={(e) => accessibleKeyDown(e, () => handleRemove(i.index))}
							tabIndex={0}
						>
							<Icon name={'x'} style={{ pointerEvents: 'none' }} />
						</div>
					)}
				</div>
			))}
		</div>
	);
});
