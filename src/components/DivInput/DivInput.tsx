'use client';

import { motion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { cleanString } from '../../utils/functions/misc';
import css from './DivInput.module.css';
import type { DivInputProps } from './_types';

export const DivInput = React.memo((props: DivInputProps) => {
	const {
		value = '',
		name = 'Input Field',
		placeholder = 'Placeholder',
		isEditable = true,
		wrap = false,
		focus = false,
		width = 'auto',
		textAlign = 'left',
		clamp = 3,
		padding = '0px',
		onChange = () => null,
		onSubmit = () => null,
		onFocus = () => null,
		onBlur = () => null,
		onDblClick = () => null,
		onClick = () => null,
		borderRadius,
		radius = 4,
		backgroundColor,
		bgColor = 'var(--core-surface-secondary)',
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';

	const ref = useRef<HTMLDivElement>(null);
	const innerText = useRef<string>(value === '' ? cleanString(placeholder) : cleanString(value));
	const [isFocused, setIsFocused] = useState(focus);
	const [text, setText] = useState(innerText.current);
	const [isPlaceholder, setIsPlaceholder] = useState<boolean>(false);
	const resolvedBorderRadius = borderRadius ?? radius;
	const resolvedBackgroundColor = backgroundColor ?? bgColor;

	// place the text cursor at the requested edge of the editable content
	const setCursor = useCallback((to: 'start' | 'end', length = 1) => {
		if (ref.current) {
			const range = document.createRange();
			range.setStart(ref.current, to === 'start' ? 0 : length);
			range.setEnd(ref.current, to === 'start' ? 0 : 1);
			const selection = globalThis.getSelection();
			selection?.removeAllRanges();
			selection?.addRange(range);
		}
	}, []);

	// select the full editable value when focus is programmatically applied
	const handleSelectAll = useCallback(() => {
		if (!ref.current?.firstChild) return;
		const range = document.createRange();
		range.selectNode(ref.current.firstChild);
		globalThis.getSelection()?.removeAllRanges();
		globalThis.getSelection()?.addRange(range);
	}, []);

	// sync editable state, focus, and displayed text from controlled props
	useEffect(() => {
		if (!ref.current) return;

		// Set contentEditable
		ref.current.contentEditable = isEditable ? 'true' : 'false';

		// Handle focus
		if (focus) {
			handleSelectAll();
			ref.current.focus();
		}
		setIsFocused(focus);

		// Update text
		const newText = value === '' ? cleanString(placeholder) : cleanString(value);
		innerText.current = newText;
		ref.current.innerText = newText;
		setText(newText);
	}, [value, placeholder, focus, isEditable, handleSelectAll]);

	// track whether the current content is displaying placeholder text
	useEffect(() => {
		if (placeholder) {
			setIsPlaceholder(text === placeholder);
		}
	}, [placeholder, text]);

	// normalize edited content and preserve placeholder behavior
	const handleSetValue = useCallback(
		(e: React.InputEvent<HTMLDivElement>) => {
			let textString = '';
			const stripped = e.currentTarget.innerText.replaceAll(/\s+/g, '');
			if (stripped.length === 0 && placeholder && ref.current) {
				ref.current.innerText = placeholder;
				setIsPlaceholder(true);
				setCursor('start');
			} else if (isPlaceholder) {
				const textString = e.currentTarget.innerText.replace(placeholder, '');
				innerText.current = cleanString(textString);
				if (ref.current) {
					ref.current.innerText = cleanString(textString);
					setCursor('end');
				}
			} else {
				textString = e.currentTarget.innerText;
				innerText.current = cleanString(textString || '');
			}
			onChange(innerText.current);
			setText(innerText.current);
		},
		[placeholder, isPlaceholder, onChange, setCursor],
	);

	// handle submit-on-enter and block unsupported angle-bracket input
	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			// stop propagation to avoid conflicts with listeners to shortcuts while editing
			e.stopPropagation();
			if (e.key === 'Enter' && ref.current) {
				e.preventDefault();
				ref.current.innerHTML = cleanString(innerText.current);
				onChange(null);
				onSubmit(innerText.current);
				ref?.current.blur();
				return true;
			}
			if (e.key === '<' || e.key === '>') {
				e.preventDefault();
				return false;
			}
		},
		[onChange, onSubmit],
	);

	// sanitize pasted content before inserting it into the editable field
	const handlePaste = useCallback(
		(e: React.ClipboardEvent<HTMLDivElement>) => {
			e.preventDefault();
			if (!e.clipboardData) return;
			const textData = e.clipboardData.getData('text/plain');
			if (!textData) return;
			const pasteText = cleanString(textData);
			const selection = globalThis.getSelection();
			if (!selection?.rangeCount) return;
			selection?.deleteFromDocument();
			selection?.getRangeAt(0).insertNode(document.createTextNode(pasteText));
			selection?.collapseToEnd();
			const newText = ref.current?.innerText || '';
			onChange(cleanString(newText));
			innerText.current = cleanString(newText);
			return true;
		},
		[onChange],
	);

	// update focus state and forward the focus event
	const handleFocus = useCallback(
		(e: React.FocusEvent<HTMLDivElement>) => {
			setIsFocused(true);
			onFocus(e);
		},
		[onFocus],
	);

	// normalize content on blur and submit the final value
	const handleBlur = useCallback(
		(_e: React.FocusEvent<HTMLDivElement>) => {
			if (!ref.current) return;
			const blurText = cleanString(innerText.current);
			if (blurText === '') {
				ref.current.innerText = placeholder;
				innerText.current = placeholder;
			}
			onChange(null);
			onSubmit(innerText.current);
			setIsFocused(false);
			onBlur(blurText);
		},
		[placeholder, onChange, onSubmit, onBlur],
	);

	// keep cursor placement predictable when clicking placeholder content
	const handleClick = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			if (isPlaceholder) setTimeout(() => setCursor('start'), 50);
			onClick();
		},
		[isPlaceholder, setCursor, onClick],
	);

	// normalize width values before applying them as CSS
	const setWidth = useCallback((width: number | string) => {
		if (typeof width === 'string') return width;
		return `${width}px`;
	}, []);

	// compose CSS custom properties for layout, wrapping, and editing state
	const cssVars = useMemo(() => {
		return {
			'--div-input-color': isPlaceholder ? 'var(--core-text-tertiary)' : 'var(--core-text-primary)',
			'--div-input-width': `${setWidth(width)}`,
			'--div-input-user-select': isEditable ? 'text' : 'none',
			'--div-input-padding': padding ?? '0',
			'--div-input-text-align': textAlign ?? 'left',
			'--div-input-white-space': isEditable && wrap ? 'wrap' : 'no-wrap',
			'--div-input-line-clamp': isEditable && isFocused ? 'none' : (clamp ?? 'none'),
			'--div-input-cursor': isEditable ? 'text' : 'default',
			'--div-input-bg': isEditable ? (bgColor ?? 'var(--core-surface-secondary)') : 'transparent',
			'--div-input-wrapper-bg':
				isEditable && isFocused ? (resolvedBackgroundColor ?? 'var(--core-surface-secondary)') : 'transparent',
			'--div-input-border-radius': `${resolvedBorderRadius}px`,
		} as React.CSSProperties;
	}, [
		clamp,
		wrap,
		isEditable,
		width,
		textAlign,
		isFocused,
		padding,
		isPlaceholder,
		setWidth,
		resolvedBackgroundColor,
		resolvedBorderRadius,
		bgColor,
	]);

	/* START.DEBUG */
	useTrackRenders(props, 'DivInput');
	/* END.DEBUG */

	// wrap the editable div to avoid Safari refocus issues on blur
	return (
		<div id={divId} className={`${css.wrapper}${divClass}`} style={{ ...divStyle, ...cssVars }} {...rest}>
			<motion.div
				className={css.input}
				ref={ref}
				contentEditable={isEditable}
				suppressContentEditableWarning={true}
				onInput={handleSetValue}
				onKeyDown={handleKeyDown}
				onFocus={handleFocus}
				onBlur={handleBlur}
				onPaste={handlePaste}
				onDoubleClick={onDblClick}
				onClick={handleClick}
				role={'textbox'}
				aria-label={name}
			>
				{value ?? placeholder}
			</motion.div>
		</div>
	);
});

DivInput.displayName = 'DivInput';
