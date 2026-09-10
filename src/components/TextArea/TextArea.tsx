'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { Button } from '../Button';
import css from './TextArea.module.css';
import type { TextAreaProps } from './_types';

export const TextArea = React.memo((props: TextAreaProps) => {
	const {
		value = '',
		name = 'text_area',
		width = '100%',
		height = 'auto',
		focused = false,
		placeholder = 'Enter text here...',
		rows = 6,
		border = true,
		borderRadius = 4,
		padding = '16px 4px 16px 16px',
		error = false,
		resizable = true,
		hasSend = false,
		sendOffset = { bottom: 10, right: 10 },
		sendSize = 36,
		returnSubmits = false,
		backgroundColor,
		bgColor = undefined,
		minWidth = undefined,
		textSize = 'm',
		disabled = false,
		submitClears = true,
		maxLength = undefined,
		onChange = () => null,
		onFocus = () => null,
		onBlur = () => null,
		onSubmit = () => null,
		onKeyDown = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const resolvedBackgroundColor = backgroundColor ?? bgColor;

	const [isFocused, setIsFocused] = useState<boolean>(focused);
	const [text, setText] = useState<string>(value);
	const ref = useRef<HTMLTextAreaElement>(null);

	// resize the textarea to fit its current content
	const handleResize = useCallback(() => {
		if (!ref?.current) return;
		ref.current.style.height = 'auto';
		ref.current.style.height = `${ref.current.scrollHeight}px`;
	}, []);

	// sync focus state from the controlled prop
	useEffect(() => {
		if (ref?.current) {
			if (focused) ref.current.focus();
			else ref.current.blur();
			setIsFocused(focused);
		}
	}, [focused]);

	// sync the textarea value from the controlled prop
	useEffect(() => setText(value), [value]);

	// re-measure the textarea when the configured row count changes
	// biome-ignore lint/correctness/useExhaustiveDependencies: update height on rows change
	useEffect(() => handleResize(), [rows]);

	// update local state and validation when the text changes
	const handleChange = useCallback(
		(content: string) => {
			onChange(content);
			setText(content);
		},
		[onChange],
	);

	// mark the field as active and notify focus listeners
	const handleFocus = useCallback(() => {
		if (ref?.current) ref.current.focus();
		setIsFocused(true);
		onFocus(ref.current?.value ?? '');
	}, [onFocus]);

	// commit the latest value and notify blur listeners
	const handleBlur = useCallback(() => {
		setIsFocused(false);
		onBlur(ref.current?.value ?? '');
	}, [onBlur]);

	// submit the current value and optionally clear the field
	const handleSubmit = useCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined) => {
			e?.preventDefault();
			handleFocus();
			onSubmit(text);
			if (submitClears) setText('');
			if (ref?.current) ref.current.value = '';
			handleResize();
		},
		[handleFocus, onSubmit, text, submitClears, handleResize],
	);

	// optionally treat the return key as submit
	const handleKeyDownWrapper = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (returnSubmits && e.key === 'Enter') {
				e.preventDefault();
				e.stopPropagation();
				handleSubmit(undefined);
			}
			onKeyDown(e);
		},
		[returnSubmits, handleSubmit, onKeyDown],
	);

	// normalize dimension values before applying them as CSS
	const setStyleValue = useCallback((value: string | number) => {
		if (typeof value === 'string') return value;
		return `${value}px`;
	}, []);

	// resolve the current border color from focus and error state
	const setBorderColor = useMemo(() => {
		if (border && isFocused) return 'var(--core-link-primary)';
		if (border && error) return 'var(--feedback-warning)';
		return border ? 'var(--core-outline-primary)' : 'transparent';
	}, [isFocused, error, border]);

	// resolve the text size class for the textarea content
	const textClassName = useMemo(() => {
		if (textSize === 'xs') return css.xs;
		if (textSize === 'l') return css.l;
		if (textSize === 'm') return css.m;
		return css.s;
	}, [textSize]);

	// compose CSS custom properties for layout, colors, and send button placement
	const cssVars = useMemo(() => {
		return {
			'--ta-border-radius': `${borderRadius}px`,
			'--ta-width': `${setStyleValue(width)}`,
			'--ta-min-width': minWidth ? `${minWidth}px` : 'unset',
			'--ta-height': `${setStyleValue(height)}`,
			'--ta-max-height': height === 'auto' ? 'unset' : `${setStyleValue(height)}`,
			'--ta-bg-color': resolvedBackgroundColor ?? 'var(--core-surface-secondary)',
			'--ta-border-color': setBorderColor,
			'--ta-padding': `${setStyleValue(padding)}`,
			'--ta-send-icon-offset-bottom': `${sendOffset.bottom}px`,
			'--ta-send-icon-offset-right': `${sendOffset.right}px`,
			'--ta-send-icon-size': `${sendSize}px`,
			'--ta-resize': resizable ? 'vertical' : 'none',
		} as React.CSSProperties;
	}, [
		width,
		minWidth,
		resolvedBackgroundColor,
		setBorderColor,
		padding,
		sendOffset,
		sendSize,
		setStyleValue,
		borderRadius,
		resizable,
		height,
	]);

	/* START.DEBUG */
	useTrackRenders(props, 'TextArea');
	/* END.DEBUG */

	return (
		<div
			id={divId}
			className={`${css.wrapper}${divClass}`}
			style={{ ...divStyle, ...cssVars }}
			onBlur={() => handleBlur()}
			onFocus={() => handleFocus()}
			{...rest}
		>
			{hasSend && (
				<div className={css.send} onMouseDown={(e) => handleSubmit(e)}>
					<Button iconLeft={'arrow up'} size={'medium'} variant={'solid'} round />
				</div>
			)}
			<textarea
				className={`${css.textarea} ${textClassName}`}
				ref={ref}
				name={name}
				value={text}
				placeholder={placeholder}
				rows={rows}
				maxLength={maxLength}
				disabled={disabled}
				onChange={(e) => handleChange(e.target.value)}
				onInput={() => handleResize()}
				onKeyDown={(e) => handleKeyDownWrapper(e)}
			/>
		</div>
	);
});
