import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

export type LevelBaseProps = {
	audioStream?: MediaStream | MediaStreamTrack | null;
	playing?: boolean;
	backgroundColor?: ColorValue;
	colorActive?: string;
	borderRadius?: number | string;
	borderColor?: ColorValue;
	borderWidth?: number;
	width?: number | string;
	gap?: number;
	height?: number;
	minIntensity?: number;
	maxIntensity?: number;
	intensity?: number;
	peakIntensity?: number;
	risePerSeconds?: number;
	releasePerSeconds?: number;
	ReleasePerSeconds?: number;
};

export type LevelProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof LevelBaseProps> & LevelBaseProps;
