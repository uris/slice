'use client';

import { CodeBlock } from '@/components/CodeBlock';
import { Caption } from '@/components/Type/Type';
import { classNames } from '@/src/utils/misc';
import { IconButton, Pager, Slider } from '@apple-pie/slice';
import { useTheme } from '@apple-pie/slice/hooks';
import {
	AnimatePresence,
	type Transition,
	type Variants,
	motion,
	useAnimationControls,
	usePresence,
	usePresenceData,
} from 'motion/react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getWaterTransition } from '../../../../../packages/slice/src/utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../../../../packages/slice/src/utils/styling/usePrefersReducedMotion';
import styles from './ComponentCanvas.module.css';

export type Zoom = {
	min: number;
	max: number;
	initial: number;
};

export type ComponentCanvasItem = {
	label: string;
	code?: string;
	codeFilename?: string;
	component: React.ReactNode;
	hasRefresh?: boolean;
};

export interface ComponentCanvasProps {
	storybookUrl?: string;
	zoom?: Zoom;
	components?: ComponentCanvasItem[];
	showControls?: boolean;
	showCode?: boolean;
	offsetTop?: boolean;
	offsetBottom?: boolean;
}

type SlideSettings = { direction: number; reduceMotion: boolean; transition: Transition; contentKey: string };

const slideVariants: Variants = {
	enter: ({ direction, reduceMotion }: SlideSettings) => ({
		x: reduceMotion ? 0 : direction * 200,
		opacity: reduceMotion ? 1 : 0,
	}),
	center: { x: 0, opacity: 1 },
	exit: ({ direction, reduceMotion, transition }: SlideSettings) => ({
		x: reduceMotion ? 0 : direction * -200,
		opacity: reduceMotion ? 1 : 0,
		transition: reduceMotion ? { duration: 0 } : transition,
	}),
};

function CanvasSlide({ children, settings }: Readonly<{ children: React.ReactNode; settings: SlideSettings }>) {
	const [isPresent, safeToRemove] = usePresence();
	const presenceSettings = usePresenceData() as SlideSettings | undefined;
	const reduceMotion = usePrefersReducedMotion();
	const liveSettings = { ...(presenceSettings ?? settings), reduceMotion };
	const controls = useAnimationControls();
	useEffect(() => {
		if (liveSettings.reduceMotion) {
			controls.set({ x: 0, opacity: 1 });
			if (!isPresent) safeToRemove?.();
			return;
		}
		let active = true;
		void controls.start(isPresent ? 'center' : 'exit').then(() => {
			if (active && !isPresent) safeToRemove?.();
		});
		return () => {
			active = false;
			controls.stop();
		};
	}, [controls, isPresent, safeToRemove, liveSettings.reduceMotion]);
	return (
		<motion.div
			className={styles.slide}
			custom={liveSettings}
			variants={slideVariants}
			initial="enter"
			animate={controls}
			transition={liveSettings.reduceMotion ? { duration: 0 } : liveSettings.transition}
			inert={!isPresent || undefined}
			aria-hidden={!isPresent || undefined}
			key={settings.contentKey}
		>
			{children}
		</motion.div>
	);
}

