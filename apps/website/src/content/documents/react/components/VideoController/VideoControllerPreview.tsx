'use client';

import { Button, Video } from '@apple-pie/slice';
import { type VideoDescriptor, getVideo, videoActions } from '@apple-pie/slice/stores/video';
import { useEffect, useRef } from 'react';

export function VideoControllerPreview() {
	const ownedVideo = useRef<VideoDescriptor | null>(null);
	useEffect(() => {
		return () => {
			if (ownedVideo.current && getVideo() === ownedVideo.current) videoActions.clear();
		};
	}, []);
	return (
		<>
			<Button
				onClick={() => {
					const descriptor: VideoDescriptor = {
						component: Video,
						props: {
							src: 'https://player.vimeo.com/progressive_redirect/playback/481754051/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=ee67f15d70122bb1a1e900e51e60e3c5384450a3c256412e15fe188ef841a6d2',
							videoName: 'Vimeo demo',
							width: '100%',
							playing: true,
							muted: false,
							volume: 0.5,
						},
					};
					ownedVideo.current = descriptor;
					videoActions.show(descriptor);
				}}
			>
				Watch video
			</Button>
		</>
	);
}
