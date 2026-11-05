import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type CheckBoxBaseProps = {
	align?: 'top' | 'middle' | 'bottom';
	children?: React.ReactNode;
	label?: string;
	checked?: 'mixed' | boolean;
	disabled?: boolean;
	iconChecked?: string;
	iconUnChecked?: string;
	iconPartial?: string;
	iconColor?: ColorValue;
	iconColorSelected?: ColorValue;
	iconSize?: number;
	gap?: number;
	textColor?: ColorValue;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	textTopOffset?: number;
	onChange?: (state: boolean) => void;
};

export type CheckBoxProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof CheckBoxBaseProps | 'color'> &
	CheckBoxBaseProps;
