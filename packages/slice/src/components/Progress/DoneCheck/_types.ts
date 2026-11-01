import type React from 'react';
import type { ColorValue } from '../../../theme/colors/resolveColor';

type DoneCheckBaseProps = {
	size?: number;
	color?: ColorValue;
	stroke?: number;
	duration?: number;
	delay?: number;
	play?: boolean;
	didStart?: () => void;
	didEnd?: () => void;
};

export type DoneCheckProps = Omit<React.SVGAttributes<SVGSVGElement>, keyof DoneCheckBaseProps> & DoneCheckBaseProps;
