export type VolumeStore = {
	volume: number;
	storedVolume: number;
	muted: boolean;
	elements: Set<AudioElement>;
	feedbackElement: AudioElement | null;
	actions: {
		attachMedia: (elements: AudioElement[] | AudioElement) => void;
		detachMedia: (elements: AudioElement[] | AudioElement) => void;
		attachFeedbackElement: (element: AudioElement) => void;
		detachFeedbackElement: (element: AudioElement) => void;
		playFeedback: (volume?: number) => Promise<void>;
		setVolume: (volume: number, options?: { playFeedback?: boolean }) => Promise<void>;
		mute: () => Promise<void>;
		unmute: () => Promise<void>;
		clearMedia: () => void;
	};
};

export type AudioElement = HTMLAudioElement | HTMLVideoElement;
