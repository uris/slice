import type React from 'react';

export type AudioBubbleBaseProps = {
	audioStream?: MediaStream | MediaStreamTrack | null;
	playing?: boolean;
	size?: number;
	backgroundColor?: string;
	glow?: boolean;
	glowColor?: string;
	glowSize?: number;
	glowOffset?: number;
	minScale?: number;
	maxScale?: number;
	intensity?: number;
	peakIntensity?: number;
	risePerSeconds?: number;
	ReleasePerSeconds?: number;
};

export type AudioBubbleProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof AudioBubbleBaseProps> &
	AudioBubbleBaseProps;
