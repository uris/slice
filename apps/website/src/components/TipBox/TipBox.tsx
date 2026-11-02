import { surfaceGreen } from '@/src/consts/consts';
import { addOpacity } from '@apple-pie/slice/utils';
import type React from 'react';
import styles from './TipBox.module.css';

interface TipBoxProps {
	title?: string;
	children?: React.ReactNode;
	noBorder?: boolean;
	inline?: boolean;
	marginBottom?: boolean;
}

export function TipBox(props: Readonly<TipBoxProps>) {
	const { title, children, noBorder, inline = false, marginBottom = true } = props;

	const cssStyles = {
		color: surfaceGreen,
		background: addOpacity(surfaceGreen, 0.2),
		borderWidth: noBorder ? 0 : 1,
		display: inline ? 'inline-flex' : 'flex',
		flexDirection: inline ? 'row' : 'column',
		marginBottom: marginBottom ? 24 : 0,
	} as React.CSSProperties;

	return (
		<div className={styles.wrapper} style={cssStyles}>
			{title && <div className={styles.title}>{title}</div>}
			{children && <div className={'body-s-regular'}>{children}</div>}
		</div>
	);
}
