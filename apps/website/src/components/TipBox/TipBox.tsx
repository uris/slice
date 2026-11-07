import { useTheme } from '@apple-pie/slice';
import { addOpacity } from '@apple-pie/slice/utils';
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
	const { title, children, noBorder, inline = false, noMargin = true } = props;
	const { current } = useTheme();
	const green = current.colors['feedback-positive'];

	const cssStyles = {
		color: green,
		background: addOpacity(green, 0.05),
		borderWidth: noBorder ? 0 : 1,
		borderColor: addOpacity(green, 0.25),
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
