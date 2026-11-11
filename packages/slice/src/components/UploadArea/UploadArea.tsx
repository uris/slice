'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { corners } from '../../theme/corners/corners';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { FileList } from '../FileList';
import { Icon } from '../Icon';
import { ProgressIndicator } from '../Progress';
import css from './UploadArea.module.css';
import { type UploadAreaProps, allTypes } from './_types';
import { useFileSelection } from './useFileSelection';

const UploadAreaBase = React.forwardRef<HTMLDivElement, UploadAreaProps>((rawProps, ref) => {
	const {
		icon = 'documents.file-upload',
		iconColor = 'var(--core-text-primary)',
		iconColorHover = 'var(--core-text-special)',
		title = 'Upload Files',
		actionName,
		width = '100%',
		height = 'auto',
		message = 'Drag and drop files here or click to upload',
		busyMessage = 'Uploading in progress',
		iconSize = 24,
		textSize = 'm',
		borderWidth = 1,
		borderStyle = 'dashed',
		borderColor = 'var(--core-outline-primary)',
		borderColorHover = 'var(--core-outline-special)',
		borderRadius = corners['corner-m'],
		padding = 'var(--spacing-xl)',
		backgroundColor = 'var(--core-surface-secondary)',
		backgroundColorHover = 'var(--core-surface-special)',
		acceptedTypes = allTypes,
		multiple = true,
		busy = false,
		disabled = false,
		canRemove = true,
		showProgress = true,
		files = [],
		fileListProps,
		onUpload,
		onFilesChange,
		onReject,
		onToolTip,
		className,
		style,
		onDragEnter,
		onDragOver,
		onDragLeave,
		onDrop,
		...attributes
	} = resolveColorProps(rawProps);
	// Keep state semantics on the trigger, including when callers use untyped native props.
	const wrapperAttributes: React.HTMLAttributes<HTMLDivElement> = attributes;
	wrapperAttributes.role = undefined;
	wrapperAttributes['aria-disabled'] = undefined;
	wrapperAttributes['aria-busy'] = undefined;
	wrapperAttributes.children = undefined;
	wrapperAttributes.dangerouslySetInnerHTML = undefined;
	const [hovered, setHovered] = useState(false);

	const triggerRef = useRef<HTMLButtonElement>(null);
	const dragDepth = useRef(0);
	const messageId = useId();
	const rejectionId = useId();
	const enabled = !busy && !disabled;
	const selection = useFileSelection({
		files,
		acceptedTypes,
		multiple,
		disabled: !enabled,
		onFilesChange,
		onUpload,
		onReject,
	});
	const { inputRef } = selection;
	const dragging = enabled && hovered;
	const resetDrag = () => {
		dragDepth.current = 0;
		setHovered(false);
	};
	// A cancelled drag or an availability change must not leave the drop highlight active.
	useEffect(() => {
		if (!enabled) {
			dragDepth.current = 0;
			setHovered(false);
		}
	}, [enabled]);
	useEffect(() => {
		const view = inputRef.current?.ownerDocument.defaultView;
		if (!view) return;
		const reset = () => {
			dragDepth.current = 0;
			setHovered(false);
		};
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') reset();
		};
		view.addEventListener('dragend', reset);
		view.addEventListener('drop', reset);
		view.addEventListener('blur', reset);
		view.addEventListener('keydown', handleEscape);
		return () => {
			view.removeEventListener('dragend', reset);
			view.removeEventListener('drop', reset);
			view.removeEventListener('blur', reset);
			view.removeEventListener('keydown', handleEscape);
		};
	}, [inputRef]);
	const cssVars = {
		'--ua-border': `${borderWidth}px`,
		'--ua-border-style': borderStyle,
		'--ua-border-color': dragging || busy ? borderColorHover : borderColor,
		'--ua-radius': setStyle(borderRadius),
		'--ua-padding': setStyle(padding),
		'--ua-bg-color': dragging ? backgroundColorHover : backgroundColor,
		'--ua-icon-size': `${iconSize}px`,
		'--ua-width': setStyle(width),
		'--ua-height': setStyle(height),
	} as React.CSSProperties;
	return (
		<div
			{...wrapperAttributes}
			className={`${css.wrapper} ${className ?? ''}`}
			style={{ ...style, ...cssVars }}
			ref={ref}
			onDragEnter={(event) => {
				onDragEnter?.(event);
				if (event.defaultPrevented || !enabled || !Array.from(event.dataTransfer?.types ?? []).includes('Files'))
					return;
				event.preventDefault();
				dragDepth.current += 1;
				setHovered(true);
			}}
			onDragOver={(event) => {
				onDragOver?.(event);
				if (!event.defaultPrevented && Array.from(event.dataTransfer?.types ?? []).includes('Files')) {
					event.preventDefault();
					event.dataTransfer.dropEffect = enabled ? 'copy' : 'none';
				}
			}}
			onDragLeave={(event) => {
				onDragLeave?.(event);
				dragDepth.current = Math.max(0, dragDepth.current - 1);
				if (!dragDepth.current) setHovered(false);
			}}
			onDrop={(event) => {
				onDrop?.(event);
				const cancelled = event.defaultPrevented;
				event.preventDefault();
				resetDrag();
				if (!cancelled) selection.selectFiles(Array.from(event.dataTransfer?.files ?? []));
			}}
		>
			<button
				type="button"
				ref={triggerRef}
				className={css.trigger}
				disabled={!enabled}
				aria-busy={busy || undefined}
				aria-label={actionName?.trim() || title.trim() || 'Upload files'}
				aria-describedby={`${messageId} ${rejectionId}`}
				onClick={(event) => {
					if (!event.defaultPrevented) selection.openPicker();
				}}
			>
				<span className={css.icon}>
					<Icon size={iconSize} name={icon} strokeColor={dragging ? iconColorHover : iconColor} decorative />
				</span>
				<span className={css.title}>{title}</span>
				<span id={messageId} className={`${css.message} ${css[textSize]}`}>
					{busy && showProgress && <ProgressIndicator decorative show size={20} inline color={iconColor} />}
					{busy ? busyMessage : message}
				</span>
			</button>
			<span className={css.srOnly} role="status" aria-atomic="true">
				{busy ? busyMessage : ''}
			</span>
			<span id={rejectionId} className={css.rejection} role="alert" aria-atomic="true">
				{selection.rejection}
			</span>
			{files.length > 0 && (
				<div className={css.files}>
					<FileList
						backgroundColor="var(--core-surface-primary)"
						textSize="m"
						direction={fileListProps?.variant === 'attachments' ? 'row' : 'column'}
						gap={8}
						{...fileListProps}
						files={files}
						canRemove={canRemove && enabled && Boolean(onFilesChange)}
						onToolTip={onToolTip}
						onChange={(next) => {
							if (!enabled) return;
							onFilesChange?.(next);
							if (next.length === 0) triggerRef.current?.focus();
						}}
					/>
				</div>
			)}
			<input {...selection.inputProps} />
		</div>
	);
});
UploadAreaBase.displayName = 'UploadArea';
export const UploadArea = React.memo(UploadAreaBase);
