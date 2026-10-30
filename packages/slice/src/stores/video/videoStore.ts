import { create } from 'zustand';
import type { VideoDescriptor, VideoStore } from './_types';

export const useVideoStore = create<VideoStore>((set, get) => ({
	video: null,
	actions: {
		show: (video: VideoDescriptor | null) => {
			const currentVideo = get().video;
			if (currentVideo === video) return;
			set({ video });
		},
		clear: () => {
			set({ video: null });
		},
	},
}));

// atomic hook exports for use in React components
export const useVideo = () => useVideoStore((state) => state.video);
export const useVideoActions = () => useVideoStore((state) => state.actions);

// non-reactive imperative exports for use outside the React context
export const videoActions = useVideoStore.getState().actions;
export const getVideo = () => useVideoStore.getState().video;
