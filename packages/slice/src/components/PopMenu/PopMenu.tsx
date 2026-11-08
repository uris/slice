import type { AnimationDefinition } from 'motion';
import { type Variants, motion } from 'motion/react';
import type React from 'react';
import {
	type CSSProperties,
	createContext,
	useCallback,
	useContext,
	useEffect,
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
import { PopMenuActiveSubMenuContext, PopMenuContext } from './PopMenuContext';
import { PopMenuGroup } from './PopMenuGroup';
import { PopMenuItem } from './PopMenuItem';
import type { PopMenuItemClickInfo, PopMenuItemGroupProps, PopMenuItemProps, PopMenuProps } from './_types';
import { usePopMenu } from './usePopMenu';
import { type PopMenuPortalTarget, usePopMenuPortal } from './usePopMenuPortal';

// Keep portal placement, branch dismissal, and root focus restoration available across submenu wrappers.
const PortalContext = createContext<PopMenuPortalTarget | undefined>(undefined);
const BranchDismissContext = createContext<(() => void) | undefined>(undefined);
const RootCallerContext = createContext<HTMLElement | undefined>(undefined);

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
		portalContainer,
		offset = level > 0 ? 'right' : 'bottom',
		gap = level > 0 ? -24 : 2,
		...divAttributes
	} = props;

	// Resolve the host before measuring; submenus inherit the parent host unless explicitly overridden.
	const inheritedPortal = useContext(PortalContext);
	const portalTarget = usePopMenuPortal(caller, portalContainer, inheritedPortal);
	const dismissBranch = useContext(BranchDismissContext);
	const rootCaller = useContext(RootCallerContext) ?? caller;
	const { current } = useTheme();
	const {
		className,
		style,
		'aria-label': ariaLabel,
		'aria-labelledby': ariaLabelledBy,
		onKeyDown,
		...rest
	} = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ?? '';
	const generatedId = useId();
	const menuId = id?.trim() || generatedId;
	const menuName = name?.trim() || id?.trim() || 'Pop Menu';
	const menuRef = useRef<HTMLDivElement>(null);
	const layout = usePopMenu({
		menuRef,
		caller,
		offset,
		gap,
		container: portalTarget,
		enabled: portalTarget !== undefined,
	});
	const { coords, resolved, constraints, visible, resetMenu } = layout;
	const resolvedTransition = getWaterTransition(current.motion, transition);

	// Each menu owns one active submenu branch; descendants manage their own branches.
	const [activeSubMenu, setActiveSubMenu] = useState<{
		caller: HTMLButtonElement;
		render: NonNullable<PopMenuItemProps['subMenu']>;
		key: number;
	}>();

	const dismissSubMenu = useCallback(() => setActiveSubMenu(undefined), []);

	// Focus only after placement resolves, without scrolling an ancestor and dismissing the menu.
	useEffect(() => {
		if (!resolved) return;
		const firstItem = menuRef.current?.querySelector<HTMLElement>('[role^="menuitem"]:not(:disabled)');
		(firstItem ?? menuRef.current)?.focus({ preventScroll: true });
	}, [resolved]);

	// Close this level and return focus to its opener; whole-tree dismissal is handled separately.
	const closeCurrentMenu = () => {
		caller?.focus();
		layout.dismissMenu();
	};

	// Let consumer handlers cancel navigation, and ignore keyboard events from nested menus.
	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		onKeyDown?.(event);
		if (event.defaultPrevented || (event.target as Element).closest('[role="menu"]') !== menuRef.current) return;
		const items = Array.from(
			menuRef.current?.querySelectorAll<HTMLButtonElement>('[role^="menuitem"]:not(:disabled)') ?? [],
		);
		const index = items.indexOf(event.target as HTMLButtonElement);
		let next: HTMLButtonElement | undefined;
		if (event.key === 'ArrowDown') next = items[(index + 1) % items.length];
		if (event.key === 'ArrowUp') next = items[(index - 1 + items.length) % items.length];
		if (event.key === 'Home') next = items[0];
		if (event.key === 'End') next = items.at(-1);
		if (next) {
			event.preventDefault();
			next.focus();
		}
		if (event.key === 'Escape' || (event.key === 'ArrowLeft' && level > 0)) {
			event.preventDefault();
			event.stopPropagation();
			closeCurrentMenu();
		}
		if (event.key === 'ArrowRight' && (event.target as HTMLElement).getAttribute('aria-haspopup') === 'menu') {
			event.preventDefault();
			(event.target as HTMLButtonElement).click();
		}
		if (event.key === 'Tab') {
			// Resolve the next tab stop before dismissal removes the focused menu item.
			const stops = Array.from(
				((rootCaller?.getRootNode() as Document | ShadowRoot) ?? document).querySelectorAll<HTMLElement>(
					'button, a[href], input, select, textarea, [tabindex]',
				),
			).filter(
				(element) =>
					element.tabIndex >= 0 &&
					!element.matches(':disabled') &&
					!element.closest('[role="menu"], [inert]') &&
					element.getClientRects().length > 0,
			);
			const triggerIndex = rootCaller ? stops.indexOf(rootCaller) : -1;
			const destination = stops[triggerIndex + (event.shiftKey ? -1 : 1)];
			rootCaller?.focus();
			handleDismissAll();
			layout.dismissMenu();
			if (triggerIndex >= 0 && destination) {
				event.preventDefault();
				destination.focus();
			}
		}
	};

	// Layer consumer animation overrides onto the default enter/exit variants.
	const resolvedVariants = useMemo(() => {
		return mergedPresenceMotionValues(defaultMotionValues, motionValues);
	}, [motionValues]);

	// Placement and interaction state update independently of appearance tokens.
	const posStyles = useMemo(() => {
		return {
			'--pop-left': coords ? `${coords.x}px` : 'unset',
			'--pop-top': coords ? `${coords.y}px` : 'unset',
			'--pop-max-width': constraints ? `${constraints.maxWidth}px` : 'unset',
			'--pop-max-height': constraints ? `${constraints.maxHeight}px` : 'unset',
			visibility: visible ? 'visible' : 'hidden',
			pointerEvents: resolved ? 'auto' : 'none',
			zIndex: visible ? 10 + level : -10,
		} as CSSProperties;
	}, [coords, constraints, resolved, visible, level]);

	// Keep appearance variables stable while placement or submenu state changes.
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

	// Restore focus only while it remains in this menu, then delegate whole-tree closure to its owner.
	const handleDismissAll = useCallback(() => {
		const menu = menuRef.current;
		if (menu?.contains((menu.getRootNode() as Document | ShadowRoot).activeElement)) rootCaller?.focus();
		const dismiss = dismissAll ?? onDismiss;
		dismiss?.();
	}, [rootCaller, dismissAll, onDismiss]);

	const handleItemClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>, item: PopMenuItemClickInfo) => {
			const caller = event.currentTarget;
			const render = item.subMenu;
			if (render) {
				// Remount the selected branch so any previous descendants close too.
				setActiveSubMenu((previous) => ({ caller, render, key: (previous?.key ?? 0) + 1 }));
			} else {
				setActiveSubMenu(undefined);
			}
			// Notify the consumer before applying dismissal; toggles and submenu openers stay open by default.
			onClickItem?.(event, item);
			const shouldDismiss = item.autoDismiss ?? !(item.toggle || item.subMenu);
			if (shouldDismiss) handleDismissAll();
		},
		[onClickItem, handleDismissAll],
	);

	// Stable actions connect items through wrappers; submenu expansion uses a separate state context.
	const menuActions = useMemo(
		() => ({ dismissAll: handleDismissAll, onClickItem: handleItemClick, onHoverItem }),
		[handleDismissAll, handleItemClick, onHoverItem],
	);

	// Shorthand options use the same context-driven components as authored children.
	const renderOptions = () => {
		if (!options || options?.length === 0) return null;
		return options.map((option, index) => {
			if ('label' in option) {
				const item = option as PopMenuItemProps;
				return <PopMenuItem key={item.id?.trim() ? `id:${item.id.trim()}` : `index:${index}`} {...item} />;
			}
			const item = option as PopMenuItemGroupProps;
			return <PopMenuGroup key={item.id?.trim() ? `id:${item.id.trim()}` : `index:${index}`} {...item} />;
		});
	};

	// Retain the menu during exit, then clear layout and notify both its owner and parent branch.
	const handleAnimationComplete = useCallback(
		(definition: AnimationDefinition) => {
			if (definition !== 'exit' || resolved || !visible) return;
			setActiveSubMenu(undefined);
			resetMenu();
			onDismiss?.();
			dismissBranch?.();
		},
		[resolved, visible, onDismiss, resetMenu, dismissBranch],
	);

	// Wait for automatic host creation; false is a resolved request to render in place.
	if (portalTarget === undefined) return null;
	const content = (
		<PortalContext.Provider value={portalTarget}>
			<RootCallerContext.Provider value={rootCaller}>
				<PopMenuContext.Provider value={menuActions}>
					<PopMenuActiveSubMenuContext.Provider value={activeSubMenu?.caller.id}>
						<motion.div
							{...rest}
							id={menuId}
							data-pop-menu-parent={caller?.closest('[role="menu"]')?.id || undefined}
							onKeyDown={handleKeyDown}
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
							role={'menu'}
							tabIndex={-1}
							aria-label={ariaLabel?.trim() || menuName}
							aria-labelledby={ariaLabelledBy}
						>
							{children ?? renderOptions()}
						</motion.div>
						{activeSubMenu && (
							<BranchDismissContext.Provider key={activeSubMenu.key} value={dismissSubMenu}>
								{activeSubMenu.render({
									caller: activeSubMenu.caller,
									level: level + 1,
									dismissAll: handleDismissAll,
								})}
							</BranchDismissContext.Provider>
						)}
					</PopMenuActiveSubMenuContext.Provider>
				</PopMenuContext.Provider>
			</RootCallerContext.Provider>
		</PortalContext.Provider>
	);
	if (portalTarget === false) return content;
	return createPortal(content, portalTarget);
}
