'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { setStyle } from '../../utils/functions/misc';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import css from './Modal.module.css';
import type { ModalAction, ModalProps } from './_types';

const BaseModal = <T = string>(props: ModalProps<T>) => {
	const {
		children,
		id,
		className,
		style,
		minWidth = 300,
		minHeight = 200,
		maxHeight = 400,
		maxWidth = 400,
		padding,
		close = true,
		title,
		titleSize = 'l',
		contentSize = 'm',
		actions,
		titleIcon,
		titleIconFill = true,
		titleBorderColor = 'var(--core-outline-primary)',
		titleBorderWidth = 0,
		actionsBorderColor = 'var(--core-outline-primary)',
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
		titleColor = 'var(--core-text-special)',
		borderColor = 'var(--core-outline-primary)',
		borderRadius = 8,
		borderWidth = 1,
		...rest
	} = props;
	const contentWrapperRef = useRef<HTMLDivElement>(null);
	const modalStyle = style ?? ({} as React.CSSProperties);
	const modalClass = className ? ` ${className}` : '';
	const [scrolls, setScrolls] = useState<boolean>(false);

	// determine if the modal content needs to scroll
	const getScrolls = useCallback(() => {
		const height = contentWrapperRef.current?.offsetHeight;
		const scrollHeight = contentWrapperRef.current?.scrollHeight;
		if (!height || !scrollHeight) return false;
		return height < scrollHeight;
	}, []);

	const setActionBorderWidth = useMemo(() => {
		if (scrolls && actionsBorderWidth === 0 && autoBorderBottom) return '1px';
		return setStyle(actionsBorderWidth);
	}, [actionsBorderWidth, scrolls, autoBorderBottom]);

	// set content padding for scrolling
	const setContentPaddingTops = useMemo(() => {
		if (scrolls && autoBorderBottom) {
			if (typeof padding === 'string') {
				const parts = padding.split(' ');
				return parts[0];
			}
			return setStyle(padding, '16px');
		}
		return '0';
	}, [scrolls, padding, autoBorderBottom]);

	// memo dynamic css vars
	const cssVars = useMemo(() => {
		return {
			'--modal-min-width': setStyle(minWidth),
			'--modal-min-height': setStyle(minHeight),
			'--modal-max-height': setStyle(maxHeight),
			'--modal-max-width': setStyle(maxWidth),
			'--modal-border-color': borderColor,
			'--modal-title-color': titleColor,
			'--modal-border-radius': setStyle(borderRadius),
			'--modal-border-width': setStyle(borderWidth),
			'--modal-padding': setStyle(padding, '16px 24px'),
			'--modal-background-color': backgroundColor,
			'--modal-title-border-color': titleBorderColor,
			'--modal-title-border-width': setStyle(titleBorderWidth),
			'--modal-actions-border-color': actionsBorderColor,
			'--modal-scroll-handle': setStyle(scrollHandleColor),
			'--modal-scroll-handle-hover': setStyle(scrollHandleColorHover),
			'--modal-actions-border-width': setActionBorderWidth,
			'--modal-content-padding-tops': setContentPaddingTops,
		} as React.CSSProperties;
	}, [
		minWidth,
		minHeight,
		maxHeight,
		maxWidth,
		borderColor,
		titleColor,
		borderRadius,
		borderWidth,
		padding,
		titleBorderWidth,
		titleBorderColor,
		actionsBorderColor,
		backgroundColor,
		scrollHandleColor,
		scrollHandleColorHover,
		setContentPaddingTops,
		setActionBorderWidth,
	]);

	// handle the action click event
	const handleAction = (action: ModalAction<T>) => {
		const resolves = !action.promise || action.promise === 'resolve';
		const rejects = action.promise === 'reject';
		onAction?.(action.value);
		if (resolves) onResolve?.(action.value);
		if (rejects) {
			onReject?.(new Error('Modal rejected', { cause: action.value }));
		}
	};

	// Cancel will always reject as user takes no action at all
	const handleClose = () => {
		onReject?.(new Error('Modal was closed', { cause: 'user action' }));
		onClose?.();
	};

	// set scrolls
	useEffect(() => {
		if (!children || !maxHeight) return;
		setScrolls(getScrolls());
	}, [children, maxHeight, getScrolls]);

	console.log(scrolls);

	// render action buttons based on their position, if none defined default to right
	const renderActions = (position: 'right' | 'left') => {
		return actions?.map((action, index) => {
			if (!action.position && position === 'left') return null;
			if (action.position && position !== action.position) return null;
			return (
				<Button
					variant={action.primary ? 'solid' : 'outline'}
					key={`${action.id}_${index}`}
					label={action.label}
					onClick={(e) => handleAction(action)}
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
		<div id={id} className={`${css.wrapper}${modalClass}`} style={{ ...modalStyle, ...cssVars }} {...(rest as any)}>
			{(title || close) && (
				<div className={`${css.title} ${css[titleSize]}`} onPointerDown={onDragPointerDown}>
					<div className={css.titleBlock}>
						{titleIcon && (
							<div className={css.titleIcon}>
								<Icon name={titleIcon} fill={titleIconFill} size={20} />
							</div>
						)}
						{title}
					</div>
					{close && (
						<div className={css.close}>
							<div className={css.titleIcon}>
								<IconButton tooltip={'close'} icon={'x'} onClick={handleClose} onToolTip={(tip) => onToolTip?.(tip)} />
							</div>
						</div>
					)}
				</div>
			)}
			<div className={css.contentWrapper} ref={contentWrapperRef}>
				<div className={`${css.content} ${css[contentSize]}`}>{children}</div>
			</div>
			{actions && actions.length > 0 && (
				<div className={css.actions} onPointerDown={onDragPointerDown}>
					<div className={css.leftActions}>{renderActions('left')}</div>
					<div className={css.rightActions}>{renderActions('right')}</div>
				</div>
			)}
		</div>
	);
};

export const Modal = React.memo(BaseModal) as <T = string>(props: ModalProps<T>) => React.JSX.Element;
