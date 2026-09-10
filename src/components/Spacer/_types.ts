import type React from 'react';

type SpacerBaseProps = {
	size?: number;
};

export type SpacerProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof SpacerBaseProps> & SpacerBaseProps;
