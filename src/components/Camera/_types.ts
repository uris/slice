import type React from 'react';

export interface DefaultNoVideoPosterProps {
	size?: number | string;
	user?: UserProfile;
	message?: string;
}

export interface ToolbarButtonProps {
	icon: string;
	iconActive?: string;
	onClick: () => void;
	active?: boolean;
	label?: string;
	disabled?: boolean;
	onMouseOver?: (e: React.MouseEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>) => void;
}

export interface CameraElement {
	container?: HTMLDivElement;
	video?: HTMLVideoElement;
	stream?: MediaStream;
	videoTrack?: MediaStreamTrack;
	audioTrack?: MediaStreamTrack;
	snapshot?: (options?: CameraSnapshotOptions) => Blob | undefined;
	startCamera?: () => Promise<MediaStream | Error>;
	stopCamera?: () => Promise<boolean | Error>;
	enableVideo?: () => MediaStream | Error;
	disableVideo?: () => boolean | Error;
	muteMic?: () => boolean | Error;
	unmuteMic?: () => boolean | Error;
	toggleVideo?: () => Promise<MediaStream | boolean | Error>;
	toggleMic?: () => boolean | Error;
	devices?: () => Promise<MediaDeviceInfo[] | Error>;
}

export interface CameraSnapshotOptions {
	width?: number;
	height?: number;
	toggle?: boolean;
}

export interface Controls {
	mic?: boolean;
	camera?: boolean;
	play?: boolean;
	stop?: boolean;
	pause?: boolean;
	videoDevices?: boolean;
	audioDevices?: boolean;
	flipCamera?: boolean;
}

export interface UserProfile {
	name?: string;
	email?: string;
	avatar?: string;
}

export interface Settings {
	micDeviceId?: string;
	micVolume?: number;
	videoDeviceId?: string;
}

export interface BaseCameraProps {
	width?: number | string;
	height?: number | string;
	noVideoPoster?: React.ReactNode;
	videoFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down';
	startCameraOff?: boolean;
	startAudioMuted?: boolean;
	playLocalAudio?: boolean;
	userProfile?: UserProfile;
	sessionSettings?: Settings;
	onVideoStream?: (stream: MediaStream) => void;
	onSnapshot?: (blob: Blob | undefined) => void;
	onNoVideo?: (reason?: string | Error) => void;
	onNoAudio?: (reason?: string | Error) => void;
	onChangeProfile?: (profile?: UserProfile) => void;
	onChangeSettings?: (settings?: Settings, devices?: MediaDeviceInfo[] | Error) => void;
	showControlBar?: boolean;
	autoHideControlBar?: boolean;
	controls?: Controls;
	pipSnapshot?: boolean;
}

export type CameraProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseCameraProps> & BaseCameraProps;
