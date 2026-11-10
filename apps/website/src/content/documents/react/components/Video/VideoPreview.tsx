'use client';

import { Button, FlexBox, Preset, type SliceIcon, Video } from '@apple-pie/slice';

export function DefaultVideoPreview() {
	return (
		<Video
			src="https://player.vimeo.com/progressive_redirect/playback/481754051/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=ee67f15d70122bb1a1e900e51e60e3c5384450a3c256412e15fe188ef841a6d2"
			videoName="Vimeo demo"
			width="100%"
			volume={0.5}
			controls={'simple'}
		/>
	);
}

export function SimpleVideoPreview() {
	return (
		<Video
			src="https://player.vimeo.com/progressive_redirect/playback/481754051/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=ee67f15d70122bb1a1e900e51e60e3c5384450a3c256412e15fe188ef841a6d2"
			videoName="Vimeo demo"
			width="100%"
			customControls={{ play: true }}
		/>
	);
}

export function NativeVideoPreview() {
	return (
		<Video
			src="https://player.vimeo.com/progressive_redirect/playback/481754051/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=ee67f15d70122bb1a1e900e51e60e3c5384450a3c256412e15fe188ef841a6d2"
			height={320}
			videoName="Vimeo demo"
			controls="default"
		/>
	);
}

export function CustomVideoPreview() {
	return (
		<Video
			src="https://player.vimeo.com/progressive_redirect/playback/481754051/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=ee67f15d70122bb1a1e900e51e60e3c5384450a3c256412e15fe188ef841a6d2"
			videoName="Custom player"
			controls="custom"
			width="100%"
		>
			{({ playing, togglePlay }) => {
				const icon: SliceIcon = playing ? 'media.pause-filled' : 'media.play-filled';
				const label = playing ? 'Pause' : 'Play';
				return (
					<FlexBox preset={Preset.FillCenter}>
						<Button padding={8} iconLeft={icon} label={label} onClick={() => void togglePlay()} />
					</FlexBox>
				);
			}}
		</Video>
	);
}
