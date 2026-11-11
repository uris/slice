import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme';
import type { SliceIcon } from '../Icon';
import type { CustomVideoControls } from '../Video';

export type VideoControllerProps = {
	dialogName?: string;
	dragConstraintsRef?: React.RefObject<HTMLElement | null>;
	overlayColor?: ColorValue;
	overlayOpacity?: number;
	transition?: Transition;
	variants?: Variants;
	initial?: string;
	animate?: string;
	exit?: string;
	draggable?: boolean;
	dragIcon?: SliceIcon;
	padding?: number | string;
	borderRadius?: number | string;
	/** Replaces the descriptor selection. Omitted flags are off; quit is managed separately. */
	customControls?: CustomVideoControls;
	showProgressIndicator?: boolean;
	quit?: 'inside' | 'outside' | 'none';
	onQuit?: () => void;
};
