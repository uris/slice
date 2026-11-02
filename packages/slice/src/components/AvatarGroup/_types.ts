import type React from 'react';
import type { AvatarProps } from '../Avatar';
import type { ToolTip } from '../sharedTypes';

export type AvatarInfo = Pick<AvatarProps, 'image' | 'email' | 'textColor' | 'backgroundColor'> & {
	/** Unique, stable identity within the group. Used as the React key, not a DOM id. */
	id?: string | number;
	first?: string;
	last?: string;
};

export type AvatarGroupBaseProps = Pick<
	AvatarProps,
	'borderWidth' | 'borderColor' | 'borderColorHover' | 'outerBorderWidth' | 'outerBorderColor' | 'lazyLoad' | 'textSize'
> & {
	avatars?: AvatarInfo[] | null;
	size?: number;
	overlap?: number;
	gap?: number;
	margin?: number;
	onToolTip?: (tip: ToolTip | null) => void;
};

export type AvatarGroupProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof AvatarGroupBaseProps | 'color' | 'children'
> &
	AvatarGroupBaseProps;
