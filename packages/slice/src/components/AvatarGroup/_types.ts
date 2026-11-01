import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { ToolTip } from '../sharedTypes';

export type AvatarInfo = {
	first?: string;
	last?: string;
	image?: any;
	avatar?: string;
	email?: string;
	textColor?: ColorValue;
	color?: ColorValue;
	backgroundColor?: ColorValue;
};

export type AvatarGroupBaseProps = {
	avatars?: AvatarInfo[] | null;
	size?: number;
	overlap?: number;
	borderWidth?: number;
	borderSize?: number;
	borderColor?: ColorValue;
	borderColorHover?: ColorValue;
	gap?: number;
	margin?: number;
	outerBorderSize?: number;
	outerBorderColor?: ColorValue;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type AvatarGroupProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof AvatarGroupBaseProps> &
	AvatarGroupBaseProps;
