import type { Transition, Variants } from 'motion/react';
import type React from 'react';

type DotBaseProps = {
	size?: number;
	topOffset?: number;
	rightOffset?: number;
	border?: number;
	position?: 'inline' | 'corner';
	state?: 'red' | 'yellow' | 'green' | 'blue' | 'grey';
	color?: string;
	transition?: Transition;
	motionValues?: Variants;
	motion?: Variants;
	show?: boolean;
};

export type DotProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof DotBaseProps> & DotBaseProps;

export const DEFAULT_VARIANTS: Variants = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
};

export const DEFAULT_TRANSITION: Transition = {
	ease: 'easeInOut',
	duration: 0.5,
};
