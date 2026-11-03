import type { Transition } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type PagerBaseProps = {
	size?: number;
	selectedIndex?: number;
	defaultSelectedIndex?: number;
	color?: ColorValue;
	colorOn?: ColorValue;
	colorHover?: ColorValue;
	pages?: number;
	gap?: number;
	/** Scale of the selected dot. */
	scale?: number;
	/** Multiplier applied for each page away from the selection. */
	scaleFactor?: number;
	minScale?: number;
	/** Fade opacity by scaleFactor for each page away from the selection. */
	opacityScales?: boolean;
	maxVisiblePages?: number;
	/** One-based visible-dot trigger, mirrored backward. Reaching it centers selection when possible. Must be less than the visible count. */
	showMoreOn?: number;
	/** Settings merged with Water for sliding, scaling, opacity, and color changes. */
	transition?: Transition;
	onChange?: (index: number) => void;
};

/** A group of native page buttons. Motion gestures are not a public API. */
export type PagerProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof PagerBaseProps | 'children' | 'dangerouslySetInnerHTML'
> &
	PagerBaseProps;
