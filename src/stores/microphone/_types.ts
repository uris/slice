import type { RefObject } from 'react';
import type { DropDownOption } from '../../components/DropDown';
import type { MicOption, UseMicrophoneReturn } from '../../hooks';

export type MicrophoneStoreState = {
	micStream: RefObject<MediaStream | null>;
	processedMicStream: RefObject<MediaStream | null>;
	micTrack: RefObject<MediaStreamTrack | null>;
	currentDeviceId: string | null;
	isActive: boolean;
	inputVolume: number;
	muted: boolean;
	isSupported: boolean;
	isRequesting: boolean;
	error: Error | null;
	microphones: MediaDeviceInfo[];
	micOptions: DropDownOption<MicOption>[];
};

export type MicrophoneStoreActions = {
	sync: (microphone: UseMicrophoneReturn | null) => void;
	clear: () => void;
	requestMicrophone: () => Promise<MediaStream | null>;
	stopMicrophone: () => void;
	muteMic: () => boolean;
	unmuteMic: () => boolean;
	toggleMute: () => void;
	setInputVolume: (volume: number) => number;
	refreshMicrophones: () => Promise<MediaDeviceInfo[]>;
	setMicrophone: (deviceId: string | DropDownOption<MicOption>) => Promise<void>;
};

export type MicrophoneStore = MicrophoneStoreState & {
	actions: MicrophoneStoreActions;
};
