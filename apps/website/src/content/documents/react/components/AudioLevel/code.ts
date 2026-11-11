export const usageCode = `
import { AudioLevel, Chip, DropDown, FlexBox, type MicOption } from '@apple-pie/slice';
import {useMicrophone} from '@apple-pie/slice/hooks';

export default function MicrophoneLevel() {
    const { micStream, isActive, isRequesting, error, micOptions, setMicrophone, currentDeviceId } = useMicrophone(false);
    return (
        <FlexBox justify="start" align="center" direction="column" gap={16}>
        <AudioLevel
            audioStream={isRequesting ? null : micStream.current}
            playing={isActive}
            levelName="Microphone level"
            width={200}
            height={8}
            barCount={40}
            minActiveBars={0}
            peakIntensity={0.5}
            intensity={3.5}
            gap={0}
        />
        {!error && (
            <DropDown<MicOption>
                valueKey="id"
                value={{ id: currentDeviceId ?? '' }}
                options={micOptions}
                onChangeOption={setMicrophone}
                label="Mic"
                backgroundColor="core-surface-primary"
                style={{ maxWidth: 'min-content', alignSelf: 'center' }}
            />
        )}
        {error && <Chip padding={8} label={error.message} />}
        </FlexBox>
    );
}
`;

export const restingCode = `
import { AudioLevel } from '@apple-pie/slice';

export default function RestingLevel() {
    return (
        <AudioLevel
            width={200}
            height={8}
            barCount={8}
            minActiveBars={2}
            gap={4}
            backgroundColorActive="core-link-primary"
        />
    );
}
`;
