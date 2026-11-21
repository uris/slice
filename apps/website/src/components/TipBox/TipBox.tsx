import { opacityFromColor } from '@apple-pie/slice/utils';
import type React from 'react';
import styles from './TipBox.module.css';

interface TipBoxProps {
	title?: string;
	children?: React.ReactNode;
	noBorder?: boolean;
	inline?: boolean;
	noMargin?: boolean;
}

export function TipBox(props: Readonly<TipBoxProps>) {
	const { title, children, noBorder = true, inline = false, noMargin = true } = props;

	const cssStyles = {
		color: 'var(--array-lime-accent)',
		background: opacityFromColor('array-lime-accent', 5),
		borderWidth: noBorder ? 0 : 1,
		borderColor: opacityFromColor('array-lime-accent', 75),
		display: inline ? 'inline-flex' : 'flex',
		flexDirection: inline ? 'row' : 'column',
		marginBottom: noMargin ? 0 : 24,
	} as React.CSSProperties;

	return (
		<div className={styles.wrapper} style={cssStyles}>
			{title && <div className={styles.title}>{title}</div>}
			{children && <div className={'body-l-regular'}>{children}</div>}
		</div>
	);
}
