import { SliceLogo } from '@/src/SliceLogo';
import { Button, Chip } from '@apple-pie/slice';
import styles from './LogoHeader.module.css';

export function LogoHeader() {
	return (
		<div className={styles.wrapper}>
			<Button variant={'text'} link={'/'} target={'_top'} aria-label="Slice UI Kit home">
				<SliceLogo size={24} />
			</Button>
			<Chip label={'UI Kit'} />
		</div>
	);
}
