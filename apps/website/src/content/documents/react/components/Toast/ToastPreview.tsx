'use client';
import { Button, Toast, ToastType } from '@apple-pie/slice';
import { useState } from 'react';
import styles from '../_shared/LayerPreview.module.css';
export function ToastPreview({
	type = ToastType.Info,
	timed = false,
	progress = false,
}: { type?: ToastType; timed?: boolean; progress?: boolean }) {
	const [key, setKey] = useState(0);
	const [visible, setVisible] = useState(true);
	const message = progress ? 'Uploading files…' : 'Your changes have been saved.';
	return (
		<div className={styles.stage}>
			<Button
				label="Show toast"
				onClick={() => {
					setKey((value) => value + 1);
					setVisible(true);
				}}
			/>
			<Toast
				key={key}
				notifId={`preview-${key}`}
				message={visible ? message : null}
				type={type}
				container="parent"
				duration={timed ? 4000 : 'Infinite'}
				progress={progress}
				didHide={() => setVisible(false)}
				offset={24}
			/>
		</div>
	);
}
