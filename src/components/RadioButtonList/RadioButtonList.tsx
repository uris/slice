'use client';

import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { setStyle } from '../../utils/functions/misc';
import { RadioButton, type RadioButtonOption } from '../RadioButton';
import css from './RadioButtonList.module.css';
import type { RadioButtonListProps } from './_types';

function RadioButtonListComponent<T = string>(props: RadioButtonListProps<T>) {
	const {
		width = 'min-content',
		options = [],
		selectedIndexes = null,
		selectedOptions = null,
		label = null,
		deselect = false,
		multiSelect = false,
		wrap = false,
		tabIndexSeed = 0,
		spacer = 'none',
		custom = 0,
		gap = 16,
		hideRadio = false,
		noFrame = true,
		toggleIcon = true,
		iconColor = undefined,
		icon = 'circle',
		checkedIcon = 'check circle',
		iconSelectedColor = undefined,
		onChange = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const labelId = useId();

	const [selected, setSelected] = useState<number[] | null>(selectedIndexes);

	useEffect(() => setSelected(selectedIndexes), [selectedIndexes]);

	useEffect(() => {
		if (!selectedOptions || !options) return;
		const selections: number[] = [];
		for (const item of selectedOptions) {
			for (let i = 0; i < options.length; i++) {
				const option = options[i];
				if (option.fieldName === item) selections.push(i);
			}
		}
		setSelected(selections);
	}, [selectedOptions, options]);

	const isSelected = useCallback(
		(index: number): boolean => {
			if (!selected) return false;
			return selected.includes(index);
		},
		[selected],
	);

	const doMultiSelection = useCallback(
		(selection: number, state: boolean) => {
			let indexesSelected: number[] = selected ? [...selected] : [];
			if (!state && selected) {
				const removeAt = indexesSelected.indexOf(selection);
				indexesSelected.splice(removeAt, 1);
			} else if (state) {
				indexesSelected = selected ? [...selected] : [];
				const exists = indexesSelected.includes(selection);
				if (!exists) indexesSelected.push(selection);
			}
			let updatedSelections: RadioButtonOption<T>[] | null = [];
			for (const index of indexesSelected || []) {
				if (updatedSelections) updatedSelections.push(options[index]);
			}
			if (updatedSelections.length < 1) updatedSelections = null;
			setSelected(indexesSelected || null);
			onChange(updatedSelections, indexesSelected || null);
		},
		[selected, options, onChange],
	);

	const doSingleSelection = useCallback(
		(selection: number, state: boolean) => {
			onChange(state ? [options[selection]] : [], state ? [selection] : []);
			setSelected(state ? [selection] : null);
		},
		[options, onChange],
	);

	const handleChange = useCallback(
		(selection: number, state: boolean) => {
			if (multiSelect) {
				doMultiSelection(selection, state);
			} else {
				doSingleSelection(selection, state);
			}
		},
		[multiSelect, doMultiSelection, doSingleSelection],
	);

	const renderedOptions = useMemo(() => {
		return options.map((option: RadioButtonOption<T>, i: number) => {
			return (
				<RadioButton
					label={option.label}
					value={option.value}
					fieldName={option.fieldName}
					selected={isSelected(i)}
					controlType={multiSelect ? 'checkbox' : 'radio'}
					key={`${option.fieldName}_${i}`}
					deselect={deselect}
					wrap={wrap}
					noFrame={noFrame}
					hideRadio={hideRadio}
					onChange={(_option, state) => handleChange(i, state)}
					tabIndex={tabIndexSeed ? tabIndexSeed + i : 0}
					iconColor={isSelected(i) ? iconSelectedColor : iconColor}
					checkedIcon={checkedIcon}
					icon={icon}
					list={true}
				/>
			);
		});
	}, [
		options,
		isSelected,
		multiSelect,
		deselect,
		wrap,
		noFrame,
		hideRadio,
		handleChange,
		iconColor,
		iconSelectedColor,
		checkedIcon,
		tabIndexSeed,
		icon,
	]);

	const margin = useMemo(() => {
		if (spacer === 'none') return 0;
		if (spacer === 'custom') return custom;
		return 0;
	}, [spacer, custom]);

	const cssVars = useMemo(() => {
		return {
			'--rb-list-flex-wrap': wrap ? 'wrap' : 'nowrap',
			'--rb-list-margin-bottom': noFrame ? 0 : `${margin}px`,
			'--rb-gap': `${gap}px`,
			'--rb-list-width': setStyle(width),
		} as React.CSSProperties;
	}, [wrap, margin, gap, noFrame, width]);

	/* START.DEBUG */
	useTrackRenders(props, 'Radio Button List');
	/* END.DEBUG */

	return (
		<div
			id={divId}
			className={`${css.wrapper} ${noFrame ? css.column : css.row}${divClass}`}
			style={{ ...divStyle, ...cssVars }}
			role={multiSelect ? 'group' : 'radiogroup'}
			aria-labelledby={label ? labelId : undefined}
			{...rest}
		>
			{label && <div id={labelId}>{label}</div>}
			{renderedOptions}
		</div>
	);
}

RadioButtonListComponent.displayName = 'RadioButtonList';

export const RadioButtonList = React.memo(RadioButtonListComponent) as <T = string>(
	props: RadioButtonListProps<T>,
) => React.JSX.Element;
