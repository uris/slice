'use client';

import { motion } from 'motion/react';
import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { type RadiusValue, resolveBoxSides, resolveRadius, resolveSize } from '../../theme/resolveSize';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import css from './Switch.module.css';
import type { SwitchProps } from './_types';

const radiusValue = (value: RadiusValue) =>
	resolveRadius(typeof value === 'number' && Number.isFinite(value) ? Math.max(0, value) : value, 'corner-round');

function SwitchComponent<T = string>(rawProps: SwitchProps<T>) {
	const props = resolveColorProps(rawProps);
	const {
		borderRadius = 'var(--corner-round)',
		knobRadius = 'var(--corner-round)',
		knobWidth = 20,
		name,
		checked,
		defaultChecked = false,
		value,
		height = 22,
		width = 36,
		padding,
		transition,
		backgroundColorOn = 'var(--core-green)',
		backgroundColorOff = 'var(--core-text-disabled)',
		knobColor = 'var(--core-surface-primary)',
		onChange,
		onClick,
		disabled = false,
		type = 'button',
		className,
		style,
		...buttonAttributes
	} = props;
	const [internalChecked, setInternalChecked] = useState(defaultChecked);
	const on = checked ?? internalChecked;
	const accessibleName = name?.trim() || 'Switch';
	const reduceMotion = usePrefersReducedMotion();
	const themeMotion = useTheme().current.motion;
	const motionTransition = getWaterTransition(themeMotion, transition);
	const backgroundColor = on ? backgroundColorOn : backgroundColorOff;
	const resolvedHeight = Number.isFinite(height) && height > 0 ? Math.max(1, height) : 22;
	const resolvedWidth = Math.max(resolvedHeight, Number.isFinite(width) && width > 0 ? width : 36);
	const { top, right, bottom, left } = resolveBoxSides(resolveSize(padding, 'spacing-xxs'));
	const clampPadding = (side: string) => `clamp(0px, ${side}, ${(resolvedHeight - 1) / 2}px)`;
	const cssVars = {
		'--switch-width': `${resolvedWidth}px`,
		'--switch-height': `${resolvedHeight}px`,
		'--switch-padding-top': clampPadding(top),
		'--switch-padding-right': clampPadding(right),
		'--switch-padding-bottom': clampPadding(bottom),
		'--switch-padding-left': clampPadding(left),
		'--switch-knob-size': 'calc(var(--switch-height) - var(--switch-padding-top) - var(--switch-padding-bottom))',
		'--switch-knob-color': knobColor,
		'--switch-border-radius': radiusValue(borderRadius),
		'--switch-knob-radius': radiusValue(knobRadius),
		'--switch-knob-width': `clamp(1px, ${Number.isFinite(knobWidth) && knobWidth > 0 ? knobWidth : 20}px, calc(var(--switch-width) - var(--switch-padding-left) - var(--switch-padding-right)))`,
	} as React.CSSProperties;

	/* START.DEBUG */
	useTrackRenders(props, 'Switch');
	/* END.DEBUG */

	return (
		<button
			{...Object.fromEntries(
				Object.entries(buttonAttributes).filter(([key]) => key !== 'role' && !key.startsWith('aria-')),
			)}
			name={name}
			type={type}
			disabled={disabled}
			className={`${css.wrapper}${className ? ` ${className}` : ''}`}
			style={{ ...style, ...cssVars, justifyContent: on ? 'flex-end' : 'flex-start' }}
			onClick={(event) => {
				if (disabled) return;
				onClick?.(event);
				if (event.defaultPrevented) return;
				const next = !on;
				if (checked === undefined) setInternalChecked(next);
				onChange?.(value, next);
			}}
			role="switch"
			aria-label={accessibleName}
			aria-checked={on}
		>
			{reduceMotion ? (
				<div className={css.knob} aria-hidden="true" />
			) : (
				<motion.div
					className={css.knob}
					aria-hidden="true"
					layout="position"
					initial={false}
					animate={{ backgroundColor: knobColor }}
					transition={motionTransition}
				/>
			)}
			{reduceMotion ? (
				<span className={css.track} aria-hidden="true" style={{ backgroundColor }} />
			) : (
				<motion.span
					className={css.track}
					aria-hidden="true"
					initial={false}
					animate={{ backgroundColor }}
					transition={motionTransition}
				/>
			)}
		</button>
	);
}

SwitchComponent.displayName = 'Switch';
export const Switch = React.memo(SwitchComponent) as <T = string>(props: SwitchProps<T>) => React.JSX.Element;
