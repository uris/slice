import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type DotBaseProps = {
	size?: number;
	/** Shared top/right distance in pixels. Positive values move outward. Defaults to 2. */
	offSet?: number;
	/** Overrides offSet for the top edge. Positive values move upward. */
	topOffset?: number;
	/** Overrides offSet for the right edge. Positive values move rightward. */
	rightOffset?: number;
	border?: number;
	position?: 'inline' | 'corner';
	state?: 'red' | 'yellow' | 'green' | 'blue' | 'grey';
	color?: ColorValue;
	transition?: Transition;
	motionValues?: Variants;
	show?: boolean;
};

/** No intentional gesture API or component-specific callbacks. Document inherited DOM events as a group;
 * Motion's incidental passthrough callbacks are implementation details, not Dot features. */
export type DotProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof DotBaseProps> & DotBaseProps;

export const DEFAULT_VARIANTS: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export const DEFAULT_TRANSITION: Transition = {
	type: 'tween',
	ease: [0.36, 0, 0.64, 1],
	duration: 0.25,
};
