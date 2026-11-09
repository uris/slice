'use client';
import { Button, DialogBox, useDialogBox } from '@apple-pie/slice';
import { type ModalComponentProps, getModal, modalActions } from '@apple-pie/slice/stores/modal';
import { useEffect, useId } from 'react';
import styles from '../_shared/LayerPreview.module.css';

function PreviewActions() {
	const { close, resolve } = useDialogBox();
	return (
		<>
			<Button label="Cancel" variant="outline" onClick={close} />
			<Button variant={'solid'} label="Archive" onClick={() => resolve('archive')} />
		</>
	);
}

function PreviewDialog(props: ModalComponentProps) {
	return (
		<DialogBox {...props} minWidth={0} minHeight={180} maxWidth={360}>
			<DialogBox.Title>Archive project?</DialogBox.Title>
			<DialogBox.Content>
				You can restore this project later. Its files and history will stay together.
			</DialogBox.Content>
			<DialogBox.Actions>
				<PreviewActions />
			</DialogBox.Actions>
		</DialogBox>
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
		</div>
	);
}
