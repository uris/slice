import type React from 'react';
import { type CSSProperties, useCallback, useId, useMemo, useState } from 'react';
import { classNames, setStyle } from '../../utils';
import { Icon } from '../Icon';
import styles from './PopMenu.module.css';
import type { PopMenuItemClickInfo, PopMenuItemProps } from './_types';

export function PopMenuItem(props: PopMenuItemProps) {
	const {
		children,
		dismissAll = () => {},
		onClick,
		autoDismiss,
		onHover,
		id,
		name,
		icon,
		label,
		toggle,
		toggled = false,
		shortcut,
		subMenu,
		backgroundColor = 'var(--core-surface-secondary)',
		backgroundColorHover = 'var(--core-fill-secondary)',
		textColor = 'var(--core-text-primary)',
		textColorHover = 'var(--core-text-primary)',
		iconColor = 'var(--core-text-primary)',
		iconColorHover = 'var(--core-text-primary)',
		toggleIcon = 'basic.check',
		subMenuIcon = 'arrows.chevron-right',
		iconSize = 16,
		iconGap = 6,
		gap = 24,
		padding = '3px 4px',
		textSize = 'm',
	} = props;
	const generatedId = useId();
	const itemName = name?.trim() || label?.trim() || id?.trim();
	const accessibleName = itemName || (children != null ? undefined : 'Menu item');
	const [hovered, setHovered] = useState(false);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			const item: PopMenuItemClickInfo = { id, label, dismissAll };
			if (autoDismiss !== undefined) item.autoDismiss = autoDismiss;
			if (toggle) {
				item.toggle = true;
				item.toggled = !toggled;
			}
			if (subMenu) {
				item.subMenu = subMenu;
			}
			onClick?.(event, item);
		},
		[onClick, id, label, toggle, toggled, subMenu, dismissAll, autoDismiss],
	);

	const handleHover = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>, hovered: boolean) => {
			setHovered(hovered);
			if (hovered) onHover?.(event, { id, label });
		},
		[onHover, id, label],
	);

	const cssVars = useMemo(() => {
		return {
			'--icon-size': setStyle(iconSize),
			'--icon-gap': setStyle(iconGap),
			'--background-color': backgroundColor,
			'--background-color-hover': backgroundColorHover,
			'--text-color': textColor,
			'--text-color-hover': textColorHover,
			'--item-wrapper-padding': setStyle(padding),
			'--item-gap': setStyle(gap),
		} as CSSProperties;
	}, [backgroundColor, backgroundColorHover, textColor, textColorHover, iconSize, iconGap, padding, gap]);

	const renderContent = () => {
		return (
			<>
				<div className={styles.left}>
					{icon && (
						<div className={styles.icon} aria-hidden="true">
							<Icon name={icon} size={iconSize} stroke={1.5} strokeColor={hovered ? iconColorHover : iconColor} />
						</div>
					)}
					<span className={styles.label}>{label}</span>
				</div>
				<div className={classNames(styles.right, 'body-s-regular')}>
					{toggle && toggled && (
						<div className={styles.icon} aria-hidden="true">
							<Icon name={toggleIcon ?? undefined} size={20} stroke={1.5} strokeColor={'var(--core-text-primary)'} />
						</div>
					)}
					{subMenu && (
						<div className={styles.icon} aria-hidden="true">
							<Icon name={subMenuIcon ?? undefined} size={20} stroke={1.5} strokeColor={'var(--core-text-secondary)'} />
						</div>
					)}
					{shortcut && <span className={styles.shortcut}>{shortcut}</span>}
				</div>
			</>
		);
	};

	return (
		<button
			id={id?.trim() || generatedId}
			aria-label={accessibleName}
			type="button"
			className={classNames(styles.popMenuItem, `body-${textSize}-regular`)}
			onClick={handleClick}
			style={cssVars}
			onMouseEnter={(e) => handleHover(e, true)}
			onMouseLeave={(e) => handleHover(e, false)}
		>
			<div className={styles.popMenuItemWrapper}>{children ?? renderContent()}</div>
		</button>
	);
}
