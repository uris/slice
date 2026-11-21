import { useMuted, useVolume } from '@apple-pie/slice/stores/volume';
import css from '../Overview.module.css';
import { Block } from '../Shared';

export function VolumeReadoutExample() {
	const volume = useVolume();
	const muted = useMuted();
	return (
		<Block title="Always in sync" caption="ANOTHER SUBSCRIBER">
			<span className={css.metric}>{Math.round(volume * 100)}%</span>
			<p className={css.muted}>
				{muted ? 'Muted' : 'Sound on'}. This card reads the same store as the volume controls.
			</p>
		</Block>
	);
}
