import type React from 'react';
import type { VideoProps } from '../../components/Video';

export type VideoDescriptor = {
	id?: string;
	component: React.ComponentType<VideoProps>;
	props?: VideoProps;
};

export interface VideoStore {
	video: VideoDescriptor | null;
	actions: {
		show: (modal: VideoDescriptor | null) => void;
		clear: () => void;
	};
}
