type WebRTCMicStreamOption = {
	micStream: MediaStream;
	micTrack?: MediaStreamTrack | null;
};

type WebRTCMicTrackOption = {
	micStream?: MediaStream | null;
	micTrack: MediaStreamTrack;
};

export type WebRTCConnectionOptions = (WebRTCMicStreamOption | WebRTCMicTrackOption) & {
	connectionUrl?: string;
	audioElement?: HTMLAudioElement;
	autoPlayAudio?: boolean;
	volume?: number;
	dataChannels?: string | string[];
	videoTrack?: MediaStreamTrack | null;
	onRemoteVideoStream?: (streams: Map<string, MediaStream>) => void;
	onRemoteAudioStream?: (streams: Map<string, MediaStream>) => void;
	onDataChannelEvent?: (
		channel: string,
		eventType: 'message' | 'open' | 'close' | 'error',
		eventData: MessageEvent | Event | RTCErrorEvent,
	) => void;
};
