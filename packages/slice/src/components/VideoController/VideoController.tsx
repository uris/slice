'use client';

import {
	AnimatePresence,
	type Variants,
	motion,
	useAnimationControls,
	useDragControls,
	useMotionValue,
	usePresence,
} from 'motion/react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import type { VideoDescriptor } from '../../stores/video';
import { getVideo, useVideo, videoActions } from '../../stores/video';
import { corners } from '../../theme/corners/corners';
import { classNames, setStyle } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { useModalHost } from '../ModalController/useModalHost';
import { Overlay } from '../Overlay';
import { getVideoControls } from '../Video/getVideoControls';
import css from './VideoController.module.css';
import type { VideoControllerProps } from './_types';

const defaultVariants: Variants = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
const descriptorKeys = new WeakMap<VideoDescriptor, number>();
let nextDescriptorKey = 0;

function descriptorKey(video: VideoDescriptor) {
	let key = descriptorKeys.get(video);
	if (key === undefined) {
		key = ++nextDescriptorKey;
		descriptorKeys.set(video, key);
	}
	return key;
}

function VideoLayer({
	descriptor,
	options,
	opener,
}: {
	descriptor: VideoDescriptor;
	options: VideoControllerProps;
	opener: React.RefObject<HTMLElement | null>;
}) {
	const {
		dragConstraintsRef,
		transition,
		variants = defaultVariants,
		initial = 'initial',
		animate = 'animate',
		exit = 'exit',
		draggable = true,
		padding = 'var(--spacing-xxl)',
		borderRadius,
		quit = 'inside',
		customControls,
		showProgressIndicator = true,
		dialogName = 'Video player',
		dragIcon = 'basic.menu',
		onQuit,
	} = options;
	const [present, safeToRemove] = usePresence();
	const reduced = usePrefersReducedMotion();
	const animation = useAnimationControls();
	const dragControls = useDragControls();
	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const host = useRef<HTMLDivElement>(null);
	const panel = useRef<HTMLDivElement>(null);
	const { current } = useTheme();
	const timing = useMemo(() => getWaterTransition(current.motion, transition), [current.motion, transition]);
	const [ready, setReady] = useState(false);
	const VideoComponent = descriptor.component;
	const { onCanPlay, onError, onQuit: descriptorQuit, ...videoProps } = descriptor.props ?? {};
	const handleHide = () => {
		if (!present || getVideo() !== descriptor) return;
		videoActions.clear();
		descriptorQuit?.();
		onQuit?.();
	};
	useModalHost(host, handleHide, opener, present);

	useEffect(() => {
		animation.stop();
		if (!present) {
			for (const video of Array.from(host.current?.querySelectorAll('video') ?? [])) video.pause();
		}
		if (reduced) {
			animation.set({ opacity: 1, scale: 1, rotate: 0 });
			if (!present) safeToRemove?.();
			return;
		}
		let active = true;
		const name = present ? animate : exit;
		const target = variants[name];
		const definition = typeof target === 'function' ? name : { ...target, transition: target?.transition ?? timing };
		void animation.start(definition).then(() => {
			if (active && !present) safeToRemove?.();
		});
		return () => {
			active = false;
			animation.stop();
		};
	}, [reduced, present, animation, animate, exit, timing, safeToRemove, variants]);

	// Preserve dialog focus when media readiness changes.
	useEffect(() => {
		if (present && ready && document.activeElement === document.body) panel.current?.focus();
	}, [ready, present]);
	const configuredControls = customControls ?? videoProps.customControls;
	const usesSimpleControls =
		configuredControls !== undefined || !videoProps.controls || videoProps.controls === 'simple';
	const mergedControls = usesSimpleControls
		? { ...getVideoControls(configuredControls), quit: quit === 'inside' && ready }
		: undefined;
	const fallbackClose = !ready || quit === 'outside' || (quit === 'inside' && !mergedControls?.progress);
	const radius = borderRadius ?? videoProps.borderRadius ?? corners['corner-m'];
	const style = {
		'--overlay-padding': setStyle(padding, 'var(--spacing-xxl)'),
		'--video-border-radius': setStyle(radius),
	} as React.CSSProperties;
	const moveWithKeyboard = (event: React.KeyboardEvent<HTMLButtonElement>) => {
		const directions: Record<string, [number, number]> = {
			ArrowLeft: [-10, 0],
			ArrowRight: [10, 0],
			ArrowUp: [0, -10],
			ArrowDown: [0, 10],
		};
		const delta = directions[event.key];
		const bounds = (dragConstraintsRef ?? host).current?.getBoundingClientRect();
		const rect = panel.current?.getBoundingClientRect();
		if (!delta || !bounds || !rect) return;
		event.preventDefault();
		x.set(x.get() + Math.min(bounds.right - rect.right, Math.max(bounds.left - rect.left, delta[0])));
		y.set(y.get() + Math.min(bounds.bottom - rect.bottom, Math.max(bounds.top - rect.top, delta[1])));
	};
	if (reduced && !present) return null;
	return (
		<div
			ref={host}
			className={css.container}
			style={style}
			inert={!present}
			aria-hidden={!present || undefined}
			onLoadStartCapture={() => setReady(false)}
			onWaitingCapture={() => setReady(false)}
			// onPlayingCapture={() => setReady(true)}
		>
			<div className={css.box}>
				<motion.div
					ref={panel}
					className={css.wrapper}
					role="dialog"
					aria-modal="true"
					aria-label={dialogName.trim() || 'Video player'}
					tabIndex={-1}
					variants={reduced ? undefined : variants}
					initial={reduced ? false : initial}
					animate={animation}
					transition={timing}
					style={{ x, y }}
					drag={present && ready && draggable}
					dragListener={false}
					dragControls={dragControls}
					dragConstraints={dragConstraintsRef ?? host}
					dragElastic={0}
					dragMomentum={false}
				>
					{ready && draggable && (
						<button
							type="button"
							className={css.dragHandle}
							aria-label="Move video"
							onPointerDown={(event) => {
								if (present) dragControls.start(event);
							}}
							onKeyDown={moveWithKeyboard}
						>
							<Icon name={dragIcon} size={24} />
						</button>
					)}
					<div className={classNames(css.video, ready ? '' : css.loading)}>
						<VideoComponent
							{...videoProps}
							showProgressIndicator={showProgressIndicator}
							borderRadius={radius}
							onCanPlay={() => {
								setReady(true);
								onCanPlay?.();
							}}
							onError={(error) => {
								setReady(false);
								onError?.(error);
							}}
							customControls={ready ? mergedControls : {}}
							onQuit={handleHide}
						/>
					</div>
					{fallbackClose && ready && (
						<IconButton
							actionName="Close video"
							icon="basic.cross"
							buttonSize="l"
							onClick={handleHide}
							backgroundColor="rgba(255,255,255,0.05)"
							backgroundColorHover="rgba(255,255,255,0.25)"
							iconColor="var(--core-text-light)"
							iconColorHover="var(--core-text-light)"
						/>
					)}
				</motion.div>
			</div>
		</div>
	);
}

export function VideoController(rawProps: Readonly<VideoControllerProps>) {
	const props = resolveColorProps(rawProps);
	const video = useVideo();
	const opener = useRef<HTMLElement | null>(null);
	useEffect(() => {
		const rememberOpener = (event: PointerEvent) => {
			if (!getVideo() && event.target instanceof Element)
				opener.current = event.target.closest<HTMLElement>('button, a[href], [tabindex]');
		};
		document.addEventListener('pointerdown', rememberOpener, true);
		return () => document.removeEventListener('pointerdown', rememberOpener, true);
	}, []);
	return (
		<>
			<Overlay
				show={!!video}
				opacity={props.overlayOpacity ?? 0.7}
				backgroundColor={props.overlayColor ?? 'rgb(0,0,0)'}
				onClick={() => {
					if (getVideo() !== video || !video) return;
					videoActions.clear();
					video.props?.onQuit?.();
					props.onQuit?.();
				}}
			/>
			<AnimatePresence initial={false}>
				{video && <VideoLayer key={descriptorKey(video)} descriptor={video} options={props} opener={opener} />}
			</AnimatePresence>
		</>
	);
}
