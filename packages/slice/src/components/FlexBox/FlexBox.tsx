'use client';

import { motion } from 'motion/react';
import React, { useCallback, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { setSizeStyle, setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { reduceMotionTarget, reduceMotionVariants } from '../../utils/styling/reduceMotionTargets';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import css from './FlexBox.module.css';
import { type FlexBoxProps, layoutSets } from './_types';

// Normalize width and height values before applying them inline.
function setSize(style: string | number | undefined, isHeight: boolean) {
	if (typeof style === 'number') return `${style}px`;
	if (style === 'grow') return 'unset';
	if (style === 'fill') return '100%';
	if (style === 'fit') return 'auto';
	if (style === 'viewport') return isHeight ? '100vh' : '100vw';
	return style;
}

function setPaddingRight(padding: string | number | undefined, scrollBox: boolean | undefined) {
	// Let the padding shorthand set every side when explicitly supplied.
	if (padding !== undefined) return undefined;
	if (scrollBox) return 'var(--spacing-xs)';
	return 'unset';
}

// Translate alignment shorthand into flexbox-compatible values.
function setFlex(style: string | undefined) {
	if (style === 'start' || style === 'top') return 'flex-start';
	if (style === 'end' || style === 'bottom') return 'flex-end';
	if (style === 'between') return 'space-between';
	return style;
}

export const FlexBox = React.memo(
	React.forwardRef<HTMLDivElement, FlexBoxProps>((rawProps, ref) => {
		const props = resolveColorProps(rawProps);
		const { current } = useTheme();
		const reducedMotion = usePrefersReducedMotion();
		const {
			children,
			preset = 'default',
			scrollY = undefined,
			scrollX = undefined,
			scrollBox = false,
			overflow,
			background = 'transparent',
			direction = undefined,
			align = undefined,
			justify = undefined,
			height = undefined,
			width = undefined,
			maxWidth = undefined,
			centerSelf = undefined,
			wrap = undefined,
			reverse = false,
			padding,
			margin = 0,
			absolute = false,
			flex,
			gap,
			variants,
			transition,
			animate,
			initial,
			layout,
			layoutId,
			whileHover,
			whileTap,
			whileFocus,
			whileDrag,
			whileInView,
			exit,
			border,
			borderRadius,
			className,
			scrollHandle,
			scrollHandleHover,
			shrinkChildren,
			growChildren,
			...divAttributes
		} = props;
		const { id: divId, style: userStyle, ...rest } = divAttributes;
		const wrapperStyle = userStyle ?? {};

		const presets = useMemo(() => {
			return {
				width: width ?? layoutSets[preset].width,
				height: height ?? layoutSets[preset].height,
				direction: direction ?? layoutSets[preset].direction,
				align: align ?? layoutSets[preset].align,
				flex: flex ?? layoutSets[preset].flex,
				justify: justify ?? layoutSets[preset].justify,
				scrollY: scrollY ?? layoutSets[preset].scrollY,
				scrollX: scrollX ?? layoutSets[preset].scrollX,
				shrinkChildren: shrinkChildren ?? layoutSets[preset].shrinkChildren,
				overflow: overflow ?? layoutSets[preset].overflow,
				wrap: wrap ?? layoutSets[preset].wrap,
				alignContent: layoutSets[preset].alignContent,
			};
		}, [preset, width, height, direction, align, justify, scrollY, scrollX, shrinkChildren, flex, overflow, wrap]);

		const setScroll = useCallback((value: boolean | undefined) => {
			if (value === undefined) return undefined;
			return value ? 'auto' : 'hidden';
		}, []);

		// compose the inline layout styles for the wrapper
		const style = useMemo(() => {
			return {
				display: 'flex',
				position: `${absolute ? 'absolute' : 'relative'}`,
				flexDirection: `${presets.direction}${reverse ? '-reverse' : ''}`,
				flexWrap: `${presets.wrap ? 'wrap' : 'nowrap'}`,
				justifyContent: `${setFlex(presets.justify)}`,
				alignItems: `${setFlex(presets.align)}`,
				alignContent: presets.alignContent,
				boxSizing: 'border-box',
				padding: `${setSizeStyle(padding ?? 0)}`,
				...(padding === undefined ? { paddingRight: setPaddingRight(padding, scrollBox) } : {}),
				margin: centerSelf ? '0 auto' : `${setSizeStyle(margin)}`,
				width: `${absolute ? 'unset' : setSize(presets.width, false)}`,
				height: `${absolute ? 'unset' : setSize(presets.height, true)}`,
				maxWidth: `${maxWidth !== undefined ? setSize(maxWidth, false) : 'unset'}`,
				flex: absolute ? undefined : presets.flex,
				top: `${absolute ? '0' : 'unset'}`,
				bottom: `${absolute ? '0' : 'unset'}`,
				left: `${absolute ? '0' : 'unset'}`,
				right: `${absolute ? '0' : 'unset'}`,
				gap: gap !== undefined ? `${gap}px` : 'unset',
				border: `${border ?? 'unset'}`,
				background: `${background ?? 'transparent'}`,
				overflow: presets.overflow,
				overflowY: setScroll(scrollY ?? (overflow === undefined ? presets.scrollY : undefined)),
				overflowX: setScroll(scrollX ?? (overflow === undefined ? presets.scrollX : undefined)),
				borderRadius: setStyle(borderRadius),
				color: 'var(--core-text-primary)',
				'--flex-div-scroll-border': `${background ?? 'transparent'}`,
				'--flex-div-scroll-handle': `${scrollHandle ?? 'var(--scroll-bar)'}`,
				'--flex-div-scroll-handle-hover': `${scrollHandleHover ?? 'var(--scroll-bar-hover)'}`,
			} as React.CSSProperties;
		}, [
			absolute,
			reverse,
			padding,
			margin,
			gap,
			border,
			background,
			centerSelf,
			maxWidth,
			scrollHandle,
			scrollHandleHover,
			borderRadius,
			setScroll,
			presets,
			scrollBox,
			scrollY,
			scrollX,
			overflow,
		]);

		const motionVariants = useMemo(
			() => (reducedMotion ? reduceMotionVariants(variants) : variants),
			[reducedMotion, variants],
		);
		const motionTarget = useMemo(
			() => (reducedMotion ? reduceMotionTarget(animate) : animate),
			[reducedMotion, animate],
		);

		const getFinalStyle = () => {
			if (wrapperStyle.overflow === undefined) return { ...style, ...wrapperStyle };
			// Default axes must not undo explicit overflow; caller-provided axes still override the shorthand.
			const { overflowX: _overflowX, overflowY: _overflowY, ...layoutStyle } = style;
			return { ...layoutStyle, ...wrapperStyle };
		};

		return (
			<motion.div
				id={divId}
				ref={ref}
				className={`${css.flexDiv} ${className ?? ''}`}
				style={getFinalStyle()}
				transition={
					reducedMotion ? { duration: 0, delay: 0, repeat: 0 } : getWaterTransition(current.motion, transition)
				}
				variants={motionVariants}
				initial={reducedMotion ? false : initial}
				animate={motionTarget}
				exit={reducedMotion ? undefined : exit}
				layout={reducedMotion ? false : layout}
				layoutId={reducedMotion ? undefined : layoutId}
				whileHover={reducedMotion ? undefined : whileHover}
				whileTap={reducedMotion ? undefined : whileTap}
				whileFocus={reducedMotion ? undefined : whileFocus}
				whileDrag={reducedMotion ? undefined : whileDrag}
				whileInView={reducedMotion ? undefined : whileInView}
				data-shrink-children={presets.shrinkChildren}
				data-grow-children={growChildren}
				{...rest}
			>
				{children}
			</motion.div>
		);
	}),
);

FlexBox.displayName = 'FlexBox';
