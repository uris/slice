'use client';

import { Button, Camera, type CameraElement, FlexBox, IconButton, Preset } from '@apple-pie/slice';
import { useTipActions, useToastActions } from '@apple-pie/slice/stores';
import { useRef, useState } from 'react';

export function CameraPreview() {
	return <Camera audio={false} startCameraOff autoHideControlBar={false} width="100%" height={400} />;
}

export function CameraWithVideoPreview() {
	const [show, setShow] = useState(false);

	return (
		<FlexBox preset={Preset.FillCenterMiddle} height={show ? 'auto' : 200} gap={16}>
			{show && <Camera autoHideControlBar={true} width="100%" height={400} />}
			<Button
				iconLeft={show ? 'security.eye-slash' : 'security.eye'}
				label={show ? 'Hide Camera' : 'Show Camera'}
				onClick={() => setShow(!show)}
			/>
		</FlexBox>
	);
}

export function CameraControlsPreview() {
	const camera = useRef<CameraElement>(null);
	const [on, setOn] = useState(false);
	const pushTip = useTipActions().push;
	const pushToast = useToastActions().push;

	return (
		<FlexBox margin={24} padding={16} gap={16} borderRadius={24} border={'1px dashed var(--core-fill-primary)'}>
			<Camera
				borderRadius={16}
				ref={camera}
				audio={false}
				startCameraOff
				showControlBar={false}
				width="100%"
				height={400}
			/>
			<FlexBox width={'fill'} justify={'center'} direction="row" wrap gap={8}>
				<IconButton
					actionName={on ? 'Turn video off' : 'Turn video on'}
					tooltip={on ? 'Turn video off' : 'Turn video on'}
					icon={on ? 'media.video-camera' : 'media.video-camera-slash'}
					onClick={async () => {
						const result = await camera.current?.toggleVideo();
						if (result instanceof Error) pushToast({ message: result.message ?? 'Camera Error' });
						setOn(camera.current?.videoTrack?.enabled ?? false);
					}}
					onToolTip={pushTip}
				/>
				<IconButton
					actionName="Take snapshot"
					tooltip={'Take snapshot'}
					icon={'images.image'}
					onClick={() => camera.current?.snapshot()}
					onToolTip={pushTip}
					disabled={!on}
				/>
			</FlexBox>
		</FlexBox>
	);
}

export function CameraActionsPreview() {
	return (
		<Camera startCameraOff showProfileButton showSettingsButton autoHideControlBar={false} width="100%" height={400} />
	);
}
