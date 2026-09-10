'use client';

import { motion } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import css from './Switch.module.css';
import type { SwitchProps } from './_types';

function SwitchComponent<T = string>(props: SwitchProps<T>) {
	const {
		fieldName,
		state = false,
		value,
		height = 22,
		width = 44,
		padding = 3,
		backgroundColorOn,
		backgroundColorOff,
		bgColorOn = 'var(--feedback-positive)',
		bgColorOff = 'var(--core-text-disabled)',
		knobColor = 'var(--core-surface-primary)',
		onChange = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const [on, setOn] = useState<boolean>(state);
	const resolvedBackgroundColorOn = backgroundColorOn ?? bgColorOn;
	const resolvedBackgroundColorOff = backgroundColorOff ?? bgColorOff;

	useEffect(() => {
		setOn(state);
	}, [state]);

	const handleClick = useCallback(() => {
		setOn(!on);
		onChange(value, !on);
	}, [on, onChange, value]);

	const cssVars = useMemo(() => {
		return {
			'--switch-width': `${width}px`,
			'--switch-height': `${height}px`,
			'--switch-padding': `${padding}px`,
			'--switch-knob-size': `${height - padding * 2}px`,
			'--switch-knob-color': knobColor,
			'--switch-bg-color': on ? resolvedBackgroundColorOn : resolvedBackgroundColorOff,
		} as React.CSSProperties;
	}, [width, height, padding, resolvedBackgroundColorOff, resolvedBackgroundColorOn, on, knobColor]);

	const justify = useMemo(() => ({ justifyContent: on ? 'flex-end' : 'flex-start' }), [on]);

	/* START.DEBUG */
	useTrackRenders(props, 'Switch');
	/* END.DEBUG */

	return (
		<motion.button
			id={divId}
			type="button"
			className={`${css.wrapper}${divClass}`}
			style={{ ...divStyle, ...justify, ...cssVars }}
			onClick={handleClick}
			role="switch"
			aria-label={fieldName ?? 'Switch'}
			aria-checked={on}
			{...(rest as any)}
		>
			<motion.div className={css.knob} layout={'preserve-aspect'} />
		</motion.button>
	);
}

SwitchComponent.displayName = 'Switch';

export const Switch = React.memo(SwitchComponent) as <T = string>(props: SwitchProps<T>) => React.JSX.Element;
