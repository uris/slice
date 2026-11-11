'use client';

import {
	AnimatePresence,
	type Variants,
	motion,
	useAnimationControls,
	useDragControls,
	usePresence,
} from 'motion/react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useTheme } from '../../hooks/useTheme/useTheme';
import { type ActiveModal, getModal, useModal, useModalActions } from '../../stores/modal';
import { mergedPresenceMotionValues } from '../../utils/functions/misc';
import { resolveColorProps } from '../../utils/functions/resolveColorProps';
import { getWaterTransition } from '../../utils/styling/getWaterTransition';
import { usePrefersReducedMotion } from '../../utils/styling/usePrefersReducedMotion';
import { Overlay } from '../Overlay';
import css from './ModalController.module.css';
import { ModalHostContext } from './ModalHostContext';
import type { ModalControllerProps } from './_types';
import { useModalHost } from './useModalHost';

const defaultVariants: Variants = {
	initial: { opacity: 0, y: 20 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: 20 },
};
const reducedTarget = {
	opacity: 1,
	x: 0,
	y: 0,
	z: 0,
	scale: 1,
	scaleX: 1,
	scaleY: 1,
	rotate: 0,
	rotateX: 0,
	rotateY: 0,
	skewX: 0,
	skewY: 0,
};
const instanceKeys = new WeakMap<ActiveModal, number>();
let sequence = 0;
function instanceKey(modal: ActiveModal) {
	let key = instanceKeys.get(modal);
	if (key === undefined) {
		key = ++sequence;
		instanceKeys.set(modal, key);
	}
	return key;
}

/** Bind settlement to the stored instance, including callbacks retained by asynchronous content. */
function useModalCallbacks(modal: ActiveModal | null) {
	const { hide, resolve, reject } = useModalActions();
	const dismiss = useCallback(() => {
		if (!modal || getModal() !== modal) return;
		hide();
		if (typeof modal.props?.onClose === 'function') modal.props.onClose();
	}, [modal, hide]);
	const onResolve = useCallback(
		(value?: unknown) => {
			if (!modal || getModal() !== modal) return;
			resolve(value);
			if (typeof modal.props?.onResolve === 'function') modal.props.onResolve(value);
		},
		[modal, resolve],
	);
	const onReject = useCallback(
		(error?: Error) => {
			if (!modal || getModal() !== modal) return;
			reject(error);
			if (typeof modal.props?.onReject === 'function') modal.props.onReject(error);
		},
		[modal, reject],
	);
	return { dismiss, onResolve, onReject };
}

function ModalPresentation({
	modal,
	opener,
	...props
}: ModalControllerProps & {
	modal: ActiveModal;
	opener: React.RefObject<HTMLElement | null>;
}) {
	const { dragConstraintsRef, transition, motionValues, draggable = true } = props;
	const variants = useMemo(() => mergedPresenceMotionValues(defaultVariants, motionValues), [motionValues]);
	const [present, safeToRemove] = usePresence();
	const reduced = usePrefersReducedMotion();
	const { current } = useTheme();
	const timing = useMemo(() => getWaterTransition(current.motion, transition), [current.motion, transition]);
	const controls = useAnimationControls();
	const dragControls = useDragControls();
	const host = useRef<HTMLDivElement>(null);
	const constraints = useRef<HTMLDivElement>(null);
	const { dismiss, onResolve, onReject } = useModalCallbacks(modal);
	useModalHost(host, dismiss, opener, present);

	// Exiting instances observe preference changes too; variant-level delays cannot block reduced-motion removal.
	useEffect(() => {
		controls.stop();
		if (reduced) {
			controls.set(reducedTarget);
			if (!present) safeToRemove?.();
			return;
		}
		let active = true;
		const state = present ? 'animate' : 'exit';
		const target = variants[state];
		const definition = typeof target === 'function' ? state : { ...target, transition: target?.transition ?? timing };
		void controls.start(definition).then(() => {
			if (active && !present) safeToRemove?.();
		});
		return () => {
			active = false;
			controls.stop();
		};
	}, [reduced, present, controls, safeToRemove, variants, timing]);
	const Component = modal.component;
	return (
		<ModalHostContext.Provider value={true}>
			<div ref={host} className={css.host} tabIndex={-1} inert={!present} aria-hidden={!present || undefined}>
				<div className={css.container} ref={constraints}>
					<div className={css.box}>
						<motion.div
							className={css.wrapper}
							variants={reduced ? undefined : variants}
							initial={reduced ? false : 'initial'}
							animate={controls}
							transition={reduced ? { duration: 0, delay: 0 } : timing}
							drag={present && draggable}
							dragListener={draggable ? false : undefined}
							dragControls={draggable ? dragControls : undefined}
							dragConstraints={draggable ? (dragConstraintsRef ?? constraints) : undefined}
							dragElastic={draggable ? 0 : undefined}
							dragMomentum={draggable ? false : undefined}
						>
							<Component
								{...modal.props}
								onResolve={onResolve}
								onReject={onReject}
								onClose={dismiss}
								onDragPointerDown={(event) => {
									if (!present || getModal() !== modal) return;
									if (typeof modal.props?.onDragPointerDown === 'function') modal.props.onDragPointerDown(event);
									if (draggable && !event.defaultPrevented) dragControls.start(event);
								}}
							/>
						</motion.div>
					</div>
				</div>
			</div>
		</ModalHostContext.Provider>
	);
}

export function ModalController(rawProps: Readonly<ModalControllerProps>) {
	const props = resolveColorProps(rawProps);
	const { overlayOpacity = 0.7, overlayColor = 'rgb(0,0,0)', transition } = props;
	const { current } = useTheme();
	const timing = useMemo(() => getWaterTransition(current.motion, transition), [current.motion, transition]);
	const modal = useModal();
	const { dismiss } = useModalCallbacks(modal);
	const opener = useRef<HTMLElement | null>(null);
	// Safari may not focus a clicked button. Remember a pointer opener as a fallback.
	useEffect(() => {
		if (modal) return;
		const remember = (event: PointerEvent) => {
			if (event.target instanceof Element)
				opener.current = event.target.closest<HTMLElement>('button, a[href], input, select, textarea, [tabindex]');
		};
		document.addEventListener('pointerdown', remember, true);
		return () => document.removeEventListener('pointerdown', remember, true);
	}, [modal]);
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
				{modal?.component && <ModalPresentation key={instanceKey(modal)} {...props} modal={modal} opener={opener} />}
			</AnimatePresence>
		</>
	);
}
