import type React from 'react';
import { type CSSProperties, useCallback, useContext, useId, useMemo } from 'react';
import { classNames, resolveShortcut, setStyle } from '../../utils';
import { Icon } from '../Icon';
import styles from './PopMenu.module.css';
import { PopMenuActiveSubMenuContext, PopMenuContext, noopDismiss } from './PopMenuContext';
import type { PopMenuItemClickInfo, PopMenuItemProps } from './_types';

export function PopMenuItem(props: PopMenuItemProps) {
	const {
		children,
		dismissAll: dismissAllProp,
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
		textColorDisabled = 'var(--core-text-tertiary)',
		iconColor = 'var(--core-text-primary)',
		iconColorHover = 'var(--core-text-primary)',
		iconColorDisabled = 'var(--core-text-tertiary)',
		toggleIcon = 'basic.check',
		subMenuIcon = 'arrows.chevron-right',
		iconSize = 16,
		iconGap = 6,
		gap = 24,
		padding = '3px 4px',
		textSize = 'm',
		level,
		className = '',
		style,
		disabled,
		onMouseEnter,
		onMouseLeave,
		'aria-label': ariaLabel,
		...rest
	} = props;
	// Prefer the containing menu/group dismissal chain; standalone items can supply their own.
	const menu = useContext(PopMenuContext);
	const activeSubMenuId = useContext(PopMenuActiveSubMenuContext);
	const dismissAll = menu?.dismissAll ?? dismissAllProp ?? noopDismiss;
	const isDisabled = Boolean(disabled || props['aria-disabled'] === true || props['aria-disabled'] === 'true');
	const generatedId = useId();
	const itemId = id?.trim() || generatedId;
	const itemName = name?.trim() || label?.trim() || id?.trim();
	const accessibleName = ariaLabel ?? (itemName || (children != null ? undefined : 'Menu item'));

	// Reuse shortcut definitions from the activation hook; custom display strings pass through unchanged.
	const shortcutLabel = typeof shortcut === 'string' ? shortcut : shortcut && resolveShortcut(shortcut);

	// Build the requested action state, then notify the item before its group and menu.
	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation();
			if (isDisabled) return;
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
			menu?.onClickItem?.(event, item);
		},
		[onClick, id, label, toggle, toggled, subMenu, dismissAll, autoDismiss, isDisabled, menu],
	);

	// CSS selects icon hover/focus colors without React state; disabled text also covers shortcut hints.
	const cssVars = useMemo(() => {
		return {
			'--item-icon-color': iconColor,
			'--item-icon-color-hover': iconColorHover,
			'--item-icon-color-disabled': iconColorDisabled,
			'--icon-size': setStyle(iconSize),
			'--icon-gap': setStyle(iconGap),
			'--background-color': backgroundColor,
			'--background-color-hover': isDisabled ? backgroundColor : backgroundColorHover,
			'--text-color': isDisabled ? textColorDisabled : textColor,
			'--text-color-hover': isDisabled ? textColorDisabled : textColorHover,
			'--item-wrapper-padding': setStyle(padding),
			'--item-gap': setStyle(gap),
			'--shortcut-color': isDisabled ? textColorDisabled : 'var(--core-text-secondary)',
		} as CSSProperties;
	}, [
		backgroundColor,
		backgroundColorHover,
		textColor,
		textColorHover,
		textColorDisabled,
		isDisabled,
		iconColor,
		iconColorHover,
		iconColorDisabled,
		iconSize,
		iconGap,
		padding,
		gap,
	]);

	const renderContent = () => {
		return (
			<>
				<div className={styles.left}>
					{icon && (
						<div className={styles.icon} aria-hidden="true">
							<Icon name={icon} size={iconSize} stroke={1.5} strokeColor="var(--item-icon-color-current)" />
						</div>
					)}
					<span className={styles.label}>{label}</span>
				</div>
				<div className={classNames(styles.right, 'body-s-regular')}>
					{toggle && toggled && (
						<div className={styles.icon} aria-hidden="true">
							<Icon
								name={toggleIcon ?? undefined}
								size={20}
								stroke={1.5}
								strokeColor="var(--item-toggle-color-current)"
							/>
						</div>
					)}
					{subMenu && (
						<div className={styles.icon} aria-hidden="true">
							<Icon
								name={subMenuIcon ?? undefined}
								size={20}
								stroke={1.5}
								strokeColor="var(--item-submenu-color-current)"
							/>
						</div>
					)}
					{shortcutLabel && <span className={styles.shortcut}>{shortcutLabel}</span>}
				</div>
			</>
		);
	};

	return (
		<button
			{...rest}
			disabled={disabled}
			role={toggle ? 'menuitemcheckbox' : 'menuitem'}
			aria-checked={toggle ? toggled : undefined}
			aria-haspopup={subMenu ? 'menu' : undefined}
			aria-expanded={subMenu ? activeSubMenuId === itemId || (props['aria-expanded'] ?? false) : undefined}
			tabIndex={props.tabIndex ?? -1}
			id={itemId}
			aria-label={accessibleName}
			type="button"
			className={classNames(styles.popMenuItem, `body-${textSize}-regular`, className)}
			onClick={handleClick}
			style={{ ...cssVars, ...style }}
			onMouseEnter={(e) => {
				if (isDisabled) return;
				onHover?.(e, { id, label });
				menu?.onHoverItem?.(e, { id, label });
				onMouseEnter?.(e);
			}}
			onMouseLeave={(e) => {
				if (isDisabled) return;
				onMouseLeave?.(e);
			}}
		>
			<div className={styles.popMenuItemWrapper}>{children ?? renderContent()}</div>
		</button>
	);
}
