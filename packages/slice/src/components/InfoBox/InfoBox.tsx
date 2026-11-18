'use client';

import type { CSSProperties, MouseEvent } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { resolveColor } from '../../theme/colors/resolveColor';
import { tintFromColor } from '../../utils/functions/colors';
import { classNames, setSizeStyle } from '../../utils/functions/misc';
import css from './InfoBox.module.css';
import type { InfoBoxProps } from './_types';
import { parseSections } from './parseSections';

export function InfoBox(props: Readonly<InfoBoxProps>) {
	const {
		children,
		name,
		id,
		maxWidth,
		minWidth,
		borderRadius = 'var(--corner-l)',
		borderColor = 'core-outline-primary',
		backgroundColor = 'core-surface-primary',
		backgroundColorHover,
		borderWidth = 1,
		padding = 'calc(var(--spacing-m) - 4px)',
		className,
		style,
		onPress,
		onClick,
		disabled = false,
		...divProps
	} = props;
	const { isDark } = useTheme();
	const interactive = Boolean(onPress || onClick);
	const getHoverColor = () => {
		if (backgroundColorHover !== undefined) return resolveColor(backgroundColorHover);
		if (interactive && !disabled) return tintFromColor(backgroundColor, isDark ? 2 : -5);
		return resolveColor(backgroundColor);
	};
	const styles = {
		'--info-box-corner-radius': setSizeStyle(borderRadius),
		'--info-box-border-width': setSizeStyle(borderWidth),
		'--info-box-border-color': resolveColor(borderColor),
		'--info-box-max-width': setSizeStyle(maxWidth),
		'--info-box-min-width': setSizeStyle(minWidth),
		'--info-box-background-color': resolveColor(backgroundColor),
		'--info-box-background-color-hover': getHoverColor(),
		'--info-box-padding': setSizeStyle(padding),
		...style,
	} as CSSProperties;
	const sections = parseSections(children);
	const hasText = sections.has('title') || sections.has('content');
	const mainContent = (
		<>
			{sections.get('image')}
			{hasText && (
				<div className={css['info-box-content-wrapper']}>
					{sections.get('title')}
					{sections.get('content')}
				</div>
			)}
		</>
	);
	const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
		onClick?.(event);
		if (!event.defaultPrevented) onPress?.(event, name, id);
	};
	return (
		<div {...divProps} id={id} className={classNames(css['info-box-button'], className ?? '')} style={styles}>
			{(hasText || sections.has('image')) &&
				(interactive ? (
					<button
						type="button"
						name={name}
						disabled={disabled}
						className={classNames(css['info-box-main'], css['info-box-press'])}
						aria-label={divProps['aria-label']}
						aria-labelledby={divProps['aria-labelledby']}
						aria-describedby={divProps['aria-describedby']}
						onClick={handleClick}
					>
						{mainContent}
					</button>
				) : (
					<div className={css['info-box-main']}>{mainContent}</div>
				))}
			{sections.get('action')}
		</div>
	);
}
