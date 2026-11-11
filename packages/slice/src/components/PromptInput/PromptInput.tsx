'use client';

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import { Button } from '../Button';
import { type FileItem, FileList } from '../FileList';
import { IconButton } from '../IconButton';
import { TextArea } from '../TextArea';
import { allTypes } from '../UploadArea';
import { useFileSelection } from '../UploadArea/useFileSelection';
import css from './PromptInput.module.css';
import type { PromptActions, PromptProps } from './_types';
import { insertPromptText, pasteBecomesAttachment } from './promptText';

const PromptInputBase = React.forwardRef<HTMLDivElement, PromptProps>((rawProps, ref) => {
	const {
		children,
		attachments: controlledAttachments,
		defaultAttachments = [],
		value,
		defaultValue = '',
		width = '100%',
		maxWidth,
		minWidth,
		working = false,
		disabled = false,
		readOnly = false,
		maxHeight = 400,
		attachmentsDisabled = false,
		submitWorking = false,
		borderStyle = 'solid',
		borderColor = 'var(--core-outline-secondary)',
		borderColorFocused = 'var(--core-outline-secondary)',
		borderAnimate = true,
		borderWidth = 1,
		borderRadius = 16,
		focused,
		placeholder = 'Ask me anything ...',
		placeholderWorking = 'Working ...',
		submitClears = true,
		enterSubmits = true,
		attachButton = true,
		sendButton = true,
		stopEnabled = false,
		textSize = 'm',
		maxLength,
		toolbarGap = 8,
		inputName = 'Message',
		textAreaProps,
		fileListProps,
		acceptedTypes = allTypes,
		multiple = true,
		pasteAttachmentThreshold,
		attachActionName = 'Attach files',
		sendActionName = 'Send message',
		stopActionName = 'Stop generating',
		onChange,
		onBlur,
		onFocus,
		onSubmit,
		onStop,
		onAttachmentsChange,
		onReject,
		onToolTip,
		onPaste,
		onKeyDown,
		onClick,
		onDragEnter,
		onDragOver,
		onDragLeave,
		onDrop,
		...attributes
	} = resolveColorProps(rawProps);
	const [localText, setLocalText] = useState(defaultValue);
	const [localAttachments, setLocalAttachments] = useState<FileItem[]>(defaultAttachments);
	const text = value === undefined ? localText : value;
	const attachments = controlledAttachments ?? localAttachments;
	const editor = useRef<HTMLTextAreaElement>(null);
	const pendingCaret = useRef<{ value: string; caret: number } | undefined>(undefined);
	const reducedMotion = usePrefersReducedMotion();
	const canEdit = !disabled && !readOnly;
	const textLimit = textAreaProps?.maxLength ?? maxLength;
	const canAttach =
		canEdit && !attachmentsDisabled && (controlledAttachments === undefined || Boolean(onAttachmentsChange));
	const waiting = attachments.some((item) => item.uploading || Boolean(item.error?.trim()));
	const hasContent = Boolean(text.trim()) || attachments.length > 0;
	const blocked = disabled || readOnly || stopEnabled || (working && submitWorking) || waiting;
	const canSubmit = !blocked && hasContent && Boolean(onSubmit);
	const focus = () => editor.current?.focus();
	const changeText = (next: string) => {
		if (!canEdit) return;
		if (value === undefined) setLocalText(next);
		onChange?.(next, attachments);
	};
	const changeAttachments = (next: FileItem[]) => {
		if (!canAttach) return;
		if (controlledAttachments === undefined) setLocalAttachments(next);
		onAttachmentsChange?.(next);
		onChange?.(text, next);
	};
	const selection = useFileSelection({
		files: attachments,
		acceptedTypes,
		multiple,
		disabled: !canAttach,
		onFilesChange: changeAttachments,
		onReject,
	});
	const [fileDragging, setFileDragging] = useState(false);
	const dragDepth = useRef(0);
	const resetFileDrag = useCallback(() => {
		dragDepth.current = 0;
		setFileDragging(false);
	}, []);
	// Track nested enters/leaves, but clear the highlight when a drag ends outside the composer too.
	useEffect(() => {
		if (!canAttach) resetFileDrag();
		if (!fileDragging || !canAttach) return;
		const view = editor.current?.ownerDocument.defaultView;
		if (!view) return;
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') resetFileDrag();
		};
		view.addEventListener('dragend', resetFileDrag);
		view.addEventListener('drop', resetFileDrag);
		view.addEventListener('blur', resetFileDrag);
		view.addEventListener('keydown', handleKeyDown);
		return () => {
			view.removeEventListener('dragend', resetFileDrag);
			view.removeEventListener('drop', resetFileDrag);
			view.removeEventListener('blur', resetFileDrag);
			view.removeEventListener('keydown', handleKeyDown);
		};
	}, [canAttach, fileDragging, resetFileDrag]);
	const isFileDrag = (event: React.DragEvent<HTMLDivElement>) => {
		// Ignore React events bubbling from portaled menus; leave ordinary text dragging to the editor.
		return (
			event.target instanceof Node &&
			event.currentTarget.contains(event.target) &&
			(Array.from(event.dataTransfer.types).includes('Files') || event.dataTransfer.files.length > 0)
		);
	};
	const submit = () => {
		if (!canSubmit) return;
		onSubmit?.(text, attachments);
		if (submitClears) changeText('');
		focus();
	};
	const stop = () => {
		if (disabled || !stopEnabled) return;
		onStop?.();
		focus();
	};
	const makeTextAttachment = (content: string) => {
		if (!canAttach || !pasteBecomesAttachment(content, pasteAttachmentThreshold)) return false;
		selection.selectFiles([new File([content], 'Pasted-text.txt', { type: 'text/plain' })]);
		// Rejected oversized text remains reported as a file rejection, never silently truncated into the editor.
		return true;
	};
	const pasteText = (content: string) => {
		if (!canEdit || !content) return;
		if (makeTextAttachment(content)) {
			focus();
			return;
		}
		const element = editor.current;
		const next = insertPromptText(
			text,
			content,
			element?.selectionStart ?? text.length,
			element?.selectionEnd ?? text.length,
			textLimit,
		);
		pendingCaret.current = next;
		changeText(next.value);
		focus();
	};
	// Only restore a caret once the owning controlled value has committed the requested edit.
	useLayoutEffect(() => {
		const pending = pendingCaret.current;
		if (!pending || pending.value !== text) return;
		pendingCaret.current = undefined;
		editor.current?.setSelectionRange(pending.caret, pending.caret);
	}, [text]);
	const actions: PromptActions = {
		value: text,
		attachments,
		canSubmit,
		canAttach,
		disabled: !canEdit,
		focus,
		submit,
		stop,
		openFilePicker: selection.openPicker,
		addFiles: selection.selectFiles,
		pasteText,
	};
	const latestActions = useRef<PromptActions | undefined>(undefined);
	useLayoutEffect(() => {
		latestActions.current = actions;
		return () => {
			latestActions.current = undefined;
		};
	});
	const exposedActions: PromptActions = {
		...actions,
		pasteText: (content) => latestActions.current?.pasteText(content),
		addFiles: (files) => latestActions.current?.addFiles(files) ?? false,
		submit: () => latestActions.current?.submit(),
		stop: () => latestActions.current?.stop(),
		openFilePicker: () => latestActions.current?.openFilePicker(),
	};

	const customActions = typeof children === 'function' ? children(exposedActions) : children;
	const hasActions = React.Children.count(customActions) > 0 || attachButton || sendButton;

	const getBorder = () => {
		if (borderStyle === 'none') return 'transparent';
		if (borderStyle === 'gradient') return borderColor ?? 'var(--prompt-gradient)';
		if (working) return borderColorFocused ?? 'var(--core-outline-special)';
		return borderColor ?? 'var(--core-outline-primary)';
	};
	const size = Number.isFinite(borderWidth) ? Math.max(0, borderWidth) : 1;
	const innerRadius =
		typeof borderRadius === 'number'
			? `${Math.max(0, borderRadius - size)}px`
			: `max(0px, calc(${borderRadius} - ${size}px))`;
	const variables = {
		'--prompt-width': setStyle(width),
		'--prompt-max-width': setStyle(maxWidth, 'none'),
		'--prompt-min-width': setStyle(minWidth, '0px'),
		'--prompt-border-color': getBorder(),
		'--prompt-focused-border': borderColorFocused ?? getBorder(),
		'--prompt-border-width': `${size}px`,
		'--prompt-border-radius': setStyle(borderRadius),
		'--prompt-inner-border-radius': innerRadius,
		'--prompt-state': working && borderAnimate && !reducedMotion ? 'running' : 'paused',
		'--prompt-toolbar-gap': setStyle(toolbarGap),
	} as React.CSSProperties;
	return (
		<div
			{...attributes}
			ref={ref}
			data-file-dragging={(canAttach && fileDragging) || undefined}
			onDragEnter={(event) => {
				onDragEnter?.(event);
				if (event.defaultPrevented || !canAttach || !isFileDrag(event)) return;
				event.preventDefault();
				dragDepth.current += 1;
				setFileDragging(true);
			}}
			onDragOver={(event) => {
				onDragOver?.(event);
				if (event.defaultPrevented || !isFileDrag(event)) return;
				event.preventDefault();
				event.dataTransfer.dropEffect = canAttach ? 'copy' : 'none';
			}}
			onDragLeave={(event) => {
				onDragLeave?.(event);
				if (!isFileDrag(event)) return;
				dragDepth.current = Math.max(0, dragDepth.current - 1);
				if (!dragDepth.current) setFileDragging(false);
			}}
			onDrop={(event) => {
				onDrop?.(event);
				if (!isFileDrag(event)) return;
				const cancelled = event.defaultPrevented;
				event.preventDefault();
				resetFileDrag();
				if (!cancelled) selection.selectFiles(Array.from(event.dataTransfer.files));
			}}
			onClick={(event) => {
				onClick?.(event);
				if (event.defaultPrevented || disabled) return;
				const target = event.target;
				// Portaled actions bubble through React; only the composer's own empty surface focuses the editor.
				if (!(target instanceof Element) || !event.currentTarget.contains(target)) return;
				if (
					target.closest(
						'button, a, input, textarea, select, label, [contenteditable]:not([contenteditable="false"]), [tabindex], [role="button"], [role="menuitem"], [role="checkbox"], [role="combobox"], [role="switch"], [role="link"]',
					)
				)
					return;
				if (event.currentTarget.ownerDocument.getSelection()?.isCollapsed === false) return;
				focus();
			}}
			className={`${css.wrapper} ${attributes.className ?? ''}`}
			style={{ ...attributes.style, ...variables }}
		>
			<div className={css.surface}>
				{attachments.length > 0 && (
					<div className={css.attachments}>
						<FileList
							direction="row"
							gap={8}
							{...fileListProps}
							files={attachments}
							canRemove={canAttach}
							onChange={changeAttachments}
							onToolTip={onToolTip}
						/>
					</div>
				)}
				<TextArea
					rows={1}
					autoGrow
					resizable={false}
					borderStyle="none"
					backgroundColor="transparent"
					padding="var(--spacing-m)"
					maxHeight={maxHeight}
					textSize={textSize}
					inputName={inputName}
					placeholder={working ? placeholderWorking : placeholder}
					{...textAreaProps}
					maxLength={textLimit}
					inputRef={editor}
					value={text}
					disabled={disabled}
					readOnly={readOnly}
					focused={focused}
					showSendButton={false}
					submitClears={false}
					returnSubmits={enterSubmits && !blocked}
					allowEmptySubmit={attachments.length > 0 && !waiting}
					onChange={changeText}
					onSubmit={submit}
					onFocus={(next) => onFocus?.(next, attachments)}
					onBlur={(next) => onBlur?.(next, attachments)}
					onKeyDown={(event) => {
						onKeyDown?.(event);
						if (event.defaultPrevented) return;
						if (event.repeat && event.key === 'Enter') event.preventDefault();
					}}
					onPaste={(event) => {
						onPaste?.(event);
						if (event.defaultPrevented || !canEdit) return;
						const content = event.clipboardData.getData('text/plain');
						if (makeTextAttachment(content)) event.preventDefault();
					}}
				/>
				{hasActions && (
					<div className={css.buttonBar}>
						<div className={css.actions}>
							{attachButton && (
								<IconButton
									actionName={attachActionName}
									icon="basic.plus"
									buttonSize="m"
									disabled={!canAttach}
									onClick={(event) => {
										if (!event.defaultPrevented) selection.openPicker();
									}}
									tooltip={attachActionName}
									onToolTip={onToolTip}
									backgroundColor={'core-fill-primary'}
								/>
							)}
							{customActions}
						</div>
						{sendButton && (
							<Button
								round
								aria-label={stopEnabled ? stopActionName : sendActionName}
								variant={stopEnabled ? 'outline' : 'solid'}
								iconLeft={stopEnabled ? 'media.stop' : 'arrows.arrow-top'}
								iconSize={stopEnabled ? 16 : 20}
								disabled={stopEnabled ? disabled : !canSubmit}
								progress={!stopEnabled}
								working={!stopEnabled && working && submitWorking}
								onClick={(event) => {
									if (event?.defaultPrevented) return;
									if (stopEnabled) stop();
									else submit();
								}}
								tooltip={stopEnabled ? stopActionName : sendActionName}
								onToolTip={onToolTip}
							/>
						)}
					</div>
				)}
				<span className={css.rejection} role="alert">
					{selection.rejection}
				</span>
				<input {...selection.inputProps} />
			</div>
		</div>
	);
});
PromptInputBase.displayName = 'PromptInput';
export const PromptInput = React.memo(PromptInputBase);
