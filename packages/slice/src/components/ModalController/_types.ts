import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

export type ModalControllerProps = {
	dragConstraintsRef?: React.RefObject<HTMLElement | null>;
	overlayColor?: ColorValue;
	overlayOpacity?: number;
	transition?: Transition;
	motionValues?: Variants;
	draggable?: boolean;
};
