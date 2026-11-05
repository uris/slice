import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type OverlayBaseProps = {
	children?: React.ReactNode;
	show?: boolean;
	backgroundColor?: ColorValue;
	opacity?: number;
	position?: 'fixed' | 'absolute';
	pointerEvents?: 'auto' | 'none';
	transition?: Transition;
	motionValues?: Variants;
};

export type OverlayProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof OverlayBaseProps | keyof React.AriaAttributes | 'role' | 'color' | 'dangerouslySetInnerHTML'
> &
	OverlayBaseProps;
