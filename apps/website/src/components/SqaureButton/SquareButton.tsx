import { outlineTertiary, surfaceDark, surfaceYellow } from '@/src/consts/consts';
import { classNames } from '@/src/utils/misc';
import { Icon } from '@apple-pie/slice';
import type React from 'react';
import { useMemo } from 'react';
import styles from './SqaureButton.module.css';

export enum SquareButtonType {
	Primary = 'primary',
	Secondary = 'secondary',
	Text = 'text',
}

interface SquareButtonProps {
	label?: string;
	variant?: SquareButtonType;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	disabled?: boolean;
	decorative?: boolean;
	icon?: string;
}

export function SquareButton(props: Readonly<SquareButtonProps>) {
	const {
		label = 'Button Label',
		onClick = () => null,
		variant = SquareButtonType.Primary,
		disabled = false,
		icon,
	} = props;
	const isPrimary = variant === SquareButtonType.Primary;

	const className = useMemo(() => {
		switch (variant) {
			case SquareButtonType.Primary:
				return classNames(styles.button, styles.primary);
			case SquareButtonType.Text:
				return classNames(styles.button, styles.text);
			default:
				return classNames(styles.button, styles.secondary);
		}
	}, [variant]);

	const buttonStyles = useMemo(() => {
		return {
			'--label-color': isPrimary ? surfaceDark : 'var(--core-text-primary)',
			'--bg-color': isPrimary ? surfaceYellow : surfaceDark,
			'--border-color': isPrimary ? 'transparent' : outlineTertiary,
		} as React.CSSProperties;
	}, [isPrimary]);

	return (
		<button className={className} style={buttonStyles} type={'button'} onClick={onClick} disabled={disabled}>
			<span>{label}</span>
			{icon && <Icon name={icon} size={16} />}
		</button>
	);
}
