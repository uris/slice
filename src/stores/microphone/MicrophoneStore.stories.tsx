import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from 'src/components/Button';
import { FlexDiv } from 'src/components/FlexDiv';
import { Label } from 'src/components/Label';
import { Slider } from 'src/components/Slider';
import { useMicrophone } from 'src/hooks/useMicrophone/useMicrophone';
import {
	useCurrentMicDeviceId,
	useMicActive,
	useMicError,
	useMicInputVolume,
	useMicMuted,
	useMicOptions,
	useMicRequesting,
	useMicSupported,
	useMicTrack,
	useMicrophoneStoreActions,
	useProcessedMicStream,
	useSyncMicrophoneStore,
} from 'src/stores/microphone';

function MicrophoneStoreDemo() {
	const microphone = useMicrophone(true, undefined, false);
	useSyncMicrophoneStore(microphone);

	const micTrack = useMicTrack();
	const processedMicStream = useProcessedMicStream();
	const currentDeviceId = useCurrentMicDeviceId();
	const isActive = useMicActive();
	const inputVolume = useMicInputVolume();
	const muted = useMicMuted();
	const isSupported = useMicSupported();
	const isRequesting = useMicRequesting();
	const error = useMicError();
	const micOptions = useMicOptions();
	const actions = useMicrophoneStoreActions();

	return (
		<FlexDiv width={'fill'} height={'fill'} padding={32} gap={16}>
			<div>Store-bound microphone state from a single `useMicrophone()` instance.</div>
			<div>
				Supported: <Label>{String(isSupported)}</Label>
			</div>
			<div>
				Requesting: <Label>{String(isRequesting)}</Label>
			</div>
			<div>
				Active: <Label>{String(isActive)}</Label>
			</div>
			<div>
				Muted: <Label>{String(muted)}</Label>
			</div>
			<div>
				Input Volume: <Label>{inputVolume.toFixed(2)}</Label>
			</div>
			<div>
				Track ready: <Label>{micTrack.current?.readyState ?? 'none'}</Label>
			</div>
			<div>
				Processed Stream: <Label>{processedMicStream.current?.id ?? 'none'}</Label>
			</div>
			<div>
				Current Device Id: <Label>{currentDeviceId ?? 'none'}</Label>
			</div>
			<div>
				Microphones: <Label>{String(micOptions.length)}</Label>
			</div>
			<div>
				Error: <Label>{error?.message ?? 'none'}</Label>
			</div>
			<Slider
				value={inputVolume}
				scaleMin={0}
				scaleMax={1}
				step={0.05}
				width={240}
				onChange={(value) => actions.setInputVolume(value)}
			/>
			<FlexDiv direction={'row'} wrap gap={8}>
				<Button label={'Request Microphone'} onClick={() => void actions.requestMicrophone()} />
				<Button label={'Toggle Mute'} onClick={() => actions.toggleMute()} />
				<Button label={'Refresh Devices'} onClick={() => void actions.refreshMicrophones()} />
				<Button label={'Stop'} onClick={() => actions.stopMicrophone()} />
			</FlexDiv>
		</FlexDiv>
	);
}

const meta: Meta<typeof MicrophoneStoreDemo> = {
	title: 'Stores/Microphone Store',
	component: MicrophoneStoreDemo,
	parameters: {
		layout: 'fullscreen',
	},
};

export default meta;

export const Demo: StoryObj<typeof MicrophoneStoreDemo> = {};
