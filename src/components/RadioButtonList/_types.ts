import type React from 'react';
import type { RadioButtonOption } from '../RadioButton';

type RadioButtonListBaseProps<T = string> = {
	options?: RadioButtonOption<T>[];
	selectedIndexes?: number[] | null;
	selectedOptions?: string[] | null;
	label?: string | null;
	deselect?: boolean;
	multiSelect?: boolean;
	wrap?: boolean;
	spacer?: 'xl' | 'lg' | 'md' | 'sm' | 'custom' | 'none';
	custom?: number;
	gap?: number;
	tabIndexSeed?: number;
	hideRadio?: boolean;
	toggleIcon?: boolean;
	iconColor?: string;
	iconSelectedColor?: string;
	noFrame?: boolean;
	icon?: string;
	checkedIcon?: string;
	width?: number | string;
	onChange?: (options: RadioButtonOption<T>[] | null, indexes: number[] | null) => void;
};

export type RadioButtonListProps<T = string> = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof RadioButtonListBaseProps
> &
	RadioButtonListBaseProps<T>;
