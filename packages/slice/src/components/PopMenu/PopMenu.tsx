import type { AnimationDefinition } from 'motion';
import { type Variants, motion } from 'motion/react';
import type React from 'react';
import {
	type CSSProperties,
	Children,
	Fragment,
	cloneElement,
	isValidElement,
	useCallback,
	useId,
	useMemo,
	useRef,
	useState,
} from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../../hooks';
import { classNames, setStyle } from '../../utils';
import { mergedPresenceMotionValues } from '../../utils/functions/misc';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import styles from './PopMenu.module.css';
import { PopMenuGroup } from './PopMenuGroup';
import { PopMenuItem } from './PopMenuItem';
import type { PopMenuItemClickInfo, PopMenuItemGroupProps, PopMenuItemProps, PopMenuProps } from './_types';
import { usePopMenu } from './usePopMenu';

const defaultMotionValues = {
	initial: { y: 5, opacity: 0 },
	animate: { y: 0, opacity: 1 },
	exit: { y: 5, opacity: 0 },
} satisfies Variants;

export function PopMenu(props: Readonly<PopMenuProps>) {
	const {
		level = 0,
		children,
		id,
		name,
		options,
		minWidth,
		padding = '4px 2px',
		backgroundColor = 'var(--core-surface-secondary)',
		borderRadius = 'var(--corner-l)',
		borderWidth = 1,
		borderColor = 'var(--core-fill-primary)',
		onClickItem,
		onHoverItem,
		onDismiss,
		dismissAll,
		motionValues,
		transition,
		caller,
		offset = level > 0 ? 'right' : 'bottom',
		gap = level > 0 ? -24 : 2,
		...divAttributes
	} = props;
	const { current } = useTheme();
	const { className, style, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledBy, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ?? '';
	const generatedId = useId();
	const menuId = id?.trim() || generatedId;
	const menuName = name?.trim() || id?.trim() || 'Pop Menu';
	const menuRef = useRef<HTMLDivElement>(null);
	const layout = usePopMenu({ menuRef, caller, offset, gap });
	const { coords, resolved, constraints, visible, resetMenu } = layout;
	const resolvedTransition = getWaterTransition(current.motion, transition);
	const [exiting, setExiting] = useState(false);

	// track sub menus open by this menu
	const [activeSubMenu, setActiveSubMenu] = useState<{
		caller: HTMLButtonElement;
		render: NonNullable<PopMenuItemProps['subMenu']>;
		key: number;
	}>();

	// merge presence motion values
	const resolvedVariants = useMemo(() => {
		return mergedPresenceMotionValues(defaultMotionValues, motionValues);
	}, [motionValues]);

	// will change more frequently so carved out from rest of css vars
	const posStyles = useMemo(() => {
		return {
			'--pop-left': coords ? `${coords.x}px` : 'unset',
			'--pop-top': coords ? `${coords.y}px` : 'unset',
			'--pop-max-width': constraints ? `${constraints.maxWidth}px` : 'unset',
			'--pop-max-height': constraints ? `${constraints.maxHeight}px` : 'unset',
			visibility: visible ? 'visible' : 'hidden',
			pointerEvents: exiting ? 'none' : 'auto',
			zIndex: visible ? 10 + level : -10,
		} as CSSProperties;
	}, [coords, constraints, exiting, visible, level]);

	// typically stable
	const appearanceStyles = useMemo(() => {
		return {
			'--pop-background-color': backgroundColor,
			'--pop-padding': setStyle(padding),
			'--pop-border-width': setStyle(borderWidth),
			'--pop-border-color': borderColor,
			'--pop-gap': setStyle(gap),
			'--pop-border-radius': setStyle(borderRadius),
			'--pop-min-width': setStyle(minWidth, 'unset'),
		} as CSSProperties;
	}, [backgroundColor, borderWidth, borderColor, gap, padding, borderRadius, minWidth]);

	// Root owners close their menu by clearing its caller or unmounting it.
	const handleDismissAll = () => {
		const dismiss = dismissAll ?? onDismiss;
		dismiss?.();
	};

	const handleItemClick = (event: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo) => {
		const caller = event.currentTarget;
		const render = item.subMenu;
		if (render) {
			// Remount the selected branch so any previous descendants close too.
			setActiveSubMenu((previous) => ({ caller, render, key: (previous?.key ?? 0) + 1 }));
		} else {
			setActiveSubMenu(undefined);
		}
		onClickItem?.(event, item);
		const shouldDismiss = item.autoDismiss ?? !(item.toggle || item.subMenu);
		if (shouldDismiss) handleDismissAll();
	};

	const connectChildren = (nodes: React.ReactNode, onClick = handleItemClick, onHover = onHoverItem): React.ReactNode =>
		Children.map(nodes, (child) => {
			if (!isValidElement(child)) return child;
			if (child.type === Fragment) {
				const fragment = child as React.ReactElement<{ children?: React.ReactNode }>;
				return cloneElement(fragment, {}, connectChildren(fragment.props.children, onClick, onHover));
			}
			if (child.type === PopMenuItem) {
				const item = child as React.ReactElement<PopMenuItemProps>;
				return cloneElement(item, {
					dismissAll: handleDismissAll,
					onClick: (event, info) => {
						item.props.onClick?.(event, info);
						onClick(event, info);
					},
					onHover: (event, info) => {
						item.props.onHover?.(event, info);
						onHover?.(event, info);
					},
				});
			}
			if (child.type === PopMenuGroup) {
				const group = child as React.ReactElement<PopMenuItemGroupProps>;
				const groupClick: typeof handleItemClick = (event, info) => {
					group.props.onClickItem?.(event, info);
					onClick(event, info);
				};
				const groupHover: NonNullable<typeof onHoverItem> = (event, info) => {
					group.props.onHoverItem?.(event, info);
					onHover?.(event, info);
				};
				return cloneElement(
					group,
					{
						dismissAll: handleDismissAll,
						onClickItem: groupClick,
						onHoverItem: groupHover,
					},
					connectChildren(group.props.children, groupClick, groupHover),
				);
			}
			return child;
		});

	const renderOptions = () => {
		if (!options || options?.length === 0) return null;
		return options.map((option) => {
			if ('label' in option) {
				const item = option as PopMenuItemProps;
				return (
					<PopMenuItem
						key={`pop-menu-item.${menuName}.${item.label}`}
						{...item}
						dismissAll={handleDismissAll}
						onClick={handleItemClick}
						onHover={onHoverItem}
					/>
				);
			}
			const item = option as PopMenuItemGroupProps;
			return (
				<PopMenuGroup
					key={`pop-menu-group.${menuName}.${item.title}`}
					{...item}
					dismissAll={handleDismissAll}
					onClickItem={(event, info) => {
						item.onClickItem?.(event, info);
						handleItemClick(event, info);
					}}
					onHoverItem={(event, info) => {
						item.onHoverItem?.(event, info);
						onHoverItem?.(event, info);
					}}
				/>
			);
		});
	};

	const handleAnimationComplete = useCallback(
		(definition: AnimationDefinition) => {
			if (definition !== 'exit' || resolved || !visible) return;
			setActiveSubMenu(undefined);
			resetMenu();
			onDismiss?.();
		},
		[resolved, visible, onDismiss, resetMenu],
	);

	const handleAnimationStart = useCallback((definition: AnimationDefinition) => {
		setExiting(definition === 'exit');
	}, []);

	return (
		<>
			<motion.div
				{...rest}
				id={menuId}
				ref={menuRef}
				variants={resolvedVariants}
				initial={'initial'}
				animate={resolved ? 'animate' : 'exit'}
				exit={'exit'}
				transition={resolvedTransition}
				className={classNames(divClass, styles.popMenu)}
				style={{ ...divStyle, ...appearanceStyles, ...posStyles }}
				onScroll={(e) => e.stopPropagation()}
				inert={!resolved}
				onAnimationComplete={handleAnimationComplete}
				onAnimationStart={handleAnimationStart}
				role={'menu'}
				aria-label={ariaLabel?.trim() || menuName}
				aria-labelledby={ariaLabelledBy}
			>
				{children != null ? connectChildren(children) : renderOptions()}
			</motion.div>
			{activeSubMenu &&
				createPortal(
					<Fragment key={activeSubMenu.key}>
						{activeSubMenu.render({
							caller: activeSubMenu.caller,
							level: level + 1,
							dismissAll: handleDismissAll,
						})}
					</Fragment>,
					activeSubMenu.caller.closest('[data-slice-theme-scope]') ?? document.body,
				)}
		</>
	);
}
