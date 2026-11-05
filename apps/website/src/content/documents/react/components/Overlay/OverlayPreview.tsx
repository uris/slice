'use client';
import { Button, Overlay } from '@apple-pie/slice';
import { useState } from 'react';
import styles from '../_shared/LayerPreview.module.css';
export function OverlayPreview({ opacity = 0.35 }: { opacity?: number }) {
	const [show, setShow] = useState(true);
	return (
		<div
			className={styles.stage}
			onKeyDown={(event) => {
				if (event.key === 'Escape') setShow(false);
			}}
		>
			<Button label="Show overlay" onClick={() => setShow(true)} />
			<Overlay show={show} type="dark" opacity={opacity} onClick={() => setShow(false)} />
		</div>
	);
}