export function ComponentCanvas(props: Readonly<ComponentCanvasProps>): React.ReactElement {
	const { zoom, components, showControls = false, showCode = true, offsetTop = false, offsetBottom = true } = props;
	const { initial, min, max } = zoom ?? { initial: 1, min: 0, max: 2 };
	const [scale, setScale] = useState(initial);
	const [{ index: selected, direction }, setPage] = useState({ index: 0, direction: 1 });
	const reduceMotion = usePrefersReducedMotion();
	const themeMotion = useTheme().current.motion;
	const transition = useMemo(() => getWaterTransition(themeMotion), [themeMotion]);
	const [contentKey, setContentKey] = useState<string>(Date.now().toString());
	const slideSettings = { direction, reduceMotion, transition, contentKey };
	const controls = useAnimationControls();
	const rotation = useRef(0);

	/*
    const patternStyles = useMemo(() => {
        return {
            backgroundImage: `url("${pattern.src}")`,
            backgroundRepeat: 'repeat',
            backgroundSize: `${pattern.width * 0.1}px ${pattern.height * 0.1}px`,
        } as React.CSSProperties;
    }, []);
    */

	const maskStyles = useMemo(() => {
		return {
			background: 'linear-gradient(to top, transparent 0%, var(--core-surface-primary) 70%)',
		} as React.CSSProperties;
	}, []);

	// resolve the component to show
	const selectedIndex = selected >= 0 && selected < (components?.length ?? 0) ? selected : 0;
	const resolvedComponent = components?.[selectedIndex];
	const cycleIndex = useCallback(
		(next: number, navigationDirection?: number) => {
			const count = components?.length ?? 0;
			if (count < 2) return;
			const index = ((next % count) + count) % count;
			setPage((previous) =>
				index === previous.index
					? previous
					: {
							index,
							direction: navigationDirection ?? (index > previous.index ? 1 : -1),
						},
			);
		},
		[components?.length],
	);

	// apply canvas styles based on weather it shows controls above amnd/or code below
	const canvasStyles = useMemo(() => {
		const topRadius = showControls ? 0 : 24;
		const bottomRadius = resolvedComponent?.code ? 0 : 24;
		return {
			borderTopRightRadius: topRadius,
			borderTopLeftRadius: topRadius,
			borderBottomRightRadius: bottomRadius,
			borderBottomLeftRadius: bottomRadius,
			borderTopWidth: showControls ? 0 : 1,
			borderBottomWidth: resolvedComponent?.code ? 0 : 1,
		} as React.CSSProperties;
	}, [showControls, resolvedComponent?.code]);

	const page = (components?.length ?? 0) > 1;

	return (
		<div className={styles.container} style={{ marginBottom: offsetBottom ? 24 : 0 }}>
			{showControls && (
				<div className={styles.header}>
					<div className={styles.scale}>
						<Caption style={{ padding: 0 }}>Zoom:</Caption>
						<Slider
							aria-label="Preview zoom"
							value={scale}
							min={min}
							max={max}
							step={0.1}
							width={'100%'}
							onChange={setScale}
							progressColor={'core-text-primary'}
							trackHeadBorderRadius={100}
							trackHeadSize={10}
							trackHeadBorderWidth={0}
							trackHeadOnHover={true}
							trackHeadBorderColor={'var(--core-surface-primary-tint)'}
							trackHeadColor={'core-text-primary'}
							height={2}
						/>
						<Caption style={{ padding: 0 }}>{Math.round(scale * 100)}%</Caption>
						<IconButton
							actionName="Reset preview zoom"
							icon={'arrows.undo'}
							iconSize={20}
							buttonSize={'s'}
							backgroundColor={'transparent'}
							backgroundColorHover={'transparent'}
							disabled={scale === 1}
							onClick={() => setScale(1)}
						/>
					</div>
				</div>
			)}
			<div className={styles.canvas} style={canvasStyles}>
				{/*<div className={styles.storybookLink}>
                    <SquareButton
                        icon="basic.share"
                        label="View on Storybook"
                        variant={SquareButtonType.Secondary}
                        onClick={() => window.open(storybookUrl, '_blank', 'noopener,no"core-text-primary"referrer')}
                    />
                </div>*/}
				{/*<div className={styles.pattern} style={patternStyles}/>*/}
				<div className={styles.mask} style={maskStyles} />
				<div className={styles.caption}>
					<Caption style={{ padding: 0 }}>{resolvedComponent?.label}</Caption>
				</div>
				{resolvedComponent?.hasRefresh && (
					<motion.div animate={controls} className={styles.refresh}>
						<IconButton
							iconColor={'core-text-tertiary'}
							backgroundColor={'transparent'}
							backgroundColorHover={'transparent'}
							icon={'arrows.refresh-ccw'}
							onClick={() => {
								setContentKey(Date.now().toString());
								rotation.current += 180;
								void controls.start({ rotate: rotation.current }, { ease: 'linear', duration: 0.25 });
							}}
						/>
					</motion.div>
				)}
				<div className={styles.content}>
					<div className={styles.preview} style={{ transform: `scale(${scale})` }}>
						<AnimatePresence initial={false} custom={slideSettings}>
							{resolvedComponent && (
								<CanvasSlide key={selectedIndex} settings={slideSettings}>
									{resolvedComponent.component}
								</CanvasSlide>
							)}
						</AnimatePresence>
					</div>
					{page && (
						<div className={styles.pager}>
							<Pager
								pages={components?.length}
								selectedIndex={selectedIndex}
								color={'core-surface-secondary'}
								colorOn={'core-text-primary'}
								maxVisiblePages={5}
								onChange={(index) => cycleIndex(index)}
							/>
						</div>
					)}
					{page && (
						<div className={classNames(styles.nav, styles.left)}>
							<IconButton
								backgroundColor={'core-fill-primary'}
								backgroundColorHover={'core-fill-primary'}
								icon={'arrows.chevron-left'}
								actionName="Previous preview"
								onClick={() => cycleIndex(selectedIndex - 1, -1)}
							/>
						</div>
					)}
					{page && (
						<div className={classNames(styles.nav, styles.right)}>
							<IconButton
								backgroundColor={'core-fill-primary'}
								backgroundColorHover={'core-fill-primary'}
								icon={'arrows.chevron-right'}
								actionName="Next preview"
								onClick={() => cycleIndex(selectedIndex + 1, 1)}
							/>
						</div>
					)}
				</div>
			</div>
			{resolvedComponent?.code && (
				<CodeBlock
					canvas={true}
					teased={true}
					filename={resolvedComponent?.codeFilename}
					language="tsx"
					code={resolvedComponent?.code}
				/>
			)}
		</div>
	);
}
