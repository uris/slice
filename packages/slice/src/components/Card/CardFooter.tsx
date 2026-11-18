import type { CSSProperties } from 'react';
import { useTheme } from '../../hooks';
import { resolveColor } from '../../theme/colors/resolveColor';
import { tintFromColor } from '../../utils/functions/colors';
import { classNames, setSizeStyle } from '../../utils/functions/misc';
import { Button } from '../Button';
import css from './Card.module.css';
import type { CardFooterProps } from './_types';

export function CardFooter(props: Readonly<CardFooterProps>) {
	const { isDark } = useTheme();
	const tint = isDark ? tintFromColor('core-surface-secondary', -30) : 'core-surface-primary-tint';
	const {
		children,
		backgroundColor = tint,
		borderColor = 'core-outline-primary',
		borderWidth = 1,
		actionButtons,
		onAction,
		padding,
		stack = 'vertical',
		layout = 'fill',
		align = 'start',
		className,
		style,
		...divProps
	} = props;

	const resolveAlign = () => {
		if (align === 'start') return 'flex-start';
		if (align === 'end') return 'flex-end';
		if (align === 'center') return 'center';
		return 'space-between';
	};

	const styles = {
		'--footer-border-width': setSizeStyle(borderWidth),
		'--footer-border-color': resolveColor(borderColor),
		'--footer-background-color': resolveColor(backgroundColor),
		'--footer-buttons-stack': stack === 'vertical' ? 'column' : 'row',
		'--footer-alignment': resolveAlign(),
		padding: setSizeStyle(padding),
		...style,
	} as CSSProperties;

	return (
		<div {...divProps} className={classNames(css['footer-wrapper'], className ?? '')} style={styles}>
			{children ??
				(actionButtons && (
					<div className={classNames(css['footer-buttons'], 'body-m-regular')}>
						{actionButtons.map((button, index) => (
							<Button
								key={button.id ?? index}
								width={layout}
								{...button}
								onClick={(event) => {
									button.onClick?.(event);
									onAction?.(button);
								}}
							/>
						))}
					</div>
				))}
		</div>
	);
}
