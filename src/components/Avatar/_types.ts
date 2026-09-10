import type React from 'react';
import type { ToolTip } from '../sharedTypes';

export type AvatarBaseProps = {
	size?: number | string;
	frame?: number | string;
	name?: string;
	email?: string;
	textColor?: string;
	image?: string;
	color?: string;
	borderWidth?: number;
	borderSize?: number;
	borderColor?: string;
	borderColorHover?: string;
	backgroundColor?: string;
	bgColor?: string;
	fontSize?: number | string;
	onToolTip?: (tip: ToolTip | null) => void;
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
	tabIndex?: number;
	outerBorderSize?: number;
	outerBorderColor?: string;
};

export type AvatarProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof AvatarBaseProps> & AvatarBaseProps;
