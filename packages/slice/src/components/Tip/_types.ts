import type { Transition, Variants } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { RadiusValue, SizeValue } from '../../theme/resolveSize';
import type { ElevationProps, ToolTip } from '../sharedTypes';

export interface ToolTipBaseProps extends ElevationProps {
	tip?: ToolTip | null;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	backgroundColor?: ColorValue;
	textColor?: ColorValue;
	border?: boolean;
	borderColor?: ColorValue;
	padding?: SizeValue;
	borderRadius?: RadiusValue;
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
