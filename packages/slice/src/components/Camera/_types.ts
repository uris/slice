import type React from 'react';
import type { ColorValue } from '../../theme/colors/resolveColor';
import type { RadiusValue } from '../../theme/resolveSize';
import type { SliceIcon } from '../Icon/_types';
import type { ElevationProps } from '../sharedTypes';

export interface DefaultNoVideoPosterProps {
	user?: UserProfile;
	message?: string;
}

export interface ToolbarButtonProps {
	icon: SliceIcon;
	iconActive?: SliceIcon;
	onClick: () => void;
	active?: boolean;
	label?: string;
	disabled?: boolean;
	borderWidth?: number;
	onMouseOver?: (e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>) => void;
}

export interface CameraElement {
	container?: HTMLDivElement;
	video?: HTMLVideoElement;
	stream?: MediaStream;
	videoTrack?: MediaStreamTrack;
	audioTrack?: MediaStreamTrack;
	snapshot: (options?: CameraSnapshotOptions) => Blob | undefined;
	startCamera: () => Promise<MediaStream | Error>;
	stopCamera: () => Promise<boolean | Error>;
	enableVideo: () => MediaStream | Error;
	disableVideo: () => boolean | Error;
	muteMic: () => boolean | Error;
	unmuteMic: () => boolean | Error;
	toggleVideo: () => Promise<MediaStream | boolean | Error>;
	toggleMic: () => boolean | Error;
	devices: () => Promise<MediaDeviceInfo[] | Error>;
}

export interface CameraSnapshotOptions {
	width?: number;
	height?: number;
	toggle?: boolean;
}

export interface UserProfile {
	name?: string;
	email?: string;
	avatar?: string;
}

export interface Settings {
	micDeviceId?: string;
	videoDeviceId?: string;
}

export interface BaseCameraProps extends ElevationProps {
	backgroundColor?: ColorValue;
	borderColor?: ColorValue;
	borderWidth?: number | string;
	borderRadius?: RadiusValue;
	audio?: boolean;
	width?: number | string;
	height?: number | string;
	noVideoPoster?: React.ReactNode;
	startCameraOff?: boolean;
	startAudioMuted?: boolean;
	playLocalAudio?: boolean;
	displayError?: boolean;
	userProfile?: UserProfile;
	sessionSettings?: Settings;
	onVideoStream?: (stream: MediaStream) => void;
	onSnapshot?: (blob: Blob | undefined) => void;
	onNoVideo?: (reason: Error) => void;
	onNoAudio?: (reason: Error) => void;
	onChangeProfile?: (profile?: UserProfile) => void;
	onChangeSettings?: (settings?: Settings, devices?: MediaDeviceInfo[] | Error) => void;
	showControlBar?: boolean;
	showProfileButton?: boolean;
	showSettingsButton?: boolean;
	autoHideControlBar?: boolean;
	pipSnapshot?: boolean;
}

export type CameraProps = Omit<React.HTMLAttributes<HTMLDivElement>, keyof BaseCameraProps> & BaseCameraProps;
