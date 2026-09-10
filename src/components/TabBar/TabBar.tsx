'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../hooks';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { setStyle } from '../../utils/functions/misc';
import { Badge } from '../Badge';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { type ToolTip, ToolTipType } from '../sharedTypes';
import css from './TabBar.module.css';
import type { TabBarProps, TabOption, TabOptionProps } from './_types';
import { placeholderOptions } from './_types';

export const TabBar = React.memo((props: TabBarProps) => {
	const {
		options = placeholderOptions,
		selected = 0,
		border = true,
		underline = true,
		height = '100%',
		width = '100%',
		tabWidth = 'fill',
		padding = 8,
		iconFill = false,
		iconSize = 20,
		iconGap = 8,
		tabGap = 0,
		disabled = false,
		hasClose = false,
		closeWidth = 'auto',
		selectedValue = null,
		justify = 'start',
		borderColor = 'var(--core-outline-secondary)',
		textSize = 'm',
		onChange = () => null,
		onTabChange = () => null,
		onClose = () => null,
		onToolTip = () => null,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';

	const [index, setIndex] = useState<number>(selected);
	const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

	// sync the active tab from the controlled index or selected value
	useEffect(() => {
		let selectedIndex = 0;
		if (selectedValue && options) {
			selectedIndex = options.findIndex((option) => option.value === selectedValue);
			setIndex(selectedIndex === -1 ? selected : selectedIndex);
		} else {
			setIndex(selected);
		}
	}, [selected, selectedValue, options]);

	// update the active tab and notify both tab change callbacks
	const handleClick = useCallback(
		(i: number) => {
			setIndex(i);
			onChange(i);
			onTabChange(options[i]);
		},
		[onChange, onTabChange, options],
	);

	// clear any active tooltip before switching tabs
	const handleOptionClick = useCallback(
		(i: number) => {
			onToolTip(null);
			handleClick(i);
		},
		[onToolTip, handleClick],
	);

	const focusOption = useCallback((nextIndex: number) => {
		optionRefs.current[nextIndex]?.focus();
	}, []);

	const handleOptionKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLButtonElement>, optionIndex: number) => {
			if (options.length < 1) return;
			let nextIndex: number | null = null;
			switch (event.key) {
				case 'ArrowRight':
				case 'ArrowDown':
					nextIndex = (optionIndex + 1) % options.length;
					break;
				case 'ArrowLeft':
				case 'ArrowUp':
					nextIndex = (optionIndex - 1 + options.length) % options.length;
					break;
				case 'Home':
					nextIndex = 0;
					break;
				case 'End':
					nextIndex = options.length - 1;
					break;
				default:
					break;
			}
			if (nextIndex === null) return;
			event.preventDefault();
			handleOptionClick(nextIndex);
			focusOption(nextIndex);
		},
		[options.length, handleOptionClick, focusOption],
	);

	// derive the rendered tab options from the options list
	const renderedOptions = useMemo(
		() =>
			options.map((option: TabOption, i: number) => (
				<Option
					key={`${i}_option_${option.name}`}
					label={option.name}
					value={i}
					showToolTip={option.toolTip}
					selected={i === index}
					padding={padding}
					icon={option.icon}
					iconSize={iconSize}
					iconGap={iconGap}
					disabled={disabled}
					count={option.count}
					onClick={handleOptionClick}
					onKeyDown={handleOptionKeyDown}
					onToolTip={onToolTip}
					underline={underline}
					iconFill={iconFill}
					tabWidth={tabWidth}
					textSize={textSize}
					borderColor={borderColor}
					buttonRef={(element) => {
						optionRefs.current[i] = element;
					}}
				/>
			)),
		[
			options,
			index,
			padding,
			iconSize,
			iconGap,
			disabled,
			underline,
			tabWidth,
			onToolTip,
			handleOptionClick,
			iconFill,
			handleOptionKeyDown,
			borderColor,
			textSize,
		],
	);

	// compose CSS custom properties for tab bar layout and close control spacing
	const cssVars = useMemo(() => {
		return {
			'--tab-bar-gap': `${tabGap}px`,
			'--tab-bar-height': `${setStyle(height)}px`,
			'--tab-bar-width': setStyle(width),
			'--tab-bar-border-bottom': `${border ? '1px' : '0'}`,
			'--tab-bar-border-color': borderColor,
			'--tab-bar-justify': justify,
			'--tab-bar-close-width': `${closeWidth}px`,
			'--tab-bar-close-padding': setStyle(padding, '8px'),
		} as React.CSSProperties;
	}, [tabGap, height, width, border, closeWidth, padding, borderColor, justify]);

	return (
		<div
			id={divId}
			className={`${css.wrapper}${divClass}`}
			style={{ ...divStyle, ...cssVars }}
			role="tablist"
			aria-orientation="horizontal"
			{...rest}
		>
			{renderedOptions}
			{hasClose && (
				<div className={css.close}>
					<IconButton
						iconSize={iconSize - 4}
						frameSize={iconSize}
						toggle={false}
						hover={true}
						icon={'x'}
						onClick={onClose}
						iconFill={iconFill}
					/>
				</div>
			)}
		</div>
	);
});

