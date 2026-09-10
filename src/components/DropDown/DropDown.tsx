'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { setStyle } from '../../utils/functions/misc';
import { Icon } from '../Icon';
import css from './DropDown.module.css';
import type { DropDownOption, DropDownProps } from './_types';

function resolveValueKey(value: unknown, valueKey?: string) {
	if (!valueKey || !value || typeof value !== 'object') return undefined;
	return (value as Record<string, unknown>)[valueKey];
}

function DropDownComponent<T = string>(props: DropDownProps<T>) {
	const {
		name = 'drop-down-select',
		label,
		labelColor = 'var(--core-text-primary)',
		size = 'm',
		width = '100%',
		height = 'auto',
		inline = false,
		selectedIndex,
		selectedValue,
		valueKey,
		options = [],
		placeholder = true,
		borderRadius = 8,
		backgroundColor = 'var(--core-surface-secondary)',
		bgColor = 'var(--core-surface-secondary)',
		iconColor = 'var(--core-text-primary)',
		textColor = 'var(--core-text-primary)',
		borderWidth,
		borderSize = 1,
		borderColor = 'var(--core-outline-primary)',
		paddingLeft = '10px',
		paddingRight = '8px',
		paddingTop = '8px',
		paddingBottom = '8px',
		borderStyle = 'box',
		iconSize = 20,
		disabled = false,
		error = false,
		gap = 8,
		onChange = () => null,
		onOption = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const resolvedBackgroundColor = backgroundColor ?? bgColor;
	const resolvedBorderWidth = borderWidth ?? borderSize;

	const [index, setIndex] = useState<number>(selectedIndex ?? 0);
	const [selectedText, setSelectedText] = useState<string>('Select an option');
	const ref = useRef<HTMLSelectElement>(null);

	// sync the selected option from the controlled index prop
	useEffect(() => {
		if (selectedValue != null || selectedIndex === undefined) return;
		if (ref?.current) {
			if (!options?.[selectedIndex]) return;
			const label = options[selectedIndex].label || 'Select an option';
			setIndex(selectedIndex);
			setSelectedText(label);
			ref.current.selectedIndex = selectedIndex;
		}
	}, [selectedIndex, options, selectedValue]);

	// sync the selected option from the controlled value prop
	useEffect(() => {
		if (!options || options.length === 0 || selectedValue == null) return;

		const selectedKey = resolveValueKey(selectedValue, valueKey);
		const foundIndex = options.findIndex(
			(option) =>
				option?.value === selectedValue ||
				(selectedKey !== undefined && resolveValueKey(option?.value, valueKey) === selectedKey) ||
				option?.label?.toLowerCase() === String(selectedValue).toLowerCase() ||
				option?.alt?.toLowerCase() === String(selectedValue).toLowerCase(),
		);

		if (foundIndex !== -1) {
			const label = options[foundIndex].label || 'Select an option';
			setSelectedText(label);
			setIndex(foundIndex);
			if (ref.current) ref.current.selectedIndex = foundIndex;
		}
	}, [selectedValue, options, valueKey]);

	// update the local selection state and notify consumers when the option changes
	const handleChange = useCallback(
		(i: number) => {
			if (!options) return;
			const label = options[i].label || 'Select an option';
			setIndex(i);
			setSelectedText(label);
			if (index !== i) {
				onChange(i, options[i]);
				onOption(options[i]);
			}
		},
		[options, index, onChange, onOption],
	);

	// derive the rendered option elements from the options list
	const renderedOptions = useMemo(() => {
		if (!options) return null;
		return options.map((option: DropDownOption<T>, i: number) => (
			<option key={`${option?.value}_${i}`} value={i} onMouseUp={() => handleChange(i)}>
				{option?.label}
			</option>
		));
	}, [options, handleChange]);

	// resolve the display label shown in the custom face element
	const displayText = useMemo(() => selectedText.replace('-- ', ''), [selectedText]);

	// block interaction when disabled and otherwise treat the pointer down as focus
	const handleMouseDown = useCallback(
		(e: React.MouseEvent<HTMLSelectElement>) => {
			if (disabled) e.preventDefault();
		},
		[disabled],
	);

	// forward native select changes through the shared change handler
	const handleSelectChange = useCallback(
		(e: React.ChangeEvent<HTMLSelectElement>) => {
			handleChange(e.target.selectedIndex);
		},
		[handleChange],
	);

	// set the color of text based on state
	const setTextColor = useMemo(() => {
		if (disabled) return 'var(--core-text-disabled)';
		if (placeholder && index === 0) return 'var(--core-text-tertiary)';
		return textColor;
	}, [disabled, placeholder, index, textColor]);

	// set the color of text based on state
	const setLabelColor = useMemo(() => {
		if (disabled) return 'var(--core-text-disabled)';
		return labelColor;
	}, [disabled, labelColor]);

	// set the color of the icon based on state
	const setIconColor = useMemo(() => {
		if (disabled) return 'var(--core-text-disabled)';
		return iconColor;
	}, [disabled, iconColor]);

	// set the color of the border based on state
	const setBorderColor = useMemo(() => {
		if (disabled) return 'var(--core-outline-primary)';
		if (error) return 'var(--feedback-warning)';
		return borderColor;
	}, [disabled, error, borderColor]);

	// set padding based on border style
	const setPadding = useMemo(() => {
		if (borderStyle === 'box')
			return `${setStyle(paddingTop)} ${setStyle(paddingRight)} ${setStyle(paddingBottom)} ${setStyle(paddingLeft)}`;
		return `0 0 ${setStyle(paddingBottom)} 0`;
	}, [paddingTop, paddingRight, paddingBottom, paddingLeft, borderStyle]);

	// set border
	const setBorder = useMemo(() => {
		if (borderStyle === 'box') return `${setStyle(resolvedBorderWidth)} solid ${setBorderColor}`;
		return 'unset';
	}, [resolvedBorderWidth, setBorderColor, borderStyle]);

	// set border bottom
	const setBorderBottom = useMemo(() => {
		if (borderStyle !== 'none') return `${setStyle(resolvedBorderWidth)} solid ${setStyle(borderColor)}`;
		return 'unset';
	}, [resolvedBorderWidth, borderColor, borderStyle]);

	// set border radius
	const setBorderRadius = useMemo(() => {
		if (borderStyle !== 'box') return 0;
		return `${borderRadius}px`;
	}, [borderStyle, borderRadius]);

	// compose CSS custom properties for layout, spacing, and visual state
	const cssVars = useMemo(() => {
		return {
			'--dd-gap': setStyle(gap),
			'--dd-height': setStyle(height),
			'--dd-width': setStyle(width),
			'--dd-margin': inline ? '0 4px' : '0',
			'--dd-border-radius': setBorderRadius,
			'--dd-border': setBorder,
			'--dd-border-bottom': setBorderBottom,
			'--dd-color': setTextColor,
			'--dd-bg-color': resolvedBackgroundColor ?? 'transparent',
			'--dd-padding': setPadding,
			'--dd-icon-size': `${iconSize}px`,
			'--dd-label-color': setLabelColor,
			'--dd-display': inline ? 'inline-flex' : 'flex',
		} as React.CSSProperties;
	}, [
		gap,
		height,
		width,
		setBorderRadius,
		setBorder,
		setBorderBottom,
		setTextColor,
		resolvedBackgroundColor,
		setPadding,
		setLabelColor,
		iconSize,
		inline,
	]);

	/* START.DEBUG */
	useTrackRenders(props, 'DropDown');
	/* END.DEBUG */

	return (
		<span id={divId} className={`${css.wrapper}${divClass}`} style={{ ...divStyle, ...cssVars }} {...rest}>
			{label && <span className={`${css.label} ${css[size]}`}>{label}</span>}
			<span className={`${css.face} ${css[size]}`}>
				<span className={css.faceText}>{displayText}</span>
			</span>
			<span className={css.chevron}>
				<Icon name="chevron down" size={iconSize} strokeColor={setIconColor} />
			</span>
			<select
				className={css.select}
				value={index}
				ref={ref}
				onMouseDown={handleMouseDown}
				onChange={handleSelectChange}
				aria-label={name}
			>
				{renderedOptions}
			</select>
		</span>
	);
}

DropDownComponent.displayName = 'DropDown';

export const DropDown = React.memo(DropDownComponent) as <T = string>(props: DropDownProps<T>) => React.JSX.Element;
