'use client';
import React, { useContext, useId, useMemo, useRef } from 'react';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import { TabContext, useClientLayoutEffect, withoutAria } from '../TabBar/shared';
import { ToolTipType } from '../sharedTypes';
import css from './Tab.module.css';
import type { TabProps } from './_types';

function TabComponent<T = string>({
	value,
	label,
	children,
	icon,
	toolTip,
	count,
	disabled = false,
	panelId,
	id,
	onClick,
	onKeyDown,
	onMouseEnter,
	onMouseLeave,
	className,
	...attributes
}: TabProps<T>) {
	const group = useContext(TabContext);
	if (!group) throw new Error('Tab must be used inside TabBar.');
	if (value == null) throw new Error('Tab requires a unique, non-null value.');
	const generatedId = useId();
	const ref = useRef<HTMLButtonElement>(null);
	const option = useMemo(
		() => ({ value, label, children, icon, toolTip, count, disabled, panelId, id }),
		[value, label, children, icon, toolTip, count, disabled, panelId, id],
	);
	useClientLayoutEffect(
		() => (ref.current ? group.register(ref.current, option) : undefined),
		[group.register, option],
	);
	const selected = group.value != null && Object.is(group.value, value);
	const unavailable = group.disabled || disabled;
	return (
		<button
			{...withoutAria(attributes)}
			id={id ?? generatedId}
			ref={ref}
			type="button"
			role="tab"
			aria-controls={panelId}
			aria-selected={selected}
			disabled={unavailable}
			tabIndex={!unavailable && (selected || Object.is(group.firstValue, value)) ? 0 : -1}
			className={`${css.option}${selected ? ` ${css.selected}` : ''}${className ? ` ${className}` : ''}`}
			onClick={(event) => {
				onClick?.(event);
				if (!event.defaultPrevented) group.select(option);
			}}
			onKeyDown={(event) => {
				onKeyDown?.(event);
				if (!event.defaultPrevented) group.navigate(event);
			}}
			onMouseEnter={(event) => {
				onMouseEnter?.(event);
				if (!event.defaultPrevented && !unavailable && toolTip)
					group.onToolTip?.({ type: ToolTipType.button, payload: { label: toolTip }, event, ref });
			}}
			onMouseLeave={(event) => {
				onMouseLeave?.(event);
				if (!event.defaultPrevented && toolTip) group.onToolTip?.(null);
			}}
		>
			{icon && (
				<span className={css.icon} aria-hidden="true">
					<Icon
						name={icon}
						size={20}
						style={{ width: '100%', height: '100%' }}
						fill={group.iconFill}
						strokeColor="currentColor"
					/>
				</span>
			)}
			{label ?? children ?? 'Tab'}
			{count !== undefined && count !== 0 && <Badge variant="light" hideZero={false} count={count} />}
		</button>
	);
}
export const Tab = React.memo(TabComponent) as <T = string>(props: TabProps<T>) => React.JSX.Element;
