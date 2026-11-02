'use client';

import React, { useCallback, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { accessibleKeyDown, setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import css from './Avatar.module.css';
import type { AvatarProps } from './_types';

/** A new source gets a fresh loading state, including when switching back to an earlier photo. */
function AvatarImage({ image, lazyLoad, initials }: { image: string; lazyLoad: boolean; initials: string }) {
	const [loaded, setLoaded] = useState(false);
	const syncLoadedImage = useCallback((element: HTMLImageElement | null) => {
		// Server-rendered or cached images can finish before React attaches onLoad.
		if (element?.complete && element.naturalWidth > 0) setLoaded(true);
	}, []);
	return (
		<>
			{!loaded && initials}
			<img
				ref={syncLoadedImage}
				className={css.image}
				src={image}
				alt=""
				loading={lazyLoad ? 'lazy' : 'eager'}
				decoding="async"
				data-loaded={loaded}
				onLoad={() => setLoaded(true)}
				onError={() => setLoaded(false)}
			/>
		</>
	);
}

function AvatarComponent<T = unknown>(rawProps: AvatarProps<T>) {
	const props = resolveColorProps(rawProps);
	const {
		info,
		name,
		email,
		image = '',
		lazyLoad = false,
		size = 34,
		textSize = 'm',
		textColor,
		backgroundColor,
		borderWidth = 0,
		borderColor,
		borderColorHover,
		outerBorderWidth = 0,
		outerBorderColor,
		onClick,
		onKeyDown,
		onToolTip,
		onMouseEnter,
		onMouseLeave,
		onFocus,
		onBlur,
		tabIndex = 0,
		className,
		style,
		...divAttributes
	} = props;
	// Adapt remaining native handlers, including capture events, without forwarding info to the DOM.
	const forwardedAttributes: Record<string, unknown> = { ...divAttributes };
	for (const [key, value] of Object.entries(forwardedAttributes)) {
		if (key.startsWith('on') && typeof value === 'function') {
			forwardedAttributes[key] = (event: React.SyntheticEvent<HTMLDivElement>) => value(event, info);
		}
	}

	const ref = useRef<HTMLDivElement>(null);
	const hovered = useRef(false);
	const focused = useRef(false);
	const displayName = name?.trim() ?? '';
	const displayEmail = email?.trim() ?? '';
	const label = displayName || displayEmail;
	const parts = displayName.split(/\s+/);
	let initials = displayEmail.charAt(0);
	if (displayName) {
		initials = parts[0].charAt(0);
		if (parts.length > 1) initials += parts[parts.length - 1].charAt(0);
	}

	const avatarVars = {
		'--avatar-size': setStyle(size),
		'--avatar-border': `${borderWidth}px`,
		'--avatar-color': textColor ?? 'var(--core-text-primary)',
		'--avatar-bg-color': backgroundColor ?? 'var(--core-surface-secondary)',
		'--avatar-border-color': borderColor ?? 'var(--core-outline-primary)',
		'--avatar-border-color-hover': borderColorHover ?? 'var(--core-outline-special)',
		'--avatar-outer-border-size': `${outerBorderWidth}px`,
		'--avatar-outer-border-color': outerBorderColor ?? 'var(--core-surface-primary)',
		'--avatar-cursor': onClick ? 'pointer' : 'default',
	} as React.CSSProperties;

	/* START.DEBUG */
	useTrackRenders(props, 'Avatar');
	/* END.DEBUG */

	return (
		<div
			{...forwardedAttributes}
			ref={ref}
			className={`${css.wrapper}${className ? ` ${className}` : ''}`}
			style={{ ...style, ...avatarVars }}
			onMouseEnter={(event) => {
				hovered.current = true;
				onMouseEnter?.(event, info);
				onToolTip?.({ payload: { label }, ref, event }, info);
			}}
			onMouseLeave={(event) => {
				hovered.current = false;
				onMouseLeave?.(event, info);
				if (!focused.current) onToolTip?.(null, info);
			}}
			onFocus={(event) => {
				focused.current = true;
				onFocus?.(event, info);
				onToolTip?.({ payload: { label }, ref }, info);
			}}
			onBlur={(event) => {
				focused.current = false;
				onBlur?.(event, info);
				if (!hovered.current) onToolTip?.(null, info);
			}}
			onClick={onClick ? (event) => onClick(event, info) : undefined}
			onKeyDown={(event) => {
				onKeyDown?.(event, info);
				if (!onClick || event.defaultPrevented || event.repeat) return;
				// Dispatch a real click so onClick always receives a mouse event, including keyboard activation.
				accessibleKeyDown(event, () => event.currentTarget.click());
			}}
			role={divAttributes.role ?? (onClick ? 'button' : 'img')}
			tabIndex={onClick ? tabIndex : undefined}
			aria-label={divAttributes['aria-label'] ?? `User Avatar - ${label || 'Unknown User'}`}
		>
			<div aria-hidden={true} className={`${css.user} ${css[textSize]}`}>
				{image ? <AvatarImage key={image} image={image} lazyLoad={lazyLoad} initials={initials} /> : initials}
			</div>
		</div>
	);
}

// React.memo erases generic inference; preserve the wrapped component's public signature.
export const Avatar = React.memo(AvatarComponent) as typeof AvatarComponent;
