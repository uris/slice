'use client';

import { motion } from 'motion/react';
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
	useState,
} from 'react';
import { useTrackRenders } from '../../hooks/useTrackRenders/useTrackRenders';
import { Badge } from '../Badge';
import { Dot } from '../Dot';
import { Icon } from '../Icon';
import { ProgressIndicator } from '../Progress';
import { ToolTipType } from '../sharedTypes';
import type { ToolTip } from '../sharedTypes';
import css from './Button.module.css';
import type { ButtonHandle, ButtonProps } from './_types';

const ButtonComponent = forwardRef<ButtonHandle, ButtonProps>(
	(props, buttonRef: React.Ref<ButtonHandle>) => {
		const {
			children,
			size = 'medium',
			variant = 'outline',
			label = undefined,
			labelSize = 'm',
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
			iconColor = undefined,
			backgroundColor = undefined,
			backgroundColorDisabled = undefined,
			bgColor = undefined,
			bgColorDisabled = undefined,
			labelColor = undefined,
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
			onClick = () => null,
			onToolTip = () => null,
			...divAttributes
		} = props;
		const { id: divId, className, style, ...rest } = divAttributes;
		const divStyle = style ?? ({} as React.CSSProperties);
		const divClass = className ? ` ${className}` : '';
		const resolvedBackgroundColor = backgroundColor ?? bgColor;
		const resolvedBackgroundColorDisabled =
			backgroundColorDisabled ?? bgColorDisabled;

		const [btnState, setBtnState] = useState<'normal' | 'hover' | 'disabled'>(
			state,
		);
		const [lockedWidth, setLockedWidth] = useState<number | undefined>(
			undefined,
		);
		const [playing, setPlaying] = useState<boolean>(working);
		const ref = useRef<HTMLButtonElement | null>(null);

		// capture the rendered button width before swapping content during loading
		const lockCurrentWidth = useCallback(() => {
			if (!ref.current) return;
			setLockedWidth(ref.current.offsetWidth);
		}, []);

		// handle clicks, trigger tooltip cleanup, and start progress mode when needed
		const handleClick = useCallback(
			(e: React.MouseEvent<any> | undefined) => {
				onToolTip(null);
				if (btnState === 'disabled') return;
				if (progress && duration) {
					lockCurrentWidth();
					setPlaying(true);
				} else {
					if (link && globalThis.window !== undefined) {
						globalThis.window.open(link, target);
					}
					onClick(e);
				}
			},
			[
				onToolTip,
				btnState,
				progress,
				duration,
				lockCurrentWidth,
				onClick,
				link,
				target,
			],
		);

		// sync the visual button state from the controlled prop
		useEffect(() => setBtnState(state), [state]);

		// sync the progress indicator from the controlled working flag
		useEffect(() => {
			if (working) lockCurrentWidth();
			else setLockedWidth(undefined);
			setPlaying(working);
		}, [working, lockCurrentWidth]);

		// expose the click trigger through the forwarded ref
		useImperativeHandle(buttonRef, () => ({
			triggerClick: () => handleClick(undefined),
		}));

		// trigger a programmatic click when the trigger prop flips on
		useEffect(() => {
			if (trigger) handleClick(undefined);
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
					normal:
						resolvedBackgroundColor ||
						(destructive
							? 'var(--feedback-warning)'
							: 'var(--core-button-primary)'),
					hover:
						resolvedBackgroundColor ||
						(destructive
							? 'var(--feedback-warning)'
							: 'var(--core-button-primary)'),
					disabled:
						resolvedBackgroundColorDisabled || 'var(--core-button-disabled)',
				},
				borderColor: {
					normal: 'transparent',
					hover: 'transparent',
					disabled: 'transparent',
				},
				color: {
					normal:
						labelColor || (destructive ? 'white' : 'var(--core-text-light)'),
					hover:
						labelColor || (destructive ? 'white' : 'var(--core-text-light)'),
					disabled: 'var(--core-text-disabled)',
				},
			};
		}, [
			labelColor,
			destructive,
			destructiveColor,
			resolvedBackgroundColor,
			resolvedBackgroundColorDisabled,
			iconColor,
		]);

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
					disabled:
						resolvedBackgroundColorDisabled || 'var(--core-surface-primary)',
				},
				borderColor: {
					normal: destructive
						? 'var(--feedback-warning)'
						: 'var(--core-outline-primary)',
					hover: destructive
						? 'var(--feedback-warning)'
						: 'var(--core-outline-primary)',
					disabled: 'var(--core-outline-primary)',
				},
				color: {
					normal:
						labelColor ||
						(destructive
							? 'var(--feedback-warning)'
							: 'var(--core-text-primary)'),
					hover:
						labelColor ||
						(destructive
							? 'var(--feedback-warning)'
							: 'var(--core-text-special)'),
					disabled: 'var(--core-text-disabled)',
				},
			};
		}, [
			labelColor,
			destructive,
			destructiveColor,
			resolvedBackgroundColor,
			resolvedBackgroundColorDisabled,
			iconColor,
		]);

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
					normal: 'transparent',
					hover: 'transparent',
					disabled: 'transparent',
				},
				borderColor: {
					normal: 'transparent',
					hover: 'transparent',
					disabled: 'transparent',
				},
				color: {
					normal: labelColor || destructiveColor(false),
					hover: labelColor || destructiveColor(false),
					disabled: 'var(--core-text-disabled)',
				},
			};
		}, [destructiveColor, labelColor, iconColor]);

		// group variant-specific color styles into a single lookup map
		const colorStyles = useMemo(() => {
			return {
				solid,
				outline,
				text,
			};
		}, [solid, outline, text]);

		// resolve side-specific padding based on shape and icon placement
		const setPadding = useCallback(
			(side: 'left' | 'right') => {
				if (round) return 0;
				let padding = 20;
				if (variant === 'text') padding = 0;
				if (size === 'small') padding = 12;
				if (side === 'left' && iconLeft) return padding;
				if (side === 'right' && iconRight) return padding;
				return padding + 4;
			},
			[round, variant, size, iconLeft, iconRight],
		);

		// resolve dimensions and spacing for each button size
		const sizingStyles = useMemo(() => {
			return {
				large: {
					height: 48,
					gap: 8,
					iconSize,
					paddingLeft: setPadding('left'),
					paddingRight: setPadding('right'),
					paddingTop: 0,
					paddingBottom: 0,
					borderRadius: borderRadius ?? '500px',
				},
				medium: {
					height: 36,
					gap: 8,
					iconSize,
					paddingLeft: setPadding('left'),
					paddingRight: setPadding('right'),
					paddingTop: 0,
					paddingBottom: 0,
					borderRadius: borderRadius ?? '500px',
				},
				small: {
					height: 'auto',
					gap: 8,
					iconSize,
					paddingLeft: setPadding('left'),
					paddingRight: setPadding('right'),
					paddingTop: 4,
					paddingBottom: 4,
					borderRadius: borderRadius ?? '500px',
				},
			};
		}, [iconSize, borderRadius, setPadding]);

		// update hover state and surface tooltip content on pointer entry
		const handleMouseEnter = useCallback(
			(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
				if (btnState !== 'disabled') setBtnState('hover');
				if (!ref?.current || !tooltip) return;
				const tip: ToolTip = {
					type: ToolTipType.button,
					payload: { label: tooltip },
					event: e,
					ref,
				};
				onToolTip(tip);
			},
			[btnState, tooltip, onToolTip],
		);

		// restore the resting state and clear tooltip content on pointer exit
		const handleMouseLeave = useCallback(() => {
			if (btnState !== 'disabled') setBtnState('normal');
			if (tooltip) onToolTip(null);
		}, [btnState, tooltip, onToolTip]);

		// finish progress mode and forward the completed click event
		const handleDidStop = useCallback(() => {
			setPlaying(false);
			setLockedWidth(undefined);
			onClick(undefined);
		}, [onClick]);

		const buttonContent = children ?? label;

		// hide the label only while a center progress indicator is shown
		const shouldShowLabel = useMemo(
			() => !(playing && !iconLeft && !iconRight) && Boolean(buttonContent),
			[playing, iconLeft, iconRight, buttonContent],
		);

		// normalize style values before applying them as CSS
		const setStyle = useCallback((value: string | number | undefined) => {
			if (value === undefined) return 'unset';
			if (typeof value === 'number') return `${value}px`;
			return value;
		}, []);

		// calc width and memo
		const setWidth = useMemo(() => {
			if (playing && lockedWidth && width === 'min-content')
				return setStyle(lockedWidth);
			if (width && width !== 'fill') return setStyle(width);
			return 'min-content';
		}, [playing, lockedWidth, width, setStyle]);

		// compose the resolved inline styles for the active variant and size
		const buttonStyle = useMemo(
			() => ({
				color: colorStyles[variant].color[btnState],
				background: fill
					? 'var(--core-surface-primary)'
					: colorStyles[variant].background[state],
				paddingRight: paddingRight ?? sizingStyles[size].paddingRight,
				paddingLeft: paddingLeft ?? sizingStyles[size].paddingLeft,
				paddingTop: variant === 'text' ? 0 : sizingStyles[size].paddingTop,
				paddingBottom:
					variant === 'text' ? 0 : sizingStyles[size].paddingBottom,
				borderRadius: sizingStyles[size].borderRadius,
				height: sizingStyles[size].height,
				maxHeight: sizingStyles[size].height,
				minHeight: sizingStyles[size].height,
				flex: width === 'fill' ? 1 : 'unset',
				width: setWidth,
				maxWidth: setWidth,
				gap: sizingStyles[size].gap,
				borderWidth: colorStyles[variant].border,
				borderStyle: 'solid' as const,
				borderColor: colorStyles[variant].borderColor[btnState],
				cursor:
					state === 'disabled' ? ('default' as const) : ('pointer' as const),
				transition: 'all var(--motion-water-duration) var(--motion-water) 0s',
			}),
			[
				colorStyles,
				variant,
				btnState,
				fill,
				state,
				paddingRight,
				paddingLeft,
				sizingStyles,
				size,
				setWidth,
				width,
			],
		);

		// resolve the progress indicator color from variant and destructive state
		const progressColor = useMemo(
			() =>
				destructive
					? 'var(feedback-warning)'
					: colorStyles[variant].color[btnState],
			[destructive, colorStyles, variant, btnState],
		);

		// resolve the icon container size from the current shape and icon size
		const iconDivSize = useMemo(() => {
			if (round) return `${buttonStyle.minHeight}px`;
			return iconSize ? setStyle(iconSize) : 'unset';
		}, [round, iconSize, buttonStyle, setStyle]);

		// compose CSS custom properties for decoration and icon sizing
		const cssVars = useMemo(() => {
			return {
				'--ui-button-decoration': underline ? 'underline' : 'unset',
				'--ui-button-icon-size': iconDivSize,
			} as React.CSSProperties;
		}, [underline, iconDivSize]);

		/* START.DEBUG */
		useTrackRenders(props, 'Button');
		/* END.DEBUG */

		return (
			<motion.button
				id={divId}
				type="button"
				className={`${css.button}  ${css[labelSize]}${divClass}`}
				ref={ref}
				onMouseEnter={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				style={{ ...divStyle, ...buttonStyle, ...cssVars }}
				transition={transition}
				variants={variants}
				initial={initial}
				animate={animate}
				exit={exit}
				onClick={(e) => handleClick(e)}
				disabled={btnState === 'disabled'}
				aria-disabled={btnState === 'disabled'}
				{...(rest as any)}
			>
				{!playing && iconLeft && (
					<div className={css.icon}>
						<Icon
							name={iconLeft}
							size={sizingStyles[size].iconSize}
							strokeColor={colorStyles[variant].iconColor[btnState]}
							pointer={btnState !== 'disabled'}
							fill={iconFill}
						/>
					</div>
				)}
				{playing && iconLeft && (
					<div className={css.icon}>
						<ProgressIndicator
							show={playing}
							didStop={handleDidStop}
							duration={duration}
							size={sizingStyles[size].iconSize}
							color={progressColor}
							inline
						/>
					</div>
				)}
				{playing && !iconLeft && !iconRight && (
					<div className={css.icon}>
						<ProgressIndicator
							show={playing}
							didStop={handleDidStop}
							duration={duration}
							size={sizingStyles[size].iconSize}
							color={progressColor}
							inline={false}
						/>
					</div>
				)}
				{shouldShowLabel && <div className={css.label}>{buttonContent}</div>}
				{playing && iconRight && (
					<div className={css.icon}>
						<ProgressIndicator
							show={playing}
							didStop={handleDidStop}
							duration={duration}
							size={sizingStyles[size].iconSize}
							color={progressColor}
							inline
						/>
					</div>
				)}
				{!playing && iconRight && (
					<div className={css.icon}>
						<Icon
							name={iconRight}
							size={sizingStyles[size].iconSize}
							strokeColor={colorStyles[variant].iconColor[btnState]}
							pointer={btnState !== 'disabled'}
							fill={iconFill}
						/>
					</div>
				)}
				<Dot show={!playing && showDot} />
				{!playing && count && (
					<div className={css.count}>
						<Badge variant={'light'} count={Number(count)} />
					</div>
				)}
			</motion.button>
		);
	},
);

ButtonComponent.displayName = 'Button';

export const Button = React.memo(ButtonComponent);
