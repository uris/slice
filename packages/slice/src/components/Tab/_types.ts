import type React from 'react';

export type TabOption<T = string> = {
	value: T;
	label?: string;
	children?: React.ReactNode;
	icon?: string | null;
	toolTip?: string;
	count?: number;
	disabled?: boolean;
	id?: string;
	panelId?: string;
};
export type TabProps<T = string> = TabOption<T> &
	Omit<
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		keyof TabOption<T> | keyof React.AriaAttributes | 'onChange' | 'role' | 'type' | 'tabIndex'
	>;
