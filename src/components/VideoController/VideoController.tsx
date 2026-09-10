'use client';

import { AnimatePresence, type Transition, motion, useDragControls } from 'motion/react';
import type React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useVideo, useVideoActions } from '../../stores';
import { setStyle } from '../../utils/functions/misc';
import { IconButton } from '../IconButton';
import { Overlay } from '../Overlay';
import css from './VideoController.module.css';
import type { VideoControllerProps } from './_types';

const defaultTransition: Transition = {
	ease: 'easeOut',
	duration: 0.25,
	delay: 0.1,
};
const defaultVariants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export function VideoController(props: Readonly<VideoControllerProps>) {
	const {
		dragConstraintsRef,
		transition = defaultTransition,
		variants = defaultVariants,
		initial = 'initial',
		animate = 'animate',
		exit = 'exit',
		draggable = true,
		overlayOpacity = 0.7,
		overlayColor = 'rgb(0,0,0)',
		padding = 64,
		borderRadius = 8,
		quit = 'inline',
		onQuit,
	} = props;
	const controls = useDragControls();
	const video = useVideo();
	const hide = useVideoActions().clear;
	const VideoComponent = video?.component;
	const { onLoadedFrameData, borderRadius: videoBorderRadius, ...videoProps } = video?.props ?? {};
	const ref = useRef<HTMLDivElement>(null);
	const constraints = dragConstraintsRef ?? ref;
	const [ready, setReady] = useState(false);

	// reset readiness whenever the active descriptor changes
	useEffect(() => {
		if (!video?.id) return;
		setReady(false);
	}, [video?.id]);

	// set ready when meta is loaded to avoid a size flicker
	const handleDidLoadFrame = () => {
		setReady(true);
		onLoadedFrameData?.();
	};

	// hide video overlay and clear video
	const handleHide = () => {
		setReady(false);
		hide();
		onQuit?.();
	};

	// memo CSS vars
	const cssVars = useMemo(() => {
		return {
			'--overlay-padding': setStyle(padding, 64),
			'--video-visibility': ready ? 'visible' : 'hidden',
			'--video-border-radius': setStyle(borderRadius, 8),
		} as React.CSSProperties;
	}, [padding, ready, borderRadius]);

	return (
		<>
			<Overlay show={!!video} type={'dark'} opacity={overlayOpacity} color={overlayColor} onClick={handleHide} />
			<AnimatePresence initial={false}>
				{video && VideoComponent && (
					<div className={css.container} ref={ref} style={cssVars}>
						<div className={css.box}>
							<motion.div
								className={css.wrapper}
								variants={variants}
								initial={initial}
								animate={animate}
								exit={exit}
								transition={transition}
								drag={draggable}
								dragListener={draggable ? false : undefined}
								dragControls={draggable ? controls : undefined}
								dragConstraints={draggable ? constraints : undefined}
								dragElastic={draggable ? 0 : undefined}
								dragMomentum={draggable ? false : undefined}
							>
								<div className={css.video}>
									<VideoComponent
										{...videoProps}
										borderRadius={borderRadius ?? videoBorderRadius}
										onLoadedFrameData={handleDidLoadFrame}
										customControls={{
											...videoProps.customControls,
											quit: quit === 'inside',
										}}
										onQuit={() => handleHide()}
									/>
								</div>
								{quit === 'outside' && (
									<IconButton
										icon={'x'}
										buttonSize={'l'}
										onClick={handleHide}
										bgColor={'rgba(255,255,255,0.05)'}
										bgColorHover={'rgba(255,255,255,0.25)'}
										iconColor={'var(--core-text-light)'}
										iconColorHover={'var(--core-text-light)'}
									/>
								)}
							</motion.div>
						</div>
					</div>
				)}
			</AnimatePresence>
		</>
	);
}
