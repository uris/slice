'use client';

import { useDocsActions } from '@/docs/stores/store';
import { surfaceGreen, surfaceYellow } from '@/src/consts/consts';
import { classNames } from '@/src/utils/misc';
import { useIntersecting } from '@apple-pie/slice/hooks';
import { addOpacity } from '@apple-pie/slice/utils';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import styles from './Type.module.css';

export interface TextProps {
	id?: string;
	onVisibilityChange?: (visible: boolean, entry: IntersectionObserverEntry) => void;
	children?: React.ReactNode;
	clipWidth?: true | number;
	style?: React.CSSProperties;
	openURL?: string;
	target?: '_blank' | '_top';
}

function useTextVisibility<T extends HTMLElement>(props: Readonly<TextProps>, trackVisibility = false) {
	const { id, onVisibilityChange } = props;
	const { updateVisibleItems } = useDocsActions();
	const track = trackVisibility && Boolean(id?.trim());
	const ref = useRef<T>(null);
	const callback = useRef(onVisibilityChange);

	useEffect(() => {
		callback.current = onVisibilityChange;
	}, [onVisibilityChange]);

	const { results } = useIntersecting({
		container: null,
		entries: track ? ref : [],
		thresholds: 1,
		margin: '-112px 0px 0px 0px',
	});

	const entry = track ? results[0]?.entry : undefined;

	const visible = entry ? entry.isIntersecting && entry.intersectionRatio >= 1 : undefined;

	// Publish after commit so subscribers are never updated during render.
	useEffect(() => {
		if (track) updateVisibleItems(id, visible === true);
	}, [id, track, visible, updateVisibleItems]);

	// Remove stale entries when an item unmounts or its ID changes.
	useEffect(() => {
		if (!track) return;
		return () => updateVisibleItems(id, false);
	}, [id, track, updateVisibleItems]);

	useEffect(() => {
		if (entry) callback.current?.(visible === true, entry);
	}, [entry, visible]);

	return { ref, id: props.id, 'data-visible': visible };
}

export function H1(props: Readonly<TextProps>) {
	const visibility = useTextVisibility<HTMLDivElement>(props, true);
	const { children } = props;
	return (
		<div {...visibility} className={styles.wrapper}>
			<span className={styles.h1}>{children}</span>
		</div>
	);
}

export function H2(props: Readonly<TextProps>) {
	const visibility = useTextVisibility<HTMLDivElement>(props, true);
	const { children } = props;
	return (
		<div {...visibility} className={styles.wrapper}>
			<span className={styles.h2}>{children}</span>
		</div>
	);
}

export function H3(props: Readonly<TextProps>) {
	const visibility = useTextVisibility<HTMLDivElement>(props);
	const { children } = props;
	return (
		<div {...visibility} className={styles.wrapper}>
			<span className={styles.h3}>{children}</span>
		</div>
	);
}

export function P(props: Readonly<TextProps>) {
	const visibility = useTextVisibility<HTMLDivElement>(props);
	const { children, clipWidth } = props;
	const resolvedMaxWidth = useMemo(() => {
		if (!clipWidth || typeof clipWidth === 'number') return clipWidth;
		return 360;
	}, [clipWidth]);
	return (
		<div {...visibility} className={classNames(styles.wrapper, styles.paragraph)}>
			<span className={styles.p} style={{ maxWidth: resolvedMaxWidth }}>
				{children}
			</span>
		</div>
	);
}

export function Caption(props: Readonly<TextProps>) {
	const visibility = useTextVisibility<HTMLDivElement>(props);
	const { children, style } = props;
	return (
		<div {...visibility} className={styles.wrapper} style={style}>
			<span className={styles.caption}>{children}</span>
		</div>
	);
}

export function Code(props: Readonly<TextProps>) {
	const visibility = useTextVisibility<HTMLSpanElement>(props);
	const { children, openURL, style, target } = props;
	const url = openURL?.trim();
	const cssStyles = useMemo(() => {
		return {
			'--underline-hover-color': surfaceYellow,
			'--underline-color': addOpacity(surfaceYellow, 0.25),
			...style,
		} as React.CSSProperties;
	}, [style]);

	const handleClick = useCallback(() => {
		if (url) window.open(url, target ?? '_blank');
	}, [url, target]);

	return (
		<span {...visibility} className={styles.code} style={cssStyles}>
			{url ? (
				<button type={'button'} className={styles.button} onClick={handleClick}>
					{children}
				</button>
			) : (
				children
			)}
		</span>
	);
}

export function Prop(props: Readonly<TextProps>) {
	const visibility = useTextVisibility<HTMLSpanElement>(props);
	const { children } = props;
	const cssVars = {
		color: surfaceYellow,
		backgroundColor: addOpacity(surfaceYellow, 0.1),
	} as React.CSSProperties;
	return (
		<span {...visibility} className={styles.prop} style={cssVars}>
			{children}
		</span>
	);
}

export function Method(props: Readonly<TextProps>) {
	const visibility = useTextVisibility<HTMLSpanElement>(props);
	const { children } = props;
	const cssVars = {
		color: surfaceGreen,
		backgroundColor: addOpacity(surfaceGreen, 0.1),
	} as React.CSSProperties;
	return (
		<span {...visibility} className={styles.prop} style={cssVars}>
			{children}
		</span>
	);
}

export function TypeDef(props: Readonly<TextProps>) {
	const visibility = useTextVisibility<HTMLSpanElement>(props);
	const { children } = props;
	const cssVars = {
		color: 'var(--core-text-primary)',
		backgroundColor: 'var(--core-fill-primary)',
	} as React.CSSProperties;
	return (
		<span {...visibility} className={styles.prop} style={cssVars}>
			{children}
		</span>
	);
}

export function DefaultVal(props: Readonly<TextProps>) {
	const visibility = useTextVisibility<HTMLSpanElement>(props);
	const { children } = props;
	const cssVars = {
		color: 'var(--core-text-secondary)',
		backgroundColor: 'var(--core-fill-primary)',
	} as React.CSSProperties;
	return (
		<span {...visibility} className={styles.prop} style={cssVars}>
			{children}
		</span>
	);
}

export function Definition(props: Readonly<TextProps>) {
	const visibility = useTextVisibility<HTMLDivElement>(props, true);
	const { children } = props;
	return (
		<div {...visibility} className={classNames(styles.wrapper, styles.definition)}>
			{children}
		</div>
	);
}

export function SpacerS(props: Readonly<TextProps> = {}) {
	const visibility = useTextVisibility<HTMLDivElement>(props);
	return <div {...visibility} className={classNames(styles.spacer, styles.spacerS)} />;
}

export function SpacerM(props: Readonly<TextProps> = {}) {
	const visibility = useTextVisibility<HTMLDivElement>(props);
	return <div {...visibility} className={classNames(styles.spacer, styles.spacerM)} />;
}

export function SpacerL(props: Readonly<TextProps> = {}) {
	const visibility = useTextVisibility<HTMLDivElement>(props);
	return <div {...visibility} className={classNames(styles.spacer, styles.spacerL)} />;
}

export function SpacerXL(props: Readonly<TextProps> = {}) {
	const visibility = useTextVisibility<HTMLDivElement>(props);
	return <div {...visibility} className={classNames(styles.spacer, styles.spacerXL)} />;
}
