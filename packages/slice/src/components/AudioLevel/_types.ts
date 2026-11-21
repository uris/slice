import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { RadiusValue, SizeValue } from '../../theme/resolveSize';

export type AudioLevelBaseProps = {
	audioStream?: MediaStream | MediaStreamTrack | null;
	playing?: boolean;
	levelName?: string;
	backgroundColor?: ColorValue;
	backgroundColorActive?: ColorValue;
	borderRadius?: RadiusValue;
	borderColor?: ColorValue;
	borderWidth?: number;
	width?: number | string;
	gap?: SizeValue;
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
