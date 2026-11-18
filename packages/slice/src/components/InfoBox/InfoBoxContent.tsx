import { classNames } from '../../utils';
import css from './InfoBox.module.css';
import type { InfoBoxContentProps } from './_types';

export function InfoBoxContent(props: Readonly<InfoBoxContentProps>) {
	const { children, text, className = '', style, ...divProps } = props;
	return (
		<div {...divProps} className={classNames(css['info-box-content'], 'body-m-regular', className)} style={style}>
			{children ?? text}
		</div>
	);
}
