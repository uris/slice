import { classNames } from '../../utils';
import { Icon } from '../Icon';
import css from './InfoBox.module.css';
import type { InfoBoxImageProps } from './_types';

export function InfoBoxImage(props: Readonly<InfoBoxImageProps>) {
	const {
		src,
		alt = '',
		width,
		height,
		iconName,
		iconSize = 20,
		iconStrokeColor,
		iconStrokeWidth = 1.5,
		children,
		style,
		className = '',
		...divProps
	} = props;

	const renderIcon = () => {
		if (!iconName) return null;
		return <Icon name={iconName} size={iconSize} strokeColor={iconStrokeColor} stroke={iconStrokeWidth} />;
	};

	const renderImage = () => {
		if (!src) return null;
		return <img src={src} alt={alt} width={width} height={height} />;
	};

	return (
		<div {...divProps} className={classNames(css['info-box-image'], className)} style={style}>
			{children ?? renderImage() ?? renderIcon()}
		</div>
	);
}
