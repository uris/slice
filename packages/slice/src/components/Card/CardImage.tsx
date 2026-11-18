import type { CSSProperties } from 'react';
import { resolveColor } from '../../theme/colors/resolveColor';
import { classNames, setSizeStyle } from '../../utils/functions/misc';
import css from './Card.module.css';
import type { CardImageProps } from './_types';

export function CardImage(props: Readonly<CardImageProps>) {
	const { children, src, alt = '', height, padding, className, borderWidth, borderColor, style, ...divProps } = props;
	const styles = {
		minHeight: height,
		height,
		padding: setSizeStyle(padding),
		borderTopWidth: setSizeStyle(borderWidth),
		borderBottomWidth: setSizeStyle(borderWidth),
		borderColor: resolveColor(borderColor),
		...style,
	} as CSSProperties;
	return (
		<div {...divProps} className={classNames(css['image-wrapper'], className ?? '')} style={styles}>
			{src && <img className={css['card-image']} src={src} alt={alt} />}
			{children}
		</div>
	);
}
