'use client';
import { Button, Modal, ModalController } from '@apple-pie/slice';
import { type ModalComponentProps, getModal, modalActions } from '@apple-pie/slice/stores/modal';
import { useEffect, useId } from 'react';
import styles from '../_shared/LayerPreview.module.css';
function PreviewDialog(props: ModalComponentProps) {
	return (
		<Modal
			{...props}
			title="Archive project?"
			minWidth={0}
			minHeight={180}
			maxWidth={360}
			actions={[
				{ id: 'cancel', label: 'Cancel', promise: 'reject' },
				{ id: 'archive', label: 'Archive', value: 'archive', primary: true },
			]}
		>
			You can restore this project later. Its files and history will stay together.
		</Modal>
	);
}
export function ModalControllerPreview() {
	const id = useId();
	useEffect(
		() => () => {
			if (getModal()?.id === id) modalActions.hide();
		},
		[id],
	);
	return (
		<div className={styles.dialogStage}>
			<Button label="Open dialog" onClick={() => modalActions.show({ id, component: PreviewDialog })} />
			<ModalController />
		</div>
	);
}
