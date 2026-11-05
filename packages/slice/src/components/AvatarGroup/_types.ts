import type React from 'react';
import type { AvatarProps } from '../Avatar';
import type { ToolTip } from '../sharedTypes';

export type AvatarInfo = Pick<AvatarProps, 'image' | 'email' | 'textColor' | 'backgroundColor'> & {
	/** Unique, stable identity within the group. Used as the React key, not a DOM id. */
	id?: string | number;
	first?: string;
	last?: string;
};

/** Overflow lists preserve input order and exclude the generated +N avatar. */
export type AvatarGroupMore =
	| { source: 'avatars'; more: AvatarInfo[]; all: AvatarInfo[] }
	| { source: 'children'; more: React.ReactNode[]; all: React.ReactNode[] };

export type AvatarGroupBaseProps = Pick<
	AvatarProps,
	| 'backgroundColor'
	| 'borderWidth'
	| 'borderColor'
	| 'borderColorHover'
	| 'outerBorderWidth'
	| 'outerBorderColor'
	| 'lazyLoad'
	| 'textSize'
> & {
	/** Used only when children is undefined. */
	avatars?: AvatarInfo[] | null;
	/** Avatar children replace avatars, including when null or empty. */
	children?: React.ReactNode;
	/** Maximum visible people, followed by a +N avatar when needed. Omitted means unlimited. */
	limit?: number;
	/** Runs when the overflow avatar is clicked or activated by keyboard. */
	onMore?: (details: AvatarGroupMore) => void;
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
