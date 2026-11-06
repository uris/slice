import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { SliceIcon } from '../Icon/_types';
import type { IconButtonProps } from '../IconButton';
import type { ButtonStyleProps, FixedSize } from '../sharedTypes';

type ToggleButtonBaseProps = ButtonStyleProps & {
	actionName?: string;
	label?: string;
	labelOutside?: boolean;
	children?: React.ReactNode;
	textSize?: FixedSize;
	textColor?: ColorValue;
	textColorHover?: ColorValue;
	textColorSelected?: ColorValue;
	iconSelected?: SliceIcon;
	deselect?: boolean;
};

export type ToggleButtonProps = Omit<IconButtonProps, 'toggle' | 'count' | 'showDot' | 'onSelect' | 'buttonSize'> &
	ToggleButtonBaseProps;
