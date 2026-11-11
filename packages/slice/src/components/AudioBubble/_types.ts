import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

export type AudioBubbleBaseProps = {
	audioStream?: MediaStream | MediaStreamTrack | null;
	playing?: boolean;
	size?: number;
	backgroundColor?: ColorValue;
	glow?: boolean;
	glowColor?: ColorValue;
	glowSize?: number;
	glowOffset?: number;
	minScale?: number;
	maxScale?: number;
	intensity?: number;
	peakIntensity?: number;
	risePerSeconds?: number;
	releasePerSeconds?: number;
};

export type AudioBubbleProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof AudioBubbleBaseProps> &
	AudioBubbleBaseProps;
