'use client';
import React, { useContext } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { Icon } from '../Icon';
import css from './RadioButton.module.css';
import { RadioGroupContext } from './RadioGroupContext';
import type { RadioButtonProps } from './_types';

const length = (value: number | string, fallback: string) =>
	typeof value === 'number' ? (Number.isFinite(value) ? `${Math.max(0, value)}px` : fallback) : value;
function RadioButtonComponent<T = string>(rawProps: RadioButtonProps<T>) {
	const group = useContext(RadioGroupContext);
	const ownProps = Object.fromEntries(
		Object.entries(rawProps).filter(([, value]) => value !== undefined),
	) as RadioButtonProps<T>;
	const props = resolveColorProps(group ? { ...group.optionProps, ...ownProps } : rawProps);
	const {
		actionName,
		align = 'middle',
		label,
		children,
		checked,
		defaultChecked = false,
		disabled = false,
		fieldName,
		value,
		formValue,
		iconChecked = 'system.check-circle',
		iconUnChecked = 'system.circle',
		iconColor = 'var(--core-text-primary)',
		iconColorSelected,
		iconSize = 20,
		gap = 6,
		textColor = 'var(--core-text-primary)',
		textSize = 'm',
		textTopOffset = 0,
		backgroundColor = 'transparent',
		backgroundColorSelected = 'transparent',
		borderWidth = 0,
		borderColor = 'var(--core-outline-primary)',
		borderRadius = 8,
		padding = 0,
		onChange,
		onClick,
		className,
		style,
		...inputAttributes
	} = props;
	if (group && (value === undefined || value === null))
		throw new Error('RadioButton inside RadioButtonList requires a non-null value.');
	const effectiveChecked = group
		? group.value !== null && group.value !== undefined && Object.is(group.value, value)
		: checked;
	const effectiveDisabled = disabled || Boolean(group?.disabled);
	const content = label ?? children;
	const hasContent =
		content !== undefined &&
		content !== null &&
		typeof content !== 'boolean' &&
		(typeof content !== 'string' || content.trim().length > 0);
	const size = Number.isFinite(iconSize) && iconSize >= 0 ? iconSize : 20;
	const offset = Number.isFinite(textTopOffset) ? textTopOffset : 0;
	const cssVars = {
		'--rb-align': align === 'top' ? 'flex-start' : align === 'bottom' ? 'flex-end' : 'center',
		'--rb-icon-size': `${size}px`,
		'--rb-gap': `${Number.isFinite(gap) ? Math.max(0, gap) : 6}px`,
		'--rb-icon-color': iconColor,
		'--rb-icon-color-selected': iconColorSelected ?? iconColor,
		'--rb-text-color': textColor,
		'--rb-text-top': `${Math.max(0, offset)}px`,
		'--rb-text-bottom': `${Math.max(0, -offset)}px`,
		'--rb-background': backgroundColor,
		'--rb-background-selected': backgroundColorSelected,
		'--rb-border-width': length(borderWidth, '0px'),
		'--rb-border-color': borderColor,
		'--rb-border-radius': length(borderRadius, '8px'),
		'--rb-padding': length(padding, '0px'),
	} as React.CSSProperties;
	/* START.DEBUG */
	useTrackRenders(props, 'RadioButton');
	/* END.DEBUG */
	return (
		<label
			className={`${css.wrapper}${className ? ` ${className}` : ''}`}
			style={{ ...style, ...cssVars }}
			data-disabled={effectiveDisabled || undefined}
		>
			<input
				{...inputAttributes}
				className={css.input}
				type="radio"
				name={group?.name ?? inputAttributes.name}
				checked={effectiveChecked}
				defaultChecked={!group && checked === undefined ? defaultChecked : undefined}
				disabled={effectiveDisabled}
				value={formValue ?? (typeof value === 'string' || typeof value === 'number' ? value : undefined)}
				aria-label={actionName?.trim() || (hasContent ? undefined : 'Option')}
				aria-labelledby={undefined}
				onClick={onClick}
				onChange={(event) => {
					if (event.defaultPrevented || event.nativeEvent.defaultPrevented || effectiveDisabled) return;
					const option = { fieldName, label, value };
					const next = event.currentTarget.checked;
					onChange?.(option, next);
					if (next) group?.select(option);
				}}
			/>
			<span className={css.surface}>
				{size > 0 && (
					<span className={css.icon} aria-hidden="true">
						<span className={css.unchecked}>
							<Icon name={iconUnChecked} size={size} strokeColor="currentColor" pointer={false} tabIndex={-1} />
						</span>
						<span className={css.checked}>
							<Icon name={iconChecked} size={size} strokeColor="currentColor" pointer={false} tabIndex={-1} />
						</span>
					</span>
				)}
				{hasContent && <span className={`${css.text} ${css[textSize]}`}>{content}</span>}
			</span>
		</label>
	);
}
RadioButtonComponent.displayName = 'RadioButton';
export const RadioButton = React.memo(RadioButtonComponent) as <T = string>(
	props: RadioButtonProps<T>,
) => React.JSX.Element;
