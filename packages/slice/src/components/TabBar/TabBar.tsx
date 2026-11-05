'use client';

import { motion } from 'motion/react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../hooks';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import { IconButton } from '../IconButton';
import { Tab, type TabOption, type TabProps } from '../Tab';
import css from './TabBar.module.css';
import type { TabBarProps } from './_types';
import { TabContext, useClientLayoutEffect, withoutAria } from './shared';

function TabBarComponent<T = string>(rawProps: TabBarProps<T>) {
	const {
		children,
		tabBarName,
		options = [],
		value,
		defaultValue,
		underline = true,
		border = true,
		height = 'auto',
		width = '100%',
		tabWidth = 'compact',
		closeWidth = 'auto',
		padding = 'var(--spacing-s)',
		iconSize = 20,
		iconFill = false,
		iconGap = 8,
		tabGap = 8,
		disabled = false,
		hasClose = false,
		justify = 'start',
		borderColor = 'var(--core-outline-secondary)',
		textSize = 'm',
		transition,
		onChange,
		onClose,
		onToolTip,
		className,
		style,
		...attributes
	} = resolveColorProps(rawProps);
	const accessibleName = tabBarName?.trim() || 'Tabs';
	const theme = useTheme();
	const reduced = usePrefersReducedMotion();
	const timing = useMemo(
		() =>
			reduced
				? { type: 'tween' as const, duration: 0, delay: 0, repeat: 0 }
				: getWaterTransition(theme.current.motion, transition),
		[reduced, theme.current.motion, transition],
	);
	const [localValue, setLocalValue] = useState<T | null | undefined>(() => {
		if (defaultValue !== undefined) return defaultValue;
		if (children === undefined) return options.find((option) => !option.disabled)?.value;
		const findFirst = (nodes: React.ReactNode): T | undefined => {
			for (const child of React.Children.toArray(nodes)) {
				if (!React.isValidElement<TabProps<T>>(child)) continue;
				if (child.type === Tab && !child.props.disabled) return child.props.value;
				const nested = findFirst(child.props.children);
				if (nested !== undefined) return nested;
			}
			return undefined;
		};
		return findFirst(children);
	});
	const controlled = value !== undefined;
	const active = controlled ? value : localValue;
	const listRef = useRef<HTMLDivElement>(null);
	const entries = useRef(new Map<HTMLButtonElement, TabOption<unknown>>());
	const [revision, setRevision] = useState(0);
	const [firstValue, setFirstValue] = useState<unknown>();
	const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null);
	const register = useCallback((element: HTMLButtonElement, option: TabOption<unknown>) => {
		entries.current.set(element, option);
		setRevision((n) => n + 1);
		return () => {
			entries.current.delete(element);
			setRevision((n) => n + 1);
		};
	}, []);
	const select = useCallback(
		(option: TabOption<unknown>) => {
			if (disabled || option.disabled || Object.is(active, option.value)) return;
			if (!controlled) setLocalValue(() => option.value as T);
			onToolTip?.(null);
			onChange?.(option.value as T, option as TabOption<T>);
		},
		[disabled, active, controlled, onChange, onToolTip],
	);
	const enabledTabs = useCallback(
		() =>
			Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []).filter(
				(el) => !el.disabled && entries.current.has(el),
			),
		[],
	);
	const navigate = useCallback(
		(event: React.KeyboardEvent<HTMLButtonElement>) => {
			if (disabled) return;
			const tabs = enabledTabs();
			const index = tabs.indexOf(event.currentTarget);
			let next: number;
			switch (event.key) {
				case 'ArrowRight':
					next = (index + 1) % tabs.length;
					break;
				case 'ArrowLeft':
					next = (index - 1 + tabs.length) % tabs.length;
					break;
				case 'Home':
					next = 0;
					break;
				case 'End':
					next = tabs.length - 1;
					break;
				default:
					return;
			}
			event.preventDefault();
			const target = tabs[next];
			if (target) {
				target.focus();
				const option = entries.current.get(target);
				if (option) select(option);
			}
		},
		[disabled, enabledTabs, select],
	);
	useClientLayoutEffect(() => {
		const first = enabledTabs()[0];
		const firstOption = first && entries.current.get(first);
		const selectedOption = enabledTabs()
			.map((element) => entries.current.get(element))
			.find((option) => Object.is(option?.value, active));
		setFirstValue(() => selectedOption?.value ?? firstOption?.value);
		if (!controlled && active === undefined && firstOption) setLocalValue(() => firstOption.value as T);
	}, [revision, enabledTabs, controlled, active, disabled]);
	useClientLayoutEffect(() => {
		const list = listRef.current;
		if (!list) return;
		const measure = () => {
			const target = Array.from(entries.current).find(
				([el, option]) => el.isConnected && !el.disabled && Object.is(option.value, active),
			)?.[0];
			if (!target || disabled || !underline) {
				setIndicator(null);
				return;
			}
			const next = { x: target.offsetLeft, width: target.offsetWidth };
			setIndicator((previous) => (previous?.x === next.x && previous.width === next.width ? previous : next));
		};
		measure();
		const observer = new ResizeObserver(measure);
		observer.observe(list);
		for (const element of entries.current.keys()) observer.observe(element);
		return () => observer.disconnect();
	}, [
		revision,
		active,
		disabled,
		underline,
		children,
		options,
		padding,
		iconSize,
		iconGap,
		tabGap,
		tabWidth,
		textSize,
		width,
	]);
	const context = useMemo(
		() => ({ value: active, firstValue, iconFill, disabled, register, select, navigate, onToolTip }),
		[active, firstValue, iconFill, disabled, register, select, navigate, onToolTip],
	);
	const vars = {
		'--tab-bar-height': setStyle(height),
		'--tab-bar-width': setStyle(width),
		'--tab-bar-gap': setStyle(tabGap),
		'--tab-bar-padding': setStyle(padding),
		'--tab-bar-icon-size': setStyle(iconSize),
		'--tab-bar-icon-gap': setStyle(iconGap),
		'--tab-bar-tab-width': tabWidth === 'fill' ? 'auto' : tabWidth === 'compact' ? 'max-content' : setStyle(tabWidth),
		'--tab-bar-tab-flex': tabWidth === 'fill' ? '1 1 0' : tabWidth === 'compact' ? '0 1 auto' : '0 0 auto',
		'--tab-bar-border': border ? '1px' : '0px',
		'--tab-bar-border-color': borderColor,
		'--tab-bar-justify': justify === 'start' ? 'flex-start' : justify === 'end' ? 'flex-end' : 'center',
		'--tab-bar-close-width': setStyle(closeWidth),
	} as React.CSSProperties;
	return (
		<TabContext.Provider value={context}>
			<div className={`${css.wrapper}${className ? ` ${className}` : ''}`} style={{ ...style, ...vars }}>
				<div
					{...withoutAria(attributes)}
					ref={listRef}
					role="tablist"
					aria-label={accessibleName}
					aria-orientation="horizontal"
					aria-disabled={disabled || undefined}
					className={`${css.list} ${css[textSize]}`}
					data-icon-fill={iconFill || undefined}
				>
					{children !== undefined
						? children
						: options.map((option, i) => (
								<Tab
									{...option}
									key={
										typeof option.value === 'string' || typeof option.value === 'number'
											? `${typeof option.value}:${option.value}`
											: (option.id ?? i)
									}
								/>
							))}
					{indicator && (
						<motion.div
							key={reduced ? 'static' : 'animated'}
							aria-hidden="true"
							className={css.indicator}
							initial={false}
							animate={indicator}
							transition={timing}
						/>
					)}
				</div>
				{hasClose && (
					<div className={css.close}>
						<IconButton
							actionName="Close tabs"
							icon="x"
							iconSize={Math.max(0, iconSize - 4)}
							buttonSize={iconSize}
							disabled={disabled}
							onClick={onClose}
							iconFill={iconFill}
						/>
					</div>
				)}
			</div>
		</TabContext.Provider>
	);
}
export const TabBar = React.memo(TabBarComponent) as <T = string>(props: TabBarProps<T>) => React.JSX.Element;
