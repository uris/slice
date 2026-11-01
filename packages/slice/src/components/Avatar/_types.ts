import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { ToolTip } from '../sharedTypes';

export type AvatarBaseProps = {
	size?: number | string;
	frame?: number | string;
	name?: string;
	email?: string;
	textColor?: ColorValue;
	image?: string;
	color?: ColorValue;
	borderWidth?: number;
	borderSize?: number;
	borderColor?: ColorValue;
	borderColorHover?: ColorValue;
	backgroundColor?: ColorValue;
	fontSize?: number | string;
	onToolTip?: (tip: ToolTip | null) => void;
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
	tabIndex?: number;
	outerBorderSize?: number;
	outerBorderColor?: ColorValue;
};

export type AvatarProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof AvatarBaseProps> & AvatarBaseProps;
