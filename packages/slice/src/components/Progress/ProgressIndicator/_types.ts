import type React from 'react';
import type { ColorValue } from '../../../theme/colors/resolveColor';

type ProgressIndicatorBaseProps = {
	size?: number | string;
	secondsPerSpin?: number;
	show?: boolean;
	color?: ColorValue;
	stroke?: number;
	duration?: number;
	inline?: boolean;
	inset?: boolean;
	didStart?: () => void;
	didStop?: () => void;
};

export type ProgressIndicatorProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof ProgressIndicatorBaseProps> &
	ProgressIndicatorBaseProps;
