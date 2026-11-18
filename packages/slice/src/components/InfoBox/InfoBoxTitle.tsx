import { classNames } from '../../utils';
import css from './InfoBox.module.css';
import type { InfoBoxTitleProps } from './_types';

export function InfoBoxTitle(props: Readonly<InfoBoxTitleProps>) {
	const { children, title, className = '', style, ...divProps } = props;
	return (
		<div {...divProps} className={classNames(css['info-box-title'], 'body-m-bold', className)} style={style}>
			{children ?? title}
		</div>
	);
}
