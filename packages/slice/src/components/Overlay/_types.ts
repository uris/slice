import type { Transition } from 'motion/react';
import type React from 'react';

type OverlayBaseProps = {
	children?: React.ReactNode;
	show?: boolean;
	opacity?: number;
	color?: string;
	type?: 'clear' | 'dark';
	global?: boolean;
	overlay?: any;
	onClick?: () => void;
	transition?: Transition;
	toggleOverlay?: (state: boolean) => void;
};

export type OverlayProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof OverlayBaseProps> & OverlayBaseProps;
