import type React from 'react';

type ProgressIndicatorBaseProps = {
	size?: number | string;
	secondsPerSpin?: number;
	show?: boolean;
	color?: string;
	stroke?: number;
	duration?: number;
	inline?: boolean;
	inset?: boolean;
	didStart?: () => void;
	didStop?: () => void;
};

export type ProgressIndicatorProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof ProgressIndicatorBaseProps> &
	ProgressIndicatorBaseProps;
