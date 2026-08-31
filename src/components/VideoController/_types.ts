import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { CustomVideoControls } from '../Video';

export type VideoControllerProps = {
	dragConstraintsRef?: React.RefObject<HTMLElement | null>;
	overlayColor?: string;
	overlayOpacity?: number;
	transition?: Transition;
	variants?: Variants;
	initial?: string;
	animate?: string;
	exit?: string;
	draggable?: boolean;
	padding?: number | string;
	borderRadius?: number | string;
	customControls?: CustomVideoControls;
	quit?: 'inside' | 'outside' | 'none';
	onQuit?: () => void;
};
