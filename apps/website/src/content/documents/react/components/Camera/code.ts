export const usageCode = `
import { Camera } from '@apple-pie/slice';

export default function CameraPreview() {
    return (
        <Camera
            audio={false}
            startCameraOff
            autoHideControlBar={false}
        />
    );
}
`;

export const showOnStart = `
import { Camera } from '@apple-pie/slice';

export default function CameraPreview() {
    return <Camera />;
}
`;

export const controlsCode = `
import { Camera, type CameraElement, IconButton } from '@apple-pie/slice';
import { useTipActions, useToastActions } from '@apple-pie/slice/stores';
import { useRef, useState } from 'react';

export default function CameraControls() {
    const camera = useRef<CameraElement>(null);
    const [on, setOn] = useState(false);
    const pushTip = useTipActions().push;
    const pushToast = useToastActions().push;

    return (
        <>
            <Camera ref={camera} audio={false} startCameraOff showControlBar={false} />
            <IconButton
                actionName={on ? 'Turn video off' : 'Turn video on'}
                tooltip={on ? 'Turn video off' : 'Turn video on'}
                icon={on ? 'media.video-camera' : 'media.video-camera-slash'}
                onClick={async () => {
                    const result = await camera.current?.toggleVideo();
                    if (result instanceof Error) pushToast({ message: result.message });
                    setOn(camera.current?.videoTrack?.enabled ?? false);
                }}
                onToolTip={pushTip}
            />
            <IconButton
                actionName="Take snapshot"
                tooltip="Take snapshot"
                icon="images.image"
                onClick={() => camera.current?.snapshot()}
                onToolTip={pushTip}
                disabled={!on}
            />
        </>
    );
}
`;

export const optionalActionsCode = `
import { Camera } from '@apple-pie/slice';

export default function CameraWithActions() {
    return <Camera startCameraOff showProfileButton showSettingsButton />;
}
`;
