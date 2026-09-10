'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { setStyle } from '../../utils/functions/misc';
import { Icon } from '../Icon';
import css from './RadioButton.module.css';
import type { RadioButtonProps } from './_types';

function RadioButtonComponent<T = string>(props: RadioButtonProps<T>) {
	const {
		label,
		children,
		fieldName,
		value,
		selected = false,
		controlType = 'radio',
		deselect = true,
		tabIndex = 0,
		wrap = false,
		list = false,
		hideRadio = false,
		noFrame = true,
		icon = 'circle',
		checkedIcon = 'check circle',
		iconColor,
		gap = 6,
		onChange = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const [isSelected, setIsSelected] = useState<boolean>(selected);

	useEffect(() => setIsSelected(selected), [selected]);

	const handleChange = useCallback(() => {
		if (isSelected && !deselect) return;
		setIsSelected(!isSelected);
		onChange(
			{
				fieldName,
				label,
				value,
			},
			!isSelected,
		);
	}, [isSelected, deselect, onChange, fieldName, label, value]);

	const setAriaLabel = useMemo(() => {
		if (label) return label;
		if (children && typeof children === 'string') return children;
		return 'Radio Button';
	}, [label, children]);

	const setIconColor = useMemo(() => {
		if (iconColor) return iconColor;
		return 'var(--core-text-primary)';
	}, [iconColor]);

	const iconName = useMemo(() => (isSelected ? checkedIcon : icon), [isSelected, checkedIcon, icon]);

	const setFlex = useMemo(() => {
		if (list) return 'unset';
		return wrap ? '40%' : '1';
	}, [list, wrap]);

	const cssVars = useMemo(() => {
		return {
			'--rb-max-width': wrap ? '50%' : '100%',
			'--rb-flex': setFlex,
			'--rb-padding': noFrame ? '0' : '8px 16px 8px 10px',
			'--rb-bg': !noFrame && isSelected ? 'var(--core-surface-secondary)' : 'transparent',
			'--rb-border': noFrame ? 'none' : '1px solid var(--core-outline-primary)',
			'--rb-gap': setStyle(gap),
		} as React.CSSProperties;
	}, [setFlex, isSelected, wrap, noFrame, gap]);

	/* START.DEBUG */
	useTrackRenders(props, 'Radio Button');
	/* END.DEBUG */

	return (
		<button
			id={divId}
			type="button"
			className={`${css.wrapper}${divClass}`}
			style={{ ...divStyle, ...cssVars }}
			onClick={handleChange}
			role={controlType}
			tabIndex={tabIndex}
			aria-label={setAriaLabel}
			aria-checked={isSelected}
			{...rest}
		>
			{!hideRadio && (
				<div className={css.radioIcon}>
					<Icon name={iconName} strokeColor={setIconColor} size={20} />
				</div>
			)}
			<div className={css.radioContent}>
				<div className={css.radioTitle}>{label ?? children}</div>
			</div>
		</button>
	);
}

RadioButtonComponent.displayName = 'RadioButton';

export const RadioButton = React.memo(RadioButtonComponent) as <T = string>(
	props: RadioButtonProps<T>,
) => React.JSX.Element;
