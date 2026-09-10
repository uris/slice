'use client';

import React, { useMemo } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { Avatar } from '../Avatar';
import css from './AvatarGroup.module.css';
import type { AvatarGroupProps, AvatarInfo } from './_types';

export const AvatarGroup = React.memo((props: AvatarGroupProps) => {
	const {
		avatars = [],
		size = 32,
		borderWidth,
		borderSize = 3,
		overlap = 8,
		gap = 0,
		borderColor,
		borderColorHover,
		outerBorderSize = 3,
		outerBorderColor = 'var(--core-surface-primary)',
		margin = 0,
		onToolTip = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const resolvedBorderWidth = borderWidth ?? borderSize;

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
			<div className={css.avatar} key={`avatar_${avatar.email}_${index}`}>
				<Avatar
					name={`${avatar.first} ${avatar.last}`}
					email={avatar.email}
					image={avatar.image || avatar.avatar}
					size={size}
					frame={size}
					borderWidth={resolvedBorderWidth}
					borderColor={borderColor}
					borderColorHover={borderColorHover}
					outerBorderSize={outerBorderSize}
					outerBorderColor={outerBorderColor}
					textColor={avatar.textColor ?? avatar.color}
					backgroundColor={avatar.backgroundColor ?? avatar.bgColor}
					onToolTip={onToolTip}
				/>
			</div>
		));
	}, [avatars, size, resolvedBorderWidth, borderColor, borderColorHover, outerBorderSize, outerBorderColor, onToolTip]);

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
