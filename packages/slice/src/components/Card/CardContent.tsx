import { resolveSize } from '../../theme/resolveSize';
import { classNames } from '../../utils/functions/misc';
import css from './Card.module.css';
import type { CardContentProps } from './_types';

export function CardContent(props: Readonly<CardContentProps>) {
	const { children, text, padding, className, style, ...divProps } = props;
	return (
		<div
			{...divProps}
			className={classNames(css['content-wrapper'], 'body-m-regular', className ?? '')}
			style={{ padding: resolveSize(padding), ...style }}
		>
			{children ?? text}
		</div>
	);
}
