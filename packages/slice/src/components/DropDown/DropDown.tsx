'use client';

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { corners } from '../../theme/corners/corners';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import typeCss from '../../utils/styling/type.module.css';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import { Icon } from '../Icon';
import css from './DropDown.module.css';
import type { DropDownOption, DropDownProps } from './_types';
import { resolveOptions } from './resolveOptions';

const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const withoutAria = (attributes: object) =>
	Object.fromEntries(Object.entries(attributes).filter(([key]) => !key.startsWith('aria-') && key !== 'role'));
function resolveValueKey(value: unknown, valueKey?: string) {
	if (!valueKey || value === null || typeof value !== 'object') return undefined;
	return (value as Record<string, unknown>)[valueKey];
}
function matchesValue(left: unknown, right: unknown, valueKey?: string) {
	if (Object.is(left, right)) return true;
	const key = resolveValueKey(left, valueKey);
	return key !== undefined && Object.is(key, resolveValueKey(right, valueKey));
}
function formValue<T>(option: DropDownOption<T>, index: number, valueKey?: string) {
	if (option.formValue !== undefined) return option.formValue;
	const value = option.value;
	if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint')
		return String(value);
	const key = resolveValueKey(value, valueKey);
	if (typeof key === 'string' || typeof key === 'number' || typeof key === 'boolean' || typeof key === 'bigint')
		return String(key);
	return String(index);
}
function optionLabel<T>(option: DropDownOption<T>) {
	if (option.label !== undefined) return option.label;
	if (typeof option.value === 'object') return 'Select an option';
	return String(option.value);
}
function DropDownComponent<T = string>(rawProps: DropDownProps<T>) {
	const props = resolveColorProps(rawProps);
	const {
		name,
		inputName,
		inputId,
		inputAttributes = {},
		label,
		variant = 'simple',
		behavior = 'persistent',
		labelSize = 'm',
		stackedGap = 2,
		stackedLabelTextSize = 'body-xs-regular',
		labelBackgroundColor = 'var(--core-surface-primary)',
		tip,
		errorMessage,
		textColorError = 'var(--feedback-warning)',
		labelColor = 'var(--core-text-primary)',
		textSize = 'm',
		width = '100%',
		height = 'auto',
		inline = false,
		value,
		defaultValue,
		valueKey,
		options: optionItems,
		children,
		placeholder = true,
		borderRadius = corners['corner-m'],
		backgroundColor,
		iconColor = 'var(--core-text-primary)',
		textColor = 'var(--core-text-primary)',
		textColorDisabled = 'var(--core-text-disabled)',
		textColorPlaceholder = 'var(--core-text-tertiary)',
		borderWidth = 1,
		borderColor = 'var(--core-outline-primary)',
		borderColorFocused = 'var(--core-link-primary)',
		borderColorError = 'var(--feedback-warning)',
		borderColorDisabled = 'var(--core-outline-primary)',
		padding,
		paddingLeft,
		paddingRight,
		paddingTop,
		paddingBottom,
		borderStyle = 'box',
		iconSize = 20,
		disabled = false,
		error = false,
		gap = 8,
		onChange,
		className,
		style,
		...spanAttributes
	} = props;
	const { options, elements: optionElements } = useMemo(
		() => resolveOptions<T>(optionItems, children),
		[optionItems, children],
	);
	const generatedId = useId();
	const id = inputId || generatedId;
	const hasLabel = Boolean(label?.trim());
	const ref = useRef<HTMLSelectElement>(null);
	const wrapperRef = useRef<HTMLSpanElement>(null);
	const faceRef = useRef<HTMLSpanElement>(null);
	const reduced = usePrefersReducedMotion();
	const message = (error ? errorMessage : tip)?.trim();
	const messageId = `${id}-message`;
	const initialValue = useRef(defaultValue === undefined ? options[0]?.value : defaultValue);
	const [localSelection, setLocalSelection] = useState<{ value: T | null | undefined }>({
		value: initialValue.current,
	});
	const localValue = localSelection.value;
	const [isFocused, setIsFocused] = useState(false);
	const controlled = value !== undefined;
	const getValue = () => {
		if (controlled) return value;
		if (localValue === undefined) return options[0]?.value;
		return localValue;
	};
	const selectedValue = getValue();
	const index =
		selectedValue == null ? -1 : options.findIndex((option) => matchesValue(option.value, selectedValue, valueKey));
	const option = options[index];
	const appearing = variant === 'stacked' && behavior === 'appear' && !reduced && hasLabel;
	const emptySelection = index < 0 || selectedValue === '' || (placeholder && index === 0);
	const collapsedLabel = appearing && emptySelection;
	const nativeValue = option ? formValue(option, index, valueKey) : '';
	const latestNativeValue = useRef(nativeValue);
	latestNativeValue.current = nativeValue;
	// Persist the first available choice if options arrive after mount.
	useEffect(() => {
		if (!controlled && localValue === undefined && options.length) setLocalSelection({ value: options[0].value });
	}, [controlled, localValue, options]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: Native form ownership can change independently of selection state.
	useEffect(() => {
		const select = ref.current;
		const form = select?.form;
		if (!select || !form) return;
		let resetTimer: ReturnType<typeof setTimeout> | undefined;
		const reset = (event: Event) => {
			clearTimeout(resetTimer);
			// Wait for the browser's reset default action, which can run after microtasks.
			resetTimer = setTimeout(() => {
				if (event.defaultPrevented) return;
				if (controlled) select.value = latestNativeValue.current;
				else {
					// Reapply native selection even when resetting to the unchanged value.
					setLocalSelection({ value: initialValue.current });
				}
			}, 0);
		};
		form.addEventListener('reset', reset);
		return () => {
			clearTimeout(resetTimer);
			form.removeEventListener('reset', reset);
		};
	}, [controlled, inputAttributes.form]);
	useEffect(() => {
		if (disabled) setIsFocused(false);
	}, [disabled]);
	useClientLayoutEffect(() => {
		const wrapper = wrapperRef.current;
		const face = faceRef.current;
		if (!wrapper || !face) return;
		const slot = face.querySelector<HTMLElement>('[data-label-slot]');
		const floatingLabel = slot?.querySelector('label');
		const measure = () => {
			if (variant === 'outlined' && floatingLabel) {
				wrapper.style.setProperty('--dd-label-font-size', getComputedStyle(floatingLabel).fontSize);
			}
			face.style.setProperty('--dd-column-top', `${face.offsetTop}px`);
			const padding = getComputedStyle(wrapper);
			const leftInset = Number.parseFloat(padding.paddingLeft) + Number.parseFloat(padding.borderLeftWidth);
			const rightInset = Number.parseFloat(padding.paddingRight) + Number.parseFloat(padding.borderRightWidth);
			wrapper.parentElement?.style.setProperty('--dd-content-left', `${leftInset}px`);
			wrapper.parentElement?.style.setProperty('--dd-content-right', `${rightInset}px`);
			if (variant === 'stacked' && slot) {
				const style = getComputedStyle(slot);
				const space = (Number.parseFloat(style.height) || 0) + (Number.parseFloat(style.marginBottom) || 0);
				wrapper.style.setProperty('--dd-label-space', `${space}px`);
			}
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(wrapper);
		observer.observe(face);
		if (slot) observer.observe(slot);
		return () => observer.disconnect();
	}, [
		variant,
		label,
		labelSize,
		stackedLabelTextSize,
		stackedGap,
		padding,
		paddingLeft,
		paddingRight,
		paddingTop,
		paddingBottom,
		width,
		height,
		iconSize,
		message,
		style,
	]);
	const getAccessibleName = () => {
		if (inputName?.trim()) return inputName.trim();
		if (hasLabel) return undefined;
		return name?.trim() || 'Select an option';
	};
	const getDisplayText = () => {
		if (collapsedLabel) return label;
		if (!option) return placeholder ? 'Select an option' : '';
		return optionLabel(option).replace(/^--\s*/, '');
	};
	const getTextColor = () => {
		if (disabled) return textColorDisabled;
		if (collapsedLabel || (placeholder && index <= 0)) return textColorPlaceholder;
		return textColor;
	};
	const getBorderColor = () => {
		if (disabled) return borderColorDisabled;
		if (error) return borderColorError;
		if (isFocused) return borderColorFocused;
		return borderColor;
	};
	const getBorder = () => {
		if (borderStyle === 'none') return 'none';
		return `${setStyle(borderWidth)} solid ${getBorderColor()}`;
	};
	const getPadding = () => {
		if (padding != null) return setStyle(padding);
		if (borderStyle === 'none') return '0 0 var(--spacing-s) 0';
		if (variant === 'outlined')
			return 'calc(var(--spacing-s) + var(--dd-label-font-size, 0px) / 2) var(--spacing-m) var(--spacing-s)';
		return 'var(--spacing-s) calc(var(--spacing-m) - var(--spacing-xs)) var(--spacing-s) var(--spacing-m)';
	};
	const sidePadding: React.CSSProperties = {};
	if (paddingTop != null) sidePadding.paddingTop = setStyle(paddingTop);
	if (paddingRight != null) sidePadding.paddingRight = setStyle(paddingRight);
	if (paddingBottom != null) sidePadding.paddingBottom = setStyle(paddingBottom);
	if (paddingLeft != null) sidePadding.paddingLeft = setStyle(paddingLeft);
	const getBackgroundColor = () => {
		if (backgroundColor !== undefined) return backgroundColor;
		if (borderStyle === 'underline') return 'transparent';
		return 'var(--core-surface-secondary)';
	};
	const cssVars = {
		'--dd-gap': setStyle(gap),
		'--dd-height': setStyle(height),
		'--dd-width': setStyle(width),
		'--dd-margin': inline ? '0 var(--spacing-xs)' : '0',
		'--dd-border-radius': borderStyle === 'box' ? setStyle(borderRadius) : '0px',
		'--dd-border': borderStyle === 'box' ? getBorder() : 'none',
		'--dd-border-bottom': getBorder(),
		'--dd-color': getTextColor(),
		'--dd-bg-color': getBackgroundColor(),
		'--dd-padding': getPadding(),
		'--dd-icon-size': setStyle(iconSize),
		'--dd-label-color': disabled ? textColorDisabled : labelColor,
		'--dd-display': inline ? 'inline-flex' : 'flex',
		'--dd-stacked-gap': setStyle(Number.isFinite(stackedGap) ? Math.max(0, stackedGap) : 2),
		'--dd-label-background': labelBackgroundColor,
	} as React.CSSProperties;
	/* START.DEBUG */
	useTrackRenders(props, 'DropDown');
	/* END.DEBUG */
	return (
		<span className={css.field} style={cssVars}>
			<span
				{...withoutAria(spanAttributes)}
				ref={wrapperRef}
				data-variant={variant}
				data-appear={appearing || undefined}
				data-collapsed-label={collapsedLabel || undefined}
				className={`${css.wrapper}${className ? ` ${className}` : ''}`}
				style={{ ...style, ...cssVars, ...sidePadding }}
			>
				{hasLabel && variant === 'simple' && (
					<label className={`${css.label} ${css[labelSize]}`} htmlFor={id}>
						{label}
					</label>
				)}
				{hasLabel && variant === 'simple' && (
					<span className={`${css.separator} ${css[labelSize]}`} aria-hidden="true">
						|
					</span>
				)}
				<span ref={faceRef} className={`${css.face} ${css[textSize]}`}>
					{hasLabel && variant !== 'simple' && (
						<span className={css.labelSlot} data-label-slot>
							<label
								className={`${css.label} ${typeCss[stackedLabelTextSize] ?? typeCss['body-xs-regular']}`}
								htmlFor={id}
							>
								{label}
							</label>
						</span>
					)}
					<span className={css.faceText} aria-hidden="true">
						{getDisplayText() || '\u00a0'}
					</span>
				</span>
				<span className={css.chevron} aria-hidden="true">
					<Icon name="chevron down" size={iconSize} strokeColor={disabled ? textColorDisabled : iconColor} />
				</span>
				<select
					{...withoutAria(inputAttributes)}
					className={`${css.select} ${css[textSize]}`}
					value={nativeValue}
					ref={ref}
					id={id}
					name={name}
					disabled={disabled}
					aria-label={getAccessibleName()}
					aria-invalid={error || undefined}
					aria-describedby={message ? messageId : undefined}
					onFocus={(event) => {
						setIsFocused(true);
						inputAttributes.onFocus?.(event);
					}}
					onBlur={(event) => {
						setIsFocused(false);
						inputAttributes.onBlur?.(event);
					}}
					onChange={(event) => {
						if (disabled) return;
						const selectedIndex = event.currentTarget.selectedOptions[0]?.getAttribute('data-index');
						if (selectedIndex == null) return;
						const nextIndex = Number(selectedIndex);
						const next = options[nextIndex];
						if (!next || next.disabled || nextIndex === index) return;
						if (!controlled) setLocalSelection({ value: next.value });
						onChange?.(next.value, next, nextIndex);
					}}
				>
					{index < 0 && <option value="" hidden disabled />}
					{options.map((item, i) => {
						const element = optionElements?.[i];
						const key = formValue(item, i, valueKey);
						const attributes = {
							value: formValue(item, i, valueKey),
							'data-index': i,
							disabled: item.disabled,
						};
						if (element) return React.cloneElement(element, { ...attributes, key });
						return (
							<option key={key} {...attributes}>
								{optionLabel(item)}
							</option>
						);
					})}
				</select>
			</span>
			{message && (
				<span
					id={messageId}
					className={`${css.message} ${typeCss['body-xs-regular']}`}
					style={{ color: error ? textColorError : 'var(--core-text-tertiary)' }}
				>
					{message}
				</span>
			)}
		</span>
	);
}
DropDownComponent.displayName = 'DropDown';
export const DropDown = React.memo(DropDownComponent) as <T = string>(props: DropDownProps<T>) => React.JSX.Element;
