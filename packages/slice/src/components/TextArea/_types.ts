import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type NativeInputAttributes = Omit<
	React.TextareaHTMLAttributes<HTMLTextAreaElement>,
	| keyof React.AriaAttributes
	| 'children'
	| 'className'
	| 'style'
	| 'role'
	| 'id'
	| 'name'
	| 'value'
	| 'defaultValue'
	| 'disabled'
	| 'readOnly'
	| 'placeholder'
	| 'maxLength'
	| 'rows'
	| 'onChange'
	| 'onFocus'
	| 'onBlur'
	| 'onKeyDown'
	| 'onPaste'
	| 'onSubmit'
>;
type TextAreaBaseProps = {
	/** Native editor ref for composed controls and imperative focus. */
	inputRef?: React.Ref<HTMLTextAreaElement>;
	value?: string;
	defaultValue?: string;
	name?: string;
	inputName?: string;
	inputId?: string;
	inputAttributes?: NativeInputAttributes;
	label?: string;
	labelSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	labelColor?: ColorValue;
	width?: number | string;
	height?: number | string;
	maxHeight?: number | string;
	minWidth?: number | string;
	rows?: number;
	autoGrow?: boolean;
	focused?: boolean;
	placeholder?: string;
	padding?: number | string;
	error?: boolean;
	errorMessage?: string;
	tip?: string;
	borderStyle?: 'box' | 'underline' | 'none';
	borderColor?: ColorValue;
	borderColorFocused?: ColorValue;
	borderColorError?: ColorValue;
	resizable?: boolean;
	showSendButton?: boolean;
	sendActionName?: string;
	sendOffset?: { bottom: number; right: number };
	sendSize?: number;
	backgroundColor?: ColorValue;
	borderRadius?: number | string;
	returnSubmits?: boolean;
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	textColor?: ColorValue;
	textColorDisabled?: ColorValue;
	textColorPlaceholder?: ColorValue;
	textColorError?: ColorValue;
	disabled?: boolean;
	readOnly?: boolean;
	/** Composed editors may submit associated content even when the text is empty. */
	allowEmptySubmit?: boolean;
	submitClears?: boolean;
	maxLength?: number;
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
	onFocus?: (value: string) => void;
	onBlur?: (value: string) => void;
	onKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
	onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
};
export type TextAreaProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof TextAreaBaseProps | keyof React.AriaAttributes | 'role'
> &
	TextAreaBaseProps;
