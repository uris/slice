import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { ToolTip } from '../sharedTypes';

export type AvatarBaseProps<T = unknown> = {
	/** Optional application data passed unchanged as the second argument to every event callback. */
	info?: T;
	/** Width and height. Numbers use pixels; strings accept CSS lengths. */
	size?: number | string;
	/** Display name used for initials and identity labels. */
	name?: string;
	/** Identity fallback when the trimmed name is empty. */
	email?: string;
	/** Photo URL. Initials remain visible while loading and on failure. */
	image?: string;
	/** Opt into native browser lazy loading. Defaults to false. */
	lazyLoad?: boolean;
	/** Theme typography size for initials. Defaults to m. */
	textSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
	textColor?: ColorValue;
	backgroundColor?: ColorValue;
	borderWidth?: number;
	borderColor?: ColorValue;
	borderColorHover?: ColorValue;
	outerBorderWidth?: number;
	outerBorderColor?: ColorValue;
	/** Tooltip payload on hover or focus; null after both end. */
	onToolTip?: (tip: ToolTip | null, info: T | undefined) => void;
	onClick?: (e: React.MouseEvent<HTMLDivElement>, info: T | undefined) => void;
	onKeyDown?: (e: React.KeyboardEvent<HTMLDivElement>, info: T | undefined) => void;
	tabIndex?: number;
};

/** Preserve each native event's specific React type while adding the optional application data. */
type AvatarEventHandlers<T> = {
	[Key in keyof React.DOMAttributes<HTMLDivElement> as Key extends `on${string}` ? Key : never]: NonNullable<
		React.DOMAttributes<HTMLDivElement>[Key]
	> extends (event: infer Event) => void
		? (event: Event, info: T | undefined) => void
		: never;
};

export type AvatarProps<T = unknown> = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof AvatarBaseProps<T> | keyof AvatarEventHandlers<T> | 'color' | 'children'
> &
	AvatarBaseProps<T> &
	AvatarEventHandlers<T>;
