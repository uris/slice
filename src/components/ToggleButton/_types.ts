import type React from 'react';
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
	iconColor?: string;
	iconColorOn?: string;
	iconColorHover?: string;
	bgColor?: string;
	bgColorHover?: string;
	bgColorOn?: string;
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
