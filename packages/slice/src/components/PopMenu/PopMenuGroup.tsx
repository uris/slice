import { type CSSProperties, useId, useMemo } from 'react';
import { classNames, setStyle } from '../../utils';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import styles from './PopMenu.module.css';
import { type PopMenuActions, PopMenuContext, noopDismiss, usePopMenuActions } from './PopMenuContext';
import { PopMenuItem } from './PopMenuItem';
import type { PopMenuItemGroupProps } from './_types';

export function PopMenuGroup<T = unknown>(rawProps: Readonly<PopMenuItemGroupProps<T>>) {
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
	// Explicit accessible names take precedence; otherwise associate the visible group title.
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

	// Add this group to the callback chain without cloning children or replacing root dismissal.
	const parent = usePopMenuActions<T>();
	const groupActions = useMemo<PopMenuActions<T>>(
		() => ({
			dismissAll: parent?.dismissAll ?? dismissAll ?? noopDismiss,
			onClickItem: (event, info) => {
				onClickItem?.(event, info);
				parent?.onClickItem?.(event, info);
			},
			onHoverItem: (event, info) => {
				onHoverItem?.(event, info);
				parent?.onHoverItem?.(event, info);
			},
		}),
		[parent, dismissAll, onClickItem, onHoverItem],
	);

	const renderItems = () =>
		items?.map((item, index) => (
			<PopMenuItem key={item.id?.trim() ? `id:${item.id.trim()}` : `index:${index}`} {...item} />
		));

	return (
		<PopMenuContext.Provider value={groupActions}>
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
		</PopMenuContext.Provider>
	);
}
