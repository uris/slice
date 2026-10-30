import type { Transition, Variants } from 'motion/react';
import type React from 'react';

export type ModalControllerProps = {
	dragConstraintsRef?: React.RefObject<HTMLElement | null>;
	overlayColor?: string;
	overlayOpacity?: number;
	transition?: Transition;
	variants?: Variants;
	initial?: string;
	animate?: string;
	exit?: string;
	draggable?: boolean;
};
