import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { ToolTip } from '../sharedTypes';

export interface ToolTipBaseProps {
	tip?: ToolTip | null;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	backgroundColor?: ColorValue;
	textColor?: ColorValue;
	border?: boolean;
	borderColor?: ColorValue;
	padding?: number | string;
	borderRadius?: number | string;
	coords?: { x: number; y: number };
	showDelay?: number;
	hideDelay?: number;
	motionValues?: Variants;
	transition?: Transition;
}
export type ToolTipProps = ToolTipBaseProps &
	Omit<
		React.HTMLAttributes<HTMLDivElement>,
		| keyof ToolTipBaseProps
		| keyof React.AriaAttributes
		| 'color'
		| 'role'
		| 'children'
		| 'dangerouslySetInnerHTML'
		| 'onDrag'
		| 'onDragStart'
		| 'onDragEnd'
		| 'onAnimationStart'
	>;
