import {
	Camera,
	type CameraElement,
	Chip,
	FlexBox,
	IconButton,
	Preset,
	ToggleButton,
	useTheme,
} from '@apple-pie/slice';
import { useTipActions } from '@apple-pie/slice/stores';
import { useRef, useState } from 'react';
import { Block } from '../Shared';

export function CameraCheck() {
	const { isDark } = useTheme();
	const camera = useRef<CameraElement>(null);
	const pushTip = useTipActions().push;
	const [on, setOn] = useState(false);
	const [micOn, setMicOn] = useState(false);
	const [busy, setBusy] = useState(false);
	const [error, setError] = useState('');
	const [init, setInit] = useState(false);
	const bgColor = isDark ? 'core-surface-primary' : 'core-surface-secondary';

	const toggle = async () => {
		setBusy(true);
		const result = await camera.current?.toggleVideo();
		setBusy(false);
		if (result instanceof Error) {
			setError(result.message);
			setInit(true);
			return;
		}
		setOn(camera.current?.videoTrack?.enabled ?? false);
		setError('');
		setInit(true);
	};
	const toggleMic = async () => {
		setBusy(true);
		if (!camera.current?.audioTrack) {
			const result = await camera.current?.startCamera();
			if (result instanceof Error) {
				setError(result.message);
				setBusy(false);
				return;
			}
			if (!on) camera.current?.disableVideo();
		}
		const result = camera.current?.toggleMic();
		setBusy(false);
		if (result instanceof Error) {
			setError(result.message);
			return;
		}
		setMicOn(camera.current?.audioTrack?.enabled ?? false);
		setError('');
	};

	return (
		<Block title="Ready when you are" caption="CAMERA CHECK">
			<Camera
				ref={camera}
				backgroundColor={bgColor}
				displayError={false}
				noVideoPoster={
					<FlexBox preset={Preset.FillCenterMiddle}>
						{!error && <Chip icon={'media.video-camera-slash'} label="Turn Video On" onClick={() => void toggle()} />}
						{error && <Chip icon={'alerts.alert-circle'} iconColor={'feedback-warning'} label="Video not available" />}
					</FlexBox>
				}
				audio
				startAudioMuted
				startCameraOff
				showControlBar={false}
				width="100%"
				height={180}
				userProfile={{ name: 'U' }}
				borderRadius={24}
			/>
			<FlexBox preset={Preset.Row} width={'fill'} justify={'center'} gap={8}>
				<ToggleButton
					borderRadius={100}
					padding={0}
					style={{ width: 36, height: 36 }}
					backgroundColor={'core-fill-primary'}
					icon={on || !init ? 'media.video-camera' : 'media.video-camera-slash'}
					selected={on || init}
					actionName={on ? 'Turn video off' : 'Turn video on'}
					tooltip={on ? 'Turn video off' : 'Turn video on'}
					onToolTip={pushTip}
					onClick={() => void toggle()}
					disabled={busy || !init}
				/>
				<ToggleButton
					borderRadius={100}
					padding={0}
					style={{ width: 36, height: 36 }}
					icon={micOn || !init ? 'media.mic' : 'media.mic-slash'}
					backgroundColor={'core-fill-primary'}
					iconColorSelected="core-surface-primary"
					selected={micOn || init}
					actionName={micOn ? 'Mute microphone' : 'Unmute microphone'}
					tooltip={micOn ? 'Mute microphone' : 'Unmute microphone'}
					onToolTip={pushTip}
					onClick={() => void toggleMic()}
					disabled={busy || !init}
				/>
				<IconButton
					icon="images.camera"
					borderRadius={100}
					buttonSize={36}
					hover={false}
					backgroundColor={on ? 'core-surface-primary' : 'core-fill-primary'}
					actionName={'Capture profile photo'}
					tooltip={'Take photo'}
					onToolTip={pushTip}
					disabled={!on || busy || !init}
					onClick={() => camera.current?.snapshot({ toggle: true })}
				/>
			</FlexBox>
		</Block>
	);
}
