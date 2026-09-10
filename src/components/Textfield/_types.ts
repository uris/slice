import type { Transition } from 'motion/react';
import type React from 'react';

type TextFieldBaseProps = {
	value?: string;
	name?: string;
	label?: string;
	labelSize?: 'xs' | 's' | 'm' | 'l';
	textSize?: 'xs' | 's' | 'm' | 'l';
	placeholder?: string;
	focused?: boolean;
	editable?: boolean;
	onChange?: (value: string) => void;
	onBlur?: (value: string) => void;
	onFocus?: (value: string) => void;
	onKeydown?: (key: string, event: React.KeyboardEvent) => void;
	onSubmit?: (value: string) => void;
	onPaste?: (value: React.ClipboardEvent<HTMLInputElement>) => void;
	onClear?: () => void;
	onAction?: () => void;
	error?: boolean;
	inline?: boolean;
	maxLength?: number;
	size?: { width?: number | string; height?: number | string };
	padding?: string | number;
	borderRadius?: number | string;
	textAlign?: 'left' | 'center';
	borderColorFocused?: string;
	borderColorBlurred?: string;
	borderColorError?: string;
	backgroundColorFocused?: string;
	backgroundColorBlurred?: string;
	textColorFocused?: string;
	textColorBlurred?: string;
	textColorError?: string;
	textColorPlaceholder?: string;
	textColorDisabled?: string;
	labelColor?: string;
	iconLeft?: { name?: string; size?: number; color?: string };
	clearButton?: { size?: number } | null;
	clearBlurs?: boolean;
	disabled?: boolean;
	actionButton?: boolean;
	borderType?: 'box' | 'underline' | 'none';
	inputType?: 'text' | 'password';
	noShow?: boolean;
};

export type TextFieldProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof TextFieldBaseProps> & TextFieldBaseProps;

export const MOTION_CONFIG = {
	variants: {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
	},
	transition: { ease: 'easeInOut', duration: 0.25 } as Transition,
};
