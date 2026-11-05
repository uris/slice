'use client';

import React, { useCallback, useContext, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { accessibleKeyDown, setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { AvatarGroupContext } from '../AvatarGroup/AvatarGroupContext';
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

type AvatarRenderProps<T> = AvatarProps<T> & { displayText?: string };

// displayText is private to the group's overflow avatar, not part of Avatar's public API.
function AvatarComponent<T = unknown>(rawProps: AvatarRenderProps<T>) {
	const group = useContext(AvatarGroupContext);
	const ownProps = Object.fromEntries(
		Object.entries(rawProps).filter(([, value]) => value !== undefined),
	) as AvatarRenderProps<T>;
	const props = resolveColorProps(group ? ({ ...group.avatarProps, ...ownProps } as AvatarRenderProps<T>) : rawProps);
	const {
		info,
		displayText,
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

	const renderContent = () => {
		if (image) return <AvatarImage key={image} image={image} lazyLoad={lazyLoad} initials={initials} />;
		if (displayText)
			return (
				<span
					className={css.overflowLabel}
					style={{ '--avatar-label-length': displayText.length } as React.CSSProperties}
				>
					{displayText}
				</span>
			);
		return initials;
	};

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

	const avatar = (
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
				{renderContent()}
			</div>
		</div>
	);
	return group ? <div className={group.itemClassName}>{avatar}</div> : avatar;
}

// React.memo erases generic inference; preserve the wrapped component's public signature.
export const Avatar = React.memo(AvatarComponent) as <T = unknown>(props: AvatarProps<T>) => React.JSX.Element;

/** Internal overflow renderer: shares the avatar's frame, tooltip, and keyboard behavior. */
export function AvatarOverflow({
	count,
	onClick,
}: { count: number; onClick?: React.MouseEventHandler<HTMLDivElement> }) {
	const label = `${count} more ${count === 1 ? 'avatar' : 'avatars'}`;
	return (
		<AvatarComponent
			className={css.overflow}
			name={label}
			displayText={`+${count}`}
			aria-label={label}
			onClick={onClick}
		/>
	);
}
