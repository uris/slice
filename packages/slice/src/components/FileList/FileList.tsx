'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { Attachment } from '../Attachment';
import { FileIcon } from '../FileIcon';
import { Icon } from '../Icon';
import { ProgressIndicator } from '../Progress';
import css from './FileList.module.css';
import type { FileItem, FileListProps } from './_types';
import { fileItemKey, fileProgress } from './fileListValues';

function FileRow({
	item,
	canRemove,
	iconSize,
	textSize,
	onRemove,
	onToolTip,
}: {
	item: FileItem;
	canRemove: boolean;
	iconSize: number;
	textSize: NonNullable<FileListProps['textSize']>;
	onRemove: (button: HTMLButtonElement) => void;
	onToolTip: FileListProps['onToolTip'];
}) {
	const name = typeof item.file === 'string' ? item.file : item.file.name;
	const progress = fileProgress(item);
	const removable = canRemove && !item.uploading;
	const tooltip = useRef({ hovered: false, focused: false, shown: false });
	// Clear only this row's active tip when its trigger disappears or its handler changes.
	useEffect(() => {
		if (!removable) tooltip.current = { hovered: false, focused: false, shown: false };
		return () => {
			if (tooltip.current.shown) onToolTip?.(null);
			tooltip.current.shown = false;
		};
	}, [onToolTip, removable]);
	const updateTip = (button: HTMLButtonElement) => {
		const state = tooltip.current;
		if (state.hovered || state.focused) {
			if (!state.shown && onToolTip) {
				state.shown = true;
				onToolTip({ payload: { label: `Remove file ${name}` }, ref: { current: button } });
			}
		} else if (state.shown) {
			state.shown = false;
			onToolTip?.(null);
		}
	};
	const style = {
		'--file-progress': `${progress ?? 0}%`,
		'--file-row-right': removable
			? 'calc(var(--file-row-horizontal, var(--spacing-xs)) - var(--file-row-adjustment, var(--spacing-xxs)))'
			: 'var(--file-row-horizontal, var(--spacing-xs))',
		'--file-border-color': item.error ? 'var(--feedback-warning)' : 'var(--core-outline-primary)',
	} as React.CSSProperties;
	return (
		<div role="listitem" className={`${css.file} ${css[textSize]}`} style={style}>
			<div className={css.fileIcon}>
				<FileIcon filename={item.file} size={iconSize} decorative />
			</div>
			<div className={css.meta}>
				<div className={css.fileName} title={name}>
					{name}
				</div>
				{item.error && (
					<div className={`${css.status} ${css.error}`} role="alert">
						{name}: {item.error}
					</div>
				)}
			</div>
			{item.uploading && (
				<div
					className={css.progress}
					role="progressbar"
					tabIndex={-1}
					aria-label={`Uploading ${name}`}
					aria-valuemin={0}
					aria-valuemax={100}
					aria-valuenow={progress}
				>
					<ProgressIndicator decorative inline size={20} show />
				</div>
			)}
			{removable && (
				<button
					type="button"
					className={css.remove}
					aria-label={`Remove file ${name}`}
					onMouseEnter={(e) => {
						tooltip.current.hovered = true;
						updateTip(e.currentTarget);
					}}
					onMouseLeave={(e) => {
						tooltip.current.hovered = false;
						updateTip(e.currentTarget);
					}}
					onFocus={(e) => {
						tooltip.current.focused = true;
						updateTip(e.currentTarget);
					}}
					onBlur={(e) => {
						tooltip.current.focused = false;
						updateTip(e.currentTarget);
					}}
					onClick={(e) => {
						if (tooltip.current.shown) onToolTip?.(null);
						tooltip.current = { hovered: false, focused: false, shown: false };
						onRemove(e.currentTarget);
					}}
				>
					<Icon name="basic.cross" aria-hidden="true" />
				</button>
			)}
		</div>
	);
}