TabBar.displayName = 'TabBar';

const Option = React.memo(
	(props: TabOptionProps) => {
		const theme = useTheme();
		const {
			label = 'Option',
			value = 0,
			icon = null,
			selected = false,
			onClick = () => null,
			onToolTip = () => null,
			padding = 8,
			iconSize = 20,
			iconGap = 6,
			disabled = false,
			showToolTip = null,
			underline = true,
			tabWidth = 'fill',
			borderColor = 'var(--core-outline-secondary)',
			count = 0,
			iconFill = false,
			textSize = 'm',
			onKeyDown = () => null,
			buttonRef,
		} = props;
		const ref = useRef<HTMLButtonElement>(null);

		// resolve the option icon color from selection and disabled state
		const strokeColor = useMemo(() => {
			if (!disabled && selected) return theme.current.colors['core-text-special'];
			if (disabled) return theme.current.colors['core-text-disabled'];
			return theme.current.colors['core-text-primary'];
		}, [disabled, selected, theme]);

		// show the option tooltip when the pointer enters the option
		const handleMouseOver = useCallback(
			(e: React.MouseEvent) => {
				onToolTip(null);
				if (showToolTip && ref.current) {
					const tip: ToolTip = {
						type: ToolTipType.button,
						payload: { label: showToolTip },
						event: e,
						ref,
					};
					onToolTip(tip);
				}
			},
			[showToolTip, onToolTip],
		);

		// clear tooltip state when the pointer leaves the option
		const handleMouseLeave = useCallback(() => {
			if (showToolTip) onToolTip(null);
		}, [showToolTip, onToolTip]);

		// resolve the option text color from selection and disabled state
		const textColor = useMemo(() => {
			if (disabled) return 'var(--core-text-disabled)';
			if (selected) return 'var(--core-text-special)';
			return 'var(--core-text-primary)';
		}, [disabled, selected]);

		// resolve the option width mode
		const setTabWidth = useMemo(() => {
			if (tabWidth === 'compact') return 'min-content';
			if (tabWidth === 'fill') return 'unset';
			return `${tabWidth}px`;
		}, [tabWidth]);

		// resolve the option flex mode
		const setTabFlex = useMemo(() => {
			if (tabWidth === 'fill') return '1';
			return 'unset';
		}, [tabWidth]);

		// resolve the underline visibility for the current option state
		const setUnderline = useMemo(() => {
			if (selected && underline && !disabled) return '1px';
			return '0';
		}, [underline, disabled, selected]);

		// compose CSS custom properties for option spacing, sizing, and color
		const cssVars = useMemo(() => {
			return {
				'--tab-bar-option-border': setUnderline,
				'--tab-bar-option-border-color': borderColor,
				'--tab-bar-option-padding': setStyle(padding, '8px'),
				'--tab-bar-option-icon-size': `${iconSize}px`,
				'--tab-bar-option-cursor': disabled ? 'default' : 'pointer',
				'--tab-bar-option-gap': `${iconGap ?? 0}px`,
				'--tab-bar-option-color': textColor,
				'--tab-bar-option-width': setTabWidth,
				'--tab-bar-option-flex': setTabFlex,
			} as React.CSSProperties;
		}, [padding, iconSize, disabled, textColor, iconGap, setTabFlex, setTabWidth, setUnderline, borderColor]);

		/* START.DEBUG */
		useTrackRenders(props, 'TabBar');
		/* END.DEBUG */

		return (
			<button
				type="button"
				className={`${css.option} ${css[textSize]} ${selected ? css.selected : ''}`}
				style={cssVars}
				ref={(element) => {
					ref.current = element;
					buttonRef?.(element);
				}}
				role="tab"
				aria-selected={selected}
				tabIndex={selected ? 0 : -1}
				onMouseEnter={handleMouseOver}
				onMouseLeave={handleMouseLeave}
				onClick={() => onClick(value)}
				onKeyDown={(e) => onKeyDown(e, value)}
			>
				{icon && (
					<div className={css.icon}>
						<Icon name={icon} fill={iconFill} size={iconSize} strokeColor={strokeColor} />
					</div>
				)}
				{label}
				{count !== 0 && <Badge variant={'light'} hideNull={false} count={count} />}
			</button>
		);
	},
	(prevProps, nextProps) => {
		// Custom comparison for performance
		return (
			prevProps.selected === nextProps.selected &&
			prevProps.underline === nextProps.underline &&
			prevProps.tabWidth === nextProps.tabWidth &&
			prevProps.disabled === nextProps.disabled &&
			prevProps.iconGap === nextProps.iconGap &&
			prevProps.iconSize === nextProps.iconSize &&
			prevProps.count === nextProps.count &&
			prevProps.label === nextProps.label &&
			prevProps.icon === nextProps.icon &&
			prevProps.borderColor === nextProps.borderColor &&
			prevProps.textSize === nextProps.textSize &&
			prevProps.padding === nextProps.padding
		);
	},
);

Option.displayName = 'TabOption';
