import { create } from 'zustand';
import type { AudioElement, VolumeStore } from './_types';

export const useVolumeStore = create<VolumeStore>((set, get) => ({
	volume: 1,
	storedVolume: 1,
	muted: false,
	elements: new Set<AudioElement>(),
	feedbackElement: null,
	actions: {
		attachMedia: (elements: AudioElement[] | AudioElement) => {
			const media = Array.isArray(elements) ? elements : [elements];
			const mediaMap = new Set(get().elements);
			for (const element of media) {
				mediaMap.add(element);
			}
			adjustMediaVolume(mediaMap, get().volume);
			set({ elements: mediaMap });
		},
		attachFeedbackElement: (element: AudioElement) => {
			element.loop = false;
			set({ feedbackElement: element });
		},
		detachFeedbackElement: (element: AudioElement) => {
			set({ feedbackElement: null });
		},
		setVolume: async (volume: number, options?: { playFeedback?: boolean }) => {
			const muted = get().muted;
			const currentVolume = muted ? 0 : volume;
			const attachedMedia = get().elements;
			const feedbackElement = get().feedbackElement;
			const newStored = volume > 0 ? volume : get().storedVolume;
			if (attachedMedia.size > 0) {
				adjustMediaVolume(attachedMedia, currentVolume);
			}
			set({ volume: currentVolume, storedVolume: newStored });
			if (!muted && feedbackElement && options?.playFeedback === true) {
				await playFeedbackSound(feedbackElement, currentVolume);
			}
		},
		playFeedback: async (volume?: number) => {
			if (get().muted) return;
			const feedbackElement = get().feedbackElement;
			await playFeedbackSound(feedbackElement, volume ?? get().volume);
		},
		mute: async () => {
			if (get().muted) return;
			const volume = get().volume;
			const attachedMedia = get().elements;
			if (attachedMedia.size > 0) adjustMediaVolume(attachedMedia, 0);
			set({ volume: 0, storedVolume: volume, muted: true });
		},
		unmute: async () => {
			if (!get().muted) return;
			const storedVolume = get().storedVolume;
			const attachedMedia = get().elements;
			const feedbackElement = get().feedbackElement;
			if (attachedMedia.size > 0) {
				adjustMediaVolume(attachedMedia, storedVolume);
			}
			set({ volume: storedVolume, muted: false });
			await playFeedbackSound(feedbackElement, storedVolume);
		},
		detachMedia: (elements: AudioElement[] | AudioElement) => {
			const media = Array.isArray(elements) ? elements : [elements];
			const mediaMap = new Set(get().elements);
			for (const element of media) {
				mediaMap.delete(element);
			}
			set({ elements: mediaMap });
		},
		clearMedia: () => {
			set({ elements: new Set<AudioElement>() });
		},
	},
}));

function adjustMediaVolume(media: Set<AudioElement>, volume: number) {
	const elements = Array.from(media);
	for (const element of elements) {
		if (element instanceof HTMLAudioElement) {
			element.volume = volume;
		}
		if (element instanceof HTMLVideoElement) {
			element.volume = volume;
		}
	}
}

async function playFeedbackSound(element: AudioElement | null, volume: number) {
	if (element) {
		const isPlaying = !element.paused && !element.ended && element.readyState > 2;
		if (isPlaying) {
			element.pause();
			element.currentTime = 0; // avoid race between setting time to 0 and immediately playing
		}
		element.volume = Number(volume.toFixed(2));
		await element.play().catch(() => null);
	}
}

// prefer atomic selectors
export const useVolume = () => useVolumeStore((state) => state.volume);
export const useStoredVolume = () => useVolumeStore((state) => state.storedVolume);
export const useMuted = () => useVolumeStore((state) => state.muted);
export const useAttachedMedia = () => useVolumeStore((state) => state.elements);
export const useVolumeActions = () => useVolumeStore((state) => state.actions);

// non-reactive imperative exports for use outside the React context
export const volumeActions = useVolumeStore.getState().actions;
export const getVolume = () => useVolumeStore.getState().volume;
export const getStoredVolume = () => useVolumeStore.getState().storedVolume;
export const getMuted = () => useVolumeStore.getState().muted;
export const getAttachedMedia = () => useVolumeStore.getState().elements;
