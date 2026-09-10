'use client';

import React, { useCallback, useId, useMemo, useRef, useState } from 'react';
import { accessibleKeyDown, setStyle } from '../../utils/functions/misc';
import { FileList } from '../FileList';
import { Icon } from '../Icon';
import { ProgressIndicator } from '../Progress';
import css from './UploadArea.module.css';
import { type UploadAreaProps, allTypes } from './_types';

const UploadAreaBase = React.forwardRef<HTMLDivElement, UploadAreaProps>((props, ref) => {
	const {
		icon = 'upload',
		iconColor = 'var(--core-text-primary)',
		iconColorHover = 'var(--core-text-special)',
		title = 'Upload Files',
		width = '100%',
		height = 'auto',
		message = 'Drag and drop files here or click to upload',
		busyMessage = 'Uploading in progress',
		iconSize = 24,
		textSize = 'm',
		borderWidth,
		border = 1,
		borderStyle = 'dashed',
		borderColor = 'var(--core-outline-primary)',
		borderColorHover = 'var(--core-outline-special)',
		borderRadius,
		radius = 8,
		padding = 32,
		backgroundColor,
		backgroundColorHover,
		bgColor = 'var(--core-surface-secondary)',
		bgColorHover = 'var(--core-surface-special)',
		acceptedTypes = allTypes,
		multiple = true,
		busy = false,
		canRemove = true,
		showProgress = true,
		files = [],
		onUpload,
	} = props;
	const [hovered, setHovered] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const dragDepth = useRef(0);
	const inputId = useId();
	const titleId = useId();
	const messageId = useId();
	const isInteractive = !busy && files.length < 1;
	const resolvedBorderWidth = borderWidth ?? border;
	const resolvedBorderRadius = borderRadius ?? radius;
	const resolvedBackgroundColor = backgroundColor ?? bgColor;
	const resolvedBackgroundColorHover = backgroundColorHover ?? bgColorHover;

	// open the native file picker when the area is idle
	const handleClickUpload = useCallback(() => {
		if (!isInteractive) return;
		if (!inputRef?.current) return;
		inputRef.current.value = '';
		inputRef.current?.click();
	}, [isInteractive]);

	// forward file selections from the hidden file input
	const handleFileInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (busy) return;
			if (!e.target.files) return;
			onUpload?.(Array.from(e.target.files));
		},
		[busy, onUpload],
	);

	// detect whether the drag event currently contains files
	const hasFilesInDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
		return Array.from(e.dataTransfer?.types ?? []).includes('Files');
	}, []);

	// track nested drag enter events so hover state stays stable
	const handleDragEnter = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			if (busy || !hasFilesInDrag(e)) return;
			dragDepth.current += 1;
			if (dragDepth.current === 1) setHovered(true);
		},
		[busy, hasFilesInDrag],
	);

	// prevent the browser from opening files on drag over
	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
	};

	// clear hover state once the drag stack fully leaves the area
	const handleDragLeave = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			if (busy) return;
			dragDepth.current = Math.max(0, dragDepth.current - 1);
			if (dragDepth.current === 0) setHovered(false);
		},
		[busy],
	);

	// accept dropped files and reset drag state
	const handleDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			if (busy) return;
			dragDepth.current = 0;
			setHovered(false);
			const files = Array.from(e.dataTransfer.files ?? []);
			onUpload?.(files);
		},
		[busy, onUpload],
	);

	// resolve the icon color from hover state
	const iconStrokeColor = useMemo(() => {
		if (hovered) return iconColorHover;
		return iconColor;
	}, [hovered, iconColor, iconColorHover]);

	// compose CSS custom properties for layout, color, and interaction state
	const cssVars = useMemo(() => {
		return {
			'--ua-border': `${resolvedBorderWidth}px`,
			'--ua-border-style': borderStyle,
			'--ua-border-color': hovered || busy ? borderColorHover : borderColor,
			'--ua-radius': `${resolvedBorderRadius}px`,
			'--ua-padding': setStyle(padding),
			'--ua-bg-color': hovered ? resolvedBackgroundColorHover : resolvedBackgroundColor,
			'--ua-icon-size': `${iconSize}px`,
			'--ua-cursor': busy || files.length > 0 ? 'default' : 'pointer',
			'--ua-width': setStyle(width),
			'--ua-height': setStyle(height),
		} as React.CSSProperties;
	}, [
		resolvedBorderWidth,
		borderStyle,
		borderColor,
		borderColorHover,
		resolvedBorderRadius,
		padding,
		resolvedBackgroundColor,
		resolvedBackgroundColorHover,
		iconSize,
		busy,
		hovered,
		height,
		files.length,
		width,
	]);

	return (
		<div
			className={css.wrapper}
			style={cssVars}
			ref={ref}
			role={isInteractive ? 'button' : undefined}
			aria-label={isInteractive ? 'Click to upload files' : undefined}
			aria-describedby={`${titleId} ${messageId}`}
			aria-disabled={!isInteractive}
			tabIndex={isInteractive ? 0 : -1}
			onClick={isInteractive ? handleClickUpload : undefined}
			onKeyDown={isInteractive ? (e) => accessibleKeyDown(e, () => handleClickUpload()) : undefined}
			onDragEnter={handleDragEnter}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<div className={css.icon}>
				<Icon size={iconSize} name={icon} strokeColor={iconStrokeColor} pointer={false} />
			</div>
			<div id={titleId} className={css.title}>
				{title}
			</div>
			<div id={messageId} className={`${css.message} ${css[textSize]}`}>
				{busy && showProgress && <ProgressIndicator show size={20} inline color={iconStrokeColor} />}
				{busy ? busyMessage : message}
			</div>
			{files.length > 0 && (
				<div className={css.files}>
					<FileList
						files={files}
						bgColor={'var(--core-surface-primary)'}
						size={'m'}
						direction={'column'}
						gap={8}
						iconSize={24}
						padding={'10px'}
						canRemove={canRemove}
					/>
				</div>
			)}
			<input
				id={inputId}
				ref={inputRef}
				type="file"
				hidden={true}
				disabled={busy}
				multiple={multiple}
				accept={acceptedTypes ? acceptedTypes.join(', ') : undefined}
				onChange={handleFileInputChange}
			/>
		</div>
	);
});

UploadAreaBase.displayName = 'UploadArea';

export const UploadArea = React.memo(UploadAreaBase);
