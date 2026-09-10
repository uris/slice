'use client';

import type React from 'react';
import { useMemo } from 'react';
import { IconButton } from '../IconButton';
import { Label } from '../Label';
import css from './ToggleButton.module.css';
import type { ToggleButtonProps } from './_types';

export function ToggleButton(props: Readonly<ToggleButtonProps>) {
	const {
		label,
		textSize,
		icon,
		iconOn,
		selected = false,
		iconColor = 'var(--core-text-primary)',
		iconColorOn = 'var(--core-surface-primary)',
		iconColorHover = 'var(--core-text-primary)',
		bgColor = 'var(--core-surface-secondary)',
		bgColorHover = 'var(--core-surface-secondary)',
		bgColorOn = 'var(--core-text-special)',
		iconSize = 20,
		buttonSize = 'm',
		tooltip,
		gap = 4,
		unselect = true,
		fill = false,
		disabled = false,
		border = false,
		onChange,
		onSelect,
		onToolTip,
		children,
		presetAnimations,
		customAnimations,
	} = props;

	const handleClick = () => {
		if (!unselect && selected) return;
		const newState = !selected;
		onChange?.(newState);
		if (newState) onSelect?.();
	};

	// memo CSS vars
	const cssVars = useMemo(() => {
		return {
			'--tb-gap': `${gap}px`,
		} as React.CSSProperties;
	}, [gap]);

	return (
		<div className={css.toggleButton} style={cssVars}>
			{icon && (
				<IconButton
					icon={selected && iconOn ? iconOn : icon}
					buttonSize={buttonSize}
					tooltip={tooltip}
					toggle={!selected}
					isToggled={selected}
					bgColorOn={bgColorOn}
					bgColorHover={bgColorHover}
					bgColor={bgColor}
					iconColor={iconColor}
					iconColorOn={iconColorOn}
					iconColorHover={iconColorHover}
					onClick={handleClick}
					iconSize={iconSize}
					iconFill={fill}
					disabled={disabled}
					onToolTip={onToolTip}
					border={border}
					presetAnimations={presetAnimations}
					customAnimations={customAnimations}
				/>
			)}
			{(children || label) && (
				<Label textSize={textSize} borderSize={0} padding={0} onClick={handleClick}>
					{children ?? label}
				</Label>
			)}
		</div>
	);
}
