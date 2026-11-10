import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from 'src/components/Button';
import { Chip } from 'src/components/Chip';
import { FlexBox } from 'src/components/FlexBox';
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
		<FlexBox width={'fill'} height={'fill'} padding={32} gap={16}>
			<div>Store-bound microphone state from a single `useMicrophone()` instance.</div>
			<div>
				Supported: <Chip>{String(isSupported)}</Chip>
			</div>
			<div>
				Requesting: <Chip>{String(isRequesting)}</Chip>
			</div>
			<div>
				Active: <Chip>{String(isActive)}</Chip>
			</div>
			<div>
				Muted: <Chip>{String(muted)}</Chip>
			</div>
			<div>
				Input Volume: <Chip>{inputVolume.toFixed(2)}</Chip>
			</div>
			<div>
				Track ready: <Chip>{micTrack.current?.readyState ?? 'none'}</Chip>
			</div>
			<div>
				Processed Stream: <Chip>{processedMicStream.current?.id ?? 'none'}</Chip>
			</div>
			<div>
				Current Device Id: <Chip>{currentDeviceId ?? 'none'}</Chip>
			</div>
			<div>
				Microphones: <Chip>{String(micOptions.length)}</Chip>
			</div>
			<div>
				Error: <Chip>{error?.message ?? 'none'}</Chip>
			</div>
			<Slider
				aria-label="Microphone volume"
				value={inputVolume}
				min={0}
				max={1}
				step={0.05}
				width={240}
				onChange={(value) => actions.setInputVolume(value)}
			/>
			<FlexBox direction={'row'} wrap gap={8}>
				<Button label={'Request Microphone'} onClick={() => void actions.requestMicrophone()} />
				<Button label={'Toggle Mute'} onClick={() => actions.toggleMute()} />
				<Button label={'Refresh Devices'} onClick={() => void actions.refreshMicrophones()} />
				<Button label={'Stop'} onClick={() => actions.stopMicrophone()} />
			</FlexBox>
		</FlexBox>
	);
}

const meta: Meta<typeof MicrophoneStoreDemo> = {
	title: 'Stores/Microphone Store',
	component: MicrophoneStoreDemo,
	parameters: {
		a11y: { test: 'todo' },
		layout: 'fullscreen',
	},
};

export default meta;

export const Demo: StoryObj<typeof MicrophoneStoreDemo> = {};
