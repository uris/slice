export const defaultUsageCode = `
import { Video } from '@apple-pie/slice';

export function VideoExample({src}: { src: string }) {
    return <Video src={src} videoName="Demo" width="100%"/>;
}
`;

export const usageCode = `
import { Video } from '@apple-pie/slice';

export function VideoExample({src}: { src: string }) {
    return (
        <Video
            src={src}
            videoName="Demo"
            width="100%"
            customControls={{play: true}}
        />
    );
}
`;

export const nativeCode = `
<Video
    src={src}
    videoName="Demo"
    width="100%"
    controls="default"
/>
`;

export const customCode = `
import { Button, FlexBox, Preset, SliceIcon, Video } from '@apple-pie/slice';

export function CustomPlayer({src}: { src: string }) {
	return (
		<Video
            src={src}
            videoName="Custom player"
            controls="custom"
            width="100%"
        >
            {({playing, togglePlay}) => {
                const icon: SliceIcon = playing ? 'media.pause-filled' : 'media.play-filled';
                const label = playing ? 'Pause' : 'Play';
                return (
                    <FlexBox preset={Preset.FillCenter}>
                        <Button
                            padding={8}
                            iconLeft={icon}
                            label={label}
                            onClick={() => void togglePlay()}
                        />
                    </FlexBox>
                );
            }}
        </Video>
	);
}
`;

export const playingCode = `<Video src="https://player.vimeo.com/progressive_redirect/playback/481754051/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=ee67f15d70122bb1a1e900e51e60e3c5384450a3c256412e15fe188ef841a6d2" playing={shouldPlay} muted />`;

export const refCode = `import { Button, FlexBox, Video, type VideoElement } from '@apple-pie/slice';
import { useRef } from 'react';

export function ReplayVideo() {
    const video = useRef<VideoElement>(null);

    return (
        <FlexBox direction="column" gap={16} width="100%">
            <Video ref={video} src="https://player.vimeo.com/progressive_redirect/playback/481754051/rendition/1080p/file.mp4%20%281080p%29.mp4?loc=external&log_user=0&signature=ee67f15d70122bb1a1e900e51e60e3c5384450a3c256412e15fe188ef841a6d2" videoName="Vimeo demo" />
            <Button onClick={() => {
                void video.current?.restart().catch(() => undefined);
            }}>Replay</Button>
        </FlexBox>
    );
}`;

export const renderControlsCode = `type VideoControlsContext = {
    playing: boolean;
    muted: boolean;
    progress: number; // 0–1
    volume: number; // 0–1
    duration: number; // seconds; 0 while unknown
    fullscreen: boolean;
    canSeek: boolean;
    play: () => Promise<void>;
    pause: () => void;
    togglePlay: () => Promise<void>;
    toggleMute: () => void;
    setProgress: (progress: number) => void;
    setVolume: (volume: number) => void;
    toggleFullscreen: () => Promise<void>;
};`;
