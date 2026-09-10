'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../hooks';
import { setStyle } from '../../utils/functions/misc';
import { Button } from '../Button';
import { type FileItem, FileList } from '../FileList';
import css from './PromptInput.module.css';
import type { PromptProps } from './_types';

const PromptInputBase = React.forwardRef<HTMLDivElement, PromptProps>((props, ref) => {
	const {
		children,
		attachments = [],
		value = '',
		width = '100%',
		maxWidth,
		minWidth,
		working = false,
		maxHeight,
		attachmentsDisabled = false,
		submitWorking = false,
		borderStyle = 'gradient',
		borderColor,
		borderColorOn,
		borderAnimate = true,
		borderWidth = 1,
		borderRadius = 8,
		focused = false,
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
		onChange,
		onBlur,
		onFocus,
		onSubmit,
		onStop,
		onAttachmentsChange,
	} = props;
	const { isDark } = useTheme();
	const [isFocused, setIsFocused] = useState<boolean>(focused ?? false);
	const [textValue, setTextValue] = useState<string | undefined>(value);
	const textAreaRef = useRef<HTMLTextAreaElement>(null);

	// focus the textarea and report the current prompt state
	const handleFocus = useCallback(() => {
		setIsFocused(true);
		textAreaRef?.current?.focus();
		onFocus?.(textAreaRef.current?.value, attachments);
	}, [onFocus, attachments]);

	// blur the textarea and report the current prompt state
	const handleBlur = useCallback(
		(valueOverride?: string) => {
			setIsFocused(false);
			textAreaRef.current?.blur();
			onBlur?.(valueOverride ?? textAreaRef.current?.value, attachments);
		},
		[onBlur, attachments],
	);

	// bridge the native blur event to the internal blur reporter
	const handleTextAreaBlur = useCallback(() => {
		handleBlur();
	}, [handleBlur]);

	// forward attachment updates and keep the parent prompt state in sync
	const handleAttachmentsChange = useCallback(
		(newFiles: FileItem[]) => {
			onAttachmentsChange?.(newFiles);
			onChange?.(textAreaRef.current?.value, newFiles);
		},
		[onAttachmentsChange, onChange],
	);

	// update local prompt text and notify the consumer
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const newValue = e.target.value;
			setTextValue(newValue);
			onChange?.(newValue, attachments);
		},
		[onChange, attachments],
	);

	// submit the current prompt when not already working or stopping
	const handleSubmit = useCallback(() => {
		if (stopEnabled) return;
		if (working && submitWorking) return;
		const currentValue = textAreaRef.current?.value;
		if (currentValue) {
			onSubmit?.(currentValue, attachments);
			if (submitClears) {
				setTextValue('');
				onChange?.('', attachments);
				if (textAreaRef.current) textAreaRef.current.value = '';
			}
			handleBlur(submitClears ? '' : currentValue);
		}
	}, [stopEnabled, submitClears, onChange, onSubmit, handleBlur, attachments, working, submitWorking]);

	// emit stop event keeping focus on the textarea
	const handleStop = useCallback(() => {
		onStop?.();
		handleFocus();
	}, [onStop, handleFocus]);

	// optionally submit on enter from the textarea
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === 'Enter' && enterSubmits) {
				e.preventDefault();
				handleSubmit();
			}
		},
		[handleSubmit, enterSubmits],
	);

	// route the send button to submit or stop based on the current state
	const handleClickSend = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			e.preventDefault();
			e.stopPropagation();
			stopEnabled ? handleStop() : handleSubmit();
		},
		[handleSubmit, handleStop, stopEnabled],
	);

	// keep the attach button from stealing wrapper click behavior
	const handleClickAttach = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		e.stopPropagation();
	}, []);

	// return focus to the textarea when the toolbar is clicked
	const handleClickButtonBar = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			e.preventDefault();
			handleFocus();
		},
		[handleFocus],
	);

	// resolve the outer border treatment from style, focus, and working state
	const setBorderColor = useMemo(() => {
		if (borderStyle === 'gradient') {
			const radial = isDark ? 'var(--conic-gradient-dark)' : 'var(--conic-gradient-light)';
			if (working && borderAnimate) return radial;
			if (isFocused) return borderColorOn ?? radial;
			return borderColor ?? radial;
		}
		if (borderStyle === 'solid') {
			if (working) return borderColorOn ?? 'var(--core-outline-special)';
			if (isFocused) return borderColorOn ?? 'var(--core-outline-special)';
			return borderColor ?? 'transparent';
		}
		return 'transparent';
	}, [borderStyle, isFocused, borderColorOn, borderColor, working, borderAnimate, isDark]);

	// resolve the placeholder text from the current working state
	const setPlaceholder = useMemo(() => {
		if (working && placeholderWorking) return placeholderWorking;
		return placeholder;
	}, [working, placeholder, placeholderWorking]);

	// resolve the send button icon color from working and content state
	const setSendIconColor = useMemo(() => {
		if (stopEnabled) return 'var(--core-text-primary)';
		if (textValue !== '') return 'var(--core-text-light)';
		return 'var(--core-text-disabled)';
	}, [textValue, stopEnabled]);

	// resolve the send button state from content and stop mode
	const sendButtonState = useMemo(() => {
		if (working && submitWorking) return 'normal';
		if (stopEnabled) return 'normal';
		return textValue === '' ? 'disabled' : 'normal';
	}, [textValue, stopEnabled, working, submitWorking]);

	// resolve the attach button state while work is in progress
	const attachState = useMemo(() => {
		if (!attachmentsDisabled) return 'normal';
		return 'disabled';
	}, [attachmentsDisabled]);

	// sync focus requests from the controlled prop
	useEffect(() => {
		if (focused) textAreaRef.current?.focus();
		else textAreaRef.current?.blur();
	}, [focused]);

	// sync the textarea value from the controlled prop
	useEffect(() => {
		setTextValue(value);
	}, [value]);

	// compose CSS custom properties for border treatment and sizing
	const cssVars = useMemo(() => {
		return {
			'--prompt-width': setStyle(width),
			'--prompt-min-width': setStyle(minWidth, 'unset'),
			'--prompt-max-width': setStyle(maxWidth, 'unset'),
			'--prompt-border-color': setBorderColor,
			'--prompt-max-height': maxHeight ? `${maxHeight}px` : 'unset',
			'--prompt-border-width': borderWidth ? `${borderWidth}px` : '0',
			'--prompt-state': working && borderAnimate ? 'running' : 'paused',
			'--prompt-border-radius': borderRadius ? `${borderRadius}px` : '8px',
			'--prompt-inner-border-radius': borderRadius ? `${borderRadius - 1}px` : '7px',
		} as React.CSSProperties;
	}, [working, borderAnimate, setBorderColor, borderWidth, borderRadius, maxHeight, width, maxWidth, minWidth]);

	return (
		<div className={css.wrapperBg} ref={ref} style={cssVars}>
			<div className={css.textareaWrapper}>
				{attachments.length > 0 && (
					<div className={css.attachments}>
						<FileList
							files={attachments}
							onChange={handleAttachmentsChange}
							bgColor={'var(--core-surface-primary)'}
							size={'s'}
							direction={'row'}
							gap={8}
							iconSize={24}
						/>
					</div>
				)}
				<textarea
					id={'promptInput'}
					name={'promptInput'}
					className={`${css.textarea} ${css[textSize]}`}
					ref={textAreaRef}
					value={textValue ?? ''}
					onChange={handleChange}
					placeholder={setPlaceholder}
					onFocus={handleFocus}
					onBlur={handleTextAreaBlur}
					onKeyDown={handleKeyDown}
					maxLength={maxLength}
					rows={1}
				/>
				{(children || attachButton || sendButton) && (
					<div className={css.buttonBar} onMouseDown={handleClickButtonBar}>
						<div className={css.toolBar} style={{ gap: toolbarGap }}>
							{attachButton && (
								<Button
									round
									label={undefined}
									variant={'outline'}
									iconLeft={'plus'}
									iconSize={20}
									state={attachState}
									onMouseDown={handleClickAttach}
								/>
							)}
							{children}
						</div>
						{sendButton && (
							<Button
								round
								label={undefined}
								variant={stopEnabled ? 'outline' : 'solid'}
								iconLeft={stopEnabled ? 'stop' : 'arrow up'}
								iconSize={stopEnabled ? 16 : 20}
								state={sendButtonState}
								bgColorDisabled={'var(--core-outline-primary)'}
								progress={!stopEnabled}
								working={submitWorking && working}
								onMouseDown={handleClickSend}
								iconColor={setSendIconColor}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
});

PromptInputBase.displayName = 'PromptInput';

export const PromptInput = React.memo(PromptInputBase);
