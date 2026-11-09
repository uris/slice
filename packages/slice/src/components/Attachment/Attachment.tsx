'use client';

import { type CSSProperties, useId } from 'react';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { FileIcon } from '../FileIcon';
import { fileProgress } from '../FileList/fileListValues';
import { IconButton } from '../IconButton';
import { ProgressIndicator } from '../Progress';
import styles from './Attachment.module.css';
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
		size = 's',
		width,
		height,
		borderColor = 'var(--core-outline-primary)',
		borderWidth = 1,
		borderStyle = 'solid',
		borderRadius = 16,
		iconSize = 32,
		iconGap = 4,
		padding = '0 var(--spacing-xs)',
		thumbTextSize = 10,
		thumbPadding = 'var(--spacing-m)',
		canRemove = true,
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
	const fileItem = typeof content === 'object' ? content : undefined;
	const uploading = Boolean(fileItem?.uploading);
	const progress = fileItem ? fileProgress(fileItem) : undefined;
	const { thumbnail, contentFormat, fileSize, fileExtension, fileName } = useContentThumbnail(content);
	const getLabel = () => {
		if (content === undefined) return '';
		if (typeof content === 'string') return 'Clipboard content';
		if (typeof content.file === 'string') return fileName ?? content.file;
		return fileName ?? content.file.name;
	};
	const label = getLabel();
	const accessibleName = attachmentName?.trim() || label || 'Attachment';
	const removeName = removeLabel?.trim() || `Remove ${accessibleName}`;
	const openName = openLabel?.trim() || `Open ${accessibleName}`;
	const uploadLabel = progress === undefined ? 'Uploading' : `Uploading ${progress}%`;
	const description = [
		uploading ? uploadLabel : undefined,
		contentFormat ?? fileExtension,
		fileSize?.replace(/ k$/, ' kilobytes').replace(/ mb$/, ' megabytes'),
		thumbnail?.type === 'text' ? thumbnail.text : undefined,
	]
		.filter(Boolean)
		.join('. ');

	const sizes = { xs: 80, s: 140, m: 160, l: 200, xl: 240 };
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
			aria-describedby={description ? descriptionId : undefined}
			aria-disabled={disabled || undefined}
			className={[styles.wrapper, className].filter(Boolean).join(' ')}
			style={cssVars}
		>
			<div className={styles.canvas}>
				<div className={styles.preview} aria-hidden="true">
					{thumbnail?.type === 'image' && <img className={styles.imageThumbnail} src={thumbnail.src} alt="" />}
					{thumbnail?.type === 'text' && <span className={styles.textThumbnail}>{thumbnail.text}</span>}
					{!thumbnail && content !== undefined && (
						<div className={styles.fileThumbnail}>
							<FileIcon type={contentFormat} size={iconSize} decorative />
						</div>
					)}
				</div>
				{onOpen && (
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
						{progress !== undefined && <span className={styles.uploadPercent}>{progress}%</span>}
					</div>
				) : (
					(contentFormat || fileExtension || fileSize) && (
						<div className={`${styles.textRow} ${styles.metadata}`} aria-hidden="true">
							{(contentFormat || fileExtension) && (
								<span className={`${styles.filetype} ${styles[textSize]}`} title={label}>
									{contentFormat ?? fileExtension}
								</span>
							)}
							{fileSize && (
								<span className={`${styles.filesize} ${styles[textSize]}`} title={label}>
									{fileSize}
								</span>
							)}
						</div>
					)
				)}
			</div>
			{canRemove && (
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