const FileListBase = React.forwardRef<HTMLDivElement, FileListProps>((rawProps, ref) => {
	const {
		files = [],
		variant = 'list',
		attachmentSize,
		onChange,
		onToolTip,
		listName = 'Files',
		maxWidth,
		minWidth,
		direction = 'row',
		padding,
		gap = 10,
		textSize = 's',
		iconSize,
		backgroundColor,
		canRemove = true,
		className,
		style,
		...attributes
	} = resolveColorProps(rawProps);
	const root = useRef<HTMLDivElement>(null);
	const setRoot = useCallback(
		(node: HTMLDivElement | null) => {
			root.current = node;
			if (typeof ref === 'function') return ref(node);
			if (ref) ref.current = node;
		},
		[ref],
	);
	const focusAfterRemoval = useRef<{ removed: HTMLElement; next?: HTMLElement } | undefined>(undefined);
	// Controlled updates keep surviving nodes; move focus only when the active trigger was removed.
	useLayoutEffect(() => {
		const pending = focusAfterRemoval.current;
		if (!pending || pending.removed.isConnected) return;
		focusAfterRemoval.current = undefined;
		const document = pending.removed.ownerDocument;
		if (document.activeElement !== document.body && document.activeElement !== pending.removed) return;
		if (pending.next?.isConnected) pending.next.focus();
		else root.current?.focus();
	});
	const occurrences = new Map<string, number>();
	const getMaxWidth = () => {
		if (variant === 'list' && direction === 'column') return '100%';
		if (variant === 'attachments') return setStyle(maxWidth ?? '100%');
		return setStyle(maxWidth);
	};
	const getMinWidth = () => {
		if (variant === 'list' && direction === 'column' && minWidth == null) return '100%';
		if (variant === 'attachments') return setStyle(minWidth ?? 0);
		return setStyle(minWidth);
	};
	const cssVars = {
		'--file-max-width': getMaxWidth(),
		'--file-min-width': getMinWidth(),
		'--file-gap': setStyle(gap),
		'--file-direction': direction,
		'--file-wrap': direction === 'column' ? 'nowrap' : 'wrap',
		'--file-padding': setStyle(padding ?? 'calc(var(--spacing-xs) + var(--spacing-xxs))'),
		'--file-icon-size': setStyle(iconSize ?? 24),
		'--file-bg-color': backgroundColor ?? 'var(--core-surface-secondary)',
	} as React.CSSProperties;
	return (
		<div
			{...attributes}
			ref={setRoot}
			role="list"
			aria-label={listName}
			tabIndex={-1}
			className={`${css.wrapper} ${className ?? ''}`}
			style={{ ...style, ...cssVars }}
		>
			{files.map((item, index) => {
				const key = fileItemKey(item);
				const occurrence = occurrences.get(key) ?? 0;
				occurrences.set(key, occurrence + 1);
				const remove = (button: HTMLButtonElement) => {
					if (button.ownerDocument.activeElement === button) {
						const buttons = Array.from(root.current?.querySelectorAll<HTMLButtonElement>('button') ?? []);
						const position = buttons.indexOf(button);
						focusAfterRemoval.current = { removed: button, next: buttons[position + 1] ?? buttons[position - 1] };
					}
					onChange?.(files.filter((_, itemIndex) => itemIndex !== index));
				};
				const rowKey = `${key}:${occurrence}`;
				if (variant === 'attachments') {
					const name = typeof item.file === 'string' ? item.file : item.file.name;
					return (
						<div role="listitem" className={css.attachment} key={rowKey}>
							<Attachment
								content={item}
								size={attachmentSize}
								textSize={textSize}
								iconSize={iconSize}
								padding={padding}
								backgroundColor={backgroundColor}
								canRemove={canRemove && !item.uploading}
								removeLabel={`Remove file ${name}`}
								onRemove={(event) => remove(event.currentTarget)}
								onToolTip={onToolTip}
								style={{ maxWidth: '100%', minWidth: 'var(--file-min-width)' }}
							/>
							{item.error && (
								<div className={`${css.status} ${css.error}`} role="alert">
									{name}: {item.error}
								</div>
							)}
						</div>
					);
				}
				return (
					<FileRow
						key={rowKey}
						item={item}
						canRemove={canRemove}
						iconSize={iconSize ?? 24}
						textSize={textSize}
						onToolTip={onToolTip}
						onRemove={remove}
					/>
				);
			})}
		</div>
	);
});
FileListBase.displayName = 'FileList';
export const FileList = React.memo(FileListBase);
