'use client';

import { AnimatePresence, motion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { setStyle } from '../../utils/functions/misc';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import css from './TextField.module.css';
import { MOTION_CONFIG, type TextFieldProps } from './_types';

export const TextField = React.memo(
	(props: TextFieldProps) => {
		const theme = useTheme();
		const {
			name = 'input_name',
			value = '',
			label,
			labelSize = 'm',
			textSize = 'm',
			placeholder = 'placeholder',
			focused = false,
			onSubmit = () => null,
			onChange = () => null,
			onBlur = () => null,
			onFocus = () => null,
			onKeydown = () => null,
			onAction = () => null,
			onPaste = () => null,
			onClear = () => null,
			actionButton = false,
			maxLength = undefined,
			size = { width: '100%', height: 'auto' },
			padding,
			borderRadius = 8,
			editable = true,
			textAlign = 'left',
			inline = false,
			noShow = false,
			borderType = 'box',
			error = false,
			borderColorFocused = 'var(--core-link-primary)',
			borderColorBlurred = 'var(--core-outline-primary)',
			borderColorError = 'var(--feedback-warning)',
			backgroundColorFocused = 'var(--core-surface-secondary)',
			backgroundColorBlurred = 'var(--core-surface-secondary)',
			textColorFocused = 'var(--core-text-primary)',
			textColorBlurred = 'var(--core-text-primary)',
			textColorError = 'var(--feedback-warning)',
			textColorPlaceholder = 'var(--core-text-disabled)',
			textColorDisabled = 'var(--core-text-disabled)',
			labelColor = 'var(--core-text-primary)',
			iconLeft,
			clearButton = { size: 20 },
			clearBlurs = false,
			disabled = false,
			inputType = 'text',
			...divAttributes
		} = props;
		const { id: divId, className, style, ...rest } = divAttributes;
		const divStyle = style ?? ({} as React.CSSProperties);
		const divClass = className ? ` ${className}` : '';

		const input = useRef<HTMLInputElement>(null);
		const [text, setText] = useState<string>(value);
		const [isFocused, setIsFocused] = useState<boolean>(focused);
		const [show, setShow] = useState<boolean>(false);

		// sync the input focus state from the controlled prop
		useEffect(() => {
			if (!input.current) return;
			if (focused) {
				input.current.focus();
			} else {
				input.current.blur();
			}
			setIsFocused(focused);
		}, [focused]);

		// sync the input value from the controlled prop
		useEffect(() => {
			setText(value);
		}, [value]);

		// clear the field value and optionally preserve focus
		const handleClearTextField = useCallback(() => {
			if (disabled || input.current?.value === '') return;
			if (input?.current) {
				if (!clearBlurs) input.current.focus();
				setText('');
			}
			onChange('');
			onClear();
		}, [disabled, clearBlurs, onChange, onClear]);

		// update local and external state when the input value changes
		const handleValueChange = useCallback(
			(newValue: string) => {
				if (disabled) return;
				setText(newValue);
				onChange(newValue);
			},
			[onChange, disabled],
		);

		// validate and report the final value when the input loses focus
		const handleBlur = useCallback(() => {
			if (disabled) return;
			setIsFocused(false);
			onBlur(text);
		}, [text, onBlur, disabled]);

		// handle enter-key submission and forward keyboard events
		const handleKeyDown = useCallback(
			(e: React.KeyboardEvent) => {
				if (disabled) return;
				if (e.key === 'Enter') {
					handleBlur();
					onSubmit(text);
					input.current?.blur();
				}
				if (disabled) {
					e.preventDefault();
					return true;
				}
				onKeydown(e.key, e);
			},
			[text, disabled, onSubmit, onKeydown, handleBlur],
		);

		// update the focus state and report the current value on focus
		const handleFocus = useCallback(() => {
			if (disabled) return;
			setIsFocused(true);
			onFocus(text);
		}, [text, onFocus, disabled]);

		// toggle password visibility when the show button is used
		const toggleShow = useCallback(() => {
			setShow((prev) => !prev);
		}, []);

		// derive the left icon container dimensions from the icon config
		const iconContainerStyle = useMemo(
			() => (iconLeft ? { width: iconLeft.size, height: iconLeft.size } : undefined),
			[iconLeft],
		);

		// resolve the left icon stroke color from the theme and icon config
		const iconStrokeColor = useMemo(
			() => (iconLeft?.color ? iconLeft.color : theme.current.colors['core-icon-secondary']),
			[iconLeft, theme],
		);

		// derive the clear-button dimensions from the button config
		const clearButtonStyle = useMemo(
			() => (clearButton ? { minWidth: clearButton.size, minHeight: clearButton.size } : undefined),
			[clearButton],
		);

		// resolve the background color from inline and focus states
		const setBackgroundColor = useMemo(() => {
			if (inline) return 'unset';
			if (isFocused) return backgroundColorFocused ?? 'transparent';
			return backgroundColorBlurred ?? 'transparent';
		}, [inline, isFocused, backgroundColorFocused, backgroundColorBlurred]);

		// resolve the border color from focus and validation state
		const setBorderColor = useMemo(() => {
			if (borderType === 'none') return 'transparent';
			if (error) return borderColorError ?? borderColorBlurred ?? 'transparent';
			if (isFocused) return borderColorFocused ?? borderColorBlurred ?? 'transparent';
			return borderColorBlurred ?? 'transparent';
		}, [borderType, error, isFocused, borderColorError, borderColorFocused, borderColorBlurred]);

		// resolve the border rendering style for box and underline modes
		const setBoxShadow = useMemo(() => {
			if (borderType === 'none') return 'unset';
			if (borderType === 'underline') return `0 1px 0 0 ${setBorderColor}`;
			return `0 0 0 1px ${setBorderColor}`;
		}, [borderType, setBorderColor]);

		// resolve the input text color from validation and focus state
		const textColor = useMemo(() => {
			if (error) return textColorError ?? 'var(--core-text-primary)';
			if (isFocused) return textColorFocused ?? 'var(--core-text-primary)';
			return textColorBlurred ?? 'var(--core-text-primary)';
		}, [isFocused, error, textColorError, textColorFocused, textColorBlurred]);

		// resolve the text alignment fallback
		const setTextAlign = useMemo(() => {
			return textAlign ?? 'left';
		}, [textAlign]);

		// resolve the show-password control opacity from focus state
		const setShowOpacity = useMemo(() => {
			if (inputType !== 'password') return '0';
			if (isFocused) return '1';
			return '0.5';
		}, [inputType, isFocused]);

		const setPaddingRight = useMemo(() => {
			const defaultPadding = clearButton ? 8 : 16;
			if (!padding) return defaultPadding;
			if (typeof padding === 'string') {
				const paddingParts = padding.split(' ');
				const isSingleValue = paddingParts.length === 1;
				const sidePadding = paddingParts[isSingleValue ? 0 : 1];
				const sideAsNumber = Number.parseFloat(sidePadding.replace('px', ''));
				return Number.isNaN(sideAsNumber) ? defaultPadding : sideAsNumber - 4;
			}
			return clearButton ? padding - 4 : padding;
		}, [padding, clearButton]);

		// compose CSS custom properties for layout, color, and interaction states
		const cssVars = useMemo(() => {
			return {
				'--tf-input-width': size.width !== 'unset' && '100%',
				'--tf-field-size': size.width === 'auto' ? 'content' : 'unset',
				'--tf-width': setStyle(size.width),
				'--tf-height': setStyle(size.height),
				'--tf-padding': setStyle(padding, '8px 10px'),
				'--tf-padding-right': `${setPaddingRight}px`,
				'--tf-padding-label-left': label === '' ? 'unset' : '0',
				'--tf-border-radius': setStyle(borderRadius),
				'--tf-bg-color': setBackgroundColor,
				'--tf-box-shadow': setBoxShadow,
				'--tf-color': textColor,
				'--tf-label-color': disabled ? (textColorDisabled ?? 'var(--core-text-disabled)') : labelColor,
				'--tf-text-align': setTextAlign,
				'--tf-show-opacity': setShowOpacity,
				'--tf-placeholder-color': textColorPlaceholder ?? 'var(--core-text-disabled)',
			} as React.CSSProperties;
		}, [
			size,
			padding,
			label,
			borderRadius,
			setBackgroundColor,
			setBoxShadow,
			textColor,
			setTextAlign,
			setShowOpacity,
			textColorPlaceholder,
			textColorDisabled,
			labelColor,
			disabled,
			setPaddingRight,
		]);

		/* START.DEBUG */
		useTrackRenders(props, 'TextField');
		/* END.DEBUG */

		return (
			<div id={divId} className={`${css.wrapper}${divClass}`} style={{ ...divStyle, ...cssVars }} {...rest}>
				{label && <div className={`${css.label} ${css[labelSize]}`}>{label}</div>}
				<div className={css.container}>
					{iconLeft && (
						<div style={iconContainerStyle}>
							<Icon name={iconLeft.name} size={iconLeft.size} strokeColor={iconStrokeColor} />
						</div>
					)}
					<input
						className={`${css.input} ${css[textSize]}`}
						ref={input}
						type={inputType === 'password' && show ? 'text' : inputType}
						name={name}
						aria-label={name}
						autoCapitalize={'none'}
						autoCorrect={'off'}
						autoComplete={'off'}
						value={text}
						onChange={(e) => handleValueChange(e.target.value)}
						onKeyDown={handleKeyDown}
						onPaste={onPaste}
						placeholder={placeholder}
						onFocus={handleFocus}
						onBlur={handleBlur}
						onMouseDown={(e) => e.stopPropagation()}
						disabled={!editable || disabled}
						maxLength={maxLength}
					/>
					{clearButton && (
						<button
							type="button"
							aria-label="Clear text"
							className={css.clearButton}
							style={clearButtonStyle}
							onClick={handleClearTextField}
						>
							{isFocused && text !== '' && (
								<Icon name={'x'} size={clearButton.size} strokeColor={theme.current.colors['core-icon-secondary']} />
							)}
						</button>
					)}
					<AnimatePresence initial={false}>
						{actionButton && (
							<motion.div
								variants={MOTION_CONFIG.variants}
								initial={'initial'}
								animate={'animate'}
								exit={'exit'}
								transition={MOTION_CONFIG.transition}
							>
								<Button
									label={'Translate'}
									variant={'text'}
									size={'small'}
									state={text === '' ? 'disabled' : 'normal'}
									labelColor={theme.current.colors['core-button-primary']}
									onClick={onAction}
								/>
							</motion.div>
						)}
					</AnimatePresence>
					{inputType === 'password' && !noShow && (
						<div className={css.showPassword}>
							<IconButton
								icon={'view'}
								toggleIcon={true}
								toggle={false}
								isToggled={show}
								iconSize={18}
								frameSize={18}
								onClick={toggleShow}
								tooltip={'Show / Hide'}
								disabled={false}
							/>
						</div>
					)}
				</div>
			</div>
		);
	},
	(prevProps, nextProps) => {
		return (
			prevProps.value === nextProps.value &&
			prevProps.borderType === nextProps.borderType &&
			prevProps.borderRadius === nextProps.borderRadius &&
			prevProps.borderColorFocused === nextProps.borderColorFocused &&
			prevProps.borderColorBlurred === nextProps.borderColorBlurred &&
			prevProps.borderColorError === nextProps.borderColorError &&
			prevProps.backgroundColorFocused === nextProps.backgroundColorFocused &&
			prevProps.backgroundColorBlurred === nextProps.backgroundColorBlurred &&
			prevProps.textColorFocused === nextProps.textColorFocused &&
			prevProps.textColorBlurred === nextProps.textColorBlurred &&
			prevProps.textColorError === nextProps.textColorError &&
			prevProps.textColorPlaceholder === nextProps.textColorPlaceholder &&
			prevProps.textColorDisabled === nextProps.textColorDisabled &&
			prevProps.labelColor === nextProps.labelColor &&
			prevProps.labelSize === nextProps.labelSize &&
			prevProps.focused === nextProps.focused &&
			prevProps.error === nextProps.error &&
			prevProps.disabled === nextProps.disabled &&
			prevProps.label === nextProps.label &&
			prevProps.inputType === nextProps.inputType &&
			prevProps.textSize === nextProps.textSize &&
			prevProps.padding === nextProps.padding &&
			prevProps.textAlign === nextProps.textAlign &&
			prevProps.placeholder === nextProps.placeholder
		);
	},
);

TextField.displayName = 'TextField';
