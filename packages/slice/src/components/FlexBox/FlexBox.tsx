'use client';

import { motion } from 'motion/react';
import React, { useCallback, useMemo } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { reduceMotionTarget, reduceMotionVariants } from '../../utils/styling/reduceMotionTargets';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import css from './FlexBox.module.css';
import { type FlexBoxProps, layoutSets } from './_types';

// Normalize width and height values before applying them inline.
function setSize(style: string | number, isHeight: boolean) {
	if (typeof style === 'number') return `${style}px`;
	if (style === 'grow') return 'unset';
	if (style === 'fill') return '100%';
	if (style === 'fit') return 'auto';
	if (style === 'viewport') return isHeight ? '100vh' : '100vw';
	return style;
}

// Normalize spacing values before applying them inline.
function setBox(style: string | number) {
	if (typeof style === 'number') return `${style}px`;
	return style;
}

function setPaddingRight(padding: string | number | undefined, scrollBox: boolean | undefined) {
	if (padding !== undefined) {
		if (typeof padding === 'number') return `${padding}px`;
		return padding;
	}
	if (scrollBox) return 'var(--spacing-xs)';
	return 'unset';
}

// Translate alignment shorthand into flexbox-compatible values.
function setFlex(style: string) {
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
			background = 'transparent',
			direction = undefined,
			align = undefined,
			justify = undefined,
			height = undefined,
			width = undefined,
			maxWidth = undefined,
			centerSelf = undefined,
			wrap = false,
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
				justify: justify ?? layoutSets[preset].justify,
				scrollY: scrollY ?? layoutSets[preset].scrollY,
				scrollX: scrollX ?? layoutSets[preset].scrollX,
				overflow: layoutSets[preset].overflow,
			};
		}, [preset, width, height, direction, align, justify, scrollY, scrollX]);

		const setScroll = useCallback((value: boolean | undefined) => {
			if (value === undefined) return 'unset';
			return value ? 'auto' : 'hidden';
		}, []);

		// compose the inline layout styles for the wrapper
		const style = useMemo(() => {
			return {
				display: 'flex',
				position: `${absolute ? 'absolute' : 'relative'}`,
				flexDirection: `${presets.direction}${reverse ? '-reverse' : ''}`,
				flexWrap: `${wrap ? 'wrap' : 'nowrap'}`,
				justifyContent: `${setFlex(presets.justify)}`,
				alignItems: `${setFlex(presets.align)}`,
				boxSizing: 'border-box',
				padding: `${setBox(padding ?? 0)}`,
				paddingRight: setPaddingRight(padding, scrollBox),
				margin: centerSelf ? '0 auto' : `${setBox(margin)}`,
				width: `${absolute ? 'unset' : setSize(presets.width, false)}`,
				height: `${absolute ? 'unset' : setSize(presets.height, true)}`,
				maxWidth: `${maxWidth !== undefined ? setSize(maxWidth, false) : 'unset'}`,
				flex: `${absolute ? 'unset' : (flex ?? 'unset')}`,
				top: `${absolute ? '0' : 'unset'}`,
				bottom: `${absolute ? '0' : 'unset'}`,
				left: `${absolute ? '0' : 'unset'}`,
				right: `${absolute ? '0' : 'unset'}`,
				gap: gap !== undefined ? `${gap}px` : 'unset',
				border: `${border ?? 'unset'}`,
				background: `${background ?? 'transparent'}`,
				overflow: presets.overflow,
				overflowY: setScroll(presets.scrollY),
				overflowX: setScroll(presets.scrollX),
				borderRadius: setStyle(borderRadius),
				color: 'var(--core-text-primary)',
				'--flex-div-scroll-border': `${background ?? 'transparent'}`,
				'--flex-div-scroll-handle': `${scrollHandle ?? 'var(--scroll-bar)'}`,
				'--flex-div-scroll-handle-hover': `${scrollHandleHover ?? 'var(--scroll-bar-hover)'}`,
			} as React.CSSProperties;
		}, [
			absolute,
			reverse,
			wrap,
			padding,
			margin,
			flex,
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
				{...rest}
			>
				{children}
			</motion.div>
		);
	}),
);

FlexBox.displayName = 'FlexBox';
