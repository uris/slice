'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { setStyle } from '../../utils';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { RadioButton, type RadioButtonOption } from '../RadioButton';
import { RadioGroupContext } from '../RadioButton/RadioGroupContext';
import css from './RadioButtonList.module.css';
import type { RadioButtonListProps } from './_types';

function RadioButtonListComponent<T = string>(rawProps: RadioButtonListProps<T>) {
	const props = resolveColorProps(rawProps);
	const {
		children,
		options = [],
		value,
		defaultValue = null,
		name,
		label,
		disabled = false,
		direction = 'column',
		wrap = false,
		gap = 16,
		itemGap = 6,
		marginBottom = 0,
		width = 'min-content',
		align,
		iconChecked,
		iconUnChecked,
		iconSize,
		iconColor,
		iconColorSelected,
		textColor,
		textSize,
		textTopOffset,
		backgroundColor,
		backgroundColorSelected,
		borderWidth,
		borderColor,
		borderRadius,
		padding,
		onChange,
		className,
		style,
		...divAttributes
	} = props;
	const labelId = useId();
	const [localValue, setLocalValue] = useState<T | null>(() => defaultValue);
	const initialValue = useRef(defaultValue);
	const containerRef = useRef<HTMLDivElement>(null);
	const controlled = value !== undefined;
	const active = controlled ? value : localValue;
	useEffect(() => {
		if (controlled) return;
		const form = containerRef.current?.closest('form');
		if (!form) return;
		let mounted = true;
		const reset = (event: Event) => {
			queueMicrotask(() => {
				if (mounted && !event.defaultPrevented) setLocalValue(() => initialValue.current);
			});
		};
		form.addEventListener('reset', reset);
		return () => {
			mounted = false;
			form.removeEventListener('reset', reset);
		};
	}, [controlled]);
	const cssVars = {
		'--rb-list-flex-wrap': wrap ? 'wrap' : 'nowrap',
		'--rb-list-margin-bottom': setStyle(marginBottom, '0px'),
		'--rb-gap': `${Number.isFinite(gap) ? Math.max(0, gap) : 16}px`,
		'--rb-list-width': setStyle(width, 'min-content'),
	} as React.CSSProperties;
	/* START.DEBUG */
	useTrackRenders(props, 'RadioButtonList');
	/* END.DEBUG */
	const context = useMemo(
		() => ({
			value: active,
			name: name || labelId,
			disabled,
			optionProps: {
				align,
				iconChecked,
				iconUnChecked,
				iconSize,
				iconColor,
				iconColorSelected,
				textColor,
				textSize,
				textTopOffset,
				backgroundColor,
				backgroundColorSelected,
				borderWidth,
				borderColor,
				borderRadius,
				padding,
				gap: itemGap,
			},
			select: (option: RadioButtonOption<unknown>) => {
				if (disabled || option.value === undefined || option.value === null || Object.is(active, option.value)) return;
				if (!controlled) setLocalValue(() => option.value as T);
				onChange?.(option.value as T, option as RadioButtonOption<T>);
			},
		}),
		[
			active,
			name,
			labelId,
			disabled,
			controlled,
			onChange,
			align,
			iconChecked,
			iconUnChecked,
			iconSize,
			iconColor,
			iconColorSelected,
			textColor,
			textSize,
			textTopOffset,
			backgroundColor,
			backgroundColorSelected,
			borderWidth,
			borderColor,
			borderRadius,
			padding,
			itemGap,
		],
	);
	return (
		<RadioGroupContext.Provider value={context}>
			<div
				ref={containerRef}
				{...divAttributes}
				className={`${css.wrapper} ${direction === 'row' ? css.row : css.column}${className ? ` ${className}` : ''}`}
				style={{ ...style, ...cssVars }}
				role="radiogroup"
				aria-labelledby={label ? labelId : divAttributes['aria-labelledby']}
				aria-disabled={disabled || undefined}
				aria-orientation={direction === 'row' ? 'horizontal' : 'vertical'}
			>
				{label && <div id={labelId}>{label}</div>}
				{children !== undefined
					? children
					: options.map((option, index) => (
							<RadioButton
								{...option}
								key={
									typeof option.value === 'string' || typeof option.value === 'number'
										? `${typeof option.value}:${option.value}`
										: (option.fieldName ?? index)
								}
							/>
						))}
			</div>
		</RadioGroupContext.Provider>
	);
}

RadioButtonListComponent.displayName = 'RadioButtonList';
export const RadioButtonList = React.memo(RadioButtonListComponent) as <T = string>(
	props: RadioButtonListProps<T>,
) => React.JSX.Element;
