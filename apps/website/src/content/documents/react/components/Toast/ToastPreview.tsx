'use client';
import { Button, Toast, ToastType } from '@apple-pie/slice';
import { useState } from 'react';
import styles from '../_shared/LayerPreview.module.css';
export function ToastPreview({
	type = ToastType.Info,
	timed = false,
	progress = false,
	position = 'bottom',
}: { type?: ToastType; timed?: boolean; progress?: boolean; position?: 'top' | 'bottom' }) {
	const [key, setKey] = useState(0);
	const message = progress ? 'Uploading files…' : 'Your changes have been saved.';
	return (
		<div className={styles.stage}>
			<Button
				label="Show toast"
				onClick={() => {
					setKey((value) => value + 1);
				}}
			/>
			<Toast
				notificationId={`preview-${key}`}
				message={message}
				type={type}
				container="parent"
				position={position}
				duration={timed ? 4000 : 'infinite'}
				progress={progress}
				offset={24}
			/>
		</div>
	);
}
