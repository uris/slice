import type { CSSProperties } from 'react';
import { classNames } from '../../utils';
import { setSizeStyle } from '../../utils/functions/misc';
import { Badge } from '../Badge';
import { Button } from '../Button';
import { Chip } from '../Chip';
import css from './InfoBox.module.css';
import type { InfoBoxActionProps } from './_types';

export function InfoBoxAction(props: Readonly<InfoBoxActionProps>) {
	const {
		children,
		contentGap = 'var(--spacing-xxl)',
		chip,
		button,
		badge,
		className = '',
		style,
		...divProps
	} = props;

	const styles = {
		marginLeft: setSizeStyle(contentGap),
		...style,
	} as CSSProperties;

	const renderButton = () => {
		if (!button) return null;
		return <Button textSize={'m'} {...button} />;
	};

	const renderChip = () => {
		if (!chip) return null;
		return <Chip textSize={'m'} {...chip} />;
	};

	const renderBadge = () => {
		if (!badge) return null;
		return <Badge {...badge} />;
	};

	return (
		<div {...divProps} className={classNames(css['info-box-action'], className)} style={styles}>
			{children ?? renderButton() ?? renderChip() ?? renderBadge()}
		</div>
	);
}
