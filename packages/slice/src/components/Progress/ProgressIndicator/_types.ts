import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../../theme/colors/resolveColor';

export interface ProgressIndicatorBaseProps {
	size?: number | string;
	secondsPerSpin?: number;
	show?: boolean;
	color?: ColorValue;
	stroke?: number;
	/** Playback limit in seconds. Zero stops immediately; omitted/invalid values have no limit. */
	duration?: number;
	inline?: boolean;
	inset?: boolean;
	/** Task text for the status announcement and optional visible label. */
	label?: string;
	/** Opt into visible label text; defaults to false. */
	displayLabel?: boolean;
	labelPosition?: 'left' | 'right' | 'top' | 'bottom';
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	textColor?: ColorValue;
	decorative?: boolean;
	motionValues?: Variants;
	transition?: Transition;
	onStart?: () => void;
	onStop?: () => void;
}
export type ProgressIndicatorProps = ProgressIndicatorBaseProps &
	Omit<
		React.HTMLAttributes<HTMLDivElement>,
		| keyof ProgressIndicatorBaseProps
		| keyof React.AriaAttributes
		| 'role'
		| 'children'
		| 'dangerouslySetInnerHTML'
		| 'onDrag'
		| 'onDragStart'
		| 'onDragEnd'
		| 'onAnimationStart'
		| 'tabIndex'
	>;
