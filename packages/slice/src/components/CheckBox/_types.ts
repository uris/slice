import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type CheckBoxBaseProps = {
	children?: React.ReactNode | string;
	size?: number;
	checked?: 'mixed' | boolean;
	disabled?: boolean;
	color?: ColorValue;
	onChange?: (state: boolean) => void;
};

export type CheckBoxProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof CheckBoxBaseProps> & CheckBoxBaseProps;
