import { classNames, setSizeStyle } from '../../utils/functions/misc';
import { Button } from '../Button';
import css from './Card.module.css';
import type { CardTitleProps } from './_types';

export function CardTitle(props: Readonly<CardTitleProps>) {
	const { children, caption, title, text, actionButton, onAction, padding, className, style, ...divProps } = props;
	return (
		<div
			{...divProps}
			className={classNames(css.header, className ?? '')}
			style={{ padding: setSizeStyle(padding), ...style }}
		>
			{children ?? (
				<div className={css.title}>
					{caption && <div className={classNames(css['title-caption'], 'body-xs-regular')}>{caption}</div>}
					<div className={css['title-section']}>
						{title && <div className={classNames(css['title-title'], 'body-xxl-regular')}>{title}</div>}
						{actionButton && (
							<div className={classNames(css.action, 'body-m-bold')}>
								<Button
									variant="text"
									buttonSize="auto"
									padding={0}
									{...actionButton}
									onClick={(event) => {
										actionButton.onClick?.(event);
										onAction?.(actionButton);
									}}
								/>
							</div>
						)}
					</div>
					{text && <div className={classNames(css['title-text'], 'body-m-regular')}>{text}</div>}
				</div>
			)}
		</div>
	);
}
