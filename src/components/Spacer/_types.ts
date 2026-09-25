import type React from 'react';
import type { SpacingGrid } from '../../theme/spacing/_types';

type SpacerBaseProps = {
	size?: keyof SpacingGrid;
};

export type SpacerProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof SpacerBaseProps> & SpacerBaseProps;
