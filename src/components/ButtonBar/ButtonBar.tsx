'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { setStyle } from '../../utils/functions/misc';
import { Icon } from '../Icon';
import type { ToolTip } from '../sharedTypes';
import css from './ButtonBar.module.css';
import type { BarButton as ButtonBarItem, ButtonBarProps } from './_types';

export const ButtonBar = React.memo(function ButtonBar(props: Readonly<ButtonBarProps>) {
	const {
		buttons = [],
		selected,
		toggle = true,
		buttonSize = 'm',
		frameSize = 36,
		iconSize = 20,
		borderWidth,
		borderSize = 0,
		borderRadius = 100,
		borderColor = 'var(--core-outline-primary)',
		backgroundColor,
		backgroundColorHover,
		backgroundColorActive,
		bgColor = 'var(--core-surface-secondary)',
		bgColorHover = 'var(--core-outline-primary)',
		bgColorActive = 'var(--core-outline-primary)',
		labelColor = 'var(--core-text-primary)',
		onClick = (button?: ButtonBarItem) => null,
		onChange = (button?: ButtonBarItem) => null,
		onToolTip = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const resolvedBorderWidth = borderWidth ?? borderSize;
	const resolvedBackgroundColor = backgroundColor ?? bgColor;
	const resolvedBackgroundColorHover = backgroundColorHover ?? bgColorHover;
	const resolvedBackgroundColorActive = backgroundColorActive ?? bgColorActive;
	const [hovered, setHovered] = useState<number>(-1);
	const [selectedIndex, setSelectedIndex] = useState<number | undefined>(selected);

	// sync the selected button index from the controlled prop
	useEffect(() => setSelectedIndex(selected), [selected]);

	// track which button is currently hovered
	const handleMouseEnter = useCallback((index: number) => {
		setHovered(index);
	}, []);

	// clear the hovered button state
	const handleMouseLeave = useCallback(() => {
		setHovered(-1);
	}, []);

	// update the selected button and notify the consumer
	const handleClick = useCallback(
		(button: ButtonBarItem, index: number) => {
			onClick(button);
			if (toggle) {
				setSelectedIndex(index);
				onChange(button);
			}
		},
		[onChange, onClick, toggle],
	);

	// determine whether a button is currently selected
	const buttonClass = useCallback(
		(index: number) => {
			if (!toggle) return '';
			return selectedIndex === index ? css.selected : '';
		},
		[selectedIndex, toggle],
	);

	// resolve icon colors from selected and hovered states
	const iconColor = useCallback(
		(index: number) => {
			const isSelected = selectedIndex === index;
			const isHovered = hovered === index;
			if (toggle && isSelected) return 'var(--core-text-special)';
			if (isHovered) return 'var(--core-text-primary)';
			return 'var(--core-text-secondary)';
		},
		[selectedIndex, hovered, toggle],
	);

	// resolve icon button size
	const size = useMemo(() => {
		if (!buttonSize) return frameSize;
		if (buttonSize === 's') return 24;
		if (buttonSize === 'm') return 36;
		if (buttonSize === 'l') return 44;
		if (buttonSize === 'xl') return 56;
	}, [frameSize, buttonSize]);

	// compose CSS custom properties for button bar sizing and colors
	const cssVars = useMemo(() => {
		return {
			'--bb-border-size': `${resolvedBorderWidth}px`,
			'--bb-border-radius': setStyle(borderRadius),
			'--bb-border-color': borderColor,
			'--bb-bg-color': resolvedBackgroundColor,
			'--bb-bg-color-hover': resolvedBackgroundColorHover,
			'--bb-bg-color-active': resolvedBackgroundColorActive,
			'--bb-label-color': labelColor,
			'--bb-button-size': `${size}px`,
		} as React.CSSProperties;
	}, [
		resolvedBorderWidth,
		borderRadius,
		borderColor,
		resolvedBackgroundColor,
		labelColor,
		resolvedBackgroundColorHover,
		size,
		resolvedBackgroundColorActive,
	]);

	const barButtons = useMemo(
		() =>
			buttons?.map((button: ButtonBarItem, index: number) => (
				<BarButton
					classNames={`${css.button} ${buttonClass(index)}`}
					key={`button-bar-${button.icon}-${index}`}
					onMouseEnter={() => handleMouseEnter(index)}
					onMouseLeave={handleMouseLeave}
					onClick={() => handleClick(button, index)}
					onToolTip={onToolTip}
					toolTip={button.tip}
					iconSize={iconSize}
					icon={button.icon}
					iconColor={iconColor(index)}
				/>
			)),
		[buttons, buttonClass, handleMouseEnter, handleMouseLeave, handleClick, onToolTip, iconSize, iconColor],
	);

	/* START.DEBUG */
	useTrackRenders(props, 'ButtonBar');
	/* END.DEBUG */

	return (
		<div id={divId} className={`${css.wrapper}${divClass}`} style={{ ...cssVars, ...divStyle }} {...rest}>
			{barButtons}
		</div>
	);
});

interface ButtonProps {
	classNames?: string;
	icon?: string;
	iconSize: number;
	iconColor?: string;
	onClick?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	toolTip?: string;
	onToolTip?: (tip: ToolTip | null) => void;
}

export const BarButton = React.memo(function BarButton(props: Readonly<ButtonProps>) {
	const { classNames, icon, iconSize, iconColor, toolTip, onClick, onMouseEnter, onMouseLeave, onToolTip } = props;
	const ref = useRef<HTMLButtonElement>(null);

	const handleMouseEnter = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>) => {
			const tip: ToolTip = {
				payload: { label: toolTip ?? 'Button' },
				ref,
				event: e,
			};
			onMouseEnter?.();
			onToolTip?.(tip);
		},
		[toolTip, onMouseEnter, onToolTip],
	);

	const handleMouseLeave = useCallback(() => {
		onMouseLeave?.();
		onToolTip?.(null);
	}, [onMouseLeave, onToolTip]);

	const handleClick = useCallback(() => {
		onClick?.();
		onToolTip?.(null);
	}, [onClick, onToolTip]);

	return (
		<button
			ref={ref}
			type="button"
			className={classNames}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onClick={handleClick}
		>
			<Icon name={icon} size={iconSize} strokeColor={iconColor} />
		</button>
	);
});
