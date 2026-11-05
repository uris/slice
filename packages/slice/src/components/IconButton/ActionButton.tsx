'use client';

import { type TargetAndTransition, type Transition, motion, useAnimationControls } from 'motion/react';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import type { ColorValue } from '../../theme';
import { resolveTransparent } from '../../utils';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import { Badge } from '../Badge';
import { Dot } from '../Dot';
import { Icon } from '../Icon';
import { ToolTipType } from '../sharedTypes';
import css from './IconButton.module.css';
import type { IconButtonProps } from './_types';

type ActionButtonProps = Omit<IconButtonProps, 'icon'> & {
	icon?: string | null;
	iconSelected?: string;
	iconFrame?: boolean;
	labelContent?: React.ReactNode;
	contentClassName?: string;
	textColor?: ColorValue;
	textColorHover?: ColorValue;
	textColorSelected?: ColorValue;
	deselect?: boolean;
};

const sizes = { s: 24, m: 36, l: 44, xl: 56 };

/** Keep the native button mounted when a live motion preference changes. */
function AnimatedSurface({
	target,
	transition,
	reduceMotion,
	className,
	children,
}: Readonly<{
	target: TargetAndTransition;
	transition: Transition;
	reduceMotion: boolean;
	className: string;
	children?: React.ReactNode;
}>) {
	const controls = useAnimationControls();
	const mounted = useRef(false);
	useEffect(() => {
		controls.stop();
		const { transition: _variantTiming, transitionEnd, ...values } = target;
		if (reduceMotion || !mounted.current) {
			const settled = Object.fromEntries(
				Object.entries({ ...values, ...transitionEnd }).map(([key, value]) => [
					key,
					Array.isArray(value) ? [...value].reverse().find((item) => item !== null) : value,
				]),
			);
			controls.set(settled as TargetAndTransition);
		} else void controls.start({ ...values, transitionEnd, transition });
		mounted.current = true;
		return () => controls.stop();
	}, [controls, target, transition, reduceMotion]);
	return (
		<motion.span aria-hidden="true" className={className} initial={false} animate={controls}>
			{children}
		</motion.span>
	);
}

