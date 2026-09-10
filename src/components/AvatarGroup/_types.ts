import type React from 'react';
import type { ToolTip } from '../sharedTypes';

export type AvatarInfo = {
	first?: string;
	last?: string;
	image?: any;
	avatar?: string;
	email?: string;
	textColor?: string;
	color?: string;
	backgroundColor?: string;
	bgColor?: string;
};

export type AvatarGroupBaseProps = {
	avatars?: AvatarInfo[] | null;
	size?: number;
	overlap?: number;
	borderWidth?: number;
	borderSize?: number;
	borderColor?: string;
	borderColorHover?: string;
	gap?: number;
	margin?: number;
	outerBorderSize?: number;
	outerBorderColor?: string;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type AvatarGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof AvatarGroupBaseProps> &
	AvatarGroupBaseProps;
