'use client';

import { AnimatePresence, type Transition, type Variants, motion } from 'motion/react';
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useTheme } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { accessibleKeyDown, filterClasses, setStyle } from '../../utils/functions/misc';
import { Icon } from '../Icon';
import { ProgressIndicator } from '../Progress';
import css from './Toast.module.css';
import { type ToastProps, ToastType } from './_types';

const ToastBase = React.forwardRef<HTMLDivElement, ToastProps>((props, ref) => {
	const {
		notifId,
		message = null,
		size = 'm',
		border = true,
		padding,
		radius = 8,
		container = 'window',
		showDelay = 0,
		duration = 5000,
		position = 'bottom',
		offset = 24,
		close = true,
		progress = undefined,
		type = ToastType.Info,
		didHide = () => null,
		...divAttributes
	} = props;
	const theme = useTheme();

	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? `${className}` : '';

	const [ready, setReady] = useState<boolean>(false);
	const [content, setContent] = useState<string | null>(null);
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

	// schedule toast visibility from the incoming message and duration
	useEffect(() => {
		if (timer.current) clearTimeout(timer.current);
		const show = message && message.length > 0;
		if (show) {
			timer.current = setTimeout(() => {
				setContent(message);
				if (timer.current) clearTimeout(timer.current);
				if (duration !== 'Infinite') {
					timer.current = setTimeout(() => {
						setReady(false);
					}, duration);
				}
			}, showDelay);
		} else {
			setContent(null);
		}
		// clean up timers
		return () => {
			if (timer.current) clearTimeout(timer.current);
		};
	}, [message, showDelay, duration]);

	// enable animation once content has been set
	useEffect(() => setReady(content !== null), [content]);

	// resolve the default padding based on whether the close affordance is shown
	const defaultPadding = useMemo(() => {
		return close ? '10px 12px 10px 16px' : '10px 16px';
	}, [close]);

	// resolve toast colors from the selected toast type
	const colorScheme = useMemo(() => {
		switch (type) {
			case 'success':
				return {
					border: 'var(--array-land-label)',
					bg: 'var(--array-land)',
					text: 'var(--array-land-label)',
				};
			case 'warning':
				return {
					border: 'var(--array-orange-label)',
					bg: 'var(--array-orange)',
					text: 'var(--array-orange-label)',
				};
			case 'error':
				return {
					border: 'var(--feedback-warning)',
					bg: 'var(--array-magenta)',
					text: 'var(--feedback-warning)',
				};
			default:
				return {
					border: 'var(--core-outline-primary)',
					bg: 'var(--core-surface-secondary)',
					text: 'var(--core-text-primary)',
				};
		}
	}, [type]);

	// compose CSS custom properties for spacing and color treatment
	const cssVars = useMemo(() => {
		return {
			'--toast-padding': setStyle(padding, defaultPadding),
			'--toast-background': colorScheme.bg,
			'--toast-color': colorScheme.text,
			'--toast-border': border ? `1px solid ${colorScheme.border}` : 'unset',
			'--toast-border-radius': setStyle(radius, 4),
			'--toast-position': container === 'window' ? 'fixed' : 'absolute',
		} as React.CSSProperties;
	}, [padding, border, colorScheme, radius, defaultPadding, container]);

	// resolve entry and exit variants from the toast position
	const variants = useMemo(() => {
		const positionShow = position === 'bottom' ? { bottom: offset } : { top: offset };
		const positionHide = position === 'bottom' ? { bottom: -offset } : { top: -offset };
		const transition: Transition = { ease: 'easeInOut', duration: 0.25 };
		return {
			initial: { opacity: 0, ...positionHide },
			animate: { opacity: 1, ...positionShow, transition },
			exit: { opacity: 0, ...positionHide, transition },
		} as Variants;
	}, [position, offset]);

	// compose wrapper class names from size and caller overrides
	const classNames = useMemo(() => {
		return filterClasses([css.wrapper, css[size], divClass]);
	}, [size, divClass]);

	// dismiss the toast immediately when the close affordance is used
	const handleClose = useCallback(() => {
		setReady(false);
	}, []);

	// pause the auto-hide timer while the toast is hovered or focused
	const handleMouseOver = useCallback(() => {
		if (timer.current) clearTimeout(timer.current);
	}, []);

	// restart the auto-hide timer after hover or focus ends
	const handleMouseOut = useCallback(() => {
		if (timer.current) clearTimeout(timer.current);
		if (duration !== 'Infinite') {
			timer.current = setTimeout(() => {
				setContent(null);
			}, duration);
		}
	}, [duration]);

	// memo show progress
	const showProgress = useMemo(() => {
		if (progress !== undefined) return progress;
		return duration === 'Infinite';
	}, [progress, duration]);

	// resolve the close icon color from the selected toast type
	const iconColor = useMemo(() => {
		switch (type) {
			case ToastType.Error:
				return theme.current.colors['feedback-warning'];
			case ToastType.Success:
				return theme.current.colors['array-land-label'];
			case ToastType.Warning:
				return theme.current.colors['array-orange-label'];
			default:
				return theme.current.colors['core-text-primary'];
		}
	}, [type, theme]);

	/* START.DEBUG */
	useTrackRenders(props, 'Toast');
	/* END.DEBUG */

	return (
		<AnimatePresence onExitComplete={() => didHide()} initial={false}>
			{ready && (
				<motion.div
					key={notifId}
					ref={ref}
					id={divId}
					className={classNames}
					{...rest}
					onMouseEnter={handleMouseOver}
					onMouseLeave={handleMouseOut}
					onFocus={handleMouseOver}
					onBlur={handleMouseOut}
					style={{
						...divStyle,
						...cssVars,
						visibility: ready ? 'visible' : 'hidden',
					}}
					variants={variants}
					initial={'initial'}
					animate={'animate'}
					exit={'exit'}
				>
					<div role={'status'} aria-live={'polite'} className={css.message}>
						{showProgress && (
							<div className={css.progress}>
								<ProgressIndicator show inline color={iconColor} />
							</div>
						)}
						{content}
					</div>
					{(duration === 'Infinite' || close) && (
						<div
							className={css.close}
							tabIndex={0}
							role={'button'}
							aria-label={'dismiss message'}
							onKeyDown={(e) => accessibleKeyDown(e, handleClose)}
							onClick={handleClose}
						>
							<Icon name={'x'} size={20} strokeColor={iconColor} />
						</div>
					)}
				</motion.div>
			)}
		</AnimatePresence>
	);
});

ToastBase.displayName = 'Toast';

export const Toast = React.memo(ToastBase);
