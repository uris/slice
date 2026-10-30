import type React from 'react';

type BadgeBaseProps = {
	count?: number | string;
	hideNull?: boolean;
	variant?: 'light' | 'dark';
};

export type BadgeProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof BadgeBaseProps> & BadgeBaseProps;
