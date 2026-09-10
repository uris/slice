import type React from 'react';

type DivInputBaseProps = {
	name?: string;
	onClick?: () => void;
	onDblClick?: () => void;
	onChange?: (value: string | null) => void;
	onSubmit?: (value: string) => void;
	onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
	onBlur?: (value: string) => void;
	placeholder?: string;
	value?: string;
	isEditable?: boolean;
	wrap?: boolean;
	focus?: boolean;
	width?: number | string;
	textAlign?: 'left' | 'center' | 'right';
	clamp?: number;
	padding?: string;
	borderRadius?: number;
	radius?: number;
	backgroundColor?: string;
	bgColor?: string;
};

export type DivInputProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof DivInputBaseProps> & DivInputBaseProps;
