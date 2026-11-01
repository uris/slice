import { Chip } from '@/components/Chip/Chip';
import { SliceLogo } from '@/src/SliceLogo';
import styles from './SidebarHeader.module.css';

export function SidebarHeader() {
	return (
		<div className={styles.wrapper}>
			<div className={styles.identity}>
				<SliceLogo size={24} />
				<Chip label={'UI-Kit'} />
			</div>
		</div>
	);
}
