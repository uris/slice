'use client';

import React, { useMemo } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { Avatar } from '../Avatar';
import css from './AvatarGroup.module.css';
import type { AvatarGroupProps, AvatarInfo } from './_types';

export const AvatarGroup = React.memo((rawProps: AvatarGroupProps) => {
	const props = resolveColorProps(rawProps);
	const {
		avatars = [],
		size = 32,
		lazyLoad = false,
		textSize = 'm',
		borderWidth = 3,
		overlap = 8,
		gap = 0,
		borderColor,
		borderColorHover,
		outerBorderWidth = 3,
		outerBorderColor = 'var(--core-surface-primary)',
		margin = 0,
		onToolTip,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
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

	// derive the rendered avatar list from the provided avatar data
	const renderedAvatars = useMemo(() => {
		if (!avatars) return null;
		return avatars.map((avatar: AvatarInfo, index: number) => (
			<div
				className={css.avatar}
				key={avatar.id !== undefined ? `id:${avatar.id}` : `fallback:${avatar.email ?? ''}:${index}`}
			>
				<Avatar
					name={[avatar.first, avatar.last].filter(Boolean).join(' ')}
					email={avatar.email}
					image={avatar.image}
					size={size}
					lazyLoad={lazyLoad}
					textSize={textSize}
					borderWidth={borderWidth}
					borderColor={borderColor}
					borderColorHover={borderColorHover}
					outerBorderWidth={outerBorderWidth}
					outerBorderColor={outerBorderColor}
					textColor={avatar.textColor}
					backgroundColor={avatar.backgroundColor}
					onToolTip={onToolTip}
				/>
			</div>
		));
	}, [
		avatars,
		size,
		lazyLoad,
		textSize,
		borderWidth,
		borderColor,
		borderColorHover,
		outerBorderWidth,
		outerBorderColor,
		onToolTip,
	]);

	// compose wrapper class names
	const classNames = useMemo(() => {
		return `${css.wrapper}${divClass}`;
	}, [divClass]);

	/* START.DEBUG */
	useTrackRenders(props, 'Avatar Group');
	/* END.DEBUG */

	return (
		<div id={divId} className={classNames} style={{ ...divStyle, ...cssVars }} {...rest}>
			{renderedAvatars}
		</div>
	);
});
