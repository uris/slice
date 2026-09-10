import type React from 'react';

export type LevelBaseProps = {
	audioStream?: MediaStream | MediaStreamTrack | null;
	playing?: boolean;
	backgroundColor?: string;
	colorActive?: string;
	borderRadius?: number | string;
	borderColor?: string;
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
