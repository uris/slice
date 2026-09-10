import type React from 'react';

type CheckBoxBaseProps = {
	children?: React.ReactNode | string;
	size?: number;
	checked?: 'mixed' | boolean;
	disabled?: boolean;
	color?: string;
	onChange?: (state: boolean) => void;
};

export type CheckBoxProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof CheckBoxBaseProps> & CheckBoxBaseProps;