export const ActionButton = React.memo(function ActionButton(rawProps: ActionButtonProps) {
	const props = resolveColorProps(rawProps);
	const {
		actionName = 'Action',
		labelContent,
		contentClassName,
		iconSelected,
		iconFrame = false,
		deselect = true,
		textColor = 'var(--core-text-primary)',
		textColorHover = 'var(--core-text-primary)',
		textColorSelected = 'var(--core-text-primary)',
		buttonSize = 'm',
		iconSize = 20,
		icon = 'more',
		iconFill = false,
		iconColor = 'var(--core-text-primary)',
		iconColorHover = 'var(--core-text-primary)',
		iconColorSelected = 'var(--core-text-primary)',
		backgroundColor = 'var(--core-surface-secondary)',
		backgroundColorHover = 'var(--core-outline-primary)',
		backgroundColorSelected = 'var(--core-outline-primary)',
		borderWidth = 0,
		borderColor = 'var(--core-outline-primary)',
		borderRadius = '50%',
		disabled = false,
		hover = true,
		toggle = false,
		selected,
		defaultSelected = false,
		toggleIcon = false,
		showDot = false,
		count = 0,
		tooltip,
		motionValues,
		transition,
		onChange,
		onToolTip,
		onClick,
		onMouseEnter,
		onMouseLeave,
		onFocus,
		onBlur,
		className,
		style,
		type = 'button',
		...buttonAttributes
	} = props;
	const [internalSelected, setInternalSelected] = useState(defaultSelected);
	const [hovered, setHovered] = useState(false);
	const on = toggle && (selected ?? internalSelected);
	const ref = useRef<HTMLButtonElement>(null);
	const focused = useRef(false);
	const pointerOver = useRef(false);
	const tipOpen = useRef(false);
	const tipCallback = useRef(onToolTip);
	const hasTipCallback = Boolean(onToolTip);
	const reduceMotion = usePrefersReducedMotion();
	const { current: theme, isDark } = useTheme();
	const themeMotion = theme.motion;
	const motionTransition = useMemo(() => getWaterTransition(themeMotion, transition), [themeMotion, transition]);
	const activeHover = hover && hovered && !disabled;
	const size =
		typeof buttonSize === 'number'
			? Number.isFinite(buttonSize) && buttonSize > 0
				? buttonSize
				: sizes.m
			: (sizes[buttonSize] ?? sizes.m);
	const resolvedIconSize = Number.isFinite(iconSize) && iconSize >= 0 ? iconSize : 20;
	const radius =
		typeof borderRadius === 'number'
			? `${Number.isFinite(borderRadius) ? Math.max(0, borderRadius) : 0}px`
			: borderRadius;
	const color = on ? iconColorSelected : activeHover ? iconColorHover : iconColor;
	const background = on ? backgroundColorSelected : activeHover ? backgroundColorHover : backgroundColor;
	const iconTarget = useMemo<TargetAndTransition>(() => {
		const variant = motionValues?.[on ? 'selected' : 'unselected'];
		const resolved = typeof variant === 'function' ? variant(on, {}, {}) : variant;
		return {
			rotate: 0,
			scale: 1,
			opacity: 1,
			...(typeof resolved === 'object' ? resolved : {}),
			color: color ?? 'var(--core-text-primary)',
		};
	}, [motionValues, on, color]);
	const contentColor = on ? textColorSelected : activeHover ? textColorHover : textColor;
	const textTarget = useMemo(() => ({ color: contentColor }), [contentColor]);
	const backgroundTarget = useMemo(
		() => ({
			backgroundColor: resolveTransparent(
				background,
				on || activeHover
					? [backgroundColor, on ? backgroundColorHover : backgroundColorSelected]
					: [backgroundColorHover, backgroundColorSelected],
				theme.colors,
				isDark,
			),
		}),
		[background, on, activeHover, backgroundColor, backgroundColorHover, backgroundColorSelected, theme.colors, isDark],
	);
	const cssVars = {
		'--ib-button-size': `${size}px`,
		'--ib-icon-size': `${resolvedIconSize}px`,
		'--ib-border-radius': radius,
		'--ib-border-width': `${Number.isFinite(borderWidth) ? Math.max(0, borderWidth) : 0}px`,
		'--ib-border-color': borderColor,
	} as React.CSSProperties;
	const clearTip = () => {
		if (tipOpen.current) tipCallback.current?.(null);
		tipOpen.current = false;
	};
	const showTip = (event?: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled || !tooltip || !onToolTip) return;
		tipOpen.current = true;
		tipCallback.current = onToolTip;
		onToolTip({ type: ToolTipType.button, payload: { label: tooltip }, ref, event });
	};
	useEffect(() => {
		if ((!tooltip || !hasTipCallback) && tipOpen.current) {
			tipCallback.current?.(null);
			tipOpen.current = false;
		}
		if (disabled) {
			setHovered(false);
			pointerOver.current = false;
			focused.current = false;
		}
		return () => {
			if (tipOpen.current) tipCallback.current?.(null);
			tipOpen.current = false;
		};
	}, [disabled, tooltip, hasTipCallback]);

	/* START.DEBUG */
	useTrackRenders(props, 'IconButton');
	/* END.DEBUG */

	return (
		<button
			{...buttonAttributes}
			ref={ref}
			type={type}
			disabled={disabled}
			className={`${css.button}${className ? ` ${className}` : ''}`}
			style={{ ...style, ...cssVars, ...(iconFrame ? { borderWidth: 0 } : {}) }}
			aria-label={typeof actionName === 'string' && actionName.trim() ? actionName.trim() : 'Action'}
			aria-labelledby={undefined}
			aria-disabled={disabled}
			aria-pressed={toggle ? on : undefined}
			onClick={(event) => {
				if (disabled) return;
				onClick?.(event);
				if (event.defaultPrevented) return;
				clearTip();
				if (toggle && (!on || deselect)) {
					const next = !on;
					if (selected === undefined) setInternalSelected(next);
					onChange?.(next);
				}
			}}
			onMouseEnter={(event) => {
				onMouseEnter?.(event);
				if (disabled || event.defaultPrevented) return;
				pointerOver.current = true;
				setHovered(true);
				showTip(event);
			}}
			onMouseLeave={(event) => {
				onMouseLeave?.(event);
				pointerOver.current = false;
				setHovered(false);
				if (!focused.current) clearTip();
			}}
			onFocus={(event) => {
				onFocus?.(event);
				if (disabled || event.defaultPrevented) return;
				focused.current = true;
				showTip();
			}}
			onBlur={(event) => {
				onBlur?.(event);
				focused.current = false;
				if (!pointerOver.current) clearTip();
			}}
		>
			{!iconFrame && (
				<AnimatedSurface
					className={css.background}
					target={backgroundTarget}
					transition={motionTransition}
					reduceMotion={reduceMotion}
				/>
			)}
			{icon && (
				<span className={`${css.slot}${iconFrame ? ` ${css.frame}` : ''}`} aria-hidden="true">
					{iconFrame && (
						<AnimatedSurface
							className={css.background}
							target={backgroundTarget}
							transition={motionTransition}
							reduceMotion={reduceMotion}
						/>
					)}
					<span className={css.content}>
						<AnimatedSurface
							className={css.icon}
							target={iconTarget}
							transition={motionTransition}
							reduceMotion={reduceMotion}
						>
							<Icon
								name={on && iconSelected ? iconSelected : icon}
								size={resolvedIconSize}
								strokeColor="currentColor"
								fill={iconFill}
								toggle={toggleIcon && on}
								pointer={false}
								tabIndex={-1}
							/>
						</AnimatedSurface>
					</span>
				</span>
			)}

			{labelContent !== undefined && labelContent !== null && (
				<AnimatedSurface
					className={contentClassName ?? css.content}
					target={textTarget}
					transition={motionTransition}
					reduceMotion={reduceMotion}
				>
					{labelContent}
				</AnimatedSurface>
			)}
			{(showDot || count !== 0) && (
				<span className={css.indicators} aria-hidden="true">
					<Dot show={showDot} aria-hidden="true" role="presentation" />
					{count !== 0 && (
						<span className={css.count}>
							<Badge variant="light" count={count} hideZero />
						</span>
					)}
				</span>
			)}
		</button>
	);
});
