import type { HTMLMotionProps, TargetAndTransition, VariantLabels } from 'motion/react';
import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

export enum Size {
	Grow = 'grow',
	Fill = 'fill',
	Fit = 'fit',
	Viewport = 'viewport',
	Auto = 'auto',
}

export enum Preset {
	Default = 'default',
	FillStart = 'fill-start',
	FillCenter = 'fill-center',
	FillCenterMiddle = 'fill-center-middle',
	FillEnd = 'fill-end',
	FillWrap = 'fill-wrap',
	FillScroll = 'fill-scroll',
	Window = 'window',
	Row = 'row',
	RowBetween = 'row-between',
	Column = 'column',
	ColumnBetween = 'column-between',
	Draggable = 'draggable',
}

type FlexBoxLayout = Required<
	Pick<FlexBoxBaseProps, 'width' | 'height' | 'justify' | 'align' | 'direction' | 'shrinkChildren'>
> &
	Pick<FlexBoxBaseProps, 'flex' | 'scrollX' | 'scrollY' | 'overflow' | 'wrap'> & {
		alignContent?: React.CSSProperties['alignContent'];
	};

export const layoutSets: Record<Preset, FlexBoxLayout> = {
	[Preset.Default]: {
		width: 'fill',
		height: 'fit',
		justify: 'start',
		align: 'start',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'column',
		shrinkChildren: false,
	},
	[Preset.FillScroll]: {
		width: 'fill',
		flex: 1,
		height: 'fill',
		justify: 'start',
		align: 'start',
		scrollY: true,
		scrollX: false,
		overflow: 'hidden',
		direction: 'column',
		shrinkChildren: false,
	},
	[Preset.FillStart]: {
		width: 'fill',
		flex: 1,
		height: 'fill',
		justify: 'start',
		align: 'start',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'column',
		shrinkChildren: false,
	},
	[Preset.FillWrap]: {
		width: 'fill',
		flex: 1,
		height: 'fill',
		justify: 'start',
		align: 'start',
		alignContent: 'flex-start',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'row',
		wrap: true,
		shrinkChildren: false,
	},
	[Preset.FillCenter]: {
		width: 'fill',
		flex: 1,
		height: 'fill',
		justify: 'start',
		align: 'center',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'column',
		shrinkChildren: false,
	},
	[Preset.FillCenterMiddle]: {
		width: 'fill',
		flex: 1,
		height: 'fill',
		justify: 'center',
		align: 'center',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'column',
		shrinkChildren: false,
	},
	[Preset.FillEnd]: {
		width: 'fill',
		flex: 1,
		height: 'fill',
		justify: 'start',
		align: 'end',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'column',
		shrinkChildren: false,
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
		shrinkChildren: false,
	},
	[Preset.Row]: {
		width: 'fit',
		height: 'fit',
		justify: 'start',
		align: 'center',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'row',
		shrinkChildren: false,
	},
	[Preset.RowBetween]: {
		width: 'fill',
		height: 'fit',
		justify: 'between',
		align: 'center',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'row',
		shrinkChildren: false,
	},
	[Preset.Column]: {
		width: 'fit',
		height: 'fit',
		justify: 'start',
		align: 'start',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'column',
		shrinkChildren: false,
	},
	[Preset.ColumnBetween]: {
		width: 'fit',
		height: 'fill',
		justify: 'between',
		align: 'start',
		scrollY: false,
		scrollX: false,
		overflow: 'hidden',
		direction: 'column',
		shrinkChildren: false,
	},
	[Preset.Draggable]: {
		width: 'fit',
		height: 'fill',
		justify: 'start',
		align: 'start',
		scrollY: undefined,
		scrollX: undefined,
		overflow: 'visible',
		direction: 'column',
		shrinkChildren: false,
	},
};

type FlexBoxBaseProps = {
	className?: string;
	children?: React.ReactNode;
	preset?: Preset;
	scrollBox?: boolean;
	scrollY?: boolean;
	scrollX?: boolean;
	absolute?: boolean;
	background?: ColorValue;
	direction?: 'row' | 'column';
	align?: 'start' | 'center' | 'end';
	justify?: 'start' | 'top' | 'center' | 'end' | 'bottom' | 'between';
	width?: number | Size | string;
	height?: number | Size | string;
	maxWidth?: number | string;
	centerSelf?: boolean;
	flex?: number;
	reverse?: boolean;
	wrap?: boolean;
	border?: string;
	overflow?: React.CSSProperties['overflow'];
	padding?: number | string;
	margin?: number | string;
	animate?: boolean | TargetAndTransition | VariantLabels;
	gap?: number;
	borderRadius?: number | string;
	scrollHandle?: ColorValue;
	scrollHandleHover?: ColorValue;
	shrinkChildren?: boolean;
	growChildren?: boolean;
};

export type FlexBoxProps = Omit<HTMLMotionProps<'div'>, keyof FlexBoxBaseProps> & FlexBoxBaseProps;
