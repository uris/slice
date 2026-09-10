'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { accessibleKeyDown, normalizedPercent, setStyle } from '../../utils/functions/misc';
import css from './Avatar.module.css';
import type { AvatarProps } from './_types';

export const Avatar = React.memo((props: AvatarProps) => {
	const {
		email,
		name,
		image = '',
		textColor,
		borderWidth,
		borderSize = 0,
		color = undefined,
		borderColor = undefined,
		borderColorHover = undefined,
		outerBorderSize,
		outerBorderColor,
		backgroundColor,
		bgColor = undefined,
		onClick = undefined,
		onKeyDown = undefined,
		fontSize = undefined,
		onToolTip = () => null,
		size = 34,
		frame = 34,
		tabIndex = 0,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const ref = useRef<HTMLDivElement>(null);
	const [textSize, setTextSize] = useState<number | string>('inherit');
	const resolvedTextColor = textColor ?? color;
	const resolvedBorderWidth = borderWidth ?? borderSize;
	const resolvedBackgroundColor = backgroundColor ?? bgColor;

	// derive the fallback initials shown when no image is rendered
	const initials = useMemo(() => {
		if (!name && !email) return '';
		if (name) {
			let last: string | undefined = undefined;
			const parts = name.trim().split(' ');
			const first = parts[0];
			if (parts.length > 1) last = parts.at(-1);
			return `${first.charAt(0)}${last ? last.charAt(0) : ''}`;
		}
		if (email) return email.charAt(0);
	}, [name, email]);

	// resolve the optional background image for the avatar frame
	const bgImage = useMemo(() => {
		return image ? `url(${image})` : '';
	}, [image]);

	// sync the rendered font size from the configured size mode
	useEffect(() => {
		if (fontSize === undefined) {
			setTextSize('inherit');
			return;
		}
		if (fontSize === 'auto' || (typeof fontSize === 'number' && fontSize <= 1)) {
			const parentHeight = ref.current?.offsetHeight;
			if (!parentHeight) {
				setTextSize('inherit');
				return;
			}
			let size = 0.5;
			if (typeof fontSize === 'number') size = fontSize;
			const fSize = Math.round(parentHeight * size);
			setTextSize(fSize);
			return;
		}
		if (typeof fontSize === 'string' && fontSize.includes('%')) {
			const normalized = normalizedPercent(fontSize);
			setTextSize(normalized);
			return;
		}
		setTextSize(fontSize);
	}, [fontSize]);

	// derive whether the avatar should render initials or image-only content
	const displayContent = useMemo(() => (image ? null : initials), [image, initials]);

	// forward tooltip payload on hover
	const onMouseEnter = useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			const payload = { label: name ?? email ?? '' };
			onToolTip({ payload, event });
		},
		[name, email, onToolTip],
	);

	// clear tooltip state when the pointer leaves the avatar
	const onMouseLeave = useCallback(() => {
		onToolTip(null);
	}, [onToolTip]);

	// mirror click activation for keyboard users on clickable avatars
	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLDivElement>) => {
			onKeyDown?.(event);
			if (!onClick || event.defaultPrevented) return;
			accessibleKeyDown(event, () => onClick(event as any));
		},
		[onClick, onKeyDown],
	);

	// compose CSS custom properties for avatar sizing and colors
	const avatarVars = useMemo(() => {
		return {
			'--avatar-size': setStyle(size),
			'--avatar-frame': setStyle(frame),
			'--avatar-border': `${resolvedBorderWidth}px`,
			'--avatar-color': resolvedTextColor ?? 'var(--core-text-primary)',
			'--avatar-bg-color': resolvedBackgroundColor ?? 'var(--core-surface-secondary)',
			'--avatar-border-color': borderColor ?? 'var(--core-outline-primary)',
			'--avatar-border-color-hover': borderColorHover ?? 'var(--core-outline-special)',
			'--avatar-bg-image': `${bgImage}`,
			'--avatar-font-size': setStyle(textSize),
			'--avatar-outer-border-size': setStyle(outerBorderSize),
			'--avatar-outer-border-color': outerBorderColor ?? 'var(--core-surface-primary)',
		} as React.CSSProperties;
	}, [
		size,
		frame,
		resolvedBorderWidth,
		resolvedTextColor,
		resolvedBackgroundColor,
		borderColor,
		borderColorHover,
		bgImage,
		textSize,
		outerBorderSize,
		outerBorderColor,
	]);

	// compose wrapper class names
	const classNames = useMemo(() => {
		return `${css.wrapper}${divClass}`;
	}, [divClass]);

	/* START.DEBUG */
	useTrackRenders(props, 'Avatar');
	/* END.DEBUG */

	return (
		<div
			id={divId}
			className={classNames}
			style={{ ...divStyle, ...avatarVars }}
			onMouseEnter={onMouseEnter}
			onMouseLeave={onMouseLeave}
			onClick={onClick}
			onKeyDown={handleKeyDown}
			role={onClick ? 'button' : 'img'}
			tabIndex={onClick ? tabIndex : undefined}
			aria-label={`User Avatar - ${name ?? email ?? 'Unknown User'}`}
			{...rest}
		>
			<div ref={ref} aria-hidden={true} className={css.user}>
				{displayContent}
			</div>
		</div>
	);
});
