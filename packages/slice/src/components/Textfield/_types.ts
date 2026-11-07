import type { Transition } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { Type } from '../../theme/type/types';
import type { SliceIcon } from '../Icon/_types';

type NativeInputAttributes = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	| keyof React.AriaAttributes
	| 'children'
	| 'className'
	| 'style'
	| 'role'
	| 'id'
	| 'name'
	| 'type'
	| 'value'
	| 'defaultValue'
	| 'size'
	| 'disabled'
	| 'readOnly'
	| 'placeholder'
	| 'maxLength'
	| 'onChange'
	| 'onFocus'
	| 'onBlur'
	| 'onKeyDown'
	| 'onPaste'
	| 'onSubmit'
>;
type TextFieldBaseProps = {
	value?: string;
	defaultValue?: string;
	name?: string;
	inputName?: string;
	inputId?: string;
	inputAttributes?: NativeInputAttributes;
	label?: string;
	variant?: 'simple' | 'stacked' | 'outlined';
	behavior?: 'persistent' | 'appear';
	stackedGap?: number;
	labelBackgroundColor?: ColorValue;
	stackedLabelTextSize?: keyof Type;
	labelSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	placeholder?: string;
	focused?: boolean;
	readOnly?: boolean;
	onChange?: (value: string) => void;
	onBlur?: (value: string) => void;
	onFocus?: (value: string) => void;
	onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	onSubmit?: (value: string) => void;
	onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
	onClear?: () => void;
	onAction?: () => void;
	error?: boolean;
	errorMessage?: string;
	tip?: string;
	inline?: boolean;
	maxLength?: number;
	width?: number | string;
	height?: number | string;
	padding?: string | number;
	/** Defaults to 0 for underline borders, otherwise 8px. */
	borderRadius?: number | string;
	textAlign?: 'left' | 'center';
	borderColorFocused?: ColorValue;
	borderColorBlurred?: ColorValue;
	borderColorError?: ColorValue;
	/** Defaults to transparent for underline borders, otherwise core-surface-secondary. */
	backgroundColorFocused?: ColorValue;
	/** Defaults to transparent for underline borders, otherwise core-surface-secondary. */
	backgroundColorBlurred?: ColorValue;
	textColorFocused?: ColorValue;
	textColorBlurred?: ColorValue;
	textColorError?: ColorValue;
	textColorPlaceholder?: ColorValue;
	textColorDisabled?: ColorValue;
	labelColor?: ColorValue;
	iconLeft?: { name?: SliceIcon; size?: number; color?: ColorValue };
	clearButton?: { size?: number } | null;
	clearBlurs?: boolean;
	disabled?: boolean;
	actionButton?: boolean;
	actionLabel?: string;
	borderStyle?: 'box' | 'underline' | 'none';
	inputType?: 'text' | 'password';
	showPasswordToggle?: boolean;
	transition?: Transition;
};
export type TextFieldProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof TextFieldBaseProps | keyof React.AriaAttributes | 'role'
> &
	TextFieldBaseProps;
