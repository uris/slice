'use client';

import React, { useMemo } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { Avatar } from '../Avatar';
import { AvatarOverflow } from '../Avatar/Avatar';
import css from './AvatarGroup.module.css';
import { AvatarGroupContext } from './AvatarGroupContext';
import type { AvatarGroupMore, AvatarGroupProps, AvatarInfo } from './_types';

// Fragments are transparent to counting and truncation. Components are opaque child slots.
function flattenChildren(children: React.ReactNode, parentKey = ''): React.ReactNode[] {
	return React.Children.toArray(children).flatMap((child) => {
		if (!React.isValidElement(child)) return [child];
		const key = `${parentKey}/${child.key}`;
		if (child.type === React.Fragment) {
			return flattenChildren((child.props as { children?: React.ReactNode }).children, key);
		}
		return [React.cloneElement(child, { key })];
	});
}

export const AvatarGroup = React.memo((rawProps: AvatarGroupProps) => {
	const props = resolveColorProps(rawProps);
	const {
		avatars = [],
		children,
		limit,
		onMore,
		size = 40,
		lazyLoad = false,
		textSize = 'm',
		borderWidth,
		backgroundColor,
		overlap = 8,
		gap = 0,
		groupName,
		borderColor,
		borderColorHover,
		outerBorderWidth = 3,
		outerBorderColor = 'var(--core-surface-primary)',
		margin = 0,
		onToolTip,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const accessibleName = groupName?.trim() || 'people';
	const nativeAttributes = Object.fromEntries(
		Object.entries(rest).filter(([key]) => key !== 'role' && !key.startsWith('aria-')),
	);
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';

	// compose CSS custom properties for spacing and overlap
	const cssVars = useMemo(() => {
		return {
			'--ag-gap': `${gap ?? 0}px`,
			'--ag-margin': `${margin ?? 0}px`,
			'--ag-overlap': `${overlap > 0 ? -overlap : 0}px`,
		} as React.CSSProperties;
	}, [overlap, gap, margin]);

	const context = useMemo(
		() => ({
			itemClassName: css.avatar,
			avatarProps: {
				backgroundColor,
				size,
				lazyLoad,
				textSize,
				borderWidth,
				borderColor,
				borderColorHover,
				outerBorderWidth,
				outerBorderColor,
				onToolTip,
			},
		}),
		[
			backgroundColor,
			size,
			lazyLoad,
			textSize,
			borderWidth,
			borderColor,
			borderColorHover,
			outerBorderWidth,
			outerBorderColor,
			onToolTip,
		],
	);

	const allChildren = useMemo(() => flattenChildren(children), [children]);
	const allAvatars = avatars ?? [];
	const itemCount = children !== undefined ? allChildren.length : allAvatars.length;
	// Non-finite values leave the list unlimited; finite values are floored and clamped to zero.
	const visibleCount = limit !== undefined && Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : itemCount;
	const overflowCount = Math.max(0, itemCount - visibleCount);
	const getMore = (): AvatarGroupMore => {
		if (children !== undefined)
			return { source: 'children', more: allChildren.slice(visibleCount), all: [...allChildren] };
		return { source: 'avatars', more: allAvatars.slice(visibleCount), all: [...allAvatars] };
	};
	const renderedAvatars =
		children !== undefined
			? allChildren.slice(0, visibleCount)
			: allAvatars
					.slice(0, visibleCount)
					.map((avatar: AvatarInfo, index: number) => (
						<Avatar
							key={avatar.id !== undefined ? `id:${avatar.id}` : `fallback:${avatar.email ?? ''}:${index}`}
							name={[avatar.first, avatar.last].filter(Boolean).join(' ')}
							email={avatar.email}
							image={avatar.image}
							textColor={avatar.textColor}
							backgroundColor={avatar.backgroundColor}
						/>
					));

	// compose wrapper class names
	const classNames = useMemo(() => {
		return `${css.wrapper}${divClass}`;
	}, [divClass]);

	/* START.DEBUG */
	useTrackRenders(props, 'Avatar Group');
	/* END.DEBUG */

	return (
		<div
			id={divId}
			className={classNames}
			style={{ ...divStyle, ...cssVars }}
			{...nativeAttributes}
			role="group"
			aria-label={accessibleName}
		>
			<AvatarGroupContext.Provider value={context}>
				{renderedAvatars}
				{overflowCount > 0 && (
					<AvatarOverflow count={overflowCount} onClick={onMore ? () => onMore(getMore()) : undefined} />
				)}
			</AvatarGroupContext.Provider>
		</div>
	);
});
