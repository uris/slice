import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

export type AudioLevelBaseProps = {
	audioStream?: MediaStream | MediaStreamTrack | null;
	playing?: boolean;
	levelName?: string;
	backgroundColor?: ColorValue;
	backgroundColorActive?: ColorValue;
	borderRadius?: number | string;
	borderColor?: ColorValue;
	borderWidth?: number;
	width?: number | string;
	gap?: number;
	height?: number;
	minActiveBars?: number;
	barCount?: number;
	intensity?: number;
	peakIntensity?: number;
	risePerSeconds?: number;
	releasePerSeconds?: number;
};

export type AudioLevelProps = Omit<
	React.HTMLAttributes<HTMLDivElement>,
	keyof AudioLevelBaseProps | keyof React.AriaAttributes | 'role'
> &
	AudioLevelBaseProps;
