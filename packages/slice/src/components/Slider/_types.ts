import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type SliderBaseProps = {
	value?: number;
	scaleMin?: number;
	scaleMax?: number;
	width?: number | string;
	height?: number | string;
	touchHeight?: number | string;
	trackHeadSize?: number | null;
	headRadius?: string | number | null;
	headColor?: ColorValue;
	trackColor?: ColorValue;
	progressColor?: ColorValue;
	trackHeadBorderSize?: number;
	trackHeadBorderColor?: ColorValue;
	step?: number;
	disabled?: boolean;
	disabledOpacity?: number;
	cursor?: 'default' | 'grab' | 'grabbing' | 'pointer';
	onChange?: (value: number, percent: number) => void;
	onDragChange?: (value: number, percent: number) => void;
};

export type SliderProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof SliderBaseProps> & SliderBaseProps;
