'use client';

import { useAnimate } from 'motion/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTheme } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import css from './Grouper.module.css';
import type { GrouperProps } from './_types';

export const Grouper = React.memo((props: GrouperProps) => {
	const theme = useTheme();

	const {
		title = 'Group Title',
		toggle = true,
		open = true,
		hasIcon = true,
		iconName = 'chevron down',
		iconSize = 18,
		frameSize = 64,
		border = 0,
		count = 0,
		unframed = false,
		hideNull = true,
		showFilterBadge = false,
		onChange = () => null,
		onClick = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const [state, setState] = useState<boolean>(open);
	const [icon, animateIcon] = useAnimate();

	// sync the local open state from the controlled prop
	useEffect(() => setState(open), [open]);

	// rotate the chevron icon to match the current open state
	const animate = useCallback(
		(state: boolean) => {
			const animation = { rotate: state ? 0 : 180 };
			animateIcon(icon.current, { ...animation }, { ease: 'easeInOut', duration: 0.25 });
		},
		[animateIcon, icon],
	);

	// toggle the group and notify listeners
	const handleToggle = useCallback(() => {
		if (!toggle) return;
		onClick();
		onChange(!state);
		animate(!state);
		setState(!state);
	}, [toggle, onClick, onChange, state, animate]);

	// compose CSS custom properties for grouper sizing
	const cssVars = useMemo(() => {
		return {
			'--grouper-height': unframed ? 'auto' : `${frameSize}px`,
			'--grouper-border': border ? `${border}px` : '0',
			'--grouper-icon-size': `${iconSize}px`,
		} as React.CSSProperties;
	}, [frameSize, iconSize, border, unframed]);

	/* START.DEBUG */
	useTrackRenders(props, 'Grouper');
	/* END.DEBUG */

	return (
		<button
			id={divId}
			type="button"
			className={`${css.header}${divClass}`}
			style={{ ...divStyle, ...cssVars }}
			onClick={handleToggle}
			aria-expanded={state}
			{...rest}
		>
			<div className={css.content}>
				<div className={css.title}>
					{title}
					<Badge hideNull={hideNull} count={count} variant={'light'} />
					{showFilterBadge && <Icon name="filter" size={16} strokeColor={theme.current.colors['core-text-disabled']} />}
				</div>
				{hasIcon && (
					<div ref={icon} className={css.icon}>
						<Icon name={iconName} size={iconSize} />
					</div>
				)}
			</div>
		</button>
	);
});
