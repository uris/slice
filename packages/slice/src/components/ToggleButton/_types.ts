import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { AnimationPreset, ButtonAnimation } from '../IconButton';
import type { ToolTip } from '../sharedTypes';

export interface ToggleButtonProps {
	children?: React.ReactNode;
	label?: string;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	buttonSize?: 's' | 'm' | 'l' | 'xl';
	frameSize?: number;
	icon?: string;
	iconOn?: string;
	iconTwo?: string;
	selected?: boolean;
	iconColor?: ColorValue;
	iconColorOn?: ColorValue;
	iconColorHover?: ColorValue;
	backgroundColor?: ColorValue;
	backgroundColorHover?: ColorValue;
	backgroundColorOn?: ColorValue;
	onChange?: (state: boolean) => void;
	onSelect?: () => void;
	onToolTip?: (tip: ToolTip | null) => void;
	gap?: number;
	border?: boolean;
	iconSize?: number;
	tooltip?: string;
	fill?: boolean;
	unselect?: boolean;
	disabled?: boolean;
	presetAnimations?: AnimationPreset;
	customAnimations?: ButtonAnimation;
}
