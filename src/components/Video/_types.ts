import type React from 'react';

export type CustomVideoControls = {
	play?: boolean;
	fullscreen?: boolean;
	progress?: boolean;
	volume?: boolean;
	quit?: boolean;
};

export enum PlayState {
	Playing = 'playing',
	Paused = 'paused',
	Stopped = 'stopped',
	Ended = 'ended',
}

export interface VideoElement {
	play?: () => Promise<void>;
	stop?: () => Promise<void>;
	restart?: () => Promise<void>;
	setVolume?: (volume: number) => void;
	mute?: (mute: boolean) => void;
	fullscreen?: (state: boolean) => void;
	playbackRate?: (rate: number) => void;
	videoElement?: HTMLVideoElement;
}

type VideoBaseProps = {
	children?: React.ReactNode;
	src?: string;
	playing?: boolean;
	loop?: boolean;
	muted?: boolean;
	volume?: number;
	playsInline?: boolean;
	playRate?: number;
	controls?: 'default' | 'simple' | 'custom' | 'none';
	customControls?: CustomVideoControls;
	poster?: string;
	width?: number | string;
	height?: number | string;
	borderRadius?: number | string;
	borderSize?: number | string;
	borderColor?: string;
	backgroundColor?: string;
	objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
	onPlay?: () => void;
	onPause?: () => void;
	onEnd?: () => void;
	onProgress?: (progress: number) => void;
	onLoadProgress?: (progress: number) => void;
	onPlaybackRateChange?: (rate: number) => void;
	onCanPlayThrough?: () => void;
	onPlayStateChange?: (state: PlayState) => void;
	onLoadMetaData?: (duration: number) => void;
	onFullScreenChange?: (fullScreen: boolean) => void;
	onVolumeChange?: (volume: number) => void;
	onLoadedFrameData?: () => void;
	onQuit?: () => void;
	captionsSrc?: string;
};

export type VideoProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof VideoBaseProps> & VideoBaseProps;
