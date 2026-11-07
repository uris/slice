'use client';

import {
	AnimatePresence,
	type Transition,
	motion,
	useAnimationControls,
	usePresence,
	usePresenceData,
} from 'motion/react';
import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import typeCss from '../../utils/styling/type.module.css';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import css from './TextField.module.css';
import type { TextFieldProps } from './_types';

const withoutAria = (attributes: object) =>
	Object.fromEntries(Object.entries(attributes).filter(([key]) => !key.startsWith('aria-') && key !== 'role'));
const useClientLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const defaultClearButton = { size: 20 };
type ActionMotion = { reduced: boolean; transition: Transition };
function ActionFrame({ children, settings }: { children: React.ReactNode; settings: ActionMotion }) {
	const [present, safeToRemove] = usePresence();
	const presenceSettings = usePresenceData() as ActionMotion | undefined;
	const live = present ? settings : (presenceSettings ?? settings);
	const controls = useAnimationControls();
	useEffect(() => {
		if (live.reduced) {
			controls.set({ opacity: present ? 1 : 0 });
			if (!present) safeToRemove?.();
			return;
		}
		let active = true;
		void controls.start({ opacity: present ? 1 : 0, transition: live.transition }).then(() => {
			if (active && !present) safeToRemove?.();
		});
		return () => {
			active = false;
			controls.stop();
		};
	}, [controls, live.reduced, live.transition, present, safeToRemove]);
	return (
		<motion.div
			className={css.action}
			initial={{ opacity: live.reduced ? 1 : 0 }}
			animate={controls}
			inert={!present}
			aria-hidden={!present || undefined}
		>
			{children}
		</motion.div>
	);
}
function TextFieldComponent(rawProps: TextFieldProps) {
	const props = resolveColorProps(rawProps);
	const theme = useTheme();
	const reduced = usePrefersReducedMotion();
	const {
		name,
		inputName,
		inputId,
		inputAttributes = {},
		value,
		defaultValue = '',
		label,
		variant = 'simple',
		behavior = 'persistent',
		stackedGap = 2,
		labelBackgroundColor = 'var(--core-surface-primary)',
		stackedLabelTextSize = 'body-xs-regular',
		labelSize = 'm',
		textSize = 'm',
		placeholder = 'placeholder',
		focused,
		onSubmit,
		onChange,
		onBlur,
		onFocus,
		onKeyDown,
		onAction,
		onPaste,
		onClear,
		actionButton = false,
		actionLabel = 'Action',
		maxLength,
		width = '100%',
		height = 'auto',
		padding,
		borderRadius,
		readOnly = false,
		textAlign = 'left',
		inline = false,
		showPasswordToggle = true,
		borderStyle = 'box',
		error = false,
		errorMessage,
		tip,
		borderColorFocused = 'var(--core-link-primary)',
		borderColorBlurred = 'var(--core-outline-primary)',
		borderColorError = 'var(--feedback-warning)',
		backgroundColorFocused,
		backgroundColorBlurred,
		textColorFocused = 'var(--core-text-primary)',
		textColorBlurred = 'var(--core-text-primary)',
		textColorError = 'var(--feedback-warning)',
		textColorPlaceholder = 'var(--core-text-disabled)',
		textColorDisabled = 'var(--core-text-disabled)',
		labelColor = 'var(--core-text-primary)',
		iconLeft,
		clearButton = defaultClearButton,
		clearBlurs = false,
		disabled = false,
		inputType = 'text',
		transition,
		className,
		style,
		...divAttributes
	} = props;
	const generatedId = useId();
	const id = inputId || generatedId;
	const hasLabel = Boolean(label?.trim());
	const getAccessibleName = () => {
		const customName = inputName?.trim();
		if (customName) return customName;
		if (hasLabel) return undefined;
		return name?.trim() || 'Text input';
	};
	const accessibleName = getAccessibleName();
	const message = (error ? errorMessage : tip)?.trim();
	const messageId = `${id}-message`;
	const input = useRef<HTMLInputElement>(null);
	const column = useRef<HTMLDivElement>(null);
	useClientLayoutEffect(() => {
		if (!message || !input.current) return;
		const element = input.current;
		const wrapper = element.closest<HTMLElement>('[data-variant]');
		const field = wrapper?.parentElement;
		if (!wrapper || !field) return;
		const measure = () => {
			const padding = getComputedStyle(wrapper);
			field.style.setProperty('--tf-message-left', padding.paddingLeft);
			field.style.setProperty('--tf-message-right', padding.paddingRight);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(wrapper);

		return () => {
			observer.disconnect();
			field.style.removeProperty('--tf-message-left');
			field.style.removeProperty('--tf-message-right');
		};
	}, [message, variant, iconLeft, padding, width, inputType, showPasswordToggle, clearButton, actionButton]);
	const initialValue = useRef(defaultValue);
	const [localText, setLocalText] = useState(defaultValue);
	const controlled = value !== undefined;
	const text = controlled ? value : localText;
	const [isFocused, setIsFocused] = useState(false);
	const [show, setShow] = useState(false);
	const canEdit = !disabled && !readOnly;
	const canPreviewPassword = !disabled && text.length > 0;
	const appearing = variant === 'stacked' && behavior === 'appear' && !reduced && hasLabel;
	const collapsedLabel = appearing && text.length === 0;
	useClientLayoutEffect(() => {
		if (variant !== 'outlined' || !hasLabel || !column.current) return;
		const element = column.current;
		const label = element.querySelector('label');
		const wrapper = element.closest<HTMLElement>('[data-variant]');
		const measure = () => {
			if (label && wrapper) {
				wrapper.style.setProperty('--tf-label-font-size', getComputedStyle(label).fontSize);
			}
			element.style.setProperty('--tf-column-top', `${element.offsetTop}px`);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(element);
		if (label) observer.observe(label);
		if (element.offsetParent) observer.observe(element.offsetParent);
		return () => {
			observer.disconnect();
			element.style.removeProperty('--tf-column-top');
			wrapper?.style.removeProperty('--tf-label-font-size');
		};
	}, [variant, hasLabel, padding, width, height, iconLeft?.size, labelSize, stackedLabelTextSize]);
	useClientLayoutEffect(() => {
		if (variant !== 'stacked' || !hasLabel || !column.current) return;
		const slot = column.current.firstElementChild;
		const container = column.current.parentElement;
		if (!(slot instanceof HTMLElement) || !container) return;
		const measure = () => {
			const style = getComputedStyle(slot);
			const labelHeight = Number.parseFloat(style.height) || 0;
			const gap = Number.parseFloat(style.marginBottom) || 0;
			container.style.setProperty('--tf-label-space', `${labelHeight + gap}px`);
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(slot);
		return () => {
			observer.disconnect();
			container.style.removeProperty('--tf-label-space');
		};
	}, [variant, hasLabel, stackedGap, stackedLabelTextSize]);
	const timing = useMemo(
		() => getWaterTransition(theme.current.motion, transition),
		[theme.current.motion, transition],
	);
	const actionMotion = useMemo(() => ({ reduced, transition: timing }), [reduced, timing]);
	useEffect(() => {
		if (disabled) {
			setIsFocused(false);
			return;
		}
		if (focused === undefined) return;
		if (focused) input.current?.focus();
		else input.current?.blur();
	}, [focused, disabled]);
	useEffect(() => {
		if (inputType !== 'password') setShow(false);
	}, [inputType]);
	// biome-ignore lint/correctness/useExhaustiveDependencies: Rebind when the native input changes its external form owner.
	useEffect(() => {
		if (controlled) return;
		const form = input.current?.form;
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
	const changeText = (next: string) => {
		if (!canEdit) return;
		if (!controlled) setLocalText(next);
		onChange?.(next);
	};
	const clear = () => {
		if (!canEdit || text === '') return;
		changeText('');
		onClear?.();
		if (clearBlurs) input.current?.blur();
		else input.current?.focus();
	};
	const iconInset = 'calc(var(--spacing-m) - var(--spacing-xs))';
	const trailingIcon = (inputType === 'password' && showPasswordToggle) || (!actionButton && clearButton);
	const getPadding = () => {
		if (padding != null) return setStyle(padding);
		if (variant === 'outlined') {
			return 'calc(var(--spacing-s) + var(--tf-label-font-size, 0px) / 2) var(--spacing-m)';
		}
		const left = iconLeft ? iconInset : 'var(--spacing-m)';
		const right = trailingIcon ? iconInset : 'var(--spacing-m)';
		return `var(--spacing-s) ${right} var(--spacing-s) ${left}`;
	};
	const getBorderColor = () => {
		if (error) return borderColorError;
		if (isFocused) return borderColorFocused;
		return borderColorBlurred;
	};
	const getTextColor = () => {
		if (disabled) return textColorDisabled;
		if (isFocused) return textColorFocused;
		return textColorBlurred;
	};
	const getBackgroundColor = () => {
		if (inline) return 'transparent';
		const fallback = borderStyle === 'underline' ? 'transparent' : 'var(--core-surface-secondary)';
		if (isFocused) return backgroundColorFocused ?? fallback;
		return backgroundColorBlurred ?? fallback;
	};
	const getBoxShadow = () => {
		if (borderStyle === 'none') return 'none';
		const borderColor = getBorderColor();
		if (borderStyle === 'underline') return `0 1px 0 0 ${borderColor}`;
		return `0 0 0 1px ${borderColor}`;
	};
	const cssVars = {
		'--tf-width': setStyle(width),
		'--tf-height': setStyle(height),
		'--tf-padding': getPadding(),
		'--tf-border-radius': setStyle(borderRadius, borderStyle === 'underline' ? 0 : 8),
		'--tf-bg-color': getBackgroundColor(),
		'--tf-box-shadow': getBoxShadow(),
		'--tf-text-color': getTextColor(),
		'--tf-label-color': disabled ? textColorDisabled : labelColor,
		'--tf-text-align': textAlign,
		'--tf-placeholder-color': textColorPlaceholder,
		'--tf-field-size': width === 'auto' ? 'content' : 'fixed',
		'--tf-input-width': width === 'auto' ? 'auto' : '100%',
		'--tf-clear-size': setStyle(clearButton?.size ?? 20),
		'--tf-icon-size': setStyle(iconLeft?.size ?? 20),
		'--tf-stacked-gap': setStyle(Number.isFinite(stackedGap) ? Math.max(0, stackedGap) : 2),
		'--tf-label-background': labelBackgroundColor,
	} as React.CSSProperties;
	/* START.DEBUG */
	useTrackRenders(props, 'TextField');
	/* END.DEBUG */
	const leadingIcon = iconLeft ? (
		<span className={css.leadingIcon} aria-hidden="true">
			<Icon
				name={iconLeft.name}
				size={iconLeft.size ?? 20}
				strokeColor={iconLeft.color ?? theme.current.colors['core-icon-secondary']}
			/>
		</span>
	) : null;
	return (
		<div className={css.field} style={{ width: setStyle(width) }}>
			<div
				{...withoutAria(divAttributes)}
				data-variant={variant}
				data-appear={appearing || undefined}
				data-collapsed-label={collapsedLabel || undefined}
				className={`${css.wrapper}${className ? ` ${className}` : ''}`}
				style={{ ...style, ...cssVars, '--tf-width': '100%' } as React.CSSProperties}
			>
				{variant === 'simple' && leadingIcon}
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
				<div className={css.container}>
					{variant !== 'simple' && leadingIcon}

					<div ref={column} className={css.textColumn}>
						{hasLabel && variant !== 'simple' && (
							<div className={css.labelSlot}>
								<label
									className={`${css.label} ${typeCss[stackedLabelTextSize] ?? typeCss['body-xs-regular']}`}
									htmlFor={id}
								>
									{label}
								</label>
							</div>
						)}
						<input
							{...withoutAria(inputAttributes)}
							id={id}
							className={`${css.input} ${css[textSize]}`}
							ref={input}
							type={inputType === 'password' && show ? 'text' : inputType}
							name={name}
							aria-label={accessibleName}
							aria-invalid={error || undefined}
							aria-describedby={message ? messageId : undefined}
							autoCapitalize={inputAttributes.autoCapitalize ?? 'none'}
							autoCorrect={inputAttributes.autoCorrect ?? 'off'}
							value={text}
							onChange={(event) => changeText(event.target.value)}
							placeholder={collapsedLabel ? label : placeholder}
							maxLength={maxLength}
							disabled={disabled}
							readOnly={readOnly}
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
							onMouseDown={(event) => {
								inputAttributes.onMouseDown?.(event);
								event.stopPropagation();
							}}
							onKeyDown={(event) => {
								if (disabled) return;
								onKeyDown?.(event);
								if (
									event.defaultPrevented ||
									readOnly ||
									event.key !== 'Enter' ||
									event.nativeEvent.isComposing ||
									event.nativeEvent.keyCode === 229
								)
									return;
								if (!onSubmit) return;
								event.preventDefault();
								onSubmit(event.currentTarget.value);
								event.currentTarget.blur();
							}}
						/>
					</div>
					{clearButton && (
						<button
							type="button"
							aria-label="Clear text"
							className={css.clearButton}
							data-has-value={text !== '' || undefined}
							disabled={!canEdit || text === ''}
							onMouseDown={(event) => {
								if (!clearBlurs) event.preventDefault();
							}}
							onClick={clear}
						>
							<Icon
								aria-hidden="true"
								name="basic.cross"
								size={clearButton.size ?? 20}
								strokeColor={theme.current.colors['core-icon-secondary']}
							/>
						</button>
					)}
					<AnimatePresence initial={false} custom={actionMotion}>
						{actionButton && (
							<ActionFrame key="action" settings={actionMotion}>
								<Button
									label={actionLabel.trim() || 'Action'}
									variant="text"
									buttonSize="s"
									state={!canEdit || text === '' ? 'disabled' : 'normal'}
									textColor={theme.current.colors['core-button-primary']}
									onClick={() => {
										if (canEdit && text !== '') onAction?.();
									}}
								/>
							</ActionFrame>
						)}
					</AnimatePresence>
					{inputType === 'password' && showPasswordToggle && (
						<div className={css.showPassword}>
							<IconButton
								actionName={show ? 'Hide password' : 'Show password'}
								icon={show ? 'security.eye-slash' : 'security.eye'}
								toggle
								selected={show}
								iconSize={18}
								buttonSize={18}
								disabled={!canPreviewPassword}
								onClick={() => {
									if (canPreviewPassword) setShow((previous) => !previous);
								}}
							/>
						</div>
					)}
				</div>
			</div>
			{message && (
				<div
					id={messageId}
					className={`${css.message} ${typeCss['body-xs-regular']}`}
					data-error={error || undefined}
					style={{ color: error ? textColorError : 'var(--core-text-tertiary)' }}
				>
					{message}
				</div>
			)}
		</div>
	);
}
TextFieldComponent.displayName = 'TextField';
export const TextField = React.memo<TextFieldProps>(TextFieldComponent);
