export const usageCode = `
import { Button, Video, VideoController } from '@apple-pie/slice';
import { videoActions } from '@apple-pie/slice/stores/video';

export function VideoExample({src}: { src: string }) {
    return (
        <>
            <Button onClick={() => videoActions.show({
                component: Video,
                props: {
                    src,
                    videoName: 'Demo',
                    width: '100%',
                    playing: true,
                },
            })}>Watch video</Button>
            <VideoController dialogName="Demo video" />
        </>
    );
}
`;

export const clearCode = `
import { videoActions } from '@apple-pie/slice/stores/video';

videoActions.clear();
`;
