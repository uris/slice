import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';

export type CustomVideoControls = {
	play?: boolean;
	fullscreen?: boolean;
	progress?: boolean;
	volume?: boolean;
	quit?: boolean;
	captions?: boolean;
};

export enum PlayState {
	Playing = 'playing',
	Paused = 'paused',
	Stopped = 'stopped',
	Ended = 'ended',
}

export interface VideoElement {
	play: () => Promise<void>;
	stop: () => Promise<void>;
	restart: () => Promise<void>;
	setVolume: (volume: number) => void;
	mute: (mute: boolean) => void;
	fullscreen: (state: boolean) => Promise<void>;
	playbackRate: (rate: number) => void;
	videoElement?: HTMLVideoElement;
}

/** Live state and actions provided to custom control render functions. */
export type VideoControlsContext = {
	playing: boolean;
	muted: boolean;
	progress: number;
	volume: number;
	duration: number;
	fullscreen: boolean;
	canSeek: boolean;
	play: () => Promise<void>;
	pause: () => void;
	togglePlay: () => Promise<void>;
	toggleMute: () => void;
	setProgress: (progress: number) => void;
	setVolume: (volume: number) => void;
	toggleFullscreen: () => Promise<void>;
};

type VideoBaseProps = {
	children?: React.ReactNode | ((controls: VideoControlsContext) => React.ReactNode);
	src?: string;
	playing?: boolean;
	loop?: boolean;
	muted?: boolean;
	volume?: number;
	playsInline?: boolean;
	playRate?: number;
	controls?: 'default' | 'simple' | 'custom' | 'none';
	/** Complete control selection. Omitted flags are off; overrides controls and children. */
	customControls?: CustomVideoControls;
	poster?: string;
	width?: number | string;
	height?: number | string;
	borderRadius?: number | string;
	borderWidth?: number | string;
	borderColor?: ColorValue;
	backgroundColor?: ColorValue;
	objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
	showProgressIndicator?: boolean;
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
	onCanPlay?: () => void;
	captionsSrc?: string;
	captionsLanguage?: string;
	captionsLabel?: string;
	captionsDefault?: boolean;
	videoName?: string;
	videoAttributes?: Omit<
		React.VideoHTMLAttributes<HTMLVideoElement>,
		| keyof VideoBaseProps
		| keyof React.AriaAttributes
		| 'children'
		| 'dangerouslySetInnerHTML'
		| 'role'
		| 'autoPlay'
		| 'controls'
		| 'onTimeUpdate'
		| 'onRateChange'
		| 'onLoadedMetadata'
		| 'onLoadedData'
		| 'onEnded'
		| 'onLoadStart'
		| 'onEmptied'
		| 'onWaiting'
		| 'onPlaying'
		| 'onDurationChange'
		| 'onSeeked'
	>;
	onError?: (error: MediaError | null) => void;
};

export type VideoProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof VideoBaseProps> & VideoBaseProps;
