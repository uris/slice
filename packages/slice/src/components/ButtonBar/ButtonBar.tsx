'use client';

import React, { useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { corners } from '../../theme/corners/corners';
import { setStyle } from '../../utils';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import type { SliceIcon } from '../Icon';
import { Icon } from '../Icon';
import { type ToolTip, ToolTipType } from '../sharedTypes';
import css from './ButtonBar.module.css';
import type { ButtonBarProps } from './_types';

const sizes = {
	s: 'calc(max(1lh, var(--bb-icon-size)) + 2 * var(--spacing-xs) + 2px)',
	m: '36px',
	l: '48px',
	xl: '56px',
};

export const ButtonBar = React.memo(function ButtonBar(rawProps: Readonly<ButtonBarProps>) {
	const props = resolveColorProps(rawProps);
	const {
		buttons = [],
		selectedIndex,
		defaultSelectedIndex = null,
		toggle = false,
		buttonSize = 'm',
		buttonGap = -2,
		padding,
		selectionRadius = '50%',
		iconSize = 20,
		borderWidth = 0,
		borderRadius = corners['corner-round'],
		borderColor = 'var(--core-outline-primary)',
		backgroundColor = 'var(--core-surface-secondary)',
		backgroundColorHover = 'var(--core-outline-primary)',
		backgroundColorSelected = 'var(--core-outline-primary)',
		onClick,
		onChange,
		onToolTip,
		...divAttributes
	} = props;
	const { className, style, ...rest } = divAttributes;
	const [localSelected, setLocalSelected] = useState<number | null>(defaultSelectedIndex);
	const controlled = selectedIndex !== undefined;
	const candidate = controlled ? selectedIndex : localSelected;
	const activeIndex =
		typeof candidate === 'number' && Number.isInteger(candidate) && candidate >= 0 && candidate < buttons.length
			? candidate
			: null;
	const getButtonSize = () => {
		if (typeof buttonSize === 'number' && Number.isFinite(buttonSize) && buttonSize > 0) {
			return `${buttonSize}px`;
		}
		const height = sizes[buttonSize as keyof typeof sizes] ?? sizes.m;
		return `max(0px, calc(${height} - 2 * var(--spacing-xs) - 2 * var(--bb-border-width)))`;
	};
	const cssVars = {
		'--bb-border-width': `${borderWidth}px`,
		'--bb-border-radius': setStyle(borderRadius),
		'--bb-border-color': borderColor,
		'--bb-bg-color': backgroundColor,
		'--bb-bg-color-hover': backgroundColorHover,
		'--bb-bg-color-selected': backgroundColorSelected,
		'--bb-button-size': getButtonSize(),
		'--bb-icon-size': `${iconSize}px`,
		'--bb-button-gap': `${buttonGap}px`,
		'--bb-padding': padding === undefined ? 'var(--spacing-xs)' : setStyle(padding),
		'--bb-selection-radius': setStyle(selectionRadius),
	} as React.CSSProperties;

	/* START.DEBUG */
	useTrackRenders(props, 'ButtonBar');
	/* END.DEBUG */

	return (
		<div
			role="group"
			aria-label="Actions"
			className={`${css.wrapper}${className ? ` ${className}` : ''}`}
			style={{ ...cssVars, ...style }}
			{...rest}
		>
			{buttons.map((button, index) => (
				<BarButton
					key={`button-bar-${button.action ?? button.icon}-${index}`}
					icon={button.icon}
					iconSize={iconSize}
					toolTip={button.tip}
					pressed={toggle ? activeIndex === index : undefined}
					onToolTip={onToolTip}
					onClick={() => {
						if (toggle && activeIndex !== index) {
							if (!controlled) setLocalSelected(index);
							onClick?.(button);
							onChange?.(button);
						} else onClick?.(button);
					}}
				/>
			))}
		</div>
	);
});

interface ButtonProps {
	icon?: SliceIcon;
	iconSize: number;
	toolTip?: string;
	pressed?: boolean;
	onClick?: () => void;
	onToolTip?: (tip: ToolTip | null) => void;
}

const BarButton = React.memo(function BarButton({
	icon,
	iconSize,
	toolTip,
	pressed,
	onClick,
	onToolTip,
}: Readonly<ButtonProps>) {
	const ref = useRef<HTMLButtonElement>(null);
	const hovered = useRef(false);
	const focused = useRef(false);
	const name = toolTip || 'Button';
	const showTooltip = (event?: React.MouseEvent<HTMLButtonElement>) => {
		onToolTip?.({ type: ToolTipType.button, payload: { label: name }, ref, event });
	};

	return (
		<button
			ref={ref}
			type="button"
			className={css.button}
			aria-label={name}
			aria-pressed={pressed}
			onMouseEnter={(event) => {
				hovered.current = true;
				showTooltip(event);
			}}
			onMouseLeave={() => {
				hovered.current = false;
				if (!focused.current) onToolTip?.(null);
			}}
			onFocus={() => {
				focused.current = true;
				showTooltip();
			}}
			onBlur={() => {
				focused.current = false;
				if (!hovered.current) onToolTip?.(null);
			}}
			onClick={() => {
				onClick?.();
				onToolTip?.(null);
			}}
		>
			<span aria-hidden="true" className={css.icon}>
				<Icon name={icon} size={iconSize} strokeColor="currentColor" pointer={false} tabIndex={-1} />
			</span>
		</button>
	);
});
