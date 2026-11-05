'use client';

import { AnimatePresence, motion, useDragControls } from 'motion/react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { useModal, useModalActions } from '../../stores';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import { Overlay } from '../Overlay';
import css from './ModalController.module.css';
import { ModalHostContext } from './ModalHostContext';
import type { ModalControllerProps } from './_types';
import { useModalHost } from './useModalHost';

const defaultVariants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 20 },
};

function ModalHost({
	children,
	dismiss,
	opener,
}: { children: React.ReactNode; dismiss: () => void; opener: React.RefObject<HTMLElement | null> }) {
	const ref = useRef<HTMLDivElement>(null);
	useModalHost(ref, dismiss, opener);
	return (
		<ModalHostContext.Provider value={true}>
			<div ref={ref} className={css.host} tabIndex={-1}>
				{children}
			</div>
		</ModalHostContext.Provider>
	);
}

export function ModalController(rawProps: Readonly<ModalControllerProps>) {
	const props = resolveColorProps(rawProps);
	const {
		dragConstraintsRef,
		transition,
		variants = defaultVariants,
		initial = 'initial',
		animate = 'animate',
		exit = 'exit',
		draggable = true,
		overlayOpacity = 0.7,
		overlayColor = 'rgb(0,0,0)',
	} = props;
	const controls = useDragControls();
	const { current } = useTheme();
	const reducedMotion = usePrefersReducedMotion();
	const timing = useMemo(() => getWaterTransition(current.motion, transition), [current.motion, transition]);
	const reducedTarget = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 };
	const modal = useModal();
	const resolve = useModalActions().resolve;
	const reject = useModalActions().reject;
	const hide = useModalActions().hide;
	const ModalComponent = modal?.component;
	const modalProps = modal?.props;
	const ref = useRef<HTMLDivElement>(null);
	const constraints = dragConstraintsRef ?? ref;
	const opener = useRef<HTMLElement | null>(null);
	// Safari may not focus a clicked button. Remember a pointer opener as a fallback.
	useEffect(() => {
		if (modal) return;
		const rememberOpener = (event: PointerEvent) => {
			opener.current = (event.target as Element).closest<HTMLElement>(
				'button, a[href], input, select, textarea, [tabindex]',
			);
		};
		document.addEventListener('pointerdown', rememberOpener, true);
		return () => document.removeEventListener('pointerdown', rememberOpener, true);
	}, [modal]);

	const dismiss = useCallback(() => {
		hide();
		if (typeof modalProps?.onClose === 'function') modalProps.onClose();
	}, [hide, modalProps]);

	return (
		<>
			<Overlay
				show={!!modal}
				opacity={overlayOpacity}
				backgroundColor={overlayColor}
				transition={timing}
				onClick={dismiss}
			/>
			<AnimatePresence>
				{modal && ModalComponent && (
					<ModalHost key={modal.id} dismiss={dismiss} opener={opener}>
						<div className={css.container} ref={ref}>
							<div className={css.box}>
								<motion.div
									className={css.wrapper}
									variants={variants}
									initial={reducedMotion ? false : initial}
									animate={reducedMotion ? reducedTarget : animate}
									exit={reducedMotion ? reducedTarget : exit}
									transition={reducedMotion ? { duration: 0 } : timing}
									drag={draggable}
									dragListener={draggable ? false : undefined}
									dragControls={draggable ? controls : undefined}
									dragConstraints={draggable ? constraints : undefined}
									dragElastic={draggable ? 0 : undefined}
									dragMomentum={draggable ? false : undefined}
								>
									<ModalComponent
										{...modalProps}
										onResolve={(value) => {
											resolve(value);
											if (typeof modalProps?.onResolve === 'function') {
												modalProps.onResolve(value);
											}
										}}
										onReject={(error) => {
											reject(error);
											if (typeof modalProps?.onReject === 'function') {
												modalProps.onReject(error);
											}
										}}
										onClose={dismiss}
										onDragPointerDown={(e) => {
											if (typeof modalProps?.onDragPointerDown === 'function') {
												modalProps?.onDragPointerDown(e);
											}
											if (draggable && !e.defaultPrevented) controls.start(e);
										}}
									/>
								</motion.div>
							</div>
						</div>
					</ModalHost>
				)}
			</AnimatePresence>
		</>
	);
}
