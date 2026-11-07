import { Chip } from '@/components/Chip/Chip';
import { SliceLogo } from '@/src/SliceLogo';
import styles from './LogoHeader.module.css';

export function LogoHeader() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.identity}>
				<SliceLogo size={24} />
				<Chip label={'Beta'} />
			</div>
		</div>
	);
}
