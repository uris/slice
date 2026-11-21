import { resolveSize } from '../../theme/resolveSize';
import { classNames } from '../../utils/functions/misc';
import { Button, type ButtonProps } from '../Button';
import css from './Card.module.css';
import type { CardTitleProps } from './_types';

function isButtonDescriptor(value: unknown): value is ButtonProps {
	// React elements and portals carry a React tag. Iterables and thenables are also renderable nodes.
	return (
		typeof value === 'object' &&
		value !== null &&
		!('$$typeof' in value) &&
		!(Symbol.iterator in value) &&
		!('then' in value)
	);
}

export function CardTitle(props: Readonly<CardTitleProps>) {
	const { children, caption, title, text, action, onAction, padding, className, style, ...divProps } = props;

	const renderAction = () => {
		if (!Array.isArray(action) || !action.every(isButtonDescriptor)) return action;
		return action.map((btn, index) => {
			return (
				<div key={btn.id ?? index} className={classNames(css.action, 'body-m-bold')}>
					<Button
						variant="text"
						buttonSize="auto"
						padding={0}
						iconStrokeWidth={1.5}
						{...btn}
						onClick={(event) => {
							btn.onClick?.(event);
							onAction?.(btn);
						}}
					/>
				</div>
			);
		});
	};

	return (
		<div
			{...divProps}
			className={classNames(css.header, className ?? '')}
			style={{ padding: resolveSize(padding), ...style }}
		>
			{children ?? (
				<div className={css['title-wrapper']}>
					<div className={css.title}>
						{caption && <div className={classNames(css['title-caption'], 'body-xs-regular')}>{caption}</div>}
						<div className={css['title-section']}>
							{title && <div className={classNames(css['title-title'], 'body-xxl-regular')}>{title}</div>}
						</div>
						{text && <div className={classNames(css['title-text'], 'body-m-regular')}>{text}</div>}
					</div>
					{action != null && typeof action !== 'boolean' && renderAction()}
				</div>
			)}
		</div>
	);
}
