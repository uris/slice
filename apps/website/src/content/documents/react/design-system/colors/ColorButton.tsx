import { classNames, setStyle } from '@apple-pie/slice/utils';
import { type CSSProperties, useMemo } from 'react';
import css from './Colors.module.css';

export interface ColorData {
	value: string;
	theme: string;
	opacity?: number;
	token: string;
}

interface ColorButtonProps {
	color: ColorData;
	onClick?: (color?: ColorData) => void;
	size?: number;
}

export function ColorButton(props: Readonly<ColorButtonProps>) {
	const { color, onClick, size = 36 } = props;

	const resolvedColorBorder = useMemo(() => {
		if (color.theme === 'dark' && color.value === '#000000') {
			return 'rgba(255,255,255,0.3)';
		}
		if (color.theme === 'light' && color.value === '#ffffff') {
			return 'rgba(0,0,0,0.08)';
		}
		return 'transparent';
	}, [color]);

	const opacityValue = useMemo(() => {
		return (color.opacity ?? 1) * 100;
	}, [color.opacity]);

	const cssVars = useMemo(() => {
		return {
			'--color-value': color.value ?? 'transparent',
			'--color-opacity': color.opacity ?? 1,
			'--border-color': color.theme === 'light' ? 'var(--core-fill-primary)' : 'transparent',
			'--border-width': color.theme === 'light' ? 1 : 'transparent',
			'--background-color': color.theme === 'light' ? '#ffffff' : '#000000',
			'--text-color': color.theme === 'light' ? '#000000' : '#ffffff',
			'--opacity-color': color.theme === 'light' ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)',
			'--color-border': resolvedColorBorder,
			'--button-size': setStyle(size),
			'--focus-color': color.theme === 'light' ? '#000000' : '#ffffff',
		} as CSSProperties;
	}, [color, resolvedColorBorder, size]);

	return (
		<button
			type={'button'}
			className={css.button}
			style={cssVars}
			onClick={() => onClick?.(color)}
			aria-label={`Copy ${color.token} (${color.theme}): ${color.value}, ${(color.opacity ?? 1) * 100}% opacity`}
		>
			<div className={css.color} />
			<div className={css.info}>
				<span className={classNames(css.hex, 'body-m-regular')}>{color.value}</span>
				{opacityValue !== 100 && (
					<span className={classNames(css.opacity, 'body-xs-regular')}>{(color.opacity ?? 1) * 100}%</span>
				)}
			</div>
		</button>
	);
}
