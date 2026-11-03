import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

type SliderBaseProps = {
	value?: number;
	defaultValue?: number;
	min?: number;
	max?: number;
	width?: number | string;
	height?: number | string;
	touchHeight?: number | string;
	trackHeadSize?: number | null;
	trackHeadOnHover?: true;
	trackHeadBorderRadius?: string | number | null;
	trackHeadColor?: ColorValue;
	trackColor?: ColorValue;
	progressColor?: ColorValue;
	trackHeadBorderWidth?: number;
	trackHeadBorderColor?: ColorValue;
	/** Keyboard increment only; pointer dragging remains continuous. */
	step?: number;
	disabled?: boolean;
	disabledOpacity?: number;
	cursor?: 'default' | 'grab' | 'grabbing' | 'pointer';
	onChange?: (value: number, percent: number) => void;
	onChangeEnd?: (value: number, percent: number) => void;
};

/** Native attributes and events target the range input; className/style target the visual wrapper. */
export type SliderProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	keyof SliderBaseProps | 'type' | 'size' | 'children' | 'dangerouslySetInnerHTML' | 'readOnly'
> &
	SliderBaseProps;
