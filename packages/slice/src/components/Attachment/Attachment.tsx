'use client';

import { type CSSProperties, useId } from 'react';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { FileIcon } from '../FileIcon';
import { fileProgress } from '../FileList/fileListValues';
import { IconButton } from '../IconButton';
import { ProgressIndicator } from '../Progress';
import styles from './Attachment.module.css';
import { AttachmentImagePreview } from './AttachmentImagePreview';
import type { AttachmentProps } from './_types';
import { useContentThumbnail } from './useContentThumbnail';

export function Attachment(props: Readonly<AttachmentProps>) {
	const {
		content,
		textColor = 'var(--core-text-primary)',
		textColorLight = 'var(--core-text-secondary)',
		backgroundColor = 'var(--core-surface-secondary)',
		thumbColor = 'var(--core-text-primary)',
		textSize = 's',
		size = 'm',
		width,
		height,
		borderColor = 'var(--core-outline-primary)',
		borderWidth = 1,
		borderStyle = 'solid',
		borderRadius = 16,
		iconSize = 48,
		iconGap = 4,
		padding = '0 var(--spacing-xs)',
		thumbTextSize = 10,
		thumbPadding = 'var(--spacing-m)',
		canRemove,
		removeLabel,
		attachmentName,
		openLabel,
		onOpen,
		disabled = false,
		onRemove,
		onToolTip,
		className,
		style,
		...nativeAttributes
	} = resolveColorProps(props);
	const descriptionId = useId();
	const errorId = useId();
	const fileItem = typeof content === 'object' && 'file' in content ? content : undefined;
	const error = fileItem?.error?.trim() || undefined;
	const uploading = Boolean(fileItem?.uploading) && !error;
	const progress = fileItem ? fileProgress(fileItem) : undefined;
	const showFileSize = size !== 'xs' && size !== 's';
	const showUploadPercent = size !== 'xs' && size !== 's';
	const { thumbnail, isLoading, contentFormat, fileSize, fileExtension, fileName } = useContentThumbnail(content);
	const getLabel = () => {
		if (content === undefined) return '';
		if (typeof content === 'string') return 'Clipboard content';
		if (!('file' in content)) return fileName ?? content.name;
		if (typeof content.file === 'string') return fileName ?? content.file;
		return fileName ?? content.file.name;
	};
	const label = getLabel();
	const accessibleName = attachmentName?.trim() || label || 'Attachment';
	const getActionName = () => {
		if (attachmentName?.trim()) return attachmentName.trim();
		if (typeof content === 'object' && !('file' in content)) return content.name || accessibleName;
		if (!fileItem) return accessibleName;
		if (typeof fileItem.file === 'string') return fileItem.file || accessibleName;
		return fileItem.file.name || accessibleName;
	};
	const actionName = getActionName();
	const removeName = removeLabel?.trim() || `Remove ${actionName}`;
	const openName = openLabel?.trim() || `Open ${actionName}`;
	const removable = (canRemove ?? true) && Boolean(onRemove);
	const uploadLabel = progress === undefined ? 'Uploading' : `Uploading ${progress}%`;
	const description = [
		uploading ? uploadLabel : undefined,
		contentFormat ?? fileExtension,
		fileSize?.replace(/ k$/, ' kilobytes').replace(/ mb$/, ' megabytes'),
		!error && thumbnail?.type === 'text' ? thumbnail.text : undefined,
	]
		.filter(Boolean)
		.join('. ');

	const sizes = { xs: 100, s: 125, m: 140, l: 160, xl: 180 };
	const cssVars = {
		'--text-color': textColor,
		'--text-color-light': textColorLight,
		'--background-color': backgroundColor,
		'--thumb-color': thumbColor,
		'--attachment-width': setStyle(width ?? sizes[size]),
		'--attachment-height': setStyle(height ?? sizes[size]),
		'--border-color': borderColor,
		'--border-width': setStyle(borderWidth),
		'--border-style': borderStyle,
		'--border-radius': setStyle(borderRadius),
		'--icon-gap': setStyle(iconGap),
		'--info-padding': setStyle(padding),
		'--thumb-text-size': setStyle(thumbTextSize),
		'--thumb-padding': setStyle(thumbPadding),
		...style,
	} as CSSProperties;

	return (
		<div
			{...nativeAttributes}
			role="group"
			aria-label={accessibleName}
			aria-describedby={
				[description ? descriptionId : undefined, error ? errorId : undefined].filter(Boolean).join(' ') || undefined
			}
			aria-disabled={disabled || undefined}
			className={[styles.wrapper, className].filter(Boolean).join(' ')}
			style={cssVars}
		>
			<div className={styles.canvas}>
				{error ? (
					// biome-ignore lint/a11y/noNoninteractiveTabindex: Long errors scroll within the fixed preview and must be keyboard reachable.
					<div id={errorId} className={`${styles.errorPreview} ${styles[textSize]}`} role="alert" tabIndex={0}>
						<span className={styles.errorMessage}>
							<span className={styles.srOnly}>{actionName}: </span>
							{error}
						</span>
					</div>
				) : (
					<div className={styles.preview} aria-hidden="true">
						{thumbnail?.type === 'image' && (
							<AttachmentImagePreview
								key={thumbnail.src}
								src={thumbnail.src}
								iconSize={iconSize}
								color={textColorLight}
							/>
						)}
						{isLoading && (
							<div className={styles.previewLoader}>
								<ProgressIndicator decorative inline show size={20} color={textColorLight} />
							</div>
						)}
						{thumbnail?.type === 'text' && <span className={styles.textThumbnail}>{thumbnail.text}</span>}
						{!thumbnail && !isLoading && content !== undefined && (
							<div className={styles.fileThumbnail}>
								<FileIcon type={contentFormat} size={iconSize} decorative />
							</div>
						)}
					</div>
				)}
				{onOpen && !error && (
					<button
						type="button"
						className={styles.openButton}
						aria-label={openName}
						disabled={disabled}
						onClick={(event) => {
							event.stopPropagation();
							onOpen(event);
						}}
					/>
				)}
			</div>
			{description && (
				<span id={descriptionId} className={styles.srOnly}>
					{description}
				</span>
			)}
			<div className={styles.info}>
				<div className={styles.textRow}>
					<span className={`${styles.filename} ${styles[textSize]}`} title={label}>
						{label}
					</span>
				</div>
				{uploading ? (
					<div
						className={`${styles.textRow} ${styles.upload} ${styles[textSize]}`}
						role="progressbar"
						tabIndex={-1}
						aria-label={`Uploading ${accessibleName}`}
						aria-valuemin={0}
						aria-valuemax={100}
						aria-valuenow={progress}
						aria-valuetext={uploadLabel}
					>
						<ProgressIndicator
							className={styles.uploadSpinner}
							decorative
							inline
							show
							size={14}
							color={textColorLight}
						/>
						<span className={styles.uploadLabel}>Uploading</span>
						{showUploadPercent && progress !== undefined && <span className={styles.uploadPercent}>{progress}%</span>}
					</div>
				) : (
					(contentFormat || fileExtension || (showFileSize && fileSize)) && (
						<div className={`${styles.textRow} ${styles.metadata}`} aria-hidden="true">
							{(contentFormat || fileExtension) && (
								<span className={`${styles.filetype} ${styles[textSize]}`} title={label}>
									{contentFormat ?? fileExtension}
								</span>
							)}
							{showFileSize && fileSize && (
								<span className={`${styles.filesize} ${styles[textSize]}`} title={label}>
									{fileSize}
								</span>
							)}
						</div>
					)
				)}
			</div>
			{removable && (
				<div className={styles.button}>
					<IconButton
						icon={'basic.cross'}
						buttonSize={'s'}
						iconSize={16}
						actionName={removeName}
						tooltip={removeName}
						onToolTip={onToolTip}
						disabled={disabled}
						onClick={(event) => {
							event.stopPropagation();
							onRemove?.(event);
						}}
					/>
				</div>
			)}
		</div>
	);
}
