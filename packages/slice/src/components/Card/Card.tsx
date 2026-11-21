import type { CSSProperties } from 'react';
import { useTheme } from '../../hooks';
import { resolveColor } from '../../theme';
import { resolveRadius, resolveSize } from '../../theme/resolveSize';
import { classNames, setSizeStyle } from '../../utils/functions/misc';
import css from './Card.module.css';
import type { CardProps } from './_types';

export function Card(props: Readonly<CardProps>) {
	const { isDark } = useTheme();
	const {
		children,
		maxWidth,
		borderRadius = 'var(--corner-xl)',
		borderColor = 'core-outline-primary',
		backgroundColor = isDark ? 'core-surface-secondary' : 'core-surface-primary',
		borderWidth = 1,
		padding = 'var(--spacing-m)',
		className,
		style,
		...divProps
	} = props;
	const styles = {
		'--card-corner-radius': resolveRadius(borderRadius),
		'--card-border-width': setSizeStyle(borderWidth),
		'--card-border-color': resolveColor(borderColor),
		'--card-max-width': setSizeStyle(maxWidth),
		'--card-background-color': resolveColor(backgroundColor),
		'--card-padding': resolveSize(padding),
		...style,
	} as CSSProperties;

	return (
		<div {...divProps} className={classNames(css.wrapper, className ?? '')} style={styles}>
			{children}
		</div>
	);
}
