import { type CSSProperties, useId } from 'react';
import { classNames, setStyle } from '../../utils';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import styles from './PopMenu.module.css';
import { PopMenuItem } from './PopMenuItem';
import type { PopMenuItemGroupProps } from './_types';

export function PopMenuGroup(rawProps: Readonly<PopMenuItemGroupProps>) {
	const {
		children,
		title,
		name,
		id,
		items,
		dismissAll,
		onClickItem,
		onHoverItem,
		textColor = 'var(--core-text-secondary)',
		textColorHover = textColor,
		textSize = 's',
		borderWidth = 1,
		borderColor = 'var(--core-fill-primary)',
		className = '',
		padding = 'var(--spacing-s) calc(var(--spacing-s) + var(--spacing-xxs)) 0',
		gap = 'var(--spacing-xxs)',
		style,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		...rest
	} = resolveColorProps(rawProps);
	const generatedId = useId();
	const groupId = id?.trim() || generatedId;
	const hasTitle = Boolean(title?.trim());
	const titleId = `${groupId}-title`;
	const groupName = ariaLabel?.trim() || name?.trim() || title?.trim() || id?.trim() || 'Menu group';
	const getLabelledBy = () => {
		if (ariaLabelledBy) return ariaLabelledBy;
		if (ariaLabel?.trim() || name?.trim()) return undefined;
		if (hasTitle) return titleId;
		return undefined;
	};
	const groupStyle = {
		'--group-text-color': textColor,
		'--group-text-color-hover': textColorHover,
		'--group-border-width': setStyle(borderWidth),
		'--group-border-color': borderColor,
		'--group-padding': setStyle(padding),
		'--group-margin-gap': setStyle(gap),
		'--group-wrapper-padding-top': hasTitle ? 0 : setStyle(gap),
		...style,
	} as CSSProperties;

	const renderItems = () =>
		items?.map((item) => (
			<PopMenuItem
				key={item.id ?? item.label}
				{...item}
				dismissAll={dismissAll}
				onClick={(event, info) => {
					item.onClick?.(event, info);
					onClickItem?.(event, info);
				}}
				onHover={(event, info) => {
					item.onHover?.(event, info);
					onHoverItem?.(event, info);
				}}
			/>
		));

	return (
		<div
			{...rest}
			role="group"
			id={groupId}
			aria-label={groupName}
			aria-labelledby={getLabelledBy()}
			className={classNames(styles.popMenuGroupWrapper, className)}
			style={groupStyle}
		>
			{hasTitle && (
				<div id={titleId} className={classNames(styles.groupTitle, `body-${textSize}-regular`)}>
					{title}
				</div>
			)}
			{children ?? renderItems()}
		</div>
	);
}
