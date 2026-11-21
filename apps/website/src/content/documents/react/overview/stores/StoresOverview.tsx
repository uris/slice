import css from '../Overview.module.css';
import { VolumeControlsExample } from './VolumeControlsExample';
import { VolumeReadoutExample } from './VolumeReadoutExample';

export function StoresOverview() {
	return (
		<div className={css.board}>
			<div className={css.tile}>
				<VolumeControlsExample />
			</div>
			<div className={css.tile}>
				<VolumeReadoutExample />
			</div>
		</div>
	);
}
