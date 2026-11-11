'use client';

import { motion } from 'motion/react';
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { corners } from '../../theme/corners/corners';
import { setStyle as resolveStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { Badge } from '../Badge';
import { Dot } from '../Dot';
import { Icon } from '../Icon';
import { ProgressIndicator } from '../Progress';
import { ToolTipType, buttonStyleDefaults } from '../sharedTypes';
import css from './Button.module.css';
import type { ButtonHandle, ButtonProps } from './_types';

const ButtonComponent = forwardRef<ButtonHandle, ButtonProps>((rawProps, buttonRef: React.Ref<ButtonHandle>) => {
	const props = resolveColorProps(rawProps);
	const {
		children,
		disabled = false,
		onMouseEnter,
		onMouseLeave,
		onFocus,
		onBlur,
		buttonSize = 'm',
		gap = buttonStyleDefaults.gap,
		padding,
		paddingTop,
		paddingBottom,
		variant = 'outline',
		label = undefined,
		textSize = 'm',
		iconRight = undefined,
		iconLeft = undefined,
		iconFill = false,
		count = props.count === undefined ? undefined : Number(props.count),
		showDot = undefined,
		tooltip = undefined,
		round = false,
		state = 'normal',
		fill = false,
		iconSize = props.iconSize === undefined ? 20 : Number(props.iconSize),
		width = 'min-content',
		underline = false,
		borderRadius = undefined,
		borderWidth = undefined,
		borderColor = undefined,
		iconColor = undefined,
		backgroundColor = undefined,
		backgroundColorDisabled = undefined,
		textColor = undefined,
		transition = undefined,
		variants = undefined,
		initial = undefined,
		animate = undefined,
		exit = undefined,
		paddingRight = undefined,
		paddingLeft = undefined,
		progress = false,
		working = false,
		duration = undefined,
		trigger = false,
		destructive = false,
		link,
		target = '_self',
		onClick,
		onToolTip,
		...divAttributes
	} = props;
	const { id: divId, className, style, ...rest } = divAttributes;
	const divStyle = style ?? ({} as React.CSSProperties);
	const divClass = className ? ` ${className}` : '';
	const resolvedBackgroundColor = backgroundColor;
	const resolvedBackgroundColorDisabled = backgroundColorDisabled;

	const [hovered, setHovered] = useState(false);
	const hoveredRef = useRef(false);
	const focusedRef = useRef(false);
	const isDisabled = disabled || state === 'disabled';
	const btnState = isDisabled ? 'disabled' : hovered || state === 'hover' ? 'hover' : 'normal';
	const [lockedWidth, setLockedWidth] = useState<number | undefined>(undefined);
	const [timedWorking, setTimedWorking] = useState(false);
	const playing = working || timedWorking;
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const inFlight = useRef(false);
	const wasTriggered = useRef(false);
	const replayTimedTrigger = useRef(false);
	const latestAction = useRef({ onClick, isDisabled, working });
	useEffect(() => {
		latestAction.current = { onClick, isDisabled, working };
	}, [onClick, isDisabled, working]);
	const ref = useRef<HTMLButtonElement | null>(null);

	// capture the rendered button width before swapping content during loading
	const lockCurrentWidth = useCallback(() => {
		if (!ref.current) return;
		setLockedWidth(ref.current.offsetWidth);
	}, []);

	// Cancel a deferred action when disabled, externally working, or unmounted.
	useEffect(() => {
		if ((isDisabled || working) && timer.current !== null) {
			clearTimeout(timer.current);
			timer.current = null;
			inFlight.current = false;
			setTimedWorking(false);
		}
	}, [isDisabled, working]);
	useEffect(
		() => () => {
			// Strict Mode replays mount effects: reschedule a canceled timed trigger without repeating immediate actions.
			replayTimedTrigger.current = timer.current !== null && wasTriggered.current;
			if (timer.current !== null) clearTimeout(timer.current);
			timer.current = null;
			inFlight.current = false;
		},
		[],
	);

	const handleClick = useCallback(
		(event: React.MouseEvent<HTMLButtonElement> | undefined) => {
			if (isDisabled || working || inFlight.current) return;
			onToolTip?.(null);
			if (progress && duration !== undefined && Number.isFinite(duration) && duration > 0) {
				// Timed progress defers the action, including preventing an immediate native form submission.
				event?.preventDefault();
				lockCurrentWidth();
				inFlight.current = true;
				setTimedWorking(true);
				timer.current = setTimeout(() => {
					timer.current = null;
					inFlight.current = false;
					setTimedWorking(false);
					if (!latestAction.current.isDisabled && !latestAction.current.working)
						latestAction.current.onClick?.(undefined);
				}, duration * 1000);
				return;
			}
			onClick?.(event);
			if (link && !event?.defaultPrevented && globalThis.window !== undefined) globalThis.window.open(link, target);
		},
		[isDisabled, working, onToolTip, progress, duration, lockCurrentWidth, onClick, link, target],
	);

	useEffect(() => {
		if (working) lockCurrentWidth();
	}, [working, lockCurrentWidth]);

	useEffect(() => {
		if (!playing) setLockedWidth(undefined);
	}, [playing]);

	useImperativeHandle(buttonRef, () => ({ triggerClick: () => handleClick(undefined) }), [handleClick]);

	useEffect(() => {
		if (trigger && (!wasTriggered.current || replayTimedTrigger.current)) {
			wasTriggered.current = true;
			replayTimedTrigger.current = false;
			handleClick(undefined);
		} else if (!trigger) wasTriggered.current = false;
	}, [trigger, handleClick]);

	// resolve destructive text and icon colors for the current state
	const destructiveColor = useCallback(
		(icon: boolean) => {
			if (icon) {
				if (btnState === 'disabled') return 'var(--core-text-disabled)';
				if (variant === 'solid') return 'var(--core-text-light)';
			}
			if (destructive) return 'var(--feedback-warning)';
			return 'var(--core-text-primary)';
		},
		[destructive, variant, btnState],
	);

	// resolve color tokens for the solid button variant
	const solid = useMemo(() => {
		return {
			border: '0px',
			iconColor: {
				normal: iconColor || destructiveColor(true),
				hover: iconColor || destructiveColor(true),
				disabled: iconColor || destructiveColor(true),
			},
			background: {
				normal: resolvedBackgroundColor || (destructive ? 'var(--feedback-warning)' : 'var(--core-button-primary)'),
				hover: resolvedBackgroundColor || (destructive ? 'var(--feedback-warning)' : 'var(--core-button-primary)'),
				disabled: resolvedBackgroundColorDisabled || 'var(--core-button-disabled)',
			},
			borderColor: {
				normal: 'transparent',
				hover: 'transparent',
				disabled: 'transparent',
			},
			color: {
				normal: textColor || (destructive ? 'white' : 'var(--core-text-light)'),
				hover: textColor || (destructive ? 'white' : 'var(--core-text-light)'),
				disabled: 'var(--core-text-disabled)',
			},
		};
	}, [textColor, destructive, destructiveColor, resolvedBackgroundColor, resolvedBackgroundColorDisabled, iconColor]);

	// resolve color tokens for the outline button variant
	const outline = useMemo(() => {
		return {
			border: '1px',
			iconColor: {
				normal: iconColor || destructiveColor(true),
				hover: iconColor || destructiveColor(true),
				disabled: iconColor || destructiveColor(true),
			},
			background: {
				normal: resolvedBackgroundColor || 'var(--core-surface-primary)',
				hover: resolvedBackgroundColor || 'var(--core-surface-primary)',
				disabled: resolvedBackgroundColorDisabled || 'var(--core-surface-primary)',
			},
			borderColor: {
				normal: destructive ? 'var(--feedback-warning)' : 'var(--core-outline-primary)',
				hover: destructive ? 'var(--feedback-warning)' : 'var(--core-outline-primary)',
				disabled: 'var(--core-outline-primary)',
			},
			color: {
				normal: textColor || (destructive ? 'var(--feedback-warning)' : 'var(--core-text-primary)'),
				hover: textColor || (destructive ? 'var(--feedback-warning)' : 'var(--core-text-special)'),
				disabled: 'var(--core-text-disabled)',
			},
		};
	}, [textColor, destructive, destructiveColor, resolvedBackgroundColor, resolvedBackgroundColorDisabled, iconColor]);

	// resolve color tokens for the text button variant
	const text = useMemo(() => {
		return {
			border: '1px',
			iconColor: {
				normal: iconColor || destructiveColor(true),
				hover: iconColor || destructiveColor(true),
				disabled: iconColor || 'var(--core-text-disabled)',
			},
			background: {
				normal: resolvedBackgroundColor || 'transparent',
				hover: resolvedBackgroundColor || 'transparent',
				disabled: resolvedBackgroundColorDisabled || 'transparent',
			},
			borderColor: {
				normal: 'transparent',
				hover: 'transparent',
				disabled: 'transparent',
			},
			color: {
				normal: textColor || destructiveColor(false),
				hover: textColor || destructiveColor(false),
				disabled: 'var(--core-text-disabled)',
			},
		};
	}, [destructiveColor, textColor, iconColor, resolvedBackgroundColor, resolvedBackgroundColorDisabled]);

	// group variant-specific color styles into a single lookup map
	const colorStyles = useMemo(() => {
		return {
			solid,
			outline,
			text,
		};
	}, [solid, outline, text]);

	const resolvedBorderWidth = resolveStyle(borderWidth, colorStyles[variant].border);
	const resolvedBorderColor = borderColor ?? colorStyles[variant].borderColor[btnState];
	const autoSize = buttonSize === 'auto';
	const getHeight = () => {
		if (autoSize) return 'auto';
		if (typeof buttonSize === 'number') {
			if (Number.isFinite(buttonSize) && buttonSize > 0) return buttonSize;
			return buttonStyleDefaults.sizes.m;
		}
		return buttonStyleDefaults.sizes[buttonSize] ?? buttonStyleDefaults.sizes.m;
	};
	const height = getHeight();
	const resolvedGap = Number.isFinite(gap) ? Math.max(0, gap) : buttonStyleDefaults.gap;
	const hasChildren = children !== undefined && children !== null;
	const verticalPadding = hasChildren || autoSize ? buttonStyleDefaults.padding.childrenTop : 0;
	const bottomPadding = hasChildren || autoSize ? buttonStyleDefaults.padding.childrenBottom : 0;
	const getSidePadding = (side: 'left' | 'right') => {
		if (padding !== undefined) return undefined;
		if (round) return 0;
		const base = variant === 'text' ? 'var(--spacing-xs)' : buttonStyleDefaults.padding.horizontal;
		const hasIcon = side === 'left' ? iconLeft : iconRight;
		if (hasIcon) return `calc(${base} - var(--spacing-xs))`;
		return base;
	};
	const roundWidth = autoSize
		? `calc(${iconSize + verticalPadding + bottomPadding}px + 2 * ${resolvedBorderWidth})`
		: height;

	const handleMouseEnter = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			onMouseEnter?.(event);
			if (isDisabled) return;
			hoveredRef.current = true;
			setHovered(true);
			if (tooltip) onToolTip?.({ type: ToolTipType.button, payload: { label: tooltip }, event, ref });
		},
		[onMouseEnter, isDisabled, tooltip, onToolTip],
	);
	const handleMouseLeave = useCallback(
		(event: React.MouseEvent<HTMLButtonElement>) => {
			onMouseLeave?.(event);
			hoveredRef.current = false;
			setHovered(false);
			if (tooltip && !focusedRef.current) onToolTip?.(null);
		},
		[onMouseLeave, tooltip, onToolTip],
	);
	const handleFocus = useCallback(
		(event: React.FocusEvent<HTMLButtonElement>) => {
			onFocus?.(event);
			focusedRef.current = true;
			if (tooltip && !isDisabled) onToolTip?.({ type: ToolTipType.button, payload: { label: tooltip }, ref });
		},
		[onFocus, tooltip, isDisabled, onToolTip],
	);
	const handleBlur = useCallback(
		(event: React.FocusEvent<HTMLButtonElement>) => {
			onBlur?.(event);
			focusedRef.current = false;
			if (tooltip && !hoveredRef.current) onToolTip?.(null);
		},
		[onBlur, tooltip, onToolTip],
	);

	const buttonContent = children ?? label;

	const hasContent =
		buttonContent !== undefined && buttonContent !== null && buttonContent !== false && buttonContent !== '';
	// normalize style values before applying them as CSS
	const setStyle = useCallback((value: string | number | undefined) => {
		if (value === undefined) return 'unset';
		if (typeof value === 'number') return `${value}px`;
		return value;
	}, []);

	// calc width and memo
	const setWidth = useMemo(() => {
		if (playing && lockedWidth && width === 'min-content') return setStyle(lockedWidth);
		if (width === 'fill') return '100%';
		if (width && width !== 'fill') return setStyle(width);
		return 'min-content';
	}, [playing, lockedWidth, width, setStyle]);

	// Explicit padding wins over optical defaults; auto releases all height constraints.
	const resolvedPaddingRight = paddingRight ?? getSidePadding('right');
	const resolvedPaddingLeft = paddingLeft ?? getSidePadding('left');
	const buttonStyle = {
		color: colorStyles[variant].color[btnState],
		backgroundColor: fill && !isDisabled ? 'var(--core-surface-primary)' : colorStyles[variant].background[btnState],
		backgroundClip: 'padding-box' as const,
		...(resolvedPaddingRight === undefined ? {} : { paddingRight: resolvedPaddingRight }),
		...(resolvedPaddingLeft === undefined ? {} : { paddingLeft: resolvedPaddingLeft }),
		...(paddingTop === undefined ? {} : { paddingTop }),
		...(paddingBottom === undefined ? {} : { paddingBottom }),
		borderRadius: borderRadius ?? corners['corner-round'],
		height,
		maxHeight: autoSize ? 'unset' : height,
		minHeight: autoSize ? 0 : height,
		flex: width === 'fill' ? 1 : 'unset',
		width: round && width === 'min-content' ? roundWidth : setWidth,
		maxWidth: round && width === 'min-content' ? 'unset' : setWidth,
		minWidth: 0,
		gap: resolvedGap,
		borderWidth: resolvedBorderWidth,
		borderStyle: 'solid' as const,
		borderColor: resolvedBorderColor,
		cursor: isDisabled || playing ? ('default' as const) : ('pointer' as const),
		transition: 'all var(--motion-water-duration) var(--motion-water) 0s',
	};

	// resolve the progress indicator color from variant and destructive state
	const progressColor = useMemo(
		() => (destructive ? 'var(--feedback-warning)' : colorStyles[variant].color[btnState]),
		[destructive, colorStyles, variant, btnState],
	);

	// resolve the icon container size from the current shape and icon size
	const iconDivSize = useMemo(() => {
		if (round) return setStyle(iconSize);
		return iconSize ? setStyle(iconSize) : 'unset';
	}, [round, iconSize, setStyle]);

	// compose CSS custom properties for decoration and icon sizing
	const cssVars = useMemo(() => {
		const getPadding = () => {
			if (typeof padding === 'number') return `${padding}px`;
			if (padding !== undefined) return padding;
			if (round && !autoSize) return '0px';
			return `${verticalPadding}px 0 ${bottomPadding}px`;
		};
		return {
			'--ui-button-decoration': underline ? 'underline' : 'unset',
			'--ui-button-icon-size': iconDivSize,
			'--ui-button-gap': `${resolvedGap}px`,
			'--ui-button-padding': getPadding(),
		} as React.CSSProperties;
	}, [underline, iconDivSize, resolvedGap, padding, round, autoSize, verticalPadding, bottomPadding]);

	/* START.DEBUG */
	useTrackRenders(props, 'Button');
	/* END.DEBUG */

	return (
		<motion.button
			id={divId}
			type="button"
			className={`${css.button}  ${css[textSize]}${divClass}`}
			ref={ref}
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			onFocus={handleFocus}
			onBlur={handleBlur}
			style={{ ...divStyle, ...buttonStyle, ...cssVars }}
			transition={transition}
			variants={variants}
			initial={initial}
			animate={animate}
			exit={exit}
			onClick={(e) => handleClick(e)}
			{...rest}
			disabled={isDisabled || playing}
			aria-disabled={isDisabled || playing}
			aria-busy={playing}
		>
			{!playing && iconLeft && (
				<div className={css.icon} aria-hidden="true">
					<Icon
						name={iconLeft}
						size={iconSize}
						strokeColor={colorStyles[variant].iconColor[btnState]}
						pointer={false}
						tabIndex={-1}
						fill={iconFill}
					/>
				</div>
			)}
			{playing && iconLeft && (
				<div className={css.icon} aria-hidden="true">
					<ProgressIndicator decorative show={playing} size={iconSize} color={progressColor} inline />
				</div>
			)}
			{playing && !iconLeft && !iconRight && (
				<div className={css.centerProgress} aria-hidden="true">
					<ProgressIndicator decorative show={playing} size={iconSize} color={progressColor} inline={false} />
				</div>
			)}
			{hasContent && (
				<div
					className={`${css.label}${hasChildren ? ` ${css.children}` : ''}${playing && !iconLeft && !iconRight ? ` ${css.labelHidden}` : ''}`}
				>
					{buttonContent}
				</div>
			)}
			{playing && iconRight && (
				<div className={css.icon} aria-hidden="true">
					<ProgressIndicator decorative show={playing} size={iconSize} color={progressColor} inline />
				</div>
			)}
			{!playing && iconRight && (
				<div className={css.icon} aria-hidden="true">
					<Icon
						name={iconRight}
						size={iconSize}
						strokeColor={colorStyles[variant].iconColor[btnState]}
						pointer={false}
						tabIndex={-1}
						fill={iconFill}
					/>
				</div>
			)}
			<Dot show={!playing && showDot} />
			{!playing && count !== undefined && count !== 0 && (
				<div className={css.count}>
					<Badge variant={'light'} count={count} aria-live="off" />
				</div>
			)}
		</motion.button>
	);
});

ButtonComponent.displayName = 'Button';

export const Button = React.memo(ButtonComponent);
