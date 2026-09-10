import type { Transition } from 'motion/react';
import type React from 'react';

export enum Size {
	Grow = 'grow',
	Fill = 'fill',
	Fit = 'fit',
	Viewport = 'viewport',
	Auto = 'auto',
}

export enum Preset {
	FillScroll = 'fill-scroll',
	FillCenter = 'fill-center',
	FillStart = 'fill-start',
	Window = 'window',
	Row = 'row',
	RowBetween = 'row-between',
	Column = 'column',
	Default = 'default',
	Draggable = 'draggable',
}

export const layoutSets = {
	[Preset.FillScroll]: {
		width: 'fill',
		height: 'fill',
		justify: 'start',
		align: 'start',
		scrollY: true,
		scrollX: false,
		overflow: 'hidden',
		direction: 'column',
	},
	[Preset.FillCenter]: {
		width: 'fill',
		height: 'fill',
		justify: 'center',
		align: 'center',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'column',
	},
	[Preset.FillStart]: {
		width: 'fill',
		height: 'fill',
		justify: 'start',
		align: 'start',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'column',
	},
	[Preset.Window]: {
		width: 'viewport',
		height: 'viewport',
		justify: 'start',
		align: 'start',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'row',
	},
	[Preset.Row]: {
		width: 'fill',
		height: 'fit',
		justify: 'start',
		align: 'center',
		scrollY: undefined,
		scrollX: undefined,
		overflow: 'hidden',
		direction: 'row',
	},
	[Preset.RowBetween]: {
		width: 'fill',
		height: 'fit',
		justify: 'between',
		align: 'center',
		scrollY: undefined,
		scrollX: undefined,
		overflow: 'hidden',
		direction: 'row',
	},
	[Preset.Column]: {
		width: 'fill',
		height: 'fit',
		justify: 'start',
		align: 'start',
		scrollY: undefined,
		scrollX: undefined,
		overflow: 'hidden',
		direction: 'column',
	},
	[Preset.Default]: {
		width: 'fill',
		height: 'fit',
		justify: 'start',
		align: 'start',
		scrollY: undefined,
		scrollX: undefined,
		overflow: 'hidden',
		direction: 'column',
	},
	[Preset.Draggable]: {
		width: 'auto',
		height: 'fill',
		justify: 'start',
		align: 'start',
		scrollY: undefined,
		scrollX: undefined,
		overflow: 'visible',
		direction: 'column',
	},
};

type FlexDivBaseProps = {
	className?: string;
	children?: any;
	preset?: Preset;
	scrollBox?: boolean;
	scrollY?: boolean;
	scrollX?: boolean;
	absolute?: boolean;
	background?: string;
	direction?: 'row' | 'column';
	align?: 'start' | 'center' | 'end' | 'between';
	justify?: 'start' | 'top' | 'center' | 'end' | 'bottom' | 'between';
	width?: number | Size | string;
	height?: number | Size | string;
	maxWidth?: number | string;
	centerSelf?: boolean | string;
	flex?: number;
	reverse?: boolean;
	wrap?: boolean;
	border?: string;
	padding?: number | string;
	margin?: number | string;
	enter?: any;
	exit?: any;
	animate?: any;
	transition?: Transition;
	variants?: any;
	gap?: number;
	borderRadius?: number;
	scrollHandle?: string;
	scrollHandleHover?: string;
};

export type FlexDivProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof FlexDivBaseProps> & FlexDivBaseProps;
