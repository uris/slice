import { Slider, ToggleButton } from '@apple-pie/slice';
import { useMuted, useVolume, useVolumeActions } from '@apple-pie/slice/stores/volume';
import { Block, Row } from '../Shared';

export function VolumeControlsExample() {
	const volume = useVolume();
	const muted = useMuted();
	const actions = useVolumeActions();
	return (
		<Block title="One setting, everywhere" caption="VOLUME STORE">
			<Row>
				<span>Shared volume</span>
				<span>{Math.round(volume * 100)}%</span>
			</Row>
			<Slider
				aria-label="Shared volume"
				min={0}
				max={100}
				step={1}
				value={volume * 100}
				trackColor="core-outline-primary"
				progressColor="core-text-special"
				onChange={(value) => void actions.setVolume(value / 100)}
			/>
			<ToggleButton
				label={muted ? 'Unmute' : 'Mute'}
				icon={muted ? 'media.volume-slash' : 'media.volume-high'}
				selected={muted}
				onChange={() => {
					if (muted) void actions.unmute();
					else void actions.mute();
				}}
			/>
		</Block>
	);
}
