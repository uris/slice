export const usageCode = `
import { AudioBubble } from '@apple-pie/slice';
import { useMicrophone } from '@apple-pie/slice/hooks';

export default function MicrophoneBubble() {
    const { micStream, isActive, isRequesting } = useMicrophone(false);

    return (
        <AudioBubble
            audioStream={isRequesting ? null : micStream.current}
            playing={isActive}
        />
    );
}
`;

export const pausedCode = `
import { AudioBubble } from '@apple-pie/slice';

export default function PausedBubble() {
    return <AudioBubble playing={false} />;
}
`;

export const responseCode = `
<AudioBubble
    audioStream={isRequesting ? null : micStream.current}
    playing={isActive}
    size={48}
    minScale={1}
    maxScale={2}
    intensity={2.2}
    peakIntensity={0.3}
/>
`;

export const glowCode = `
<AudioBubble
    audioStream={isRequesting ? null : micStream.current}
    playing={isActive}
    backgroundColor="core-link-primary"
    glowColor="core-link-primary"
    glowSize={32}
    glowOffset={0}
/>
`;

export const statusCode = `
import { AudioBubble, Chip } from '@apple-pie/slice';
import { useMicrophone } from '@apple-pie/slice/hooks';

export default function MicrophoneBubble() {
    const { micStream, isActive, isRequesting, error } = useMicrophone(false);
    
    const getStatus = () => {
        if (error) return error.message;
        if (isRequesting) return 'Waiting for microphone access…';
        return isActive ? 'Listening' : 'Not listening';
    };
    
    return (
        <>
            <AudioBubble
                audioStream={isRequesting ? null : micStream.current}
                playing={isActive}
            />
            <Chip>{getStatus()}</Chip>
        </>
    );
}
`;
