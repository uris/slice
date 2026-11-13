'use client';

import React, { useContext, useId, useMemo, useRef } from 'react';
import { useObserveResize } from '../../hooks/useObserveResize/useObserveResize';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { ModalHostContext } from '../ModalController/ModalHostContext';
import css from './DialogBox.module.css';
import type { DialogBoxAction, DialogBoxControls, DialogBoxProps } from './_types';
import { parseSections } from './parseSections';
import { sections } from './sections';
import { DialogBoxContext } from './useDialogBox';

const BaseDialogBox = <T = string>(rawProps: DialogBoxProps<T>) => {
	const props = resolveColorProps(rawProps);
	const {
		children,
		id,
		className,
		style,
		minWidth,
		minHeight = 'unset',
		maxHeight = 400,
		maxWidth = 400,
		padding,
		close = true,
		title,
		dialogName,
		titleBackgroundColor,
		titleTextSize = 'l',
		contentTextSize = 'm',
		actions,
		actionsBackgroundColor,
		titleIcon,
		titleIconDualTone = true,
		titleBorderColor = 'var(--core-fill-primary)',
		titleBorderWidth,
		actionsBorderColor = 'var(--core-fill-primary)',
		actionsBorderWidth = 0,
		autoBorderBottom = true,
		onAction,
		onReject,
		onResolve,
		onClose,
		onToolTip,
		onDragPointerDown,
		backgroundColor = 'var(--core-surface-secondary)',
		scrollHandleColor = 'var(--core-text-disabled)',
		scrollHandleColorHover = 'var(--core-text-disabled)',
		titleTextColor = 'var(--core-text-primary)',
		borderColor = 'var(--core-outline-primary)',
		borderRadius = 'var(--corner-xl)',
		borderWidth = 0,
		...rest
	} = props;
	const slots = parseSections(children, title, actions);
	const hasTitle = React.Children.toArray(slots.title).some(
		(child) => typeof child !== 'string' || child.trim().length > 0,
	);
	const accessibleName = dialogName?.trim();
	const controls = useMemo<DialogBoxControls<T>>(
		() => ({
			close: () => onClose?.(),
			resolve: (value) => onResolve?.(value),
			reject: (error) => onReject?.(error),
		}),
		[onClose, onResolve, onReject],
	);
	const titleId = useId();
	const modalHost = useContext(ModalHostContext);
	const contentRef = useRef<HTMLDivElement>(null);
	const contentWrapperRef = useRef<HTMLDivElement>(null);
	const modalStyle = style ?? ({} as React.CSSProperties);
	const modalClass = className ? ` ${className}` : '';
	const contentSize = useObserveResize(contentRef);
	const viewportSize = useObserveResize(contentWrapperRef);
	const scrolls = contentSize.height > viewportSize.height;
	const resolvedTitleBorderWidth = titleBorderWidth ?? (scrolls ? 1 : 0);
	const titlePaddingBottom = scrolls ? 'var(--spacing-xs)' : '0px';

	const setActionBorderWidth = useMemo(() => {
		if (scrolls && actionsBorderWidth === 0 && autoBorderBottom) return '1px';
		return setStyle(actionsBorderWidth);
	}, [actionsBorderWidth, scrolls, autoBorderBottom]);

	const setPaddingAdjustment = useMemo(() => {
		if (scrolls) {
			if (padding && typeof padding === 'number') return setStyle(padding);
			if (padding && typeof padding === 'string') return padding.split(' ')[0];
			return 'var(--spacing-s)';
		}
		return '0px';
	}, [scrolls, padding]);

	// memo dynamic css vars
	const cssVars = useMemo(() => {
		return {
			'--modal-min-width': setStyle(minWidth, 'min(300px, 100%)'),
			'--modal-min-height': setStyle(minHeight),
			'--modal-max-height': setStyle(maxHeight),
			'--modal-max-width': setStyle(maxWidth),
			'--modal-border-color': borderColor,
			'--modal-title-color': titleTextColor,
			'--modal-border-radius': setStyle(borderRadius),
			'--modal-border-width': setStyle(borderWidth),
			'--modal-padding': setStyle(padding, 'var(--spacing-m) var(--spacing-m)'),
			'--modal-title-padding': setStyle(padding, `var(--spacing-m) var(--spacing-m) ${titlePaddingBottom}`),
			'--modal-padding-adjust': setPaddingAdjustment,
			'--modal-content-margin-top': scrolls ? 'var(--spacing-xxs)' : '0px',
			'--modal-background-color': backgroundColor,
			'--modal-title-border-color': titleBorderColor,
			'--modal-title-border-width': setStyle(resolvedTitleBorderWidth),
			'--modal-title-background-color': titleBackgroundColor ?? backgroundColor,
			'--modal-actions-background-color': actionsBackgroundColor ?? backgroundColor,
			'--modal-actions-border-color': actionsBorderColor,
			'--modal-scroll-handle': setStyle(scrollHandleColor),
			'--modal-scroll-handle-hover': setStyle(scrollHandleColorHover),
			'--modal-actions-border-width': setActionBorderWidth,
		} as React.CSSProperties;
	}, [
		minWidth,
		minHeight,
		maxHeight,
		maxWidth,
		borderColor,
		titleTextColor,
		borderRadius,
		borderWidth,
		padding,
		setPaddingAdjustment,
		scrolls,
		titlePaddingBottom,
		resolvedTitleBorderWidth,
		titleBorderColor,
		actionsBorderColor,
		actionsBackgroundColor,
		titleBackgroundColor,
		backgroundColor,
		scrollHandleColor,
		scrollHandleColorHover,
		setActionBorderWidth,
	]);

	// handle the action click event
	const handleAction = (action: DialogBoxAction<T>) => {
		if (action.disabled || action.working) return;
		const resolves = !action.promise || action.promise === 'resolve';
		const rejects = action.promise === 'reject';
		try {
			onAction?.(action.value);
		} finally {
			if (resolves) onResolve?.(action.value);
			if (rejects) onReject?.(new Error('DialogBox rejected', { cause: action.value }));
		}
	};

	// Closing requests dismissal; action rejection is a separate operation.
	const handleClose = controls.close;

	// render action buttons based on their position, if none defined default to right
	const renderActions = (position: 'right' | 'left') => {
		return actions?.map((action) => {
			if (!action.position && position === 'left') return null;
			if (action.position && position !== action.position) return null;
			return (
				<Button
					variant={action.primary ? 'solid' : 'outline'}
					key={action.id}
					label={action.label}
					aria-label={action.label || action.tooltip || 'Action'}
					onClick={() => handleAction(action)}
					disabled={action.disabled}
					working={action.working}
					round={action.round === true}
					iconLeft={action.iconLeft}
					iconRight={action.iconRight}
					tooltip={action.tooltip}
					onToolTip={(tip) => onToolTip?.(tip)}
				/>
			);
		});
	};

	return (
		<DialogBoxContext.Provider value={controls as DialogBoxControls<unknown>}>
			<div
				{...Object.fromEntries(Object.entries(rest).filter(([key]) => !key.startsWith('aria-') && key !== 'role'))}
				id={id}
				className={`${css.wrapper}${modalClass}`}
				style={{ ...modalStyle, ...cssVars }}
				role="dialog"
				aria-modal={modalHost || undefined}
				aria-labelledby={!accessibleName && hasTitle ? titleId : undefined}
				aria-label={accessibleName || (!hasTitle ? 'Dialog' : undefined)}
				tabIndex={-1}
			>
				{(hasTitle || close) && (
					<div
						className={`${css.title} ${css[titleTextSize]}`}
						onPointerDown={(event) => {
							if ((event.target as Element).closest('button, a, input, select, textarea, [contenteditable="true"]'))
								return;
							onDragPointerDown?.(event);
						}}
					>
						<div className={css.titleBlock}>
							{titleIcon && (
								<div className={css.titleIcon} aria-hidden="true">
									<Icon name={titleIcon} dualTone={titleIconDualTone} size={20} />
								</div>
							)}
							{hasTitle && (
								<h2 id={titleId} className={css.heading}>
									{slots.title}
								</h2>
							)}
						</div>
						{close && (
							<div className={css.close}>
								<div className={css.titleIcon}>
									<IconButton
										tooltip={'close'}
										actionName={'close'}
										icon={'basic.cross'}
										onClick={handleClose}
										onToolTip={(tip) => onToolTip?.(tip)}
										hover={false}
										backgroundColor={'transparent'}
										backgroundColorHover={'transparent'}
										backgroundColorSelected={'transparent'}
										buttonSize={'s'}
									/>
								</div>
							</div>
						)}
					</div>
				)}
				<div className={css.contentWrapper} ref={contentWrapperRef}>
					<div ref={contentRef} className={`${css.content} ${css[contentTextSize]}`}>
						{slots.content}
					</div>
				</div>
				{(slots.hasActions || (actions && actions.length > 0)) && (
					<div
						className={css.actions}
						onPointerDown={(event) => {
							if ((event.target as Element).closest('button, a, input, select, textarea, [contenteditable="true"]'))
								return;
							onDragPointerDown?.(event);
						}}
					>
						{slots.hasActions ? (
							<div className={css.rightActions}>{slots.actions}</div>
						) : (
							<>
								<div className={css.leftActions}>{renderActions('left')}</div>
								<div className={css.rightActions}>{renderActions('right')}</div>
							</>
						)}
					</div>
				)}
			</div>
		</DialogBoxContext.Provider>
	);
};

type DialogBoxComponent = (<T = string>(props: DialogBoxProps<T>) => React.JSX.Element) & typeof sections;

export const DialogBox = Object.assign(React.memo(BaseDialogBox), sections) as DialogBoxComponent;
