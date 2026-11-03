import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { IconButtonProps } from '../IconButton';

type ToggleButtonBaseProps = {
	actionName?: string;
	label?: string;
	labelOutside?: boolean;
	children?: React.ReactNode;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	textColor?: ColorValue;
	textColorHover?: ColorValue;
	textColorSelected?: ColorValue;
	iconSelected?: string;
	gap?: number;
	padding?: number | string;
	paddingTop?: number | string;
	paddingRight?: number | string;
	paddingBottom?: number | string;
	paddingLeft?: number | string;
	deselect?: boolean;
};

export type ToggleButtonProps = Omit<IconButtonProps, 'toggle' | 'count' | 'showDot' | 'onSelect'> &
	ToggleButtonBaseProps;
