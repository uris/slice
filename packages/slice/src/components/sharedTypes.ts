import type React from 'react';

export type ToolTip = {
	type?: ToolTipType;
	payload?: { label: string; duration?: number };
	ref?: React.RefObject<any> | null;
	event?: MouseEvent | React.MouseEvent<any>;
};

export enum ToolTipType {
	menu = 'menu',
	button = 'button',
	general = 'general',
	other = 'other',
}

export type ToolTipInfo = {
	title?: string | null;
	description?: string | null;
	image?: string | null;
};
