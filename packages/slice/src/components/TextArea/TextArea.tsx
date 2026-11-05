'use client';

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { corners } from '../../theme/corners/corners';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { Icon } from '../Icon';
import css from './TextArea.module.css';
import type { TextAreaProps } from './_types';

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const withoutAria = (attributes: object) =>
	Object.fromEntries(Object.entries(attributes).filter(([key]) => !key.startsWith('aria-') && key !== 'role'));
const defaultSendOffset = { bottom: 10, right: 10 };

function TextAreaComponent(rawProps: TextAreaProps) {
	const props = resolveColorProps(rawProps);
	const {
		value,
		defaultValue = '',
		name,
		inputName,
		inputId,
		inputAttributes = {},
		label,
		labelSize = 'm',
		labelColor = 'var(--core-text-primary)',
		width = '100%',
		height = 'auto',
		maxHeight,
		minWidth,
		rows = 6,
		autoGrow = true,
		focused,
		placeholder = 'Enter text here...',
		padding = 'var(--spacing-m) var(--spacing-s) var(--spacing-m) var(--spacing-m)',
		borderStyle = 'box',
		borderRadius = corners['corner-xs'],
		error = false,
		errorMessage,
		tip,
		borderColor = 'var(--core-outline-primary)',
		borderColorFocused = 'var(--core-link-primary)',
		borderColorError = 'var(--feedback-warning)',
		backgroundColor = 'var(--core-surface-secondary)',
		resizable = true,
		showSendButton = false,
		sendActionName = 'Send',
		sendOffset = defaultSendOffset,
		sendSize = 36,
		returnSubmits = false,
		textSize = 'm',
		textColor = 'var(--core-text-primary)',
		textColorDisabled = 'var(--core-text-disabled)',
		textColorPlaceholder = 'var(--core-text-disabled)',
		textColorError = 'var(--feedback-warning)',
		disabled = false,
		readOnly = false,
		submitClears = true,
		maxLength,
		onChange,
		onFocus,
		onBlur,
		onSubmit,
		onKeyDown,
		onPaste,
		className,
		style,
		...divAttributes
	} = props;
	const generatedId = useId();
	const id = inputId || generatedId;
	const hasLabel = Boolean(label?.trim());
	const getAccessibleName = () => {
		if (inputName?.trim()) return inputName.trim();
		if (hasLabel) return undefined;
		return name?.trim() || 'Text input';
	};
	const message = (error ? errorMessage : tip)?.trim();
	const messageId = `${id}-message`;
	const ref = useRef<HTMLTextAreaElement>(null);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const initialValue = useRef(defaultValue);
	const [localText, setLocalText] = useState(defaultValue);
	const [isFocused, setIsFocused] = useState(false);
	const controlled = value !== undefined;
	const text = controlled ? value : localText;
	const canEdit = !disabled && !readOnly;
	const canSubmit = canEdit && Boolean(text.trim()) && Boolean(onSubmit);
	const growing = autoGrow && height === 'auto';
	const nativeResizable = resizable && !growing && height === 'auto';
	const rowCount = Number.isFinite(rows) ? Math.max(1, Math.floor(rows)) : 6;
	const buttonSize = Number.isFinite(sendSize) ? Math.max(0, sendSize) : 36;
	const bottomOffset = Number.isFinite(sendOffset.bottom) ? Math.max(0, sendOffset.bottom) : 10;
	const rightOffset = Number.isFinite(sendOffset.right) ? Math.max(0, sendOffset.right) : 10;
	const changeText = (next: string) => {
		if (!canEdit) return;
		if (!controlled) setLocalText(next);
		onChange?.(next);
	};
	const submit = () => {
		if (!canSubmit) return;
		onSubmit?.(text);
		if (submitClears) changeText('');
		ref.current?.focus();
	};
	useEffect(() => {
		if (disabled) {
			setIsFocused(false);
			return;
		}
		if (focused === undefined) return;
		if (focused) ref.current?.focus();
		else ref.current?.blur();
	}, [focused, disabled]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: Native form ownership can change independently of controlled state.
	useEffect(() => {
		if (controlled) return;
		const form = ref.current?.form;
		if (!form) return;
		let mounted = true;
		const reset = (event: Event) =>
			queueMicrotask(() => {
				if (mounted && !event.defaultPrevented) setLocalText(initialValue.current);
			});
		form.addEventListener('reset', reset);
		return () => {
			mounted = false;
			form.removeEventListener('reset', reset);
		};
	}, [controlled, inputAttributes.form]);
	useClientLayoutEffect(() => {
		const element = ref.current;
		const wrapper = wrapperRef.current;
		if (!element || !wrapper) return;
		const measure = () => {
			const styles = getComputedStyle(wrapper);
			const resizeOffset = Math.max(
				0,
				Number.parseFloat(styles.paddingBottom) - Number.parseFloat(styles.paddingRight),
			);
			wrapper.style.setProperty('--ta-resize-offset', `${resizeOffset}px`);
			wrapper.parentElement?.style.setProperty('--ta-message-left', styles.paddingLeft);
			wrapper.parentElement?.style.setProperty('--ta-message-right', styles.paddingRight);
			if (!growing) return;
			element.style.height = 'auto';
			const baseline = element.offsetHeight;
			element.style.height = '0px';
			const content = element.scrollHeight;
			element.style.height = `${Math.max(baseline, content)}px`;
		};
		measure();
		let previousWidth = wrapper.clientWidth;
		const observer = new ResizeObserver(() => {
			if (wrapper.clientWidth === previousWidth) return;
			previousWidth = wrapper.clientWidth;
			measure();
		});
		observer.observe(wrapper);
		let mounted = true;
		document.fonts?.ready.then(() => {
			if (mounted) measure();
		});
		return () => {
			mounted = false;
			observer.disconnect();
			if (growing) element.style.removeProperty('height');
		};
	}, [
		growing,
		text,
		rowCount,
		width,
		height,
		maxHeight,
		minWidth,
		textSize,
		padding,
		showSendButton,
		resizable,
		sendSize,
		sendOffset,
		style,
		className,
	]);
	useClientLayoutEffect(() => {
		const element = ref.current;
		const wrapper = wrapperRef.current;
		if (!nativeResizable || !element || !wrapper) return;
		const positionGrip = () => {
			wrapper.style.setProperty('--ta-grip-top', `${element.offsetTop + element.offsetHeight - 16}px`);
			wrapper.style.setProperty(
				'--ta-grip-right',
				`${wrapper.clientWidth - element.offsetLeft - element.offsetWidth}px`,
			);
		};
		positionGrip();
		const observer = new ResizeObserver(positionGrip);
		observer.observe(element);
		observer.observe(wrapper);
		return () => observer.disconnect();
	}, [nativeResizable, padding, style]);
	const getBorderColor = () => {
		if (error) return borderColorError;
		if (isFocused) return borderColorFocused;
		return borderColor;
	};
	const getBoxShadow = () => {
		if (borderStyle === 'none') return 'none';
		if (borderStyle === 'underline') return `0 1px 0 0 ${getBorderColor()}`;
		return `0 0 0 1px ${getBorderColor()}`;
	};
	const getResize = () => {
		if (!resizable || growing || height !== 'auto') return 'none';
		return 'vertical';
	};
	const cssVars = {
		'--ta-height': setStyle(height),
		'--ta-max-height': setStyle(maxHeight, 'none'),
		'--ta-padding': setStyle(padding),
		'--ta-border-radius': setStyle(borderRadius),
		'--ta-bg-color': backgroundColor,
		'--ta-box-shadow': getBoxShadow(),
		'--ta-text-color': disabled ? textColorDisabled : textColor,
		'--ta-placeholder-color': textColorPlaceholder,
		'--ta-label-color': disabled ? textColorDisabled : labelColor,
		'--ta-send-bottom': `${bottomOffset}px`,
		'--ta-send-right': `${rightOffset}px`,
		'--ta-send-size': `${buttonSize}px`,
		'--ta-resize': getResize(),
	} as React.CSSProperties;
	/* START.DEBUG */
	useTrackRenders(props, 'TextArea');
	/* END.DEBUG */
	return (
		<div className={css.field} style={{ width: setStyle(width), minWidth: setStyle(minWidth, '0px'), ...cssVars }}>
			{hasLabel && (
				<label htmlFor={id} className={`${css.label} ${css[labelSize]}`}>
					{label}
				</label>
			)}
			<div
				{...withoutAria(divAttributes)}
				ref={wrapperRef}
				className={`${css.wrapper}${className ? ` ${className}` : ''}`}
				style={{ ...style, ...cssVars }}
			>
				<textarea
					{...withoutAria(inputAttributes)}
					ref={ref}
					id={id}
					name={name}
					className={`${css.textarea} ${css[textSize]}`}
					data-resizable={getResize() === 'vertical' || undefined}
					value={text}
					placeholder={placeholder}
					aria-label={getAccessibleName()}
					aria-invalid={error || undefined}
					aria-describedby={message ? messageId : undefined}
					rows={rowCount}
					maxLength={maxLength}
					disabled={disabled}
					readOnly={readOnly}
					onChange={(event) => changeText(event.currentTarget.value)}
					onFocus={(event) => {
						setIsFocused(true);
						onFocus?.(event.currentTarget.value);
					}}
					onBlur={(event) => {
						setIsFocused(false);
						onBlur?.(event.currentTarget.value);
					}}
					onPaste={(event) => {
						if (canEdit) onPaste?.(event);
					}}
					onKeyDown={(event) => {
						onKeyDown?.(event);
						if (
							event.defaultPrevented ||
							!canEdit ||
							!returnSubmits ||
							!onSubmit ||
							event.key !== 'Enter' ||
							event.shiftKey ||
							event.altKey ||
							event.ctrlKey ||
							event.metaKey ||
							event.nativeEvent.isComposing ||
							event.nativeEvent.keyCode === 229
						)
							return;
						event.preventDefault();
						submit();
					}}
				/>
				{nativeResizable && <span className={css.resizeGrip} aria-hidden="true" />}
				{showSendButton && (
					<div className={css.sendSpace}>
						<button
							type="button"
							className={css.send}
							aria-label={sendActionName.trim() || 'Send'}
							disabled={!canSubmit}
							onMouseDown={(event) => event.preventDefault()}
							onClick={submit}
						>
							<Icon name="arrows.arrow-top" size={20} aria-hidden="true" strokeColor="var(--core-text-light)" />
						</button>
					</div>
				)}
			</div>
			{message && (
				<div
					id={messageId}
					className={`${css.message} ${css.xs}`}
					style={{ color: error ? textColorError : 'var(--core-text-tertiary)' }}
				>
					{message}
				</div>
			)}
		</div>
	);
}
TextAreaComponent.displayName = 'TextArea';
export const TextArea = React.memo<TextAreaProps>(TextAreaComponent);
