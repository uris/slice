import type React from 'react';

type TextAreaBaseProps = {
	value?: string;
	name?: string;
	width?: number | string;
	height?: number | string;
	minWidth?: number | string;
	rows?: number;
	focused?: boolean;
	placeholder?: string;
	padding?: number | string;
	error?: boolean;
	border?: boolean;
	resizable?: boolean;
	hasSend?: boolean;
	sendOffset?: { bottom: number; right: number };
	sendSize?: number;
	backgroundColor?: string;
	bgColor?: string;
	borderRadius?: number;
	returnSubmits?: boolean;
	textSize?: 'xs' | 's' | 'm' | 'l';
	disabled?: boolean;
	submitClears?: boolean;
	maxLength?: number;
	onChange?: (value: string) => void;
	onSubmit?: (value: string) => void;
	onFocus?: (value: string) => void;
	onBlur?: (value: string) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
};

export type TextAreaProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof TextAreaBaseProps> & TextAreaBaseProps;

export type Tip = {
	icon?: string;
	iconRight?: boolean;
	key: string;
	label?: string;
};
