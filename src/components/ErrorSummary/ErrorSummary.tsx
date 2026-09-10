'use client';

import { AnimatePresence, type Transition, motion } from 'motion/react';
import React, { useCallback, useMemo } from 'react';
import { useTheme } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { addOpacity } from '../../utils';
import css from './ErrorSummary.module.css';
import type { ErrorMessage, ErrorSummaryProps } from './_types';

export const ErrorSummary = React.memo((props: ErrorSummaryProps) => {
	const { current } = useTheme();
	const warning = current.colors['feedback-warning'];
	const bg = addOpacity(warning, 0.1);
	const {
		entries,
		textSize = 'm',
		textColor = warning,
		backgroundColor,
		bgColor = bg,
		autoNumber = true,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const resolvedBackgroundColor = backgroundColor ?? bgColor;

	// define the open and close animation states for the summary panel
	const variants = useMemo(
		() => ({
			enter: { opacity: 0, maxHeight: 0 },
			animate: { opacity: 1, maxHeight: 500 },
			exit: { opacity: 0, maxHeight: 0 },
		}),
		[],
	);

	// keep the summary transition consistent across visibility changes
	const transition: Transition = useMemo(() => ({ ease: 'easeInOut', duration: 0.25 }), []);

	// recurse through error entries to render the error messages
	const renderMessages = useCallback(
		(messages: string[]) => {
			if (!messages) return null;
			return messages.map((message: string) => {
				return (
					<li className={`${css.li} ${css[textSize]}`} key={message}>
						{message}
					</li>
				);
			});
		},
		[textSize],
	);

	// derive the rendered error entries from the active error ids
	const renderedErrors = useMemo(() => {
		if (!entries) return null;
		const addNumbers = autoNumber && entries.length > 1;
		return entries.map((error: ErrorMessage, index: number) => {
			let messages: string[] | undefined = undefined;
			if (error.message) messages = Array.isArray(error.message) ? error.message : [error.message];
			const number = addNumbers ? `${index + 1}. ` : '';
			return (
				<div className={css.error} key={`${error.title}_${index}`}>
					<p className={`${css.p} ${css[textSize]}`}>
						<strong>{`${number}${error.title}`}</strong>
					</p>
					{messages && <ul className={css.ul}>{renderMessages(messages)}</ul>}
				</div>
			);
		});
	}, [entries, autoNumber, renderMessages, textSize]);

	const cssVars = useMemo(() => {
		return {
			'--error-text-color': textColor,
			'--error-bg-color': resolvedBackgroundColor,
		} as React.CSSProperties;
	}, [textColor, resolvedBackgroundColor]);

	/* START.DEBUG */
	useTrackRenders(props, 'ErrorSummary');
	/* END.DEBUG */

	return (
		<AnimatePresence initial={false}>
			{entries && entries.length > 0 && (
				<motion.div
					id={divId}
					className={`${css.errorBox}${divClass}`}
					style={{ ...divStyle, ...cssVars }}
					initial={'enter'}
					animate={'animate'}
					exit={'exit'}
					variants={variants}
					transition={transition}
					{...(rest as any)}
				>
					{renderedErrors}
				</motion.div>
			)}
		</AnimatePresence>
	);
});
