import type React from 'react';

type SliderBaseProps = {
	value?: number;
	scaleMin?: number;
	scaleMax?: number;
	width?: number | string;
	height?: number | string;
	touchHeight?: number | string;
	trackHeadSize?: number | null;
	headColor?: string;
	trackColor?: string;
	progressColor?: string;
	trackHeadBorderSize?: number;
	trackHeadBorderColor?: string;
	step?: number;
	disabled?: boolean;
	disabledOpacity?: number;
	cursor?: 'default' | 'grab' | 'grabbing' | 'pointer';
	onChange?: (value: number, percent: number) => void;
	onDragChange?: (value: number, percent: number) => void;
};

export type SliderProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof SliderBaseProps> & SliderBaseProps;
