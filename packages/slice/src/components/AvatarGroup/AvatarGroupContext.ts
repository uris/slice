'use client';

import { createContext } from 'react';
import type { AvatarProps } from '../Avatar';

type AvatarGroupDefaults = Pick<
	AvatarProps,
	| 'backgroundColor'
	| 'size'
	| 'lazyLoad'
	| 'textSize'
	| 'borderWidth'
	| 'borderColor'
	| 'borderColorHover'
	| 'outerBorderWidth'
	| 'outerBorderColor'
	| 'onToolTip'
>;

export const AvatarGroupContext = createContext<{
	avatarProps: AvatarGroupDefaults;
	itemClassName: string;
} | null>(null);
