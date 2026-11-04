'use client';

import {
	AnimatePresence,
	type Transition,
	type Variants,
	motion,
	useAnimationControls,
	usePresence,
} from 'motion/react';
import React, { useEffect, useMemo } from 'react';
import { useTheme } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { addOpacity } from '../../utils';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import css from './ErrorSummary.module.css';
import type { ErrorSummaryProps } from './_types';

const withoutAria = (attributes: object) =>
	Object.fromEntries(Object.entries(attributes).filter(([key]) => !key.startsWith('aria-') && key !== 'role'));

function uniqueKey(value: string, counts: Map<string, number>) {
	const occurrence = counts.get(value) ?? 0;
	counts.set(value, occurrence + 1);
	return JSON.stringify([value, occurrence]);
}

const defaultMotionValues = {
	initial: { height: 0, opacity: 0 },
	animate: { height: 'auto', opacity: 1 },
	exit: { height: 0, opacity: 0 },
} satisfies Variants;

function AnimatedSummary({
	children,
	transition,
	motionValues,
}: { children: React.ReactNode; transition: Transition; motionValues?: Variants }) {
	const [isPresent, safeToRemove] = usePresence();
	const reducedMotion = usePrefersReducedMotion();
	const controls = useAnimationControls();
	const variants = useMemo(() => {
		const merged: Variants = { ...defaultMotionValues, ...motionValues };
		for (const state of ['initial', 'animate', 'exit'] as const) {
			const override = motionValues?.[state];
			if (override && typeof override !== 'function') merged[state] = { ...defaultMotionValues[state], ...override };
		}
		return merged;
	}, [motionValues]);
	useEffect(() => {
		if (reducedMotion) {
			if (!isPresent) safeToRemove?.();
			return;
		}
		let active = true;
		const state = isPresent ? 'animate' : 'exit';
		const target = variants[state];
		const definition = typeof target === 'function' ? state : target;
		void controls.start(definition, transition).then(() => {
			if (active && !isPresent) safeToRemove?.();
		});
		return () => {
			active = false;
			controls.stop();
		};
	}, [controls, isPresent, reducedMotion, safeToRemove, transition, variants]);
	if (reducedMotion) return isPresent ? <div className={css.clip}>{children}</div> : null;
	return (
		<motion.div
			className={css.clip}
			inert={!isPresent || undefined}
			aria-hidden={!isPresent || undefined}
			initial="initial"
			animate={controls}
			variants={variants}
			transition={transition}
		>
			{children}
		</motion.div>
	);
}

const ErrorSummaryComponent = React.forwardRef<HTMLDivElement, ErrorSummaryProps>((rawProps, ref) => {
	const props = resolveColorProps(rawProps);
	const { current } = useTheme();
	const reducedMotion = usePrefersReducedMotion();
	const warning = current.colors['feedback-warning'];
	const {
		entries,
		announcement = 'polite',
		summaryName = 'Errors to review',
		textSize = 'm',
		textColor = warning,
		backgroundColor = addOpacity(warning, 0.1),
		borderColor = warning,
		borderWidth = 1,
		borderRadius = 'var(--corner-xs)',
		padding = 'var(--spacing-m)',
		gap = 'var(--spacing-xs)',
		transition,
		motionValues,
		className,
		style,
		tabIndex,
		...attributes
	} = props;
	const timing = useMemo(() => getWaterTransition(current.motion, transition), [current.motion, transition]);
	const hasEntries = Boolean(entries?.length);
	const getRole = () => {
		if (announcement === 'off') return 'region';
		if (announcement === 'assertive') return 'alert';
		return 'status';
	};
	const navigateToField = (event: React.MouseEvent<HTMLButtonElement>, name: string) => {
		const summary = event.currentTarget.closest('[data-error-summary]');
		const scope = summary?.closest('form') ?? event.currentTarget.ownerDocument;
		const controls = scope.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
			'input[name], select[name], textarea[name]',
		);
		const target = Array.from(controls).find((control) => {
			if (control.name !== name || control.matches(':disabled, input[type="hidden"]')) return false;
			if (!control.getClientRects().length || control.closest('[inert]')) return false;
			const visibility = control.ownerDocument.defaultView?.getComputedStyle(control).visibility;
			return visibility !== 'hidden' && visibility !== 'collapse';
		});
		if (!target) return;
		target.focus({ preventScroll: true });
		(target.parentElement ?? target).scrollIntoView({
			block: 'center',
			behavior: reducedMotion ? 'instant' : 'smooth',
		});
	};
	const entryCounts = new Map<string, number>();
	const content = entries?.map((entry) => {
		const key = uniqueKey(entry.id ?? entry.fieldName ?? entry.title, entryCounts);
		const messageCounts = new Map<string, number>();
		const getMessages = () => {
			if (Array.isArray(entry.message)) return entry.message.filter((message) => message.trim());
			if (entry.message?.trim()) return [entry.message];
			return [];
		};
		const messages = getMessages();
		return (
			<li className={css.entry} key={key}>
				{entry.fieldName ? (
					<button
						className={css.field}
						type="button"
						onClick={(event) => navigateToField(event, entry.fieldName ?? '')}
					>
						{entry.title}
					</button>
				) : (
					<strong className={css.title}>{entry.title}</strong>
				)}
				{messages.length > 0 && (
					<ul className={css.messages}>
						{messages.map((message) => (
							<li key={uniqueKey(message, messageCounts)}>{message}</li>
						))}
					</ul>
				)}
			</li>
		);
	});
	const cssVars = {
		'--error-text-color': textColor,
		'--error-bg-color': backgroundColor,
		'--error-border-color': borderColor,
		'--error-border-width': setStyle(borderWidth),
		'--error-border-radius': setStyle(borderRadius),
		'--error-padding': setStyle(padding),
		'--error-gap': setStyle(gap),
	} as React.CSSProperties;
	/* START.DEBUG */
	useTrackRenders(props, 'ErrorSummary');
	/* END.DEBUG */
	return (
		<div
			{...withoutAria(attributes)}
			ref={ref}
			className={`${css.wrapper}${className ? ` ${className}` : ''}`}
			style={{ ...style, ...cssVars }}
			data-error-summary=""
			role={getRole()}
			aria-label={summaryName.trim() || 'Errors to review'}
			aria-live={announcement}
			aria-atomic={announcement !== 'off' || undefined}
			tabIndex={hasEntries ? (tabIndex ?? -1) : undefined}
		>
			<AnimatePresence>
				{hasEntries && (
					<AnimatedSummary key="summary" transition={timing} motionValues={motionValues}>
						<div className={`${css.panel} ${css[textSize]}`}>
							<ul className={css.entries}>{content}</ul>
						</div>
					</AnimatedSummary>
				)}
			</AnimatePresence>
		</div>
	);
});
ErrorSummaryComponent.displayName = 'ErrorSummary';
export const ErrorSummary = React.memo(ErrorSummaryComponent);
