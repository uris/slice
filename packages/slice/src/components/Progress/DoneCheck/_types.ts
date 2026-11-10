import type React from 'react';
import type { ColorValue } from '../../../theme/colors/resolveColor';

type DoneCheckBaseProps = {
	statusLabel?: string;
	decorative?: boolean;
	size?: number;
	color?: ColorValue;
	stroke?: number;
	duration?: number;
	delay?: number;
	play?: boolean;
	didStart?: () => void;
	didEnd?: () => void;
};

export type DoneCheckProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof DoneCheckBaseProps | keyof React.AriaAttributes | 'role' | 'children'
> &
	DoneCheckBaseProps;
