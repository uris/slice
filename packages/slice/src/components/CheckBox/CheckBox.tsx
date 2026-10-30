'use client';

import { motion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { accessibleKeyDown } from '../../utils/functions/misc';
import { Icon } from '../Icon';
import css from './CheckBox.module.css';
import type { CheckBoxProps } from './_types';

export const CheckBox = React.memo((props: CheckBoxProps) => {
	const {
		size = 20,
		checked = false,
		disabled = false,
		color = undefined,
		children = undefined,
		onChange = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const [state, setState] = useState<'mixed' | boolean>(checked);

	// sync the local checkbox state from the controlled prop
	useEffect(() => setState(checked), [checked]);

	// resolve which checkbox icon should be shown for the current state
	const iconName = useMemo(() => {
		if (state === true) return 'checkbox checked';
		if (state === 'mixed') return 'checkbox partial';
		return 'checkbox';
	}, [state]);

	// resolve the checkbox icon color
	const iconColor = useMemo(() => {
		if (color) return color;
		if (disabled) return 'var(--core-icon-disabled)';
		if (state === 'mixed') return 'var(--core-icon-primary)';
		if (!state) return 'var(--core-icon-secondary';
		return 'var(--core-text-special)';
	}, [color, disabled, state]);

	// resolve label color
	const labelColor = useMemo(() => {
		if (color) return color;
		if (disabled) return 'var(--core-text-disabled)';
		return 'var(--core-text-primary)';
	}, [color, disabled]);

	// compose CSS custom properties for checkbox sizing and label color
	const cssVars = useMemo(() => {
		return {
			'--cb-size': `${size}px`,
			'--cb-label-color': labelColor,
		} as React.CSSProperties;
	}, [size, labelColor]);

	// toggle the checkbox and report the updated value
	const handleToggle = useCallback(() => {
		if (disabled) return;
		let newState = false;
		switch (state) {
			case true:
				break;
			case 'mixed':
			case false:
				newState = true;
				break;
		}
		setState(newState);
		onChange(newState);
	}, [state, disabled, onChange]);

	/* START.DEBUG */
	useTrackRenders(props, 'Checkbox');
	/* END.DEBUG */

	return (
		<motion.div
			id={divId}
			className={`${css.wrapper}${divClass}`}
			style={{ ...divStyle, ...cssVars }}
			onClick={handleToggle}
			onKeyDown={(e) => accessibleKeyDown(e, handleToggle)}
			tabIndex={disabled ? -1 : 0}
			role={'checkbox'}
			aria-checked={state}
			aria-disabled={disabled}
			aria-label={String(children as string)}
			{...(rest as any)}
		>
			<div className={css.icon}>
				<Icon name={iconName} strokeColor={iconColor} size={size} />
			</div>
			{children && <span className={css.label}>{children}</span>}
		</motion.div>
	);
});
