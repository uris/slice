'use client';

import {
	AnimatePresence,
	type Transition,
	type Variants,
	motion,
	useAnimationControls,
	usePresence,
} from 'motion/react';
import React, { useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { corners } from '../../theme/corners/corners';
import { classNames, setStyle } from '../../utils/functions/misc';
import { mergedPresenceMotionValues } from '../../utils/functions/misc';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import { Icon } from '../Icon';
import { ProgressIndicator } from '../Progress';
import css from './Toast.module.css';
import type { ToastProps } from './_types';
import { useToastLifecycle } from './useToastLifecycle';

const staticState = { opacity: 1, x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, rotate: 0, rotateX: 0, rotateY: 0 };
function ToastSurface({
	children,
	reduced,
	variants,
	transition,
	forwardedRef,
	...attributes
}: Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> & {
	reduced: boolean;
	variants: Variants;
	transition: Transition;
	forwardedRef: React.ForwardedRef<HTMLDivElement>;
}) {
	const [present, safeToRemove] = usePresence();
	const controls = useAnimationControls();
	useEffect(() => {
		if (reduced) {
			controls.stop();
			controls.set(staticState);
			if (!present) safeToRemove?.();
		} else if (present && variants.animate) void controls.start('animate');
	}, [reduced, present, controls, variants, safeToRemove]);
	return (
		<motion.div
			{...attributes}
			ref={forwardedRef}
			inert={!present}
			aria-hidden={!present || undefined}
			initial={reduced ? false : 'initial'}
			animate={controls}
			exit="exit"
			variants={variants}
			transition={transition}
			onAnimationComplete={(definition) => {
				if (definition === 'exit') safeToRemove?.();
			}}
		>
			{children}
		</motion.div>
	);
}

function ToastComponent<T>(props: ToastProps<T>, forwardedRef: React.ForwardedRef<HTMLDivElement>) {
	const {
		notificationId,
		data,
		onClick,
		message = null,
		textSize = 'm',
		border = true,
		padding,
		borderRadius = corners['corner-m'],
		container = 'window',
		showDelay = 0,
		duration = 5000,
		position = 'bottom',
		offset = 24,
		close = true,
		closeLabel = 'Dismiss notification',
		progress = false,
		type = 'info',
		urgency = 'polite',
		motionValues,
		transition,
		onShow,
		onHide,
		className,
		style,
		onMouseEnter,
		onMouseLeave,
		onFocus,
		onBlur,
		...attributes
	} = props;
	const { notification, dismiss, interaction, finishExits } = useToastLifecycle({
		notificationId,
		message,
		showDelay,
		duration,
		onShow,
		onHide,
	});
	const theme = useTheme().current;
	const reduced = usePrefersReducedMotion();
	const root = useRef<HTMLDivElement | null>(null);
	const previousFocus = useRef<HTMLElement | null>(null);
	useEffect(() => {
		if (notification)
			previousFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
	}, [notification]);
	const rootToken = useRef<number | undefined>(undefined);
	const setRef = (element: HTMLDivElement | null) => {
		if (!element && rootToken.current !== notification?.token) return;
		root.current = element;
		rootToken.current = notification?.token;
		if (typeof forwardedRef === 'function') forwardedRef(element);
		else if (forwardedRef) forwardedRef.current = element;
	};
	const colorScheme = useMemo(() => {
		if (type === 'success')
			return { border: 'var(--array-land-label)', bg: 'var(--array-land)', text: 'var(--array-land-label)' };
		if (type === 'warning')
			return { border: 'var(--array-orange-label)', bg: 'var(--array-orange)', text: 'var(--array-orange-label)' };
		if (type === 'error')
			return { border: 'var(--feedback-warning)', bg: 'var(--array-magenta)', text: 'var(--feedback-warning)' };
		return {
			border: 'var(--core-outline-primary)',
			bg: 'var(--core-surface-secondary)',
			text: 'var(--core-text-primary)',
		};
	}, [type]);
	const variants = useMemo(() => {
		if (reduced) return { initial: staticState, animate: staticState, exit: staticState };
		const movement = position === 'bottom' ? 8 : -8;
		return mergedPresenceMotionValues(
			{ initial: { opacity: 0, y: movement }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: movement } },
			motionValues,
		);
	}, [reduced, position, motionValues]);
	const resolvedTransition = useMemo(() => {
		if (reduced) return { type: 'tween' as const, duration: 0, delay: 0 };
		return getWaterTransition(theme.motion, transition);
	}, [reduced, theme.motion, transition]);
	const cssVars = {
		'--toast-padding': setStyle(
			padding,
			close
				? 'var(--spacing-s) calc(var(--spacing-m) - var(--spacing-xs)) var(--spacing-s) var(--spacing-m)'
				: 'var(--spacing-s) var(--spacing-m)',
		),
		'--toast-background': colorScheme.bg,
		'--toast-color': colorScheme.text,
		'--toast-border': border ? `1px solid ${colorScheme.border}` : '0px solid transparent',
		'--toast-border-radius': setStyle(borderRadius),
		'--toast-position': container === 'window' ? 'fixed' : 'absolute',
		'--toast-offset': setStyle(offset),
	} as React.CSSProperties;
	const handleClose = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		if (root.current?.contains(document.activeElement) && previousFocus.current?.isConnected)
			previousFocus.current.focus({ preventScroll: true });
		dismiss('dismiss');
	};
	/* START.DEBUG */
	useTrackRenders(props, 'Toast');
	/* END.DEBUG */
	return (
		<>
			<div
				className={css.announcement}
				role={urgency === 'assertive' ? 'alert' : 'status'}
				aria-live={urgency}
				aria-atomic="true"
			>
				{notification?.info.message ?? ''}
			</div>
			<AnimatePresence initial={false} onExitComplete={finishExits}>
				{notification && (
					<ToastSurface
						key={notification.token}
						{...attributes}
						forwardedRef={setRef}
						reduced={reduced}
						variants={variants}
						transition={resolvedTransition}
						className={classNames(css.wrapper, css[textSize], className ?? '')}
						style={{ ...style, ...cssVars, [position]: offset }}
						onClick={onClick ? (event) => onClick(event, data) : undefined}
						onMouseEnter={(event) => {
							onMouseEnter?.(event);
							interaction('hover', true);
						}}
						onMouseLeave={(event) => {
							onMouseLeave?.(event);
							interaction('hover', false);
						}}
						onFocus={(event) => {
							onFocus?.(event);
							interaction('focus', true);
						}}
						onBlur={(event) => {
							onBlur?.(event);
							if (!event.currentTarget.contains(event.relatedTarget as Node | null)) interaction('focus', false);
						}}
					>
						{onClick && <button type="button" className={css.action} aria-label={notification.info.message} />}
						<div aria-hidden="true" className={css.message}>
							{progress && (
								<div className={css.progress}>
									{reduced ? (
										<Icon name="arrows.refresh-cw" size={20} strokeColor={colorScheme.text} />
									) : (
										<ProgressIndicator decorative show inline color={colorScheme.text} />
									)}
								</div>
							)}
							{notification.info.message}
						</div>
						{close && (
							<button
								type="button"
								className={css.close}
								aria-label={closeLabel.trim() || 'Dismiss notification'}
								onClick={handleClose}
							>
								<Icon name="basic.cross" size={20} strokeColor={colorScheme.text} pointer={false} />
							</button>
						)}
					</ToastSurface>
				)}
			</AnimatePresence>
		</>
	);
}
const ToastBase = React.forwardRef(ToastComponent);
ToastBase.displayName = 'Toast';
export const Toast = React.memo(ToastBase) as <T = unknown>(
	props: ToastProps<T> & React.RefAttributes<HTMLDivElement>,
) => React.JSX.Element;
