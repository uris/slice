export const usageCode = `
import { AudioBubble } from '@apple-pie/slice';

<AudioBubble audioStream={audioStream} playing={isListening} />
`;

export const responseCode = `
<AudioBubble
    audioStream={audioStream}
    playing={isListening}
    size={48}
    minScale={1}
    maxScale={2}
    intensity={2.2}
    peakIntensity={0.3}
/>
`;

export const glowCode = `
<AudioBubble
    audioStream={audioStream}
    playing={isListening}
    backgroundColor="core-link-primary"
    glowColor="core-link-primary"
    glowSize={32}
    glowOffset={0}
/>
`;

export const statusCode = `
<>
    <AudioBubble
        audioStream={audioStream}
        playing={isListening && !prefersReducedMotion}
        aria-hidden="true"
    />
    <span role="status">{isListening ? 'Listening' : 'Not listening'}</span>
</>
`;

export const microphoneCode = `
import { useMicrophone } from '@apple-pie/slice/hooks';

function MicrophoneBubble() {
    const { micStream, isActive, isRequesting, error } = useMicrophone(false);

    return (
        <>
            <AudioBubble
                audioStream={isRequesting ? null : micStream.current}
                playing={isActive}
                aria-hidden="true"
            />
            <span role="status">
                {error ? error.message : isRequesting ? 'Waiting for microphone access…' : 'Say something!'}
            </span>
        </>
    );
}
`;
