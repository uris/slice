'use client';

import React from 'react';
import { tintFromColor } from '../../utils/functions/colors';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { Button, type ButtonProps } from '../Button';
import { TextField, type TextFieldProps } from '../Textfield';
import { buttonStyleDefaults } from '../sharedTypes';
import css from './ButtonBar.module.css';
import type { ButtonBarProps } from './_types';

const sharedStyleKeys = new Set<keyof ButtonProps>([
	'buttonSize',
	'gap',
	'padding',
	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'paddingLeft',
	'variant',
	'state',
	'disabled',
	'iconDualTone',
	'fill',
	'iconSize',
	'iconStrokeWidth',
	'iconColor',
	'iconColorHover',
	'backgroundColor',
	'backgroundColorHover',
	'backgroundColorDisabled',
	'textColor',
	'textColorHover',
	'textSize',
	'transition',
	'variants',
	'initial',
	'animate',
	'exit',
	'underline',
	'destructive',
]);

type BarChild = React.ReactElement<ButtonProps> | React.ReactElement<TextFieldProps>;

function isTextField(element: BarChild): element is React.ReactElement<TextFieldProps> {
	return element.type === TextField;
}

export const ButtonBar = React.memo(function ButtonBar(rawProps: Readonly<ButtonBarProps>) {
	const {
		buttons = [],
		children,
		onChange,
		onClick,
		orientation = 'horizontal',
		inset,
		hoverTint = 4,
		divider = true,
		dividerColor = 'var(--core-fill-primary)',
		dividerOpacity = 0.75,
		dividerWidth = 1,
		dividerStyle = 'solid',
		borderRadius,
		borderWidth = 1,
		borderColor = 'var(--core-fill-primary)',
		borderColorFocused = 'var(--core-fill-secondary)',
		borderStyle = 'solid',
		width,
		className,
		style,
		...rest
	} = resolveColorProps(rawProps);
	const shared: Record<string, unknown> = {};
	const events: Record<string, unknown> = {};
	const wrapper: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(rest)) {
		if (key.startsWith('on')) events[key] = value;
		else if (sharedStyleKeys.has(key as keyof ButtonProps)) {
			if (value !== undefined) shared[key] = value;
		} else wrapper[key] = value;
	}

	const elements = [
		...buttons.map((button, index) => <Button key={button.id ?? `definition-${index}`} {...button} />),
		...React.Children.toArray(children).filter(
			(child): child is BarChild => React.isValidElement(child) && (child.type === Button || child.type === TextField),
		),
	];
	const vertical = orientation === 'vertical';
	const getDefaultInset = () => {
		if (rawProps.orientation === 'vertical') return 0;
		if (rawProps.buttonSize === 'xl') return 10;
		if (rawProps.buttonSize === 'l') return 6;
		return 4;
	};
	const resolvedInset = inset ?? getDefaultInset();
	const getDefaultBorderRadius = () => {
		const buttonSize = rawProps.buttonSize ?? 'm';
		if (typeof buttonSize === 'number') {
			if (Number.isFinite(buttonSize) && buttonSize > 0) return buttonSize;
			return buttonStyleDefaults.sizes.m;
		}
		if (buttonSize === 'auto') return buttonStyleDefaults.sizes.m;
		return buttonStyleDefaults.sizes[buttonSize];
	};
	const resolvedBorderRadius = borderRadius ?? getDefaultBorderRadius() / 2;
	const wrapperBackgroundColor = resolveColorProps({
		backgroundColor: rawProps.backgroundColor ?? 'var(--core-surface-secondary)',
	}).backgroundColor;

	const getChildSize = (button: ButtonProps = {}) => {
		const buttonSize = rawProps.buttonSize ?? button.buttonSize ?? 'm';
		const hasExplicitPadding = rawProps.padding !== undefined || button.padding !== undefined;
		const defaultVerticalPadding = buttonSize === 's' && !hasExplicitPadding ? 2 : undefined;
		const getSmallButtonHeight = () => {
			if (defaultVerticalPadding === undefined) return buttonSize;
			const top = rawProps.paddingTop ?? button.paddingTop ?? defaultVerticalPadding;
			const bottom = rawProps.paddingBottom ?? button.paddingBottom ?? defaultVerticalPadding;
			// Include numeric padding in the frame instead of consuming the icon's space.
			const extraTop = typeof top === 'number' ? top : 0;
			const extraBottom = typeof bottom === 'number' ? bottom : 0;
			return buttonStyleDefaults.sizes.s + extraTop + extraBottom;
		};
		return getSmallButtonHeight();
	};

	const renderChild = (element: BarChild, index: number) => {
		if (isTextField(element)) {
			const field = element.props;
			const size = getChildSize();
			const getFieldHeight = () => {
				if (size === 'auto') return 'auto';
				if (typeof size === 'number') {
					if (Number.isFinite(size) && size > 0) return size;
					return buttonStyleDefaults.sizes.m;
				}
				return buttonStyleDefaults.sizes[size ?? 'm'];
			};
			return (
				<div className={css.inputSlot}>
					{React.cloneElement(element, {
						onChange: (value) => {
							field.onChange?.(value);
							onChange?.(value, {
								index,
								id: field.inputId ?? field.id,
								label: field.label ?? field.inputName ?? field.name,
							});
						},
						variant: 'simple',
						behavior: 'persistent',
						height: getFieldHeight(),
						width: field.width ?? 'auto',
						borderStyle: 'none',
						borderRadius: 0,
						clearButton: field.clearButton === undefined ? null : field.clearButton,
						disabled: rawProps.state === 'disabled' ? true : (rawProps.disabled ?? field.disabled),
						textSize: rawProps.textSize ?? field.textSize,
						backgroundColorBlurred: rawProps.backgroundColor ?? field.backgroundColorBlurred ?? 'transparent',
						backgroundColorFocused: rawProps.backgroundColor ?? field.backgroundColorFocused ?? 'transparent',
						textColorBlurred: rawProps.textColor ?? field.textColorBlurred ?? 'var(--core-text-secondary)',
						textColorFocused:
							rawProps.textColorHover ?? rawProps.textColor ?? field.textColorFocused ?? 'var(--core-text-primary)',
					})}
				</div>
			);
		}

		const buttonSize = rawProps.buttonSize ?? element.props.buttonSize ?? 'm';
		const hasExplicitPadding = rawProps.padding !== undefined || element.props.padding !== undefined;
		const defaultVerticalPadding = buttonSize === 's' && !hasExplicitPadding ? 2 : undefined;

		const backgroundColor = resolveColorProps({
			backgroundColor: rawProps.backgroundColor ?? element.props.backgroundColor ?? 'var(--core-surface-secondary)',
		}).backgroundColor;
		const tint = Number.isFinite(hoverTint) ? Math.min(100, Math.max(0, hoverTint)) : 8;
		const getHoverBackground = () => {
			if (element.props.backgroundColorHover !== undefined) return element.props.backgroundColorHover;
			if (tint === 0) return backgroundColor;
			if (/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(backgroundColor)) {
				return tintFromColor(backgroundColor, tint / 100);
			}
			return `color-mix(in srgb, ${backgroundColor} ${100 - tint}%, white ${tint}%)`;
		};
		const callbacks: Record<string, unknown> = {};
		for (const [key, parentHandler] of Object.entries(events)) {
			if (typeof parentHandler !== 'function') continue;
			const childHandler = element.props[key as keyof ButtonProps];
			callbacks[key] = (...args: unknown[]) => {
				if (typeof childHandler === 'function') {
					(childHandler as (...values: unknown[]) => void)(...args);
				}
				parentHandler(...args);
			};
		}
		const getLabel = () => {
			const content = element.props.children ?? element.props.label;
			if (typeof content === 'string' || typeof content === 'number') return String(content);
			return element.props['aria-label'] ?? element.props.label ?? element.props.tooltip;
		};
		return React.cloneElement(element, {
			// Leave padding and label adjustment to Button so icon/content defaults stay aligned.
			variant: element.props.variant ?? 'outline',
			textSize: element.props.textSize ?? 'm',
			paddingTop: element.props.paddingTop ?? defaultVerticalPadding,
			paddingBottom: element.props.paddingBottom ?? defaultVerticalPadding,
			backgroundColor,
			backgroundColorHover: getHoverBackground(),
			textColor: element.props.textColor ?? 'var(--core-text-secondary)',
			iconColor: element.props.iconColor ?? 'var(--core-text-secondary)',
			textColorHover: element.props.textColorHover ?? 'var(--core-text-primary)',
			iconColorHover: element.props.iconColorHover ?? 'var(--core-text-primary)',
			...shared,
			buttonSize: getChildSize(element.props),
			...callbacks,
			onClick: (event) => {
				element.props.onClick?.(event);
				onClick?.(event, { index, label: getLabel(), id: element.props.id });
			},
			borderRadius: 0,
			borderWidth: 0,
			round: false,
			width: vertical ? '100%' : element.props.width,
		});
	};

	return (
		<div
			role="group"
			{...wrapper}
			className={`${css.wrapper} ${vertical ? css.vertical : css.horizontal}${className ? ` ${className}` : ''}`}
			style={
				{
					...style,
					flexDirection: vertical ? 'column' : 'row',
					width: width === 'fill' ? '100%' : (width ?? 'max-content'),
					// Translucent borders composite over the surface, matching PopMenu.
					backgroundColor: wrapperBackgroundColor,
					'--ui-button-bar-inset': typeof resolvedInset === 'number' ? `${resolvedInset}px` : resolvedInset,
					borderRadius: resolvedBorderRadius,
					borderWidth,
					'--ui-button-bar-border-color': borderColor,
					'--ui-button-bar-border-color-focused': borderColorFocused,
					borderStyle,
				} as React.CSSProperties
			}
		>
			{elements.map((element, index) => {
				return (
					<React.Fragment key={element.key ?? index}>
						{divider && index > 0 && (
							<span
								aria-hidden="true"
								className={css.divider}
								style={{
									borderColor: dividerColor,
									opacity: dividerOpacity,
									borderStyle: dividerStyle,
									borderTopWidth: vertical ? dividerWidth : 0,
									borderLeftWidth: vertical ? 0 : dividerWidth,
								}}
							/>
						)}
						{renderChild(element, index)}
					</React.Fragment>
				);
			})}
		</div>
	);
});
