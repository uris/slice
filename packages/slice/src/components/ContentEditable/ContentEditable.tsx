'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { corners } from '../../theme/corners/corners';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import css from './ContentEditable.module.css';
import type { ContentEditableEditEndReason, ContentEditableProps } from './_types';

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const withoutAria = (attributes: object) =>
	Object.fromEntries(Object.entries(attributes).filter(([key]) => !key.startsWith('aria-') && key !== 'role'));
const singleLine = (text: string) => text.replace(/[\r\n\t]+/g, ' ');
function selectText(element: HTMLElement, all: boolean) {
	const selection = element.ownerDocument.getSelection();
	if (!selection) return;
	const range = element.ownerDocument.createRange();
	range.selectNodeContents(element);
	if (!all) range.collapse(false);
	selection.removeAllRanges();
	selection.addRange(range);
}

function ContentEditableComponent(rawProps: ContentEditableProps) {
	const props = resolveColorProps(rawProps);
	const {
		name = 'Editable text',
		value,
		defaultValue = '',
		isEditable = false,
		selectOnEdit = false,
		placeholder = 'Untitled',
		width = 'auto',
		textAlign = 'left',
		textSize,
		textColor,
		textColorPlaceholder = 'var(--core-text-tertiary)',
		clamp = 0,
		padding = 0,
		borderRadius = corners['corner-xs'],
		backgroundColor = 'var(--core-surface-secondary)',
		onChange,
		onCommit,
		onEditStart,
		onEditEnd,
		onInput,
		onKeyDown,
		onFocus,
		onBlur,
		onPaste,
		onCompositionStart,
		onCompositionEnd,
		tabIndex,
		className,
		style,
		...attributes
	} = props;
	const controlled = value !== undefined;
	const [localValue, setLocalValue] = useState(defaultValue);
	const committed = controlled ? (value ?? '') : localValue;
	const firstText = useRef(committed);
	const ref = useRef<HTMLSpanElement>(null);
	const session = useRef({ active: false, initial: committed });
	const draftRef = useRef(committed);
	const composing = useRef(false);
	const [draft, setDraft] = useState(committed);
	const [isFocused, setIsFocused] = useState(false);
	const syncText = (text: string) => {
		if (ref.current && ref.current.textContent !== text) ref.current.textContent = text;
		draftRef.current = text;
		setDraft(text);
	};
	const start = () => {
		if (session.current.active) return;
		session.current = { active: true, initial: committed };
		syncText(committed);
	};
	const publish = () => {
		if (!session.current.active || !ref.current) return;
		const next = singleLine(ref.current.textContent ?? '');
		if (next === draftRef.current) return;
		draftRef.current = next;
		setDraft(next);
		onChange?.(next);
	};
	const finish = (reason: ContentEditableEditEndReason, blur = true) => {
		if (!session.current.active) return;
		const previous = session.current.initial;
		const next = singleLine(ref.current?.textContent ?? draftRef.current);
		// Close before callbacks or blur can reenter the finish path.
		session.current.active = false;
		composing.current = false;
		if (reason === 'escape') syncText(committed);
		else {
			draftRef.current = next;
			setDraft(next);
			if (!controlled) setLocalValue(next);
		}
		try {
			if (reason !== 'escape' && next !== previous) onCommit?.(next, previous);
		} finally {
			onEditEnd?.(reason);
			const element = ref.current;
			if (blur && element && element.ownerDocument.activeElement === element) element.blur();
		}
	};
	useClientLayoutEffect(() => {
		const element = ref.current;
		if (!element) return;
		if (isEditable) {
			const selection = element.ownerDocument.getSelection();
			let activationRange: Range | undefined;
			if (selection?.rangeCount && element.contains(selection.getRangeAt(0).commonAncestorContainer)) {
				activationRange = selection.getRangeAt(0).cloneRange();
			}
			start();
			element.focus();
			// Generated placeholder text is not a valid selection to restore.
			if (selectOnEdit || !element.textContent) selectText(element, selectOnEdit);
			else if (selection && activationRange && element.contains(activationRange.commonAncestorContainer)) {
				// Focusing contenteditable can reset the caret placed by the activation click.
				selection.removeAllRanges();
				selection.addRange(activationRange);
			} else selectText(element, false);
		} else if (session.current.active) finish('external');
	}, [isEditable]);
	// The browser owns the DOM/caret during editing. React keeps only the initial text child.
	useClientLayoutEffect(() => {
		if (!session.current.active) syncText(committed);
	});
	const insertPlainText = (text: string) => {
		const element = ref.current;
		if (!element || !session.current.active) return;
		const document = element.ownerDocument;
		const selection = document.getSelection();
		if (!selection) return;
		// An empty placeholder can leave a visual selection without an insertion caret.
		if (
			!element.textContent ||
			!selection.rangeCount ||
			!element.contains(selection.getRangeAt(0).commonAncestorContainer)
		)
			selectText(element, false);
		let inserted = false;
		try {
			// Native insertion keeps paste in the browser's undo history.
			inserted = document.execCommand?.('insertText', false, text) ?? false;
		} catch {
			/* Fall back to a safe text node when native insertion is unavailable. */
		}
		if (!inserted && selection.rangeCount) {
			const range = selection.getRangeAt(0);
			range.deleteContents();
			const node = document.createTextNode(text);
			range.insertNode(node);
			range.setStartAfter(node);
			range.collapse(true);
			selection.removeAllRanges();
			selection.addRange(range);
		}
		publish();
	};
	const getTextClass = () => {
		if (textSize) return ` ${css[textSize]}`;
		return '';
	};
	const cssVars = {
		'--di-width': setStyle(width),
		'--di-padding': setStyle(padding),
		'--di-text-align': textAlign,
		'--di-color': textColor ?? 'inherit',
		'--di-placeholder-color': textColorPlaceholder,
		'--di-background': isEditable ? backgroundColor : 'transparent',
		'--di-radius': setStyle(borderRadius),
		'--di-clamp': Number.isFinite(clamp) && clamp > 0 ? Math.floor(clamp) : 'none',
	} as React.CSSProperties;
	/* START.DEBUG */
	useTrackRenders(props, 'ContentEditable');
	/* END.DEBUG */
	return (
		<span
			{...withoutAria(attributes)}
			ref={ref}
			className={`${css.input}${getTextClass()}${className ? ` ${className}` : ''}`}
			style={{ ...style, ...cssVars }}
			contentEditable={isEditable}
			suppressContentEditableWarning
			role={isEditable ? 'textbox' : undefined}
			aria-label={isEditable ? name.trim() || 'Editable text' : undefined}
			aria-multiline={isEditable ? false : undefined}
			tabIndex={tabIndex ?? (isEditable || onEditStart ? 0 : undefined)}
			data-editable={isEditable || undefined}
			data-clamped={(Number.isFinite(clamp) && clamp > 0) || undefined}
			data-focused={isFocused || undefined}
			data-empty={draft.length === 0 || undefined}
			data-placeholder={placeholder}
			onInput={(event) => {
				onInput?.(event);
				if (isEditable) publish();
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (
					event.defaultPrevented ||
					composing.current ||
					event.nativeEvent.isComposing ||
					event.nativeEvent.keyCode === 229
				)
					return;
				if (!isEditable) {
					if (onEditStart && (event.key === 'Enter' || event.key === 'F2')) {
						event.preventDefault();
						onEditStart();
					}
					return;
				}
				if (event.key === 'Enter') {
					event.preventDefault();
					event.stopPropagation();
					finish('enter');
				} else if (event.key === 'Escape') {
					event.preventDefault();
					event.stopPropagation();
					finish('escape');
				}
			}}
			onFocus={(event) => {
				if (isEditable && !session.current.active) {
					start();
					if (selectOnEdit) selectText(event.currentTarget, true);
				}
				setIsFocused(true);
				onFocus?.(event);
			}}
			onBlur={(event) => {
				setIsFocused(false);
				finish('blur', false);
				onBlur?.(event);
			}}
			onPaste={(event) => {
				onPaste?.(event);
				if (event.defaultPrevented || !isEditable) return;
				event.preventDefault();
				insertPlainText(singleLine(event.clipboardData.getData('text/plain')));
			}}
			onCompositionStart={(event) => {
				composing.current = true;
				onCompositionStart?.(event);
			}}
			onCompositionEnd={(event) => {
				composing.current = false;
				if (isEditable) publish();
				onCompositionEnd?.(event);
			}}
		>
			{firstText.current}
		</span>
	);
}
ContentEditableComponent.displayName = 'ContentEditable';
export const ContentEditable = React.memo<ContentEditableProps>(ContentEditableComponent);
